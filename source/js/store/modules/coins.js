import io from 'socket.io-client';

const BASE_URL = 'https://coincap.io';

const socket = io.connect(BASE_URL);

export default {
	state: {
		coins: [],
		activeCoin: null,

		search: '',

		perPage: 20,
		currentPage: 0,
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
		setCoins(state, coins) {
			state.coins = coins;
			// this.coins.forEach(this.updateWatchlist);
		},

		setActiveCoin(state, coin) {
			state.activeCoin = coin;
		},

		setPage(state, page) {
			state.currentPage = page;
		},

		setPerPage(state, page) {
			state.perPage = page;
		},

		setSearch(state, search) {
			state.search = search;
		},

		setTick(state, trade) {
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
			commit('setLoading');

			const result = await fetch(url);
			const coins = await result.json();

			commit('setCoins', coins);
			commit('setLoading', false);
		},

		connect({ commit, state }) {
			const tick = trade => commit('setTick', trade);

			window.addEventListener('online', (e) => {
				console.log('navigator.onLine', navigator.onLine);

				socket.on('trades', tick);
			});

			window.addEventListener('offline', (e) => {
				console.log('navigator.onLine', navigator.onLine);

				socket.off('trades', tick);
			});
		},
	},
};
