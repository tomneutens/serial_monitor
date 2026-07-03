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
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler, Tooltip } from 'chart.js';
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler, Tooltip);
let LineChartWrapper = class LineChartWrapper extends LitElement {
    constructor() {
        super();
        this.chartData = [];
        this.lineColor = "rgb(0, 255, 0)";
        this.pointColor = "rgba(0, 255, 0)";
        this.lastPointCount = -1;
        // Cached theme colours resolved from CSS custom properties (kept in sync on every update).
        this.colors = { line: this.lineColor, fill: "rgba(129,159,61,0.22)", grid: "rgba(127,127,127,0.16)", text: "#888", surface: "transparent" };
    }
    firstUpdated() {
        this.resolveColors();
        this.chart = this.createChart();
    }
    /** Read the current theme colours from CSS variables so the chart adapts to light/dark and consumer themes. */
    resolveColors() {
        const s = getComputedStyle(this);
        const pick = (name, fallback) => {
            const v = s.getPropertyValue(name).trim();
            return v.length > 0 ? v : fallback;
        };
        this.colors = {
            line: pick('--line-color', this.lineColor),
            fill: pick('--chart-fill-color', 'rgba(129,159,61,0.22)'),
            grid: pick('--chart-grid-color', 'rgba(127,127,127,0.16)'),
            text: pick('--component-foreground-color', '#888'),
            surface: pick('--component-surface-color', 'transparent'),
        };
    }
    createChart() {
        return new Chart(this.canvas, {
            type: 'line',
            data: {
                labels: this.chartData.map((_, i) => i),
                datasets: [
                    {
                        label: msg("Serial data"),
                        data: this.chartData,
                        borderColor: this.colors.line,
                        // Soft vertical gradient fill under the line for a modern look.
                        backgroundColor: (context) => {
                            const { ctx, chartArea } = context.chart;
                            if (!chartArea)
                                return this.colors.fill;
                            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                            gradient.addColorStop(0, this.colors.fill);
                            gradient.addColorStop(1, 'transparent');
                            return gradient;
                        },
                        borderWidth: 2,
                        fill: true,
                        tension: 0.35,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHitRadius: 8,
                        pointBackgroundColor: this.colors.line,
                        pointBorderColor: this.colors.line,
                    }
                ]
            },
            options: {
                animation: {
                    duration: 0 // general animation time
                },
                maintainAspectRatio: false,
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: this.colors.surface,
                        titleColor: this.colors.text,
                        bodyColor: this.colors.text,
                        borderColor: this.colors.grid,
                        borderWidth: 1,
                        padding: 8,
                        displayColors: false,
                    },
                },
                scales: {
                    x: {
                        border: { display: false },
                        grid: { color: this.colors.grid },
                        ticks: { color: this.colors.text, maxTicksLimit: 8, maxRotation: 0 },
                    },
                    y: {
                        border: { display: false },
                        grid: { color: this.colors.grid },
                        ticks: { color: this.colors.text },
                    },
                },
            }
        });
    }
    /** Push the cached theme colours onto the existing chart instance. */
    applyThemeToChart() {
        var _a;
        if (!this.chart)
            return;
        const ds = this.chart.data.datasets[0];
        ds.borderColor = this.colors.line;
        ds.pointBackgroundColor = this.colors.line;
        ds.pointBorderColor = this.colors.line;
        const scales = this.chart.options.scales;
        if (scales === null || scales === void 0 ? void 0 : scales.x) {
            scales.x.grid.color = this.colors.grid;
            scales.x.ticks.color = this.colors.text;
        }
        if (scales === null || scales === void 0 ? void 0 : scales.y) {
            scales.y.grid.color = this.colors.grid;
            scales.y.ticks.color = this.colors.text;
        }
        const tooltip = (_a = this.chart.options.plugins) === null || _a === void 0 ? void 0 : _a.tooltip;
        if (tooltip) {
            tooltip.backgroundColor = this.colors.surface;
            tooltip.titleColor = this.colors.text;
            tooltip.bodyColor = this.colors.text;
            tooltip.borderColor = this.colors.grid;
        }
    }
    handleDownloadClicked() {
        const a = document.createElement('a');
        a.href = this.chart.toBase64Image();
        a.download = 'chart.png';
        a.click();
    }
    updated(changed) {
        // Update the chart only when the data actually changes, and do so outside of render()
        // to avoid triggering side effects during template evaluation.
        if (this.chart && changed.has('chartData')) {
            this.resolveColors();
            this.applyThemeToChart();
            if (this.chartData.length !== this.lastPointCount) {
                this.chart.data.labels = this.chartData.map((_, i) => i);
                this.lastPointCount = this.chartData.length;
            }
            this.chart.data.datasets[0].data = this.chartData;
            // 'none' performs an in-place redraw without animation/relayout for maximum throughput.
            this.chart.update('none');
        }
    }
    render() {
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
        flex: 1 1 auto;
        min-height: 0;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        align-content: stretch;
        display: flex;
        padding: var(--component-space-md);
        overflow: hidden;
        box-sizing: border-box;
        --line-color: var(--component-background-color-button);
        --chart-grid-color: var(--theme-chart-grid-color, rgba(127, 127, 127, 0.16));
        --chart-fill-color: var(--theme-chart-fill-color, rgba(129, 159, 61, 0.22));
      }
      #chartContainer {
        position: relative;
        flex-grow: 1;
        flex-shrink: 1;
        min-height: 120px;
        background-color: var(--component-surface-color);
        border: 1px solid var(--component-border-color);
        border-radius: var(--component-radius);
        padding: var(--component-space-sm);
        box-sizing: border-box;
      }
      #controlsContainer {
        flex-basis: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      button {
        background-color: var(--component-background-color-button);
        color: var(--component-foreground-color-button);
        text-decoration: none;
        border-radius: var(--component-radius);
        border: none;
        font-size: var(--component-base-font-size);
        font-family: var(--component-base-font-family);
        padding: var(--component-space-sm) var(--component-space-md);
        cursor: pointer;
        transition: background-color 0.15s ease, transform 0.05s ease;
    }

      button:hover {
        background-color: var(--component-background-color-button-hover);
      }

      button:active {
        transform: translateY(1px);
      }

      button:focus-visible {
        outline: 2px solid var(--component-focus-ring);
        outline-offset: 2px;
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