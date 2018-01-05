import Vue from 'vue/dist/vue.js';
import eventbus from './utils/eventbus';
import Highcharts from 'highcharts';
import io from 'socket.io-client';
import './components/chart';
import './components/coin';
import './components/watchlist';

const baseUrl = 'https://coincap.io';
const socket = io.connect(baseUrl);

const app = new Vue({
	el: '.js-app',

	data() {
		return {
			chart: [],
			coins: [],
			watchlist: [{
				long: 'Bitcoin',
				short: 'BTC',
				amount: 1,
				pricePurchase: 16583.1,
				price: 0,
				value: 0,
				performancePercentage: 0,
				performanceValue: 0,
			}, {
				long: 'Bitcoin',
				short: 'BTC',
				amount: 2,
				pricePurchase: 13892.6,
				price: 0,
				value: 0,
				performancePercentage: 0,
				performanceValue: 0,
			}, {
				long: 'Ripple',
				short: 'XRP',
				amount: 5,
				pricePurchase: 3.20485,
				price: 0,
				value: 0,
				performancePercentage: 0,
				performanceValue: 0,
			}],
		};
	},

	async mounted() {
		const data = await this.getData(`${baseUrl}/front`);

		this.setData(data);

		socket.on('trades', trade => this.onTrade(trade));
	},

	methods: {
		async getData(url) {
			const result = await fetch(url);
			const json = await result.json();

			return json;
		},

		setData(json) {
			this.coins = json;
		},

		onTrade(trade) {
			const coin = this.coins.find(c => c.short === trade.msg.short);

			if (coin) {
				Object.assign(coin, trade.msg);

				this.updateWatchlist(trade.msg);
			} else {
				this.coins.push(trade.msg);
			}
		},

		updateWatchlist(trade) {
			const coinInWatchlist = this.watchlist.find(w => trade.short === w.short); // eslint-disable-line max-len

			if (coinInWatchlist) {
				eventbus.$emit('trade', trade);
			}
		},

		async showChart(coin) {
			const data = await this.getData(`${baseUrl}/history/365day/${coin}`);

			this.renderChart(data.price);
		},

		renderChart(data) {
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
					data,
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

window.app = app;
