/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
import { LitElement, CSSResult } from "lit";
declare class LabeledDropdown extends LitElement {
    static styles: CSSResult;
    options: Array<{
        labelText: string;
        labelValue: string;
    }>;
    labelText: string;
    selectedIndex: Number;
    constructor();
    private handleOptionSelected;
    connectedCallback(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "labeled-dropdown": LabeledDropdown;
    }
}
export default LabeledDropdown;
//# sourceMappingURL=LabeledDropdown.d.ts.map