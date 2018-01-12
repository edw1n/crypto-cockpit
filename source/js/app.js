import Vue from 'vue/dist/vue.js';
import io from 'socket.io-client';

import './components/pagination';
import './components/chart';
import './components/coin';
import './components/detail';
import './components/favorites';
import './components/watchlist';
import './components/loader';

const BASE_URL = 'https://coincap.io';
const SOCKET = io.connect(BASE_URL);

const app = new Vue({
	el: '.js-app',

	data() {
		return {
			isLoading: false,

			coins: [],
			activeCoin: null,

			favorites: ['IOT', 'NEO', 'ETH'],

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
		activeCoinData() {
			return this.coins.find(c => c.short === this.activeCoin) || {};
		},

		coinsFavorites() {
			return this.coins.filter(c => this.favorites.includes(c.short));
		},

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

		const data = await this.getData(`${BASE_URL}/front`);

		this.setData(data);

		SOCKET.on('trades', trade => this.onTrade(trade));
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

		setActiveCoin(coin) {
			this.activeCoin = coin;
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

		onPageSelected(page) {
			this.currentPage = page;
		},
	},
});

window.app = app;
