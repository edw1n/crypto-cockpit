import api from '../../api';

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
		async getCoins({ commit, state }) {
			const coins = await api.getCoins();

			commit('setCoins', coins);
		},

		connect({ commit, state }) {
			const socket = api.connect();
			const tick = trade => commit('setTick', trade);

			socket.on('trades', tick);

			window.addEventListener('online', e => socket.on('trades', tick));
			window.addEventListener('offline', e => socket.off('trades', tick));
		},
	},
};
