import Vue from 'vue/dist/vue.js';
import io from 'socket.io-client';
import './components/chart';
import './components/coin';

const baseUrl = 'https://coincap.io';
const socket = io.connect(baseUrl);

const app = new Vue({
	el: '.js-app',

	data() {
		return {
			coins: [],
			form: {},
		};
	},

	async mounted() {
		const data = await this.getData(`${baseUrl}/front`);

		this.setData(data);

		socket.on('trades', trade => this.onTrade(trade));
	},

	methods: {
		async getData(url) {
			const result = await fetch(url);
			const json = await result.json();

			return json;
		},

		setData(json) {
			this.coins = json;
		},

		onTrade(trade) {
			const coin = this.coins.find(c => c.short === trade.msg.short);

			if (coin) {
				Object.assign(coin, trade.msg);
			} else {
				this.coins.push(trade.msg);
			}
		},
	},
});

window.app = app;
