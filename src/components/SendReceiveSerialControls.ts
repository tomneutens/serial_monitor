import { LitElement, css, html, CSSResult, CSSResultGroup, nothing } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { msg } from '@lit/localize';
import SerialMonitorConfig from "../state/SerialMonitorConfig";
import WebSerialConnection from "../utils/WebSerialConnection";
import FileIOController from "../utils/FileIOController";


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
            gap: 5px;
            width: 100%;
            background-color: var(--component-background-color);
            color: var(--component-foreground-color);
            padding: 0 5px;
            box-sizing: border-box;
            font-size: var(--component-base-font-size);
            font-family: var(--component-base-font-family);
            margin: 5px 0;
            border-top: 1px solid;
            border-color: var(--component-accent-color);
        }

        :host > textarea {
            flex-grow: 1;
            vertical-align: middle;
            padding-left: 5px;
            rows: 1;
            background-color: var(--component-foreground-color-text);
            color: var(--component-foreground-color);
            border: none;
            resize: none;
        }

        :host > textarea::placeholder {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translate(0, -50%);
            padding-left: 5px;
        }

        :host > * {
            margin: 5px 0;
            background-color: var(--component-foreground-color);
            color: var(--component-foreground-color-text);
            font-size: var(--component-base-font-size);
        }

        :host > *:disabled {
            background-color: var(--component-disabled-foreground-color);
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
    private webSerialConnection: WebSerialConnection
    private radixMap: {[index: string]: number} = {
        "bin": 2,
        "oct": 8,
        "dec": 10,
        "hex": 16
    }
    private readBuffer:number[] = [];
    private byteInterpreter:any = {
        "string": (value:number) => {
            let strValue = String.fromCharCode(value);
            if (strValue == "\n"){
                this.serialReadBufferPrintLn();
            } else {
                this.serialReadBufferPrint(strValue);
            }
        },
        "byte": (value:number) => {
            this.serialReadBufferPrint(value.toString(this.radixMap[this.config.getDisplayType()]));
            this.serialReadBufferPrintLn();
        },
        "int": (value:number) => {  // Javascript uses 32 bit integers, Arduino 16 bit integers => padding required
            this.readBuffer.push(value);
            if (this.readBuffer.length >= 2){
                let bytes = this.readBuffer;
                this.readBuffer = [];
                let sign = bytes[0] & (1 << 7);
                let combined = ((bytes[0] & 0xFF) << 8) | (bytes[1] & 0xFF);
                combined = sign ? 0xFFFF0000 & combined : combined;  // Add ones to beginning for sign in two complement representation
                this.serialReadBufferPrint(combined.toString(this.radixMap[this.config.getDisplayType()]))
                this.serialReadBufferPrintLn();
            }
        },
        "long": (value:number) => {
            this.readBuffer.push(value);
            if (this.readBuffer.length >= 4){
                let bytes = this.readBuffer;
                this.readBuffer = [];
                let combined = ((bytes[0] & 0xFF) << 24) | ((bytes[1] & 0xFF) << 16) | ((bytes[2] & 0xFF) << 8) | (bytes[3] & 0xFF);
                this.serialReadBufferPrint(combined.toString(this.radixMap[this.config.getDisplayType()]));
                this.serialReadBufferPrintLn();
            } 
        }
    }

    constructor(){
        super();
        this.webSerialConnection = new WebSerialConnection()
        this.webSerialConnection.addSerialDisconnectEventHandler(() => this.handleDisconnect());
        this.webSerialConnection.addSerialDataEventHandler((byte: number) => this.handleReceiveData(byte))
        this.webSerialConnection.setupWebSerial()
    }

    serialReadBufferPrint(value:string){
        if (this.datalog.length > 0){
            this.datalog[this.datalog.length-1] = this.datalog[this.datalog.length-1].concat(value)
        } else {
            this.datalog.push(value)
        }
    }

    serialReadBufferPrintLn(){
        this.datalog.push("")
    }

    private hasWebSerialSupport(){
        if ("serial" in navigator){
            return true
        } else {
            window.alert("Webserial not supported by your browser. Consider using chrome or edge.");
            return false
        }
    }

    private async handleConnect(){
        console.log("connect")
        if (!this.hasWebSerialSupport()){
            return
        }
        if (this.currentState === ConnectionState.DISC || this.currentState === ConnectionState.DISC_DATA){
            let isConnected =  await this.webSerialConnection.connect(parseInt(this.config.getBaudRate()))
            if (isConnected){
                this.connectPossible = false
                this.disconnectPossible = true
                this.sendPossible = true
                this.downloadPossible = false
                this.textInputPossible = true
                this.datalog = new Array<string>()
                this.currentState =  ConnectionState.CON
            }
        } else {
            console.log("Trying to connect but already connected?!?")
        }
    }

    private handleDisconnect(){
        console.log("disconnect")
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
            console.log("Trying to disconnect but not in a connected state?!?")
        }
    }

    handleReceiveData(byte:number){
        if (this.currentState === ConnectionState.CON || this.currentState === ConnectionState.CON_DATA){
            this.downloadPossible = true
            this.processData(byte)
            this.currentState = ConnectionState.CON_DATA
            let e = new CustomEvent("new-data-received", {bubbles: false, composed: true, detail: {data: this.datalog }})
            this.dispatchEvent(e)
        } else {
            console.log("Received data in disconnected state?!?")
        }
    }

    private processData(byte:number): string{
        this.byteInterpreter[this.config.getDataType()](byte);
        return ""
    }

    private handleSend(event: any){
        console.log(`send: ${ this.inputData }`)
        this.writeSerialValue(this.inputData)
    }

    private writeSerialValue(value: string){
        let valueArray:number[] = [];
        if (this.config.getDataType() == "byte"){ // When sending bytes check if input is in byte format => send as byte
            let parsedValue = parseInt(value, this.radixMap[this.config.getDisplayType()]);
            if (!Number.isNaN(parsedValue) && parsedValue >= -128 && parsedValue <= 256 ){
                valueArray.push(parsedValue);
            } else {  // If it does not fit in the byte format => send as array of characters
                valueArray = value.split("").map((str) => { return str.charCodeAt(0)});
            }
        } else { // When sent as string => send as array of characters with newline at end.
            valueArray = `${value}\n`.split("").map((str) => { return str.charCodeAt(0)});
        }
        console.log(valueArray)
        console.log(`Writing value: ${value}`)
        valueArray.forEach(value => this.webSerialConnection.sendByte(value))
    }

    private handleDownload(){
        console.log("download")
        FileIOController.download("data.csv", this.datalog.join(";"))
    }

    protected render() {
        return html`
            <button @click=${this.handleConnect} ?disabled="${!this.connectPossible}">${msg("Connect")}</button>
            <button @click=${this.handleDisconnect } ?disabled=${!this.disconnectPossible}>${msg("Disconnect")}</button>
            <textarea ?disabled=${!this.textInputPossible} rows="1" @input=${(e:any) => { this.inputData = e.target.value }} placeholder="${msg("Enter the data you want to send to the device!")}"></textarea>
            <button @click=${ this.handleSend } ?disabled=${!this.sendPossible}>${msg("Send")}</button>
            <button @click=${this.handleDownload } class="fas fa-download" ?disabled=${!this.downloadPossible}>${msg("Download csv")}</button>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "send-receive-serial-controls": SendReceiveSerialControls;
    }
}

export default SendReceiveSerialControls;