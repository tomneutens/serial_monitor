/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */


import { LitElement, css, html, CSSResult, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import "./MonitorMenuBar"
import "./MonitorOutput"
import "./SendReceiveSerialControls"
import "./LineChartWrapper"
import { msg } from '@lit/localize';
import {SerialMonitorConfig, SerialMonitorSetting, ViewSetting } from "../state/SerialMonitorConfig";


@customElement("serial-monitor")
class SerialMonitor extends LitElement {
    static styles?: CSSResultGroup = css`
        :host {
            /*
             * Default palette (dark). Every value can be overridden by the consumer through the
             * matching --theme-* custom property, so this is fully backward compatible. When the
             * consumer does not set a theme, the palette adapts to the user's OS light/dark setting.
             */
            --_default-foreground-color: #e7e7e7;
            --_default-foreground-color-hover: #ffffff;
            --_default-foreground-color-text: #e7e7e7;
            --_default-foreground-color-textarea-disabled: #8a8a8a;
            --_default-foreground-color-disabled: #9a9a9a;
            --_default-foreground-color-button: #10240f;
            --_default-background-color: #1e1f22;
            --_default-background-color-text: #1e1f22;
            --_default-background-color-button: #819F3D;
            --_default-background-color-button-hover: #93b447;
            --_default-background-color-disabled: #3a3b3f;
            --_default-accent-color: #9FBA63;
            --_default-accent-color-neutral: #20270F;
            --_default-surface-color: #26272b;
            --_default-border-color: #3a3b3f;

            /* Public colour tokens (theme override -> adaptive default). */
            --component-foreground-color: var(--theme-foreground-color, var(--_default-foreground-color));
            --component-foreground-color-hover: var(--theme-foreground-color-hover, var(--_default-foreground-color-hover));
            --component-foreground-color-text: var(--theme-foreground-color-text, var(--_default-foreground-color-text));
            --component-foreground-color-textarea-disabled: var(--theme-foreground-color-textarea-disabled, var(--_default-foreground-color-textarea-disabled));
            --component-foreground-color-disabled: var(--theme-disabled-foreground-color, var(--_default-foreground-color-disabled));
            --component-foreground-color-button: var(--theme-foreground-color-button, var(--_default-foreground-color-button));

            --component-background-color: var(--theme-background-color, var(--_default-background-color));
            --component-background-color-text: var(--theme-background-color-text, var(--_default-background-color-text));
            --component-background-color-button: var(--theme-background-color-button, var(--_default-background-color-button));
            --component-background-color-button-hover: var(--theme-background-color-button-hover, var(--_default-background-color-button-hover));
            --component-background-color-disabled: var(--theme-background-color-disabled, var(--_default-background-color-disabled));

            --component-accent-color: var(--theme-accent-color, var(--_default-accent-color));
            --component-accent-color-neutral: var(--theme-accent-color-neutral, var(--_default-accent-color-neutral));
            --component-surface-color: var(--theme-surface-color, var(--_default-surface-color));
            --component-border-color: var(--theme-border-color, var(--_default-border-color));

            /* Spacing / shape / typography scale (new, additive tokens). */
            --component-space-xs: var(--theme-space-xs, 4px);
            --component-space-sm: var(--theme-space-sm, 8px);
            --component-space-md: var(--theme-space-md, 12px);
            --component-radius: var(--theme-radius, 6px);
            --component-focus-ring: var(--theme-focus-ring, #4c9be8);
            --component-base-font-size: var(--theme-base-font-size, 1rem);
            --component-base-font-family: var(--theme-base-font-family, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif);
            --component-mono-font-family: var(--theme-mono-font-family, ui-monospace, "SF Mono", "Cascadia Code", "Consolas", monospace);

            display: flex;
            flex-direction: column;
            align-items: stretch;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            background-color: var(--component-background-color);
            color: var(--component-foreground-color);
        }

        /* Adapt the default palette to a light OS preference (only affects unthemed usage). */
        @media (prefers-color-scheme: light) {
            :host {
                --_default-foreground-color: #1c1d20;
                --_default-foreground-color-hover: #000000;
                --_default-foreground-color-text: #1c1d20;
                --_default-foreground-color-textarea-disabled: #9a9a9a;
                --_default-foreground-color-disabled: #b5b5b5;
                --_default-foreground-color-button: #ffffff;
                --_default-background-color: #ffffff;
                --_default-background-color-text: #ffffff;
                --_default-background-color-button: #6f8a33;
                --_default-background-color-button-hover: #7d9a3c;
                --_default-background-color-disabled: #e2e2e2;
                --_default-accent-color: #6f8a33;
                --_default-accent-color-neutral: #eef2e2;
                --_default-surface-color: #f5f6f2;
                --_default-border-color: #d7dacb;
            }
        }
    `

    @state()
    monitorConfig: SerialMonitorConfig = new SerialMonitorConfig();

    @state()
    outputLines: Array<string> = []

    @state()
    chartData: Array<number> = []

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
        if (this.monitorConfig.getOutputView() === ViewSetting.PLOT){
            this.chartData = this.outputLines.slice(0, -1).map((item) => Number(item))
        }
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
        const data = e.detail.data as Array<string>
        this.outputLines = data
        if (this.monitorConfig.getOutputView() === ViewSetting.PLOT){
            // Drop the trailing (possibly incomplete) line before plotting.
            this.chartData = data.slice(0, -1).map((item) => Number(item))
        }
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
            ${ this.monitorConfig.getOutputView() === ViewSetting.RAW 
                ? html`<monitor-output .lines=${this.outputLines}></monitor-output>`
                : html`<line-chart-wrapper .chartData=${this.chartData}></line-chart-wrapper>`}
            
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