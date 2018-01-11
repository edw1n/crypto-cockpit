import Vue from 'vue/dist/vue.js';
import { mapGetters, mapState } from 'vuex';

// import io from 'socket.io-client';

import store from './store';

// import './components/pagination';
// import './components/chart';
import Coin from './components/coin';
// import './components/detail';
// import './components/watchlist';
import Loader from './components/loader';

// const BASE_URL = 'https://coincap.io';
// const SOCKET = io.connect(BASE_URL);

const app = new Vue({
	el: '.js-app',
	store,

	// watch: {
	// 	search() {
	// 		this.currentPage = 0;
	// 	},

	// 	perPage() {
	// 		this.currentPage = 0;
	// 	},
	// },

	components: {
		Coin,
		Loader,
	},

	// map this.xx to store.state.xx
	computed: Object.assign(mapState([
		'coins',
		'isLoading',
		'currentPage',
		'perPage',
		'watchlist',
	]), mapGetters([
		'coinsOnPage',
		'totalPages',
	])),

	mounted() {
		console.log('mounted app', this.$store);

		this.$store.dispatch('getData');

		// SOCKET.on('trades', trade => this.onTrade(trade));
	},

	methods: {
		// setData(json) {
		// 	this.coins = json;
		// 	this.coins.forEach(this.updateWatchlist);
		// },

		setActiveCoin(coin) {
			this.$store.commit('activeCoin', coin);
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
			this.$store.commit('page', page);
		},
	},
});

window.app = app;
