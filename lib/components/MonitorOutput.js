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
    }
    render() {
        var _a;
        return html `
        ${(_a = this.lines) === null || _a === void 0 ? void 0 : _a.reverse().map((line => {
            return html `<div>${line}</div>`;
        }))}
        `;
    }
};
MonitorOutput.styles = css `
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