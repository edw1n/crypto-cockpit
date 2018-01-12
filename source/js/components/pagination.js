import { mapState } from 'vuex';

const template = `
	<div class="paging" v-if="hasPages">
		<button v-bind:disabled="firstDisabled" v-on:click="gotoFirstPage" class="paging__link"><<</button>
		<button v-bind:disabled="previousDisabled" v-on:click="gotoPreviousPage" class="paging__link"><</button>

		<button v-for="page in pages" class="paging__link" v-bind:class="{'is-active': page.page === currentPage}" v-on:click="setPage(page.page)">{{ page.label }}</button>

		<button v-bind:disabled="nextDisabled" v-on:click="gotoNextPage" class="paging__link">></button>
		<button v-bind:disabled="lastDisabled" v-on:click="gotoLastPage" class="paging__link">>></button>
	</div>
`;

export default {
	template,

	props: {
		totalPages: {
			type: Number,
			required: true,
		},

		maxPages: {
			default: 4,
			type: Number,
		},
	},

	data() {
		return {
			hasFirst: false,
			hasLast: false,
			pages: [],
		};
	},

	computed: Object.assign(
		mapState([
			'currentPage',
			'perPage',
		]),
		{
			hasPages() {
				return this.totalPages > 1;
			},

			previousDisabled() {
				return this.currentPage === 0;
			},

			firstDisabled() {
				return this.currentPage === 0;
			},

			nextDisabled() {
				return this.currentPage === this.totalPages - 1;
			},

			lastDisabled() {
				return this.currentPage === this.totalPages - 1;
			},
		}
	),

	watch: {
		totalPages() {
			this.createPagination();
		},

		currentPage() {
			this.createPagination();
		},
	},

	methods: {
		// page is zero based
		createPagination() {
			this.pages = [];

			const halfMaxPages = Math.ceil(this.maxPages / 2);
			let startPage = Math.max(this.currentPage - halfMaxPages, 0);
			let endPage = Math.min(this.currentPage + halfMaxPages, this.totalPages - 1);

			if (startPage + endPage < this.maxPages) {
				endPage = Math.min(endPage + (this.maxPages - endPage), this.totalPages - 1);
			}

			if (endPage - startPage < this.maxPages) {
				startPage = Math.max(0, startPage - (this.maxPages - (endPage - startPage)));
			}

			for (let i = startPage; i <= endPage; i++) {
				this.pages.push({
					page: i,
					label: i + 1,
				});
			}
		},

		gotoPreviousPage() {
			this.setPage(this.currentPage - 1);
		},

		gotoFirstPage() {
			this.setPage(0);
		},

		gotoNextPage() {
			this.setPage(this.currentPage + 1);
		},

		gotoLastPage() {
			this.setPage(this.totalPages - 1);
		},

		setPage(page) {
			this.$store.commit('page', page);
		},
	},
};
