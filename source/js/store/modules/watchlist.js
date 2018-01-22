export default {
	state: {
		items: [],
		form: {
			coin: null,
			investment: null,
		},
	},

	mutations: {
		setWatchlistCoin(state, value) {
			state.form.coin = value;
		},

		setWatchlistInvestment(state, value) {
			state.form.investment = value;
		},

		addToWatchlist(state, data) {
			state.items.push(data);
		},

		setWatchlistData(state, data) {
			state.items = data;
		},
	},

	actions: {
		getWatchlistData({ commit, state }) {
			const data = JSON.parse(localStorage.getItem('watchlist'));

			if (data) {
				commit('setWatchlistData', data);
			}
		},

		updateWatchlist({ commit, state }, data) {
			const inWatchlist = state.items.filter(w => data.short === w.short);

			if (!inWatchlist.length) {
				return;
			}

			inWatchlist.forEach((c) => {
				c.price = data.price;
			});
		},
	},
};
