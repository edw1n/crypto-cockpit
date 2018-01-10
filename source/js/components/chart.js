import Vue from 'vue/dist/vue.js';
import Highcharts from 'highcharts';

const template = `<div class="chart">
					<select name="period" v-model="period">
						<option value="1day">Intraday</option>
						<option value="365day">Jaar</option>
					</select>
					<div id="chart-container"></div>
				</div>`;

const chart = Vue.component('component-chart', {
	props: ['chart'],

	data() {
		return {
			period: '1day',
			coin: '',
		};
	},

	template,

	watch: {
		period() {
			this.onChangePeriod();
		},
	},

	methods: {
		onChangePeriod() {
			this.$emit('change-period');
		},

		renderChart() {
			Highcharts.chart('chart-container', {
				credits: {
					enabled: false,
				},
				chart: {
					backgroundColor: 'transparent',
					borderRadius: 0,
					pinchType: '',
					spacingRight: 0,
					spacingBottom: 0,
					spacingLeft: 0,
					zoomType: '',
				},
				legend: {
					enabled: false,
				},
				series: [{
					color: '#79d1ff',
					data: this.chart,
				}],
				title: {
					text: null,
				},
				xAxis: {
					labels: {
					},
					dateTimeLabelFormats: {
						day: '%e %b',
						second: '%H:%M',
					},
					lineColor: '#262d33',
					tickColor: '#262d33',
					type: 'datetime',
				},
				yAxis: {
					labels: {
						align: 'center',
						x: -30,
					},
					gridLineColor: '#262d33',
					gridLineWidth: 1,
					lineColor: '#262d33',
					lineWidth: 1,
					title: {
						text: null,
					},
				},
			});
		},
	},
});

export default chart;
