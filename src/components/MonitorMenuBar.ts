import { LitElement, css, html, CSSResult, CSSResultGroup } from "lit";
import {customElement, property} from 'lit/decorators.js';
import { msg, str } from '@lit/localize'
import "./LabeledDropdown";
import SerialMonitorConfig from "../state/SerialMonitorConfig";


@customElement("monitor-menubar")
class MonitorMenubar extends LitElement {
    static styles?: CSSResultGroup = css`
        
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
            border-bottom-color: var(--component-accent-color);
            border-bottom: 1px solid;
        }

        :host > span {
            flex-grow: 1;
            text-align: left;
        }
    `

    @property()
    labelText:string

    @property({type: Object})
    config: SerialMonitorConfig

    constructor(){
        super()
    }

    handleViewTypeSelect(event: any){
        const e = new CustomEvent('viewtype-changed', { bubbles: false, composed: true, detail: { newValue: event.detail.newValue } })
        this.dispatchEvent(e)
    }

    handleDataTypeSelect(event: any) {
        const e = new CustomEvent('datatype-changed', { bubbles: false, composed: true, detail: { newValue: event.detail.newValue } })
        this.dispatchEvent(e)
    }

    handleDisplayTypeSelect(event: any) {
        const e = new CustomEvent('displaytype-changed', { bubbles: false, composed: true, detail: { newValue: event.detail.newValue } })
        this.dispatchEvent(e)
    }

    handleBaudRateSelect(event: any) {
        const e = new CustomEvent('baudrate-changed', { bubbles: false, composed: true, detail: { newValue: event.detail.newValue } })
        this.dispatchEvent(e)
    }

    protected render() {
        return html`
            <span>${this.labelText}</span>
            <labeled-dropdown 
                id="baudRate" 
                @dropdown-value-changed=${this.handleViewTypeSelect} 
                labeltext="${msg("View:")}" 
                options='${JSON.stringify(this.config.outputView)}'
                selectedindex=${this.config.selectionIndex["outputView"]}>
            </labeled-dropdown>
            <labeled-dropdown 
                id="dataType" 
                @dropdown-value-changed=${this.handleDataTypeSelect} 
                labeltext="${msg("Data type:")}" 
                options='${JSON.stringify(this.config.dataType)}'
                selectedindex=${this.config.selectionIndex["dataType"]}>
            </labeled-dropdown>
            <labeled-dropdown 
                id="displayType" 
                @dropdown-value-changed=${this.handleDisplayTypeSelect} 
                labeltext="${msg("Display type:")}" 
                options='${JSON.stringify(this.config.displayType)}'
                selectedindex=${this.config.selectionIndex["displayType"]}>
            </labeled-dropdown>
            <labeled-dropdown 
                id="baudRate" 
                @dropdown-value-changed=${this.handleBaudRateSelect} 
                labeltext="${msg("Baud rate:")}" 
                options='${JSON.stringify(this.config.baudRate)}'
                selectedindex=${this.config.selectionIndex["baudRate"]}>
            </labeled-dropdown>
            
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "monitor-menubar": MonitorMenubar;
    }
}

export default MonitorMenubar;