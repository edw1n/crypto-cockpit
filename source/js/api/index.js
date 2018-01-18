import io from 'socket.io-client';

const BASE_URL = 'https://coincap.io';

export default {
	async getCoins(url = `${BASE_URL}/front`) {
		const result = await fetch(url);
		const coins = await result.json();

		return coins;
	},

	connect() {
		return io.connect(BASE_URL);
	},
};
