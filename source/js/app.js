import Vue from 'vue/dist/vue.js';
import { mapState, mapGetters } from 'vuex';

import store from './store';

import Paging from './components/pagination';
// import './components/chart';
import Coin from './components/coin';
// import './components/detail';
import Watchlist from './components/watchlist';
import Loader from './components/loader';

// if ('serviceWorker' in navigator) {
// 	navigator.serviceWorker.register('/sw.js');
// }

const app = new Vue({
	el: '.js-app',
	store,

	components: {
		'component-coin': Coin,
		'component-loader': Loader,
		'component-pagination': Paging,
		'component-watchlist': Watchlist,
	},

	async mounted() {
		this.$store.commit('setLoading');

		await this.$store.dispatch('getCoins');

		this.$store.dispatch('getWatchlistData');

		this.$store.commit('setLoading', false);
		this.$store.dispatch('connect');
	},

	// map 'store.state.xx' to 'this.xx'
	computed: Object.assign(
		mapState([
			'coins',
			'currentPage',
			'watchlist',
		]),
		mapGetters([
			'coinsOnPage',
		]),
		{
			// https://vuex.vuejs.org/en/forms.html
			perPage: {
				get() {
					return this.coins.perPage;
				},
				set(value) {
					this.$store.commit('setPerPage', value);
				},
			},
			search: {
				get() {
					return this.coins.search;
				},
				set(value) {
					this.$store.commit('setSearch', value);
				},
			},
			watchlistFormCoin: {
				get() {
					return this.watchlist.form.coin;
				},
				set(value) {
					this.$store.commit('setWatchlistCoin', value);
				},
			},
			watchlistFormInvestment: {
				get() {
					return this.watchlist.form.investment;
				},
				set(value) {
					this.$store.commit('setWatchlistInvestment', value);
				},
			},
		}
	),

	watch: {
		search() {
			this.$store.commit('setPage', 0);
		},

		perPage() {
			this.$store.commit('setPage', 0);
		},
	},

	methods: {
		onSubmitForm(e) {
			e.preventDefault();

			const { watchlist: { form } } = this;
			const coin = this.coins.coins.find(c => c.short === form.coin);

			const data = Object.assign({}, coin, form, {
				pricePurchase: coin.price,
				amount: Number((form.investment / coin.price).toFixed(8)),
			});

			this.$store.commit('addToWatchlist', data);

			localStorage.setItem('watchlist', JSON.stringify(this.watchlist.items));
		},

		updateWatchlist(trade) {
			const coinsInWatchlist = this.watchlist.filter(w => trade.short === w.short);

			if (!coinsInWatchlist.length) {
				return;
			}

			coinsInWatchlist.forEach((c) => {
				c.price = trade.price;
			});
		},
	},
});

window.app = app;
