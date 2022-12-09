import { LitElement, css, html, CSSResult, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import "./MonitorMenuBar"
import "./MonitorOutput"
import "./SendReceiveSerialControls"
import { msg } from '@lit/localize';
import SerialMonitorConfig from "../state/SerialMonitorConfig";


@customElement("serial-monitor")
class SerialMonitor extends LitElement {
    static styles?: CSSResultGroup = css`
        :host {
            --component-foreground-color: var(--theme-foreground-color, #819F3D);
            --component-foreground-color-hover: var(--theme-foreground-color, #8BAB42);
            --component-foreground-color-text: var(--theme-foreground-color-text, black);
            --component-disabled-foreground-color: var(--theme-disabled-foreground-color, gray);

            --component-background-color: var(--theme-background-color, #242424);
            --component-background-color-text: var(--theme-background-color-text, #F5F5F5);

            --component-accent-color: var(--theme-accent-color, #9FBA63);
            --component-neutral-accent-color: var(--theme-accent-color, #20270F);

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

        :host > monitor-output {
            flex-grow: 1;
        }
    `

    @state()
    montitorConfig: SerialMonitorConfig = new SerialMonitorConfig();

    output: Array<string> = ["een", "twee", "drie", "vier", "..."]

    constructor(){
        super();
    }

    handleViewTypeChange(e: CustomEvent){
        this.montitorConfig.setOutputView(e.detail.newValue)
        this.requestUpdate();
    }
    handleDataTypeChange(e: CustomEvent){
        this.montitorConfig.setDataType(e.detail.newValue)
        this.requestUpdate();
    }
    handleDisplayTypeChange(e: CustomEvent){
        this.montitorConfig.setDisplayType(e.detail.newValue)
        this.requestUpdate();
    }
    handleBaudRateChange(e: CustomEvent){
        this.montitorConfig.setBaudRate(e.detail.newValue)
        this.requestUpdate();
    }


    protected render() {
        return html`
            <monitor-menubar 
                labelText=${msg("Serial Monitor")}
                config=${JSON.stringify(this.montitorConfig)}
                @viewtype-changed=${this.handleViewTypeChange}
                @datatype-changed=${this.handleDataTypeChange}
                @displayType-changed=${this.handleDisplayTypeChange}
                @baudrate-changed=${this.handleBaudRateChange}
                >
            </monitor-menubar>
            <monitor-output lines=${JSON.stringify(this.output)}></monitor-output>
            <send-receive-serial-controls @new-data-received=${(e: CustomEvent) => {console.log(JSON.stringify(e));this.output = e.detail.data}} config=${JSON.stringify(this.montitorConfig)}></send-receive-serial-controls>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "serial-monitor": SerialMonitor;
    }
}

export default SerialMonitor