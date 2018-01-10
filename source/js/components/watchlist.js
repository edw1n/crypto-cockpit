import Vue from 'vue/dist/vue.js';

const { locale } = document.documentElement.dataset;

const template = `<tr>
					<td>{{long}}</td>
					<td class="text-right">{{ investmentFormatted }}</td>
					<td class="text-right">{{ amount }}</td>
					<td class="text-right">{{ pricePurchaseFormatted }}</td>
					<td class="text-right">{{ priceFormatted }}</td>
					<td class="text-right">{{ valueFormatted }}</td>
					<td class="text-right text-nowrap">
						{{ performanceValueFormatted }}
						<span v-bind:class="[performancePercentage > 0 ? 'is-positive' : '', performancePercentage < 0 ? 'is-negative' : '']">
							<span v-show="performancePercentage > 0">&#9650;</span>
							<span v-show="performancePercentage < 0">&#9660;</span>
							{{ performancePercentageFormatted }}
						</span>
					</td>
				</tr>`;

const watchlist = Vue.component('component-watchlist', {
	props: {
		pricePurchase: {
			type: Number,
			default: 0,
		},

		price: {
			type: Number,
			default: 0,
		},

		long: {
			type: String,
			default: 'Long',
		},

		amount: {
			type: Number,
			default: 0,
		},

		investment: {
			type: Number,
			default: 0,
		},
	},

	template,

	computed: {
		value() {
			return this.price * this.amount;
		},

		investmentFormatted() {
			const style = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 4 };

			return this.investment.toLocaleString(locale, style);
		},

		performanceValue() {
			return (this.price - this.pricePurchase) * this.amount;
		},

		pricePurchaseFormatted() {
			const style = { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 8 };

			return this.pricePurchase.toLocaleString(locale, style);
		},

		priceFormatted() {
			const style = { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 8 };

			return this.price.toLocaleString(locale, style);
		},

		valueFormatted() {
			const style = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };

			return this.value.toLocaleString(locale, style);
		},

		performanceValueFormatted() {
			const style = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 4 };

			return this.performanceValue.toLocaleString(locale, style); // eslint-disable-line max-len
		},

		performancePercentage() {
			return (this.price - this.pricePurchase) / this.pricePurchase;
		},

		performancePercentageFormatted() {
			const style = { style: 'percent', minimumFractionDigits: 4 };

			return (this.performancePercentage / 100).toLocaleString(locale, style); // eslint-disable-line max-len
		},
	},
});

export default watchlist;
