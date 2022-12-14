/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
import { LitElement, CSSResultGroup } from "lit";
import "./LabeledDropdown";
import { SerialMonitorConfig } from "../state/SerialMonitorConfig";
declare class MonitorMenubar extends LitElement {
    static styles?: CSSResultGroup;
    labelText: string;
    config: SerialMonitorConfig;
    constructor();
    handleViewTypeSelect(event: any): void;
    handleDataTypeSelect(event: any): void;
    handleDisplayTypeSelect(event: any): void;
    handleBaudRateSelect(event: any): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "monitor-menubar": MonitorMenubar;
    }
}
export default MonitorMenubar;
//# sourceMappingURL=MonitorMenuBar.d.ts.map