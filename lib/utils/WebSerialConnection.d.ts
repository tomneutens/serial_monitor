/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
/// <reference types="w3c-web-serial" />
declare class WebSerialConnection {
    private baudRate;
    private openPort;
    private serialConnected;
    private serialDataEventHandlers;
    private serialChunkEventHandlers;
    private serialDisconnectEventHandlers;
    private serialConnectEventHandlers;
    private sendQueue;
    constructor();
    addSerialDataEventHandler(handler: Function): void;
    /**
     * Register a handler that receives raw data one chunk (Uint8Array) at a time.
     * Preferred over the byte-level handler for high data rates because it avoids
     * per-byte callback overhead.
     */
    addSerialChunkEventHandler(handler: Function): void;
    addSerialDisconnectEventHandler(handler: Function): void;
    addSerialConnectEventHandler(handler: Function): void;
    sendByte(byte: number): void;
    private notifyDataHandlers;
    private notifyChunkHandlers;
    private notifyConnectHandlers;
    private notifyDisconnectHandlers;
    private hasWebSerialSupport;
    disconnect(): void;
    connect(baudRate: number, filters?: SerialPortFilter[]): Promise<void>;
    setupWebSerial(): void;
}
export default WebSerialConnection;
//# sourceMappingURL=WebSerialConnection.d.ts.map