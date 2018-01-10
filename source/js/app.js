import Vue from 'vue/dist/vue.js';
import io from 'socket.io-client';

import './components/pagination';
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

			search: '',

			perPage: 20,
			currentPage: 0,

			watchlist: [],
			watchlistForm: {
				coin: null,
				investment: null,
				amount: null,
			},
		};
	},

	watch: {
		search() {
			this.currentPage = 0;
		},

		perPage() {
			this.currentPage = 0;
		},
	},

	computed: {
		coinsFiltered() {
			return this.coins.filter(c => c.long.toLowerCase().includes(this.search.toLowerCase())); // eslint-disable-line max-len
		},

		totalPages() {
			return Math.ceil(this.coinsFiltered.length / this.perPage);
		},

		coinsOnPage() {
			if (!this.coins) {
				return [];
			}

			const start = this.currentPage * this.perPage;
			const end = Math.min(start + this.perPage, this.coinsFiltered.length); // eslint-disable-line max-len

			return this.coinsFiltered.slice(start, end);
		},
	},

	async mounted() {
		this.getWatchlistData();

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

			if (!coin) {
				return;
			}

			const direction = trade.msg.price > coin.price ? 1 : -1;

			Object.assign(coin, trade.msg, { tickDirection: direction });

			this.updateWatchlist(trade.msg);
		},

		onSubmitForm(e) {
			e.preventDefault();

			const { watchlistForm } = this;
			const coin = this.coins.find(c => c.short === watchlistForm.coin);

			watchlistForm.amount = Number((watchlistForm.investment / coin.price).toFixed(8)); // eslint-disable-line max-len
			watchlistForm.pricePurchase = coin.price;

			const data = Object.assign({}, coin, watchlistForm);

			this.watchlist.push(data);

			localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
		},

		getWatchlistData() {
			const watchlist = JSON.parse(localStorage.getItem('watchlist'));

			if (watchlist) {
				this.watchlist = watchlist;
			}
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

		async getChartData(period, coin) {
			const data = await this.getData(`${baseUrl}/history/${period}/${coin}`);

			console.log(data);

			this.chart = data.price;
		},

		showChart(coin) {
			console.log(coin);
			// const data = await this.getData(`${baseUrl}/history/365day/${coin}`);

			// this.renderChart(data.price);
		},

		onPageSelected(page) {
			this.currentPage = page;
		},
	},
});

window.app = app;
