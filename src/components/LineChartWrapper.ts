/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */


import { LitElement, css, html, CSSResult, CSSResultGroup } from "lit";
import {customElement, property, state, query} from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale} from 'chart.js'
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

@customElement("line-chart-wrapper")
class LineChartWrapper extends LitElement {

    static styles?: CSSResultGroup = css`
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

    `
    @property({
        type: Array<Number>
    })
    chartData:Array<Number>;

    @property({
      type: String,
    })
    lineColor: string = "rgb(0, 255, 0)"

    @property({
      type: String,
    })  
    pointColor: string = "rgba(0, 255, 0)"

    // Get referenct to element using querySelector
    @query("#lineChart")
    canvas: HTMLCanvasElement;

    chart: Chart<"line", Number[], number>;

    constructor(){
        super();
    }

    protected firstUpdated(){
        this.chart = this.createChart();
    }

    private createChart(): Chart<"line", Number[], number>{
        return new Chart(
            this.canvas,
            {
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
            }
          );
    }

    private handleDownloadClicked(){
      const a = document.createElement('a');
      a.href = this.chart.toBase64Image();
      a.download = 'chart.png';
      a.click();
    }

    protected render() {
      if (this.chart){
        let color = getComputedStyle(this).getPropertyValue('--line-color');
        this.chart.data.datasets[0].borderColor = color
        this.chart.data.datasets[0].backgroundColor = color
        this.chart.data.labels = this.chartData.map((_, i) => i);
        this.chart.data.datasets[0].data = this.chartData;
        this.chart.update();
      }
      return html`
          <div id="chartContainer">
            <canvas id="lineChart"></canvas>
          </div>
          <div id="controlsContainer">
            <button @click=${this.handleDownloadClicked}>${msg("Download image")}</button>
          </div>
      `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "line-chart-wrapper": LineChartWrapper;
    }
}

export default LineChartWrapper;