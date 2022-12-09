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

    async connect(baudRate: number):Promise<boolean>{
        this.baudRate = baudRate;
        let connection:boolean = true;
        const usbVendorId = 0Xd3e0;
        let stopped = false
        await navigator.serial.requestPort({ filters: [{ usbVendorId }]}).then( async (port:SerialPort) => {
            // Connect to `port` or add it to the list of available ports.
            await port.open({baudRate: this.baudRate});
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
                        this.notifyDisconnectHandlers()
                        reader.cancel();
                        writer.releaseLock();
                        // |reader| has been canceled.
                        console.log("Reader has been closed");
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
                } finally {
                  reader.releaseLock();
                  this.notifyDisconnectHandlers()
                }
              }
              port.close();    
        }).catch((e:any) => {
            // The user didn't select a port.
            connection=false;
            console.log("Error")
        });
        return connection;
    }

    setupWebSerial(){
        if (navigator.serial){
            navigator.serial.addEventListener('connect', (e:any) => {
                // Connect to `e.target` or add it to a list of available ports.
                console.log("Serial device connected: " + e.target)
            });
            
            navigator.serial.addEventListener('disconnect', (e:any) => {
                console.log("Serial device disconnected: " + e.target)
                this.notifyDisconnectHandlers();
            });
            
            navigator.serial.getPorts().then((ports:SerialPort[]) => {
            // Initialize the list of available ports with `ports` on page load.
                console.log(`The available ports are ${ports}`)
            });
        }
    
    }
}

export default WebSerialConnection