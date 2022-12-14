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
import "./MonitorMenuBar";
import "./MonitorOutput";
import "./SendReceiveSerialControls";
import { msg } from '@lit/localize';
import { SerialMonitorConfig, ViewSetting } from "../state/SerialMonitorConfig";
let SerialMonitor = class SerialMonitor extends LitElement {
    constructor() {
        super();
        this.monitorConfig = new SerialMonitorConfig();
        this.output = "";
    }
    attributeChangedCallback(name, _old, value) {
        super.attributeChangedCallback(name, _old, value);
        if (name === "serial-port-filters") {
            this.monitorConfig.setSerialPortFilters(JSON.parse(value));
        }
    }
    handleViewTypeChange(e) {
        this.monitorConfig.setOutputView(e.detail.newValue);
        this.requestUpdate();
    }
    handleDataTypeChange(e) {
        this.monitorConfig.setDataType(e.detail.newValue);
        this.requestUpdate();
    }
    handleDisplayTypeChange(e) {
        this.monitorConfig.setDisplayType(e.detail.newValue);
        this.requestUpdate();
    }
    handleBaudRateChange(e) {
        this.monitorConfig.setBaudRate(e.detail.newValue);
        this.requestUpdate();
    }
    handleNewData(e) {
        this.output = JSON.stringify(e.detail.data);
    }
    render() {
        return html `
            <monitor-menubar 
                labelText=${msg("Serial Monitor")}
                config=${JSON.stringify(this.monitorConfig)}
                @viewtype-changed=${this.handleViewTypeChange}
                @datatype-changed=${this.handleDataTypeChange}
                @displaytype-changed=${this.handleDisplayTypeChange}
                @baudrate-changed=${this.handleBaudRateChange}
                >
            </monitor-menubar>
            ${this.monitorConfig.getOutpuView() === ViewSetting.RAW
            ? html `<monitor-output lines=${this.output}></monitor-output>`
            : html `<p>HAHA this view does not exist!</p>`}
            
            <send-receive-serial-controls @new-data-received=${this.handleNewData} config=${JSON.stringify(this.monitorConfig)}></send-receive-serial-controls>
        `;
    }
};
SerialMonitor.styles = css `
        :host {
            --component-foreground-color: var(--theme-foreground-color, #819F3D);
            --component-foreground-color-hover: var(--theme-foreground-color-hover, #8BAB42);
            --component-foreground-color-text: var(--theme-foreground-color-text, #819F3D);
            --component-foreground-color-textarea-disabled: var(--theme-foreground-color-textarea-disabled, gray);
            --component-foreground-color-disabled: var(--theme-disabled-foreground-color, black);
            --component-foreground-color-button: var(--theme-foreground-color-button, black);

            --component-background-color: var(--theme-background-color, #242424);
            --component-background-color-text: var(--theme-background-color-text, #242424);
            --component-background-color-button: var(--theme-background-color-button, #819F3D);
            --component-background-color-disabled: var(--theme-background-color-disabled, gray);

            --component-accent-color: var(--theme-accent-color, #9FBA63);
            --component-accent-color-neutral: var(--theme-accent-color-neutral, #20270F);

            --component-base-font-size: var(--theme-base-font-size, 1rem);
            --component-base-font-family: var(--theme-base-font-family, sans-serif);

            display: flex;
            flex-direction: column;
            align-items: stretch;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            background-color: var(--component-background-color);
            color: var(--component-foreground-color);
        }
    `;
__decorate([
    state(),
    __metadata("design:type", SerialMonitorConfig)
], SerialMonitor.prototype, "monitorConfig", void 0);
__decorate([
    state(),
    __metadata("design:type", String)
], SerialMonitor.prototype, "output", void 0);
__decorate([
    property({
        type: String,
        attribute: "serial-port-filters",
    }),
    __metadata("design:type", Array)
], SerialMonitor.prototype, "serialPortFilters", void 0);
SerialMonitor = __decorate([
    customElement("serial-monitor"),
    __metadata("design:paramtypes", [])
], SerialMonitor);
export default SerialMonitor;
export { SerialMonitor };
//# sourceMappingURL=SerialMonitor.js.map