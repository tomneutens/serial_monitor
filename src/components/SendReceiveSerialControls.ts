/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */


import { LitElement, css, html, CSSResult, CSSResultGroup, nothing } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { msg } from '@lit/localize';
import SerialMonitorConfig from "../state/SerialMonitorConfig";
import FileIOController from "../utils/FileIOController";
import WebSerialConnection from "../utils/WebSerialConnection";
import SerialDataInterpreter from "../utils/SerialDataInterpreter";


enum ConnectionState {
    DISC = 1,
    DISC_DATA = 2,
    CON = 3,
    CON_DATA = 4
}

@customElement("send-receive-serial-controls")
class SendReceiveSerialControls extends LitElement {
    static styles?: CSSResultGroup = css`
        :host {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--component-space-sm);
            width: 100%;
            background-color: var(--component-background-color);
            color: var(--component-foreground-color);
            padding: var(--component-space-sm);
            box-sizing: border-box;
            font-size: var(--component-base-font-size);
            font-family: var(--component-base-font-family);
            border-top: 1px solid var(--component-border-color);
        }

        :host > textarea {
            flex-grow: 1;
            min-width: 0;
            vertical-align: middle;
            padding: var(--component-space-sm);
            background-color: var(--component-surface-color);
            color: var(--component-foreground-color-text);
            border: 1px solid var(--component-border-color);
            resize: none;
            border-radius: var(--component-radius);
            font-family: inherit;
            font-size: inherit;
            line-height: 1.4;
        }

        :host > textarea::placeholder {
            color: var(--component-foreground-color-textarea-disabled);
        }

        :host > textarea:focus-visible {
            outline: 2px solid var(--component-focus-ring);
            outline-offset: 1px;
            border-color: var(--component-focus-ring);
        }

        :host > button {
            background-color: var(--component-background-color-button);
            color: var(--component-foreground-color-button);
            text-decoration: none;
            border-radius: var(--component-radius);
            border: none;
            padding: var(--component-space-sm) var(--component-space-md);
            font-size: inherit;
            font-family: inherit;
            cursor: pointer;
            transition: background-color 0.15s ease, transform 0.05s ease;
            white-space: nowrap;
        }

        :host > button:hover:not(:disabled) {
            background-color: var(--component-background-color-button-hover);
        }

        :host > button:active:not(:disabled) {
            transform: translateY(1px);
        }

        :host > button:focus-visible {
            outline: 2px solid var(--component-focus-ring);
            outline-offset: 2px;
        }

        :host > button:disabled {
            background-color: var(--component-background-color-disabled);
            color: var(--component-foreground-color-disabled);
            cursor: not-allowed;
        }

        :host > textarea:disabled {
            background-color: var(--component-background-color-disabled);
            color: var(--component-foreground-color-textarea-disabled);
            cursor: not-allowed;
        }

        @media (max-width: 640px) {
            :host {
                flex-wrap: wrap;
            }
        }
    `

    @state()
    inputData: string = ""
    @state()
    connectPossible: boolean = true
    @state()
    disconnectPossible: boolean = false
    @state()
    sendPossible: boolean = false
    @state()
    downloadPossible: boolean = false
    @state()
    textInputPossible: boolean = false
    @state()
    datalog: Array<string> = new Array<string>()


    @property({
        type: SerialMonitorConfig,
        converter: (value: any, type) => {
            let conv: any = JSON.parse(value)
            conv.__proto__ = SerialMonitorConfig.prototype
            return conv
        }
    })
    config: SerialMonitorConfig

    private currentState: ConnectionState = ConnectionState.DISC
    private radixMap: {[index: string]: number} = {
        "bin": 2,
        "oct": 8,
        "dec": 10,
        "hex": 16
    }
    private radixPrefix: {[index: string]: string} = {
        "bin": "0b",
        "oct": "0",
        "dec": "",
        "hex": "0x"
    }

    // Maximum number of lines retained in memory (bounds memory + CSV export size).
    private static readonly MAX_LOG_LINES = 50000;
    // Maximum number of lines/points forwarded to the view per flush (bounds DOM/chart work).
    private static readonly MAX_VIEW_LINES = 2000;
    private flushScheduled = false;

    // Turns the raw incoming byte stream into log lines according to the current data/display type.
    private interpreter: SerialDataInterpreter = new SerialDataInterpreter(
        () => this.config.getDataType(),
        () => this.config.getDisplayType(),
        (value: string) => this.serialReadBufferPrint(value),
        () => this.serialReadBufferPrintLn()
    );

    serialConnection: WebSerialConnection

    constructor(){
        super();
        /*this.serialConnected = false
        this.openPort = null
        this.serialDataEventHandlers = new Array<Function>()
        this.serialDisconnectEventHandlers = new Array<Function>()
        this.serialConnectEventHandlers = new Array<Function>()
        this.sendQueue = new Array<number>()*/

        this.serialConnection = new WebSerialConnection();

        this.serialConnection.addSerialDisconnectEventHandler(() => this.handleDisconnect());
        this.serialConnection.addSerialConnectEventHandler(() => this.handleConnect())
        this.serialConnection.addSerialChunkEventHandler((chunk: Uint8Array) => this.handleReceiveChunk(chunk))
        this.serialConnection.setupWebSerial()
    }

    serialReadBufferPrint(value:string){
        // If an entry in the data log exists, concat value to the current string
        if (this.datalog.length > 0){
            this.datalog[this.datalog.length-1] = this.datalog[this.datalog.length-1].concat(value)
        } else { // Push the value to the datalog
            this.datalog.push(value)
        }
    }

    serialReadBufferPrintLn(){
        this.datalog.push("")
    }



    private async handleConnect(){
        if (this.currentState === ConnectionState.DISC || this.currentState === ConnectionState.DISC_DATA){
            this.connectPossible = false
            this.disconnectPossible = true
            this.sendPossible = true
            this.downloadPossible = false
            this.textInputPossible = true
            this.datalog = new Array<string>()
            this.interpreter.reset()
            this.currentState =  ConnectionState.CON
        } else {
            console.error("Trying to connect but already connected?!?")
        }
    }

    private handleDisconnect(){
        this.interpreter.reset()
        if (this.currentState === ConnectionState.CON){
            this.connectPossible = true
            this.disconnectPossible = false
            this.sendPossible = false
            this.downloadPossible = false
            this.textInputPossible = false
            this.datalog = new Array<string>()
            this.currentState = ConnectionState.DISC
        } else if (this.currentState === ConnectionState.CON_DATA){
            this.connectPossible = true
            this.disconnectPossible = false
            this.sendPossible = false
            this.downloadPossible = true
            this.textInputPossible = false
            this.currentState = ConnectionState.DISC_DATA
        } else {
            console.error("Trying to disconnect but not in a connected state?!?")
        }
    }

    handleReceiveChunk(chunk: Uint8Array){
        if (this.currentState === ConnectionState.CON || this.currentState === ConnectionState.CON_DATA){
            this.downloadPossible = true
            for (let i = 0; i < chunk.length; i++){
                this.processData(chunk[i])
            }
            this.currentState = ConnectionState.CON_DATA
            // Coalesce UI updates: dispatch at most once per animation frame regardless of
            // how many bytes/chunks arrive, so the main thread is not overwhelmed at high baud rates.
            this.scheduleDataFlush()
        } else {
            console.error("Received data in disconnected state?!?")
        }
    }

    private scheduleDataFlush(){
        if (this.flushScheduled){
            return
        }
        this.flushScheduled = true
        requestAnimationFrame(() => {
            this.flushScheduled = false
            // Trim the in-memory log to bound memory usage during long sessions.
            if (this.datalog.length > SendReceiveSerialControls.MAX_LOG_LINES){
                this.datalog = this.datalog.slice(-SendReceiveSerialControls.MAX_LOG_LINES)
            }
            // Only forward a bounded slice to the view to keep DOM/chart work bounded.
            const view = this.datalog.slice(-SendReceiveSerialControls.MAX_VIEW_LINES)
            const e = new CustomEvent("new-data-received", {bubbles: false, composed: true, detail: {data: view }})
            this.dispatchEvent(e)
        })
    }

    private processData(byte:number): void {
        this.interpreter.interpret(byte);
    }

    private handleSend(){
        this.writeSerialValue(this.inputData)
        this.inputData = ""
    }

    private writeSerialValue(value: string){
        let valueArray:number[] = [];
        if (this.config.getDataType() == "byte"){ // When sending bytes check if input is in byte format => send as byte
            let parsedValue = parseInt(value, this.radixMap[this.config.getDisplayType()]);
            if (!Number.isNaN(parsedValue) && parsedValue >= -128 && parsedValue <= 255 ){
                valueArray.push(parsedValue);
            } else {  // If it does not fit in the byte format => send as array of characters
                valueArray = value.split("").map((str) => { return str.charCodeAt(0)});
            }
        } else { // When sent as string => send as array of characters with newline at end.
            valueArray = `${value}\n`.split("").map((str) => { return str.charCodeAt(0)});
        }
        valueArray.forEach(value => this.serialConnection.sendByte(value))
    }

    private handleDownload(){
        FileIOController.download("data.csv", this.datalog.join("\n"))
    }

    private handleInput(data: string){
        if (data.charAt(data.length - 1) == "\n"){
            this.inputData = this.inputData.trim()
            this.handleSend()
        }else{
            this.inputData = data
        }
        
    }

    protected render() {
        return html`
            <button @click=${async () => {
                this.serialConnection.connect(
                    parseInt(this.config.getBaudRate()), 
                    this.config.getSerialPortFilters())
                .catch(e => {
                    const ce = new CustomEvent("open-port-failed", {bubbles: true, composed: true, detail: {error: e }})
                    this.dispatchEvent(ce)
                })}
            } ?disabled="${!this.connectPossible}">${msg("Connect")}</button>
            <button @click=${() => this.serialConnection.disconnect() } ?disabled=${!this.disconnectPossible}>${msg("Disconnect")}</button>
            <textarea ?disabled=${!this.textInputPossible} rows="1" @input=${(e:any) => { this.handleInput(e.target.value) }} .value=${this.inputData} placeholder="${msg("Enter the data you want to send to the device!")}"></textarea>
            <button @click=${ this.handleSend } ?disabled=${!this.sendPossible}>${msg("Send")}</button>
            <button @click=${this.handleDownload } class="fas fa-download" aria-label=${msg("Download csv")} ?disabled=${!this.downloadPossible}>${msg("Download csv")}</button>
        `
    }


}

declare global {
    interface HTMLElementTagNameMap {
        "send-receive-serial-controls": SendReceiveSerialControls;
    }
}

export default SendReceiveSerialControls;