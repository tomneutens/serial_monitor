/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
import { LitElement, CSSResultGroup } from "lit";
import SerialMonitorConfig from "../state/SerialMonitorConfig";
import WebSerialConnection from "../utils/WebSerialConnection";
declare class SendReceiveSerialControls extends LitElement {
    static styles?: CSSResultGroup;
    inputData: string;
    connectPossible: boolean;
    disconnectPossible: boolean;
    sendPossible: boolean;
    downloadPossible: boolean;
    textInputPossible: boolean;
    datalog: Array<string>;
    config: SerialMonitorConfig;
    private currentState;
    private radixMap;
    private radixPrefix;
    private static readonly MAX_LOG_LINES;
    private static readonly MAX_VIEW_LINES;
    private flushScheduled;
    private interpreter;
    serialConnection: WebSerialConnection;
    constructor();
    serialReadBufferPrint(value: string): void;
    serialReadBufferPrintLn(): void;
    private handleConnect;
    private handleDisconnect;
    handleReceiveChunk(chunk: Uint8Array): void;
    private scheduleDataFlush;
    private processData;
    private handleSend;
    private writeSerialValue;
    private handleDownload;
    private handleInput;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "send-receive-serial-controls": SendReceiveSerialControls;
    }
}
export default SendReceiveSerialControls;
//# sourceMappingURL=SendReceiveSerialControls.d.ts.map