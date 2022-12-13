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
        flex-direction: column-reverse;
        align-items: stretch;
        overflow-x: hidden;
        overflow-y: scroll;
        background-color: inherit;
        color: inherit;
        box-sizing: border-box;
        padding: 5px;
        margin-bottom: auto;
        scrollbar-color: var(--component-foreground-color) var(--component-background-color);
        scrollbar-width: thin;
    }
    :host::-webkit-scrollbar {
        width: 10px;
      }
    :host::-webkit-scrollbar-track {
        background: var(--component-background-color);
      }
    :host::-webkit-scrollbar-thumb {
        background-color: var(--component-foreground-color) ;
        border-radius: 6px;
        border: 3px solid var(--scrollbarBG);
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
        ${this.lines?.reverse().map((line => {
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