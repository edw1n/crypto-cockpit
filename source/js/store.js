import Vue from 'vue/dist/vue.js';
import Vuex from 'vuex';

import io from 'socket.io-client';

const BASE_URL = 'https://coincap.io';

const SOCKET = io.connect(BASE_URL);

const { locale } = document.documentElement.dataset;

Vue.use(Vuex);

const createWebSocketPlugin = socket => (store) => {
	SOCKET.on('trades', trade => store.commit('tick', trade));
};

export default new Vuex.Store({
	strict: true,

	plugins: [
		createWebSocketPlugin(SOCKET),
	],

	state: {
		locale,

		isLoading: false,

		coins: [],
		activeCoin: null,

		search: '',

		perPage: 20,
		currentPage: 0,

		watchlist: [],
		watchlistForm: {
			coin: null,
			investment: null,
			amount: null,
		},
	},

	getters: {
		coinsFiltered: state => state.coins.filter(c => c.long.toLowerCase().includes(state.search.toLowerCase())),

		totalPages: (state, getters) => Math.ceil(getters.coinsFiltered.length / state.perPage),

		coinsOnPage: (state, getters) => {
			if (!state.coins.length) {
				return state.coins;
			}

			const start = state.currentPage * state.perPage;
			const end = Math.min(start + state.perPage, getters.coinsFiltered.length);

			return getters.coinsFiltered.slice(start, end);
		},
	},

	mutations: {
		loading(state, isLoading = true) {
			state.isLoading = isLoading;
		},

		coins(state, coins) {
			state.coins = coins;
			// this.coins.forEach(this.updateWatchlist);
		},

		activeCoin(state, coin) {
			state.activeCoin = coin;
		},

		page(state, page) {
			state.currentPage = page;
		},

		perPage(state, page) {
			state.perPage = page;
		},

		search(state, search) {
			state.search = search;
		},

		tick(state, trade) {
			const coin = state.coins.find(c => c.short === trade.msg.short);

			if (!coin) {
				return;
			}

			const direction = trade.msg.price > coin.price ? 1 : -1;

			Object.assign(coin, trade.msg, { tickDirection: direction });

			// this.updateWatchlist(trade.msg);
		},
	},

	actions: {
		async getData({ commit, state }, url = `${BASE_URL}/front`) {
			commit('loading');

			const result = await fetch(url);
			const coins = await result.json();

			commit('coins', coins);
			commit('loading', false);
		},
	},
});
