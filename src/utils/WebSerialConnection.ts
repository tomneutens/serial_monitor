/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */


import OpenSerialPortError from "../errors/OpenSerialPortError"

class WebSerialConnection {
    private baudRate: number
    private openPort: SerialPort|null
    private serialConnected: boolean
    private serialDataEventHandlers: Array<Function>
    private serialDisconnectEventHandlers: Array<Function>
    private serialConnectEventHandlers: Array<Function>
    private sendQueue: Array<number>
  

    constructor(){
        this.serialConnected = false
        this.openPort = null
        this.serialDataEventHandlers = new Array<Function>()
        this.serialDisconnectEventHandlers = new Array<Function>()
        this.serialConnectEventHandlers = new Array<Function>()
        this.sendQueue = new Array<number>()
    }

    addSerialDataEventHandler(handler: Function){
        this.serialDataEventHandlers.push(handler)
    }

    addSerialDisconnectEventHandler(handler: Function){
        this.serialDisconnectEventHandlers.push(handler)
    }

    addSerialConnectEventHandler(handler: Function){
        this.serialConnectEventHandlers.push(handler)
    }

    sendByte(byte: number){
        this.sendQueue.push(byte)
    }

    private notifyDataHandlers(data: number){
        this.serialDataEventHandlers.forEach(handler => handler(data))
    }

    private notifyConnectHandlers(){
        this.serialConnectEventHandlers.forEach(handler => handler())
    }

    private notifyDisconnectHandlers() {
        this.serialDisconnectEventHandlers.forEach(handler => handler())
    }

    private hasWebSerialSupport(){
        if ("serial" in navigator){
            return true
        } else {
            window.alert("Webserial not supported by your browser. Consider using chrome or edge.");
            return false
        }
    }

    disconnect() {
        this.serialConnected = false;
    }

    async connect(baudRate: number, filters: SerialPortFilter[] = []) {
        if (!this.hasWebSerialSupport()){
            return
        }
        this.baudRate = baudRate;
        let stopped = false
        try {
            let port = await navigator.serial.requestPort({ filters: filters })
            // asynchronously start listening to port
            port.open({baudRate: this.baudRate}).then(async () => {
                this.notifyConnectHandlers()
                this.serialConnected = true;
                while (port.readable && port.writable && !stopped) {
                    const reader:ReadableStreamDefaultReader<Uint8Array> = port.readable.getReader();
                    const writer:WritableStreamDefaultWriter<Uint8Array> = port.writable.getWriter();
                    this.openPort = port;
                    try {
                    while (true && !stopped) {
                        const { value, done } = await reader.read();
                        if (!this.serialConnected || done) {
                            reader.cancel();
                            writer.releaseLock();
                            // |reader| has been canceled.
                            stopped = true;
                        }
                        if (value){
                            value.forEach((element) => { this.notifyDataHandlers(element); });
                        }
                        
                        if (this.sendQueue.length > 0){
                            let nextOnQueue = this.sendQueue.shift() as number
                            let data = new Uint8Array([nextOnQueue]);
                            await writer.write(data);
                        }
                    }
                    } catch (error) {
                    // Handle |error|…
                    this.openPort = null;  
                    this.serialConnected = false;              
                    } finally {
                    reader.releaseLock();
                    this.notifyDisconnectHandlers()
                    }
                }
                port.close();    
            }).catch((error) => {
                console.error(error);
            })
        } catch (error) {
            console.error(error)
            this.serialConnected = false;
            this.notifyDisconnectHandlers()
        }
    }

    setupWebSerial(){
        if (navigator.serial){
            navigator.serial.addEventListener('connect', (e:any) => {

            });
            
            navigator.serial.addEventListener('disconnect', (e:any) => {
                this.notifyDisconnectHandlers();
            });
            
            navigator.serial.getPorts().then((ports:SerialPort[]) => {

            });
        }
    
    }

}

export default WebSerialConnection