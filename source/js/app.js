import Vue from 'vue/dist/vue.js';
import eventbus from './utils/eventbus';
import Highcharts from 'highcharts';
import io from 'socket.io-client';

import './components/chart';
import './components/coin';
import './components/watchlist';
import './components/loader';

const baseUrl = 'https://coincap.io';
const socket = io.connect(baseUrl);

const app = new Vue({
	el: '.js-app',

	data() {
		return {
			isLoading: false,
			chart: [],
			coins: [],
			watchlist: [{
				long: 'Bitcoin',
				short: 'BTC',
				amount: 10,
				pricePurchase: 822.45,
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
			watchlistForm: {
				coin: null,
				pricePurchase: null,
				amount: null,
			},
		};
	},

	async mounted() {
		const data = await this.getData(`${baseUrl}/front`);

		this.setData(data);

		socket.on('trades', trade => this.onTrade(trade));
	},

	methods: {
		async getData(url) {
			this.isLoading = true;

			const result = await fetch(url);
			const json = await result.json();

			this.isLoading = false;

			return json;
		},

		setData(json) {
			this.coins = json;
			this.coins.forEach(this.updateWatchlist);
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

		onSubmitForm(e) {
			e.preventDefault();

			const { watchlistForm } = this;
			const coin = this.coins.find(c => c.short === watchlistForm.coin);
			const data = Object.assign({}, coin, watchlistForm);

			this.watchlist.push(data);
		},

		updateWatchlist(trade) {
			const coinsInWatchlist = this.watchlist.filter(w => trade.short === w.short); // eslint-disable-line max-len

			if (!coinsInWatchlist.length) {
				return;
			}

			coinsInWatchlist.forEach((c) => {
				c.price = trade.price;
			});
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
