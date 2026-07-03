/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */


import { LitElement, css, html, CSSResult, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { msg } from '@lit/localize';

@customElement("monitor-output")
class MonitorOutput extends LitElement {
    static styles?: CSSResultGroup = css`
    :host {
        display: flex;
        flex: 1 1 auto;
        min-height: 0;
        flex-direction: column-reverse;
        align-items: stretch;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: inherit;
        color: inherit;
        box-sizing: border-box;
        padding: var(--component-space-sm);
        scrollbar-color: var(--component-accent-color) var(--component-background-color);
        scrollbar-width: thin;
        font-family: var(--component-mono-font-family);
    }
    :host::-webkit-scrollbar {
        width: 10px;
      }
    :host::-webkit-scrollbar-track {
        background: var(--component-background-color);
      }
    :host::-webkit-scrollbar-thumb {
        background-color: var(--component-accent-color);
        border-radius: 6px;
        border: 2px solid var(--component-background-color);
      }

    :host > div {
        width: 100%;
        background-color: inherit;
        color: inherit;
        box-sizing: border-box;
        padding: 1px var(--component-space-sm);
        font-size: var(--component-base-font-size);
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        line-height: 1.4;
    }
    `

    @property({
        type: Array<string>
    })
    lines:Array<string> = [];

    constructor(){
        super();
    }

    protected render() {
        // Render a non-mutating copy; the source array (shared with the chart/log) must not be reversed in place.
        return html`
        ${this.lines?.slice().reverse().map((line => {
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