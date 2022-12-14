/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
/// <reference types="w3c-web-serial" />
declare class WebSerialConnection {
    private baudRate;
    private openPort;
    private serialConnected;
    private serialDataEventHandlers;
    private serialDisconnectEventHandlers;
    private serialConnectEventHandlers;
    private sendQueue;
    constructor();
    addSerialDataEventHandler(handler: Function): void;
    addSerialDisconnectEventHandler(handler: Function): void;
    addSerialConnectEventHandler(handler: Function): void;
    sendByte(byte: number): void;
    private notifyDataHandlers;
    private notifyConnectHandlers;
    private notifyDisconnectHandlers;
    private hasWebSerialSupport;
    disconnect(): void;
    connect(baudRate: number, filters?: SerialPortFilter[]): Promise<void>;
    setupWebSerial(): void;
}
export default WebSerialConnection;
//# sourceMappingURL=WebSerialConnection.d.ts.map