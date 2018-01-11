// import { mapState } from 'vuex';

const positiveClass = 'tick--positive';
const negativeClass = 'tick--negative';

const template = `
	<tr v-on:click="setActive">
		<td>
			{{ coin.long }} <small>{{ coin.short }}</small>
		</td>
		<td class="text-right">{{ marketCapFormatted }}</td>
		<td v-bind:class="[coin.tickDirection > 0 ? 'is-positive' : '', coin.tickDirection < 0 ? 'is-negative' : '', 'text-right']">
			<span v-show="coin.tickDirection > 0">&#9650;</span>
			<span v-show="coin.tickDirection < 0">&#9660;</span>
			{{ priceFormatted }}
		</td>
		<td class="text-right">{{supplyFormatted}}</td>
		<td v-bind:class="[coin.cap24hrChange > 0 ? 'is-positive' : '', coin.cap24hrChange < 0 ? 'is-negative' : '', 'text-right']">
			{{ cap24hrChangeFormatted }}
		</td>
		<td class="text-center">
			<button class="button button--unstyled">&#9734;</button>
			<button class="button button--unstyled" v-on:click="showChart">&#128480;</button>
		</td>
	</tr>
`;

export default {
	props: ['coin'],

	template,

	computed: {
		marketCapFormatted() {
			const mktcap = Math.floor(this.coin.mktcap);
			const style = { style: 'currency', currency: 'USD', minimumFractionDigits: 0 };

			return mktcap.toLocaleString(this.$store.locale, style);
		},

		priceFormatted() {
			const style = { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 8 };

			return this.coin.price.toLocaleString(this.$store.locale, style);
		},

		supplyFormatted() {
			return this.coin.supply.toLocaleString(this.$store.locale);
		},

		cap24hrChangeFormatted() {
			const style = { style: 'percent', minimumFractionDigits: 2 };

			return (this.coin.cap24hrChange / 100).toLocaleString(this.$store.locale, style); // eslint-disable-line max-len
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
		setActive(e) {
			this.$store.commit('activeCoin', this.coin);
		},

		showChart(e) {
			// e.stopPropagation();

			this.$emit('active-coin', this.coin.short);
		},

		animateTick(el, positive) {
			window.requestAnimationFrame(() => {
				let timer; // eslint-disable-line prefer-const

				function onTransitionEnd() {
					el.removeEventListener('transitionend', onTransitionEnd);

					el.classList.remove(positiveClass, negativeClass);

					clearTimeout(timer);
				}

				// Fallback timer for when a transition isn't set nor supported
				timer = setTimeout(() => onTransitionEnd, 300);

				el.addEventListener('transitionend', onTransitionEnd, false);

				el.classList.add(positive ? positiveClass : negativeClass); // eslint-disable-line max-len
			});
		},
	},
};
