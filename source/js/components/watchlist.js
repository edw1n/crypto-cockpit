import Vue from 'vue/dist/vue.js';
import eventbus from '../utils/eventbus';

const { locale } = document.documentElement.dataset;

const template = `<tr>
					<td>{{watchitem.long}}</td>
					<td class="text-right">{{ watchitem.amount }}</td>
					<td class="text-right">{{ pricePurchaseFormatted }}</td>
					<td class="text-right">{{ priceFormatted }}</td>
					<td class="text-right">{{ valueFormatted }}</td>
					<td class="text-right">
						{{ performanceValueFormatted }}
						<span v-bind:class="[watchitem.performancePercentage > 0 ? 'is-positive' : '', watchitem.performancePercentage < 0 ? 'is-negative' : '']">
						<span v-show="watchitem.performancePercentage > 0">&#9650;</span>
						<span v-show="watchitem.performancePercentage < 0">&#9660;</span>
						{{ performancePercentageFormatted }}
						</span>
						</td>
				</tr>`;

const watchlist = Vue.component('component-watchlist', {
	props: ['watchitem'],

	template,

	computed: {
		pricePurchaseFormatted() {
			const style = { style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 8 };

			return this.watchitem.pricePurchase.toLocaleString(locale, style);
		},

		priceFormatted() {
			const style = { style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 8 };

			return this.watchitem.price.toLocaleString(locale, style);
		},

		valueFormatted() {
			const style = { style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 8 };

			return this.watchitem.value.toLocaleString(locale, style);
		},

		performanceValueFormatted() {
			const style = { style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 8 };

			return this.watchitem.performanceValue.toLocaleString(locale, style); // eslint-disable-line max-len
		},

		performancePercentageFormatted() {
			const style = { style: 'percent', minimumFractionDigits: 2 };

			return (this.watchitem.performancePercentage / 100).toLocaleString(locale, style); // eslint-disable-line max-len
		},
	},

	mounted() {
		eventbus.$on('trade', data => this.update(data));
	},

	methods: {
		update(trade) {
			const { watchitem } = this;

			if (trade.short !== watchitem.short) {
				return;
			}

			const { pricePurchase } = watchitem;

			watchitem.value = trade.price * watchitem.amount;
			watchitem.performanceValue = (trade.price - watchitem.pricePurchase) * watchitem.amount; // eslint-disable-line max-len
			watchitem.performancePercentage = (trade.price - pricePurchase) / pricePurchase * 100; // eslint-disable-line max-len
			watchitem.price = trade.price;
		},
	},
});

export default watchlist;
