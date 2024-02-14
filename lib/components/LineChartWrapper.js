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
import { customElement, property, query } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
let LineChartWrapper = class LineChartWrapper extends LitElement {
    constructor() {
        super();
        this.lineColor = "rgb(0, 255, 0)";
        this.pointColor = "rgba(0, 255, 0)";
    }
    firstUpdated() {
        this.chart = this.createChart();
    }
    createChart() {
        return new Chart(this.canvas, {
            type: 'line',
            data: {
                labels: this.chartData.map((_, i) => i),
                datasets: [
                    {
                        label: 'Data from serial port',
                        data: this.chartData,
                        borderColor: this.lineColor,
                        backgroundColor: this.pointColor,
                        tension: 0.1
                    }
                ]
            },
            options: {
                animation: {
                    duration: 0 // general animation time
                },
                maintainAspectRatio: false,
            }
        });
    }
    handleDownloadClicked() {
        const a = document.createElement('a');
        a.href = this.chart.toBase64Image();
        a.download = 'chart.png';
        a.click();
    }
    render() {
        if (this.chart) {
            let color = getComputedStyle(this).getPropertyValue('--line-color');
            this.chart.data.datasets[0].borderColor = color;
            this.chart.data.datasets[0].backgroundColor = color;
            this.chart.data.labels = this.chartData.map((_, i) => i);
            this.chart.data.datasets[0].data = this.chartData;
            this.chart.update();
        }
        return html `
          <div id="chartContainer">
            <canvas id="lineChart"></canvas>
          </div>
          <div id="controlsContainer">
            <button @click=${this.handleDownloadClicked}>${msg("Download image")}</button>
          </div>
      `;
    }
};
LineChartWrapper.styles = css `
      :host {
        position: relative;
        height: 100%;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        align-content: stretch;
        display: flex;
        padding: 30px;
        overflow: hidden;
        --line-color: var(--component-background-color-button);
      }
      #chartContainer {
        position: relative;
        flex-grow: 1;
        flex-shrink: 1;
      }
      #controlsContainer {
        flex-basis: 50px;
        height: 50px;
      }

      button {
        background-color: var(--component-background-color-button);
        color: var(--component-foreground-color-button);
        text-decoration: none;
        border-radius: 3px;
        border: none;
        margin: 5px 0;
        font-size: var(--component-base-font-size);
        padding: 5px 10px;
    }

    `;
__decorate([
    property({
        type: (Array)
    }),
    __metadata("design:type", Array)
], LineChartWrapper.prototype, "chartData", void 0);
__decorate([
    property({
        type: String,
    }),
    __metadata("design:type", String)
], LineChartWrapper.prototype, "lineColor", void 0);
__decorate([
    property({
        type: String,
    }),
    __metadata("design:type", String)
], LineChartWrapper.prototype, "pointColor", void 0);
__decorate([
    query("#lineChart"),
    __metadata("design:type", HTMLCanvasElement)
], LineChartWrapper.prototype, "canvas", void 0);
LineChartWrapper = __decorate([
    customElement("line-chart-wrapper"),
    __metadata("design:paramtypes", [])
], LineChartWrapper);
export default LineChartWrapper;
//# sourceMappingURL=LineChartWrapper.js.map