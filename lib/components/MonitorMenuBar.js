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
import { customElement, property } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import "./LabeledDropdown";
import { SerialMonitorSetting, SerialMonitorConfig } from "../state/SerialMonitorConfig";
let MonitorMenubar = class MonitorMenubar extends LitElement {
    constructor() {
        super();
    }
    handleViewTypeSelect(event) {
        const e = new CustomEvent('viewtype-changed', { bubbles: false, composed: true, detail: { newValue: event.detail.newValue } });
        this.dispatchEvent(e);
    }
    handleDataTypeSelect(event) {
        const e = new CustomEvent('datatype-changed', { bubbles: false, composed: true, detail: { newValue: event.detail.newValue } });
        this.dispatchEvent(e);
    }
    handleDisplayTypeSelect(event) {
        const e = new CustomEvent('displaytype-changed', { bubbles: false, composed: true, detail: { newValue: event.detail.newValue } });
        this.dispatchEvent(e);
    }
    handleBaudRateSelect(event) {
        const e = new CustomEvent('baudrate-changed', { bubbles: false, composed: true, detail: { newValue: event.detail.newValue } });
        this.dispatchEvent(e);
    }
    render() {
        return html `
            <span>${this.labelText}</span>
            <labeled-dropdown 
                id="viewType" 
                @dropdown-value-changed=${this.handleViewTypeSelect} 
                labeltext="${msg("View:")}" 
                options='${JSON.stringify(this.config.outputView)}'
                selectedindex=${this.config.selectionIndex[SerialMonitorSetting.VIEW]}>
            </labeled-dropdown>
            <labeled-dropdown 
                id="dataType" 
                @dropdown-value-changed=${this.handleDataTypeSelect} 
                labeltext="${msg("Data type:")}" 
                options='${JSON.stringify(this.config.dataType)}'
                selectedindex=${this.config.selectionIndex[SerialMonitorSetting.DATA_TYPE]}>
            </labeled-dropdown>
            <labeled-dropdown 
                id="displayType" 
                @dropdown-value-changed=${this.handleDisplayTypeSelect} 
                labeltext="${msg("Display type:")}" 
                options='${JSON.stringify(this.config.displayType)}'
                selectedindex=${this.config.selectionIndex[SerialMonitorSetting.DISPLAY_TYPE]}>
            </labeled-dropdown>
            <labeled-dropdown 
                id="baudRate" 
                @dropdown-value-changed=${this.handleBaudRateSelect} 
                labeltext="${msg("Baud rate:")}" 
                options='${JSON.stringify(this.config.baudRate)}'
                selectedindex=${this.config.selectionIndex[SerialMonitorSetting.BAUD_RATE]}>
            </labeled-dropdown>
            
        `;
    }
};
MonitorMenubar.styles = css `
        
        :host {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: flex-start;
            gap: 5px;
            width: 100%;
            background-color: var(--component-background-color);
            color: var(--component-foreground-color);
            padding: 0 5px;
            box-sizing: border-box;
            font-size: var(--component-base-font-size);
            font-family: var(--component-base-font-family);
            border-bottom: 1px solid;
            border-color: var(--component-accent-color);
        }

        :host > span {
            flex-grow: 1;
            text-align: left;
        }
    `;
__decorate([
    property(),
    __metadata("design:type", String)
], MonitorMenubar.prototype, "labelText", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", SerialMonitorConfig)
], MonitorMenubar.prototype, "config", void 0);
MonitorMenubar = __decorate([
    customElement("monitor-menubar"),
    __metadata("design:paramtypes", [])
], MonitorMenubar);
export default MonitorMenubar;
//# sourceMappingURL=MonitorMenuBar.js.map