/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */


import { LitElement, css, html, CSSResult, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import "./MonitorMenuBar"
import "./MonitorOutput"
import "./SendReceiveSerialControls"
import { msg } from '@lit/localize';
import {SerialMonitorConfig, SerialMonitorSetting, ViewSetting } from "../state/SerialMonitorConfig";


@customElement("serial-monitor")
class SerialMonitor extends LitElement {
    static styles?: CSSResultGroup = css`
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
    `

    @state()
    monitorConfig: SerialMonitorConfig = new SerialMonitorConfig();

    @state()    
    output: string = ""

    @property({
        type: String,
        attribute: "serial-port-filters",
    })
    serialPortFilters: SerialPortFilter[]


    constructor(){
        super();
    }

    attributeChangedCallback(name: string, _old: string, value: string): void {
        super.attributeChangedCallback(name, _old, value)
        if (name === "serial-port-filters"){
            this.monitorConfig.setSerialPortFilters(JSON.parse(value))
        }
    }

    handleViewTypeChange(e: CustomEvent){
        this.monitorConfig.setOutputView(e.detail.newValue)
        this.requestUpdate();
    }
    handleDataTypeChange(e: CustomEvent){
        this.monitorConfig.setDataType(e.detail.newValue)
        this.requestUpdate();
    }
    handleDisplayTypeChange(e: CustomEvent){
        this.monitorConfig.setDisplayType(e.detail.newValue)
        this.requestUpdate();
    }
    handleBaudRateChange(e: CustomEvent){
        this.monitorConfig.setBaudRate(e.detail.newValue)
        this.requestUpdate();
    }

    handleNewData(e: CustomEvent){
        this.output = JSON.stringify(e.detail.data)
    }

    protected render() {
        return html`
            <monitor-menubar 
                labelText=${msg("Serial Monitor")}
                config=${JSON.stringify(this.monitorConfig)}
                @viewtype-changed=${this.handleViewTypeChange}
                @datatype-changed=${this.handleDataTypeChange}
                @displaytype-changed=${this.handleDisplayTypeChange}
                @baudrate-changed=${this.handleBaudRateChange}
                >
            </monitor-menubar>
            ${ this.monitorConfig.getOutpuView() === ViewSetting.RAW 
                ? html`<monitor-output lines=${this.output}></monitor-output>`
                : html`<p>HAHA this view does not exist!</p>`}
            
            <send-receive-serial-controls @new-data-received=${this.handleNewData} config=${JSON.stringify(this.monitorConfig)}></send-receive-serial-controls>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "serial-monitor": SerialMonitor;
    }
}

export default SerialMonitor

export { SerialMonitor }