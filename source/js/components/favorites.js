import Vue from 'vue/dist/vue.js';

const template = `<div class="group__item">
					<h1 class="group__label">{{ favorite.long }} <small>{{ favorite.short }}</small></h1>
					<span v-show="favorite.tickDirection > 0">&#9650;</span>
					<span v-show="favorite.tickDirection < 0">&#9660;</span>
					{{ favorite.price }}
					<span v-bind:class="[favorite.cap24hrChange > 0 ? 'is-positive' : '', favorite.cap24hrChange < 0 ? 'is-negative' : '']">
						{{ favorite.cap24hrChange }}
					</span>
				</div>`;

const favorites = Vue.component('component-favorites', {
	props: ['favorite'],

	template,

	watch: {
		'favorite.price': {
			handler() {
				this.notify();
			},
		},
	},

	mounted() {
		Notification.requestPermission();
	},

	methods: {
		// notify() {
		// 	this.notification = new Notification(this.favorite.long, {
		// 		body: this.price,
		// 		icon: 'https://emojipedia-us.s3.amazonaws.com/thumbs/120/emoji-one/104/money-mouth-face_1f911.png',
		// 	});
		// },
	},
});

export default favorites;
