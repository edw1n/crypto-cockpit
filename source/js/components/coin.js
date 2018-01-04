import Vue from 'vue/dist/vue.js';

const { locale } = document.documentElement.dataset;
const positiveClass = 'tick--positive';
const negativeClass = 'tick--negative';

const template = `<tr>
					<td>{{ coin.long }}</td>
					<td class="text-right">{{ coin.mktcap }}</td>
					<td class="text-right">{{ coin.price }}</td>
					<td class="text-right">{{supplyFormatted}}</td>
					<td v-bind:class="[coin.cap24hrChange > 0 ? 'is-positive' : '', coin.cap24hrChange < 0 ? 'is-negative' : '', 'text-right']">
						{{ coin.cap24hrChange }}%
					</td>
				</tr>`;

const coin = Vue.component('component-coin', {
	props: ['coin'],

	template,

	computed: {
		supplyFormatted() {
			return this.coin.supply.toLocaleString(locale);
		},
	},

	watch: {
		'coin.price': {
			handler(newValue, oldValue) {
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
