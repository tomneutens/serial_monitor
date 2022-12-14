/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
import { LitElement, CSSResultGroup } from "lit";
declare class MonitorOutput extends LitElement {
    static styles?: CSSResultGroup;
    lines: Array<string>;
    constructor();
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "monitor-output": MonitorOutput;
    }
}
export default MonitorOutput;
//# sourceMappingURL=MonitorOutput.d.ts.map