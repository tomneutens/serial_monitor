/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
import { LitElement, CSSResultGroup } from "lit";
import { Chart } from 'chart.js';
declare class LineChartWrapper extends LitElement {
    static styles?: CSSResultGroup;
    chartData: Array<Number>;
    lineColor: string;
    pointColor: string;
    canvas: HTMLCanvasElement;
    chart: Chart<"line", Number[], number>;
    constructor();
    protected firstUpdated(): void;
    private createChart;
    private handleDownloadClicked;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "line-chart-wrapper": LineChartWrapper;
    }
}
export default LineChartWrapper;
//# sourceMappingURL=LineChartWrapper.d.ts.map