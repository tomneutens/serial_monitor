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
let LabeledDropdown = class LabeledDropdown extends LitElement {
    constructor() {
        super();
    }
    handleOptionSelected(event) {
        this.selectedIndex = event.target.selectedIndex;
        const e = new CustomEvent('dropdown-value-changed', { bubbles: false, composed: true, detail: { newValue: event.target.options[event.target.options.selectedIndex].value } });
        this.dispatchEvent(e);
    }
    connectedCallback() {
        super.connectedCallback();
    }
    render() {
        return html `
        <span>${this.labelText}</span>
        <select @change=${this.handleOptionSelected}>
            ${this.options.map((option, index) => {
            let value;
            if (this.selectedIndex === index) {
                value = html `<option value=${option.labelValue} selected>${option.labelText}</option>`;
            }
            else {
                value = html `<option value=${option.labelValue}>${option.labelText}</option>`;
            }
            return value;
        })}
        </select>
        `;
    }
};
LabeledDropdown.styles = css `
        :host {
            color: var(--component-foreground-color);
            background-color: var(--component-background-color);
            padding: 5px;
            font-size: var(--component-base-font-size);
            font-family: var(--component-base-font-family);
        }

        select {
            color: var(--component-foreground-color);
            background-color: var(--component-background-color);
            border: none;
            border-color: var(--component-accent-color);
            font-size: inherit;
            font-family: inherit;
        }

        option {
            color: var(--component-foreground-color);
            background-color: var(--component-background-color);
            border-color: var(--component-accent-color);
        }
    `;
__decorate([
    property({
        type: (Array)
    }),
    __metadata("design:type", Array)
], LabeledDropdown.prototype, "options", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], LabeledDropdown.prototype, "labelText", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Number)
], LabeledDropdown.prototype, "selectedIndex", void 0);
LabeledDropdown = __decorate([
    customElement("labeled-dropdown"),
    __metadata("design:paramtypes", [])
], LabeledDropdown);
export default LabeledDropdown;
//# sourceMappingURL=LabeledDropdown.js.map