import Vue from 'vue/dist/vue.js';
import Highcharts from 'highcharts';

const config = {
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
	loading: {
		style: {
			backgroundColor: '#13181c',
			opacity: 0.75,
		},
	},
	series: [{
		color: '#79d1ff',
		id: 'Price',
		name: 'Price',
		data: [],
	}],
	title: {
		text: null,
	},
	xAxis: {
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
};

const period = '1day';

const template = `<div class="chart">
					<select name="period" v-model="period">
						<option value="1day">Day</option>
						<option value="7day">Week</option>
						<option value="30day">Month</option>
						<option value="365day">Year</option>
						<option value="">All</option>
						<option value="live">Live</option>
					</select>
					<div id="chart-container"></div>
				</div>`;

const chart = Vue.component('component-chart', {
	props: ['coin'],

	data() {
		return {
			period,
			chart: null,
			serie: [],
			liveTicks: false,
		};
	},

	template,

	watch: {
		period(newValue, oldValue) {
			if (newValue === 'live') {
				this.serie = [];

				this.liveTicks = true;

				return;
			}

			this.liveTicks = false;

			this.getData();
		},

		serie() {
			this.setData();
		},

		coin() {
			this.serie = [];
			this.period = period;

			this.getData();
		},

		'coin.price': {
			handler(newValue, oldValue) {
				if (this.liveTicks) {
					this.addTick([Date.now(), newValue]);
				}
			},
		},
	},

	mounted() {
		this.render((highchart) => {
			this.chart = highchart;

			this.getData();
		});
	},

	methods: {
		async getData() {
			let url = `http://coincap.io/history/${this.period}/${this.coin.short}`;

			if (!this.period) {
				url = `http://coincap.io/history/${this.coin.short}`;
			}

			this.chart.showLoading('loading...');

			const result = await fetch(url);
			const json = await result.json();

			this.chart.hideLoading();

			json.price.pop();

			this.serie = json.price;
		},

		render(callback) {
			return Highcharts.chart('chart-container', config, callback);
		},

		setData() {
			this.chart.get('Price').setData(this.serie, true);
		},

		addTick(data) {
			this.chart.get('Price').addPoint(data);
		},
	},
});

export default chart;
