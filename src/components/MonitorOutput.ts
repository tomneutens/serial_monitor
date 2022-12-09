import { LitElement, css, html, CSSResult, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { msg } from '@lit/localize';

@customElement("monitor-output")
class MonitorOutput extends LitElement {
    static styles?: CSSResultGroup = css`
    :host {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        overflow-x: hidden;
        overflow-y: scroll;
        background-color: inherit;
        color: inherit;
        box-sizing: border-box;
        padding: 5px;
    }

    :host > div {
        width: 100%;
        background-color: inherit;
        color: inherit;
        box-sizing: border-box;
        padding: 0 5px;
        font-size: var(--component-base-font-size);
    }

    `

    @property({
        type: Array<string>
    })
    lines:Array<string>;

    constructor(){
        super();
    }

    protected render() {
        return html`
        ${this.lines.map((line => {
            return html`<div>${line}</div>`
        }))}
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "monitor-output": MonitorOutput;
    }
}

export default MonitorOutput;