/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
class WebSerialConnection {
    constructor() {
        this.serialConnected = false;
        this.openPort = null;
        this.serialDataEventHandlers = new Array();
        this.serialChunkEventHandlers = new Array();
        this.serialDisconnectEventHandlers = new Array();
        this.serialConnectEventHandlers = new Array();
        this.sendQueue = new Array();
    }
    addSerialDataEventHandler(handler) {
        this.serialDataEventHandlers.push(handler);
    }
    /**
     * Register a handler that receives raw data one chunk (Uint8Array) at a time.
     * Preferred over the byte-level handler for high data rates because it avoids
     * per-byte callback overhead.
     */
    addSerialChunkEventHandler(handler) {
        this.serialChunkEventHandlers.push(handler);
    }
    addSerialDisconnectEventHandler(handler) {
        this.serialDisconnectEventHandlers.push(handler);
    }
    addSerialConnectEventHandler(handler) {
        this.serialConnectEventHandlers.push(handler);
    }
    sendByte(byte) {
        this.sendQueue.push(byte);
    }
    notifyDataHandlers(data) {
        this.serialDataEventHandlers.forEach(handler => handler(data));
    }
    notifyChunkHandlers(data) {
        this.serialChunkEventHandlers.forEach(handler => handler(data));
    }
    notifyConnectHandlers() {
        this.serialConnectEventHandlers.forEach(handler => handler());
    }
    notifyDisconnectHandlers() {
        this.serialDisconnectEventHandlers.forEach(handler => handler());
    }
    hasWebSerialSupport() {
        if ("serial" in navigator) {
            return true;
        }
        else {
            window.alert("Webserial not supported by your browser. Consider using chrome or edge.");
            return false;
        }
    }
    disconnect() {
        this.serialConnected = false;
    }
    async connect(baudRate, filters = []) {
        if (!this.hasWebSerialSupport()) {
            return;
        }
        this.baudRate = baudRate;
        let stopped = false;
        try {
            let port = await navigator.serial.requestPort({ filters: filters });
            console.log(port);
            // asynchronously start listening to port
            port.open({ baudRate: this.baudRate }).then(async () => {
                this.notifyConnectHandlers();
                this.serialConnected = true;
                while (port.readable && port.writable && !stopped) {
                    const reader = port.readable.getReader();
                    const writer = port.writable.getWriter();
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
                            if (value) {
                                // Dispatch the whole chunk at once (fast path). Byte-level
                                // handlers are only invoked when someone has registered one.
                                this.notifyChunkHandlers(value);
                                if (this.serialDataEventHandlers.length > 0) {
                                    value.forEach((element) => { this.notifyDataHandlers(element); });
                                }
                            }
                            if (this.sendQueue.length > 0) {
                                // Drain the entire send queue in a single write instead of one byte per read cycle.
                                let data = new Uint8Array(this.sendQueue.splice(0, this.sendQueue.length));
                                await writer.write(data);
                            }
                        }
                    }
                    catch (error) {
                        // Handle |error|…
                        this.openPort = null;
                        this.serialConnected = false;
                    }
                    finally {
                        reader.releaseLock();
                        this.notifyDisconnectHandlers();
                    }
                }
                port.close();
            }).catch((error) => {
                console.error(error);
            });
        }
        catch (error) {
            console.error(error);
            this.serialConnected = false;
            this.notifyDisconnectHandlers();
        }
    }
    setupWebSerial() {
        if (navigator.serial) {
            navigator.serial.addEventListener('connect', (e) => {
            });
            navigator.serial.addEventListener('disconnect', (e) => {
                this.notifyDisconnectHandlers();
            });
            navigator.serial.getPorts().then((ports) => {
            });
        }
    }
}
export default WebSerialConnection;
//# sourceMappingURL=WebSerialConnection.js.map