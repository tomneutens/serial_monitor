/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { LitElement, css, html } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import SerialMonitorConfig from "../state/SerialMonitorConfig";
import FileIOController from "../utils/FileIOController";
import WebSerialConnection from "../utils/WebSerialConnection";
var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["DISC"] = 1] = "DISC";
    ConnectionState[ConnectionState["DISC_DATA"] = 2] = "DISC_DATA";
    ConnectionState[ConnectionState["CON"] = 3] = "CON";
    ConnectionState[ConnectionState["CON_DATA"] = 4] = "CON_DATA";
})(ConnectionState || (ConnectionState = {}));
let SendReceiveSerialControls = class SendReceiveSerialControls extends LitElement {
    constructor() {
        super();
        this.inputData = "";
        this.connectPossible = true;
        this.disconnectPossible = false;
        this.sendPossible = false;
        this.downloadPossible = false;
        this.textInputPossible = false;
        this.datalog = new Array();
        this.currentState = ConnectionState.DISC;
        this.radixMap = {
            "bin": 2,
            "oct": 8,
            "dec": 10,
            "hex": 16
        };
        this.radixPrefix = {
            "bin": "0b",
            "oct": "0",
            "dec": "",
            "hex": "0x"
        };
        this.readBuffer = [];
        this.byteInterpreter = {
            "string": (value) => {
                let strValue = String.fromCharCode(value);
                if (strValue == "\n") {
                    this.serialReadBufferPrintLn();
                }
                else {
                    this.serialReadBufferPrint(strValue);
                }
            },
            "byte": (value) => {
                this.serialReadBufferPrint(this.radixPrefix[this.config.getDisplayType()] + value.toString(this.radixMap[this.config.getDisplayType()]));
                this.serialReadBufferPrintLn();
            },
            "int": (value) => {
                this.readBuffer.push(value);
                if (this.readBuffer.length >= 2) {
                    let bytes = this.readBuffer;
                    this.readBuffer = [];
                    let sign = bytes[0] & (1 << 7);
                    let combined = ((bytes[0] & 0xFF) << 8) | (bytes[1] & 0xFF);
                    combined = sign ? 0xFFFF0000 & combined : combined; // Add ones to beginning for sign in two complement representation
                    this.serialReadBufferPrint(combined.toString(this.radixMap[this.config.getDisplayType()]));
                    this.serialReadBufferPrintLn();
                }
            },
            "long": (value) => {
                this.readBuffer.push(value);
                if (this.readBuffer.length >= 4) {
                    let bytes = this.readBuffer;
                    this.readBuffer = [];
                    let combined = ((bytes[0] & 0xFF) << 24) | ((bytes[1] & 0xFF) << 16) | ((bytes[2] & 0xFF) << 8) | (bytes[3] & 0xFF);
                    this.serialReadBufferPrint(combined.toString(this.radixMap[this.config.getDisplayType()]));
                    this.serialReadBufferPrintLn();
                }
            }
        };
        /*this.serialConnected = false
        this.openPort = null
        this.serialDataEventHandlers = new Array<Function>()
        this.serialDisconnectEventHandlers = new Array<Function>()
        this.serialConnectEventHandlers = new Array<Function>()
        this.sendQueue = new Array<number>()*/
        this.serialConnection = new WebSerialConnection();
        this.serialConnection.addSerialDisconnectEventHandler(() => this.handleDisconnect());
        this.serialConnection.addSerialConnectEventHandler(() => this.handleConnect());
        this.serialConnection.addSerialDataEventHandler((byte) => this.handleReceiveData(byte));
        this.serialConnection.setupWebSerial();
    }
    serialReadBufferPrint(value) {
        if (this.datalog.length > 0) {
            this.datalog[this.datalog.length - 1] = this.datalog[this.datalog.length - 1].concat(value);
        }
        else {
            this.datalog.push(value);
        }
    }
    serialReadBufferPrintLn() {
        this.datalog.push("");
    }
    async handleConnect() {
        if (this.currentState === ConnectionState.DISC || this.currentState === ConnectionState.DISC_DATA) {
            this.connectPossible = false;
            this.disconnectPossible = true;
            this.sendPossible = true;
            this.downloadPossible = false;
            this.textInputPossible = true;
            this.datalog = new Array();
            this.currentState = ConnectionState.CON;
        }
        else {
            console.error("Trying to connect but already connected?!?");
        }
    }
    handleDisconnect() {
        if (this.currentState === ConnectionState.CON) {
            this.connectPossible = true;
            this.disconnectPossible = false;
            this.sendPossible = false;
            this.downloadPossible = false;
            this.textInputPossible = false;
            this.datalog = new Array();
            this.currentState = ConnectionState.DISC;
        }
        else if (this.currentState === ConnectionState.CON_DATA) {
            this.connectPossible = true;
            this.disconnectPossible = false;
            this.sendPossible = false;
            this.downloadPossible = true;
            this.textInputPossible = false;
            this.currentState = ConnectionState.DISC_DATA;
        }
        else {
            console.error("Trying to disconnect but not in a connected state?!?");
        }
    }
    handleReceiveData(byte) {
        if (this.currentState === ConnectionState.CON || this.currentState === ConnectionState.CON_DATA) {
            this.downloadPossible = true;
            this.processData(byte);
            this.currentState = ConnectionState.CON_DATA;
            let e = new CustomEvent("new-data-received", { bubbles: false, composed: true, detail: { data: this.datalog } });
            this.dispatchEvent(e);
        }
        else {
            console.error("Received data in disconnected state?!?");
        }
    }
    processData(byte) {
        this.byteInterpreter[this.config.getDataType()](byte);
        return "";
    }
    handleSend(event) {
        this.writeSerialValue(this.inputData);
    }
    writeSerialValue(value) {
        let valueArray = [];
        if (this.config.getDataType() == "byte") { // When sending bytes check if input is in byte format => send as byte
            let parsedValue = parseInt(value, this.radixMap[this.config.getDisplayType()]);
            if (!Number.isNaN(parsedValue) && parsedValue >= -128 && parsedValue <= 256) {
                valueArray.push(parsedValue);
            }
            else { // If it does not fit in the byte format => send as array of characters
                valueArray = value.split("").map((str) => { return str.charCodeAt(0); });
            }
        }
        else { // When sent as string => send as array of characters with newline at end.
            valueArray = `${value}\n`.split("").map((str) => { return str.charCodeAt(0); });
        }
        valueArray.forEach(value => this.serialConnection.sendByte(value));
    }
    handleDownload() {
        FileIOController.download("data.csv", this.datalog.join(";"));
    }
    render() {
        return html `
            <button @click=${async () => {
            this.serialConnection.connect(parseInt(this.config.getBaudRate()), this.config.getSerialPortFilters())
                .catch(e => {
                const ce = new CustomEvent("open-port-failed", { bubbles: true, composed: true, detail: { error: e } });
                this.dispatchEvent(ce);
            });
        }} ?disabled="${!this.connectPossible}">${msg("Connect")}</button>
            <button @click=${() => this.serialConnection.disconnect()} ?disabled=${!this.disconnectPossible}>${msg("Disconnect")}</button>
            <textarea ?disabled=${!this.textInputPossible} rows="1" @input=${(e) => { this.inputData = e.target.value; }} placeholder="${msg("Enter the data you want to send to the device!")}"></textarea>
            <button @click=${this.handleSend} ?disabled=${!this.sendPossible}>${msg("Send")}</button>
            <button @click=${this.handleDownload} class="fas fa-download" ?disabled=${!this.downloadPossible}>${msg("Download csv")}</button>
        `;
    }
};
SendReceiveSerialControls.styles = css `
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
            background-color: var(--component-background-color);
            color: var(--component-foreground-color);
            border: 1px solid white;
            resize: none;
            border-radius: 3px;
        }

        :host > textarea::placeholder {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translate(0, -50%);
            padding-left: 5px;
            color: var(--component-foreground-color-textarea-disabled);
        }

        :host > * {
            margin: 5px 0;
            font-size: var(--component-base-font-size);
        }

        :host > button {
            background-color: var(--component-background-color-button);
            color: var(--component-foreground-color-button);
            text-decoration: none;
            border-radius: 3px;
            border: none;
        }

        :host > button:disabled {
            background-color: var(--component-background-color-disabled);
            color: var(--component-foreground-color-disabled)
        }

        :host > textarea:disabled {
            background-color: var(--component-background-color);
            color: var(--component-foreground-color-textarea-disabled)
        }
    `;
__decorate([
    state(),
    __metadata("design:type", String)
], SendReceiveSerialControls.prototype, "inputData", void 0);
__decorate([
    state(),
    __metadata("design:type", Boolean)
], SendReceiveSerialControls.prototype, "connectPossible", void 0);
__decorate([
    state(),
    __metadata("design:type", Boolean)
], SendReceiveSerialControls.prototype, "disconnectPossible", void 0);
__decorate([
    state(),
    __metadata("design:type", Boolean)
], SendReceiveSerialControls.prototype, "sendPossible", void 0);
__decorate([
    state(),
    __metadata("design:type", Boolean)
], SendReceiveSerialControls.prototype, "downloadPossible", void 0);
__decorate([
    state(),
    __metadata("design:type", Boolean)
], SendReceiveSerialControls.prototype, "textInputPossible", void 0);
__decorate([
    state(),
    __metadata("design:type", Array)
], SendReceiveSerialControls.prototype, "datalog", void 0);
__decorate([
    property({
        type: SerialMonitorConfig,
        converter: (value, type) => {
            let conv = JSON.parse(value);
            conv.__proto__ = SerialMonitorConfig.prototype;
            return conv;
        }
    }),
    __metadata("design:type", SerialMonitorConfig)
], SendReceiveSerialControls.prototype, "config", void 0);
SendReceiveSerialControls = __decorate([
    customElement("send-receive-serial-controls"),
    __metadata("design:paramtypes", [])
], SendReceiveSerialControls);
export default SendReceiveSerialControls;
//# sourceMappingURL=SendReceiveSerialControls.js.map