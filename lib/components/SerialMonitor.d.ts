/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
/// <reference types="w3c-web-serial" />
import { LitElement, CSSResultGroup } from "lit";
import "./MonitorMenuBar";
import "./MonitorOutput";
import "./SendReceiveSerialControls";
import "./LineChartWrapper";
import { SerialMonitorConfig } from "../state/SerialMonitorConfig";
declare class SerialMonitor extends LitElement {
    static styles?: CSSResultGroup;
    monitorConfig: SerialMonitorConfig;
    output: string;
    serialPortFilters: SerialPortFilter[];
    constructor();
    attributeChangedCallback(name: string, _old: string, value: string): void;
    handleViewTypeChange(e: CustomEvent): void;
    handleDataTypeChange(e: CustomEvent): void;
    handleDisplayTypeChange(e: CustomEvent): void;
    handleBaudRateChange(e: CustomEvent): void;
    handleNewData(e: CustomEvent): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "serial-monitor": SerialMonitor;
    }
}
export default SerialMonitor;
export { SerialMonitor };
//# sourceMappingURL=SerialMonitor.d.ts.map