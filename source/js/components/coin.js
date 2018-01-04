import Vue from 'vue/dist/vue.js';

const { locale } = document.documentElement.dataset;
const positiveClass = 'tick--positive';
const negativeClass = 'tick--negative';

const template = `<tr>
					<td>{{ coin.long }} {{ coin.short }}</td>
					<td class="text-right">{{ marketCapFormatted }}</td>
					<td v-bind:class="[tickDirection > 0 ? 'is-positive' : '', tickDirection < 0 ? 'is-negative' : '', 'text-right']">{{ priceFormatted }}</td>
					<td class="text-right">{{supplyFormatted}}</td>
					<td v-bind:class="[coin.cap24hrChange > 0 ? 'is-positive' : '', coin.cap24hrChange < 0 ? 'is-negative' : '', 'text-right']">
						{{ cap24hrChangeFormatted }}
					</td>
				</tr>`;

const coin = Vue.component('component-coin', {
	props: ['coin'],

	data() {
		return {
			tickDirection: 0,
		};
	},

	template,

	computed: {
		marketCapFormatted() {
			const mktcap = Math.floor(this.coin.mktcap);
			const style = { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 };

			return mktcap.toLocaleString(locale, style);
		},

		priceFormatted() {
			const style = { style: 'currency', currency: 'EUR', minimumFractionDigits: 4, maximumFractionDigits: 8 };

			return this.coin.price.toLocaleString(locale, style);
		},

		supplyFormatted() {
			return this.coin.supply.toLocaleString(locale);
		},

		cap24hrChangeFormatted() {
			const style = { style: 'percent', minimumFractionDigits: 2 };

			return (this.coin.cap24hrChange / 100).toLocaleString(locale, style); // eslint-disable-line max-len
		},
	},

	watch: {
		'coin.price': {
			handler(newValue, oldValue) {
				this.tickDirection = newValue > oldValue ? 1 : -1;

				this.animateTick(this.$el, newValue > oldValue);
			},
		},
	},

	methods: {
		animateTick(el, positive) {
			window.requestAnimationFrame(() => {
				let timer; // eslint-disable-line prefer-const

				function onTransitionEnd() {
					el.removeEventListener('transitionend', onTransitionEnd);

					el.classList.remove(positiveClass, negativeClass);

					clearTimeout(timer);
				}

				// Fallback timer for when a transition isn't set nor supported
				timer = setTimeout(() => {
					el.removeEventListener('transitionend', onTransitionEnd);

					el.classList.remove(positiveClass, negativeClass);
				}, 300);

				el.addEventListener('transitionend', onTransitionEnd, false);

				el.classList.add(positive ? positiveClass : negativeClass); // eslint-disable-line max-len
			});
		},
	},
});

export default coin;
