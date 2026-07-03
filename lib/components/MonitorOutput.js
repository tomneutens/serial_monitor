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
let MonitorOutput = class MonitorOutput extends LitElement {
    constructor() {
        super();
        this.lines = [];
    }
    render() {
        var _a;
        // Render a non-mutating copy; the source array (shared with the chart/log) must not be reversed in place.
        return html `
        ${(_a = this.lines) === null || _a === void 0 ? void 0 : _a.slice().reverse().map((line => {
            return html `<div>${line}</div>`;
        }))}
        `;
    }
};
MonitorOutput.styles = css `
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
    `;
__decorate([
    property({
        type: (Array)
    }),
    __metadata("design:type", Array)
], MonitorOutput.prototype, "lines", void 0);
MonitorOutput = __decorate([
    customElement("monitor-output"),
    __metadata("design:paramtypes", [])
], MonitorOutput);
export default MonitorOutput;
//# sourceMappingURL=MonitorOutput.js.map