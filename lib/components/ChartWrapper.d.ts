/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */
import { LitElement, CSSResultGroup } from "lit";
declare class LineChartWrapper extends LitElement {
    static styles?: CSSResultGroup;
    chartData: Array<Number>;
    canvas: HTMLCanvasElement;
    constructor();
    protected firstUpdated(): void;
    private createChart;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "line-chart-wrapper": LineChartWrapper;
    }
}
export default LineChartWrapper;
//# sourceMappingURL=ChartWrapper.d.ts.map