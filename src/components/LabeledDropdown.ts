/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResult, nothing } from "lit";
import {customElement, property} from 'lit/decorators.js';

@customElement("labeled-dropdown")
class LabeledDropdown extends LitElement {
    static styles:CSSResult = css`
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
    `
    @property({
        type: Array<{labelText: string, labelValue:string}>
    })
    options:Array<{labelText: string, labelValue:string}>

    @property()
    labelText:string

    @property({type: Number})
    selectedIndex:Number

    constructor(){
        super()
        
    }

    private handleOptionSelected(event:any){
        this.selectedIndex = event.target.selectedIndex;
        const e = new CustomEvent('dropdown-value-changed', { bubbles: false, composed: true, detail: { newValue: event.target.options[event.target.options.selectedIndex].value } })
        this.dispatchEvent(e)
    }

    connectedCallback(): void {
        super.connectedCallback();
    }

    protected render() {
        return html`
        <span>${this.labelText}</span>
        <select @change=${this.handleOptionSelected}>
            ${this.options.map((option, index) => {
                let value
                if (this.selectedIndex === index){
                    value = html`<option value=${option.labelValue} selected>${option.labelText}</option>`
                } else {
                    value = html`<option value=${option.labelValue}>${option.labelText}</option>`
                }
                return value;
            })}
        </select>
        `
    }

}

declare global {
    interface HTMLElementTagNameMap {
        "labeled-dropdown": LabeledDropdown;
    }
}

export default LabeledDropdown;