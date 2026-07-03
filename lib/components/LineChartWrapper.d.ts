/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
import { LitElement, CSSResultGroup, PropertyValues } from "lit";
import { Chart } from 'chart.js';
declare class LineChartWrapper extends LitElement {
    static styles?: CSSResultGroup;
    chartData: Array<Number>;
    lineColor: string;
    pointColor: string;
    canvas: HTMLCanvasElement;
    chart: Chart<"line", Number[], number>;
    private lastPointCount;
    private colors;
    constructor();
    protected firstUpdated(): void;
    /** Read the current theme colours from CSS variables so the chart adapts to light/dark and consumer themes. */
    private resolveColors;
    private createChart;
    /** Push the cached theme colours onto the existing chart instance. */
    private applyThemeToChart;
    private handleDownloadClicked;
    protected updated(changed: PropertyValues): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "line-chart-wrapper": LineChartWrapper;
    }
}
export default LineChartWrapper;
//# sourceMappingURL=LineChartWrapper.d.ts.map