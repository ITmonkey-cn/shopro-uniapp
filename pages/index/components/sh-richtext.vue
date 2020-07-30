<template>
	<view class="sh-richtext-box mb10" v-if="richText.content"><uni-parser :html="richText.content"></uni-parser></view>
</template>

<script>
export default {
	components: {
	},
	data() {
		return {
			richText: ''
		};
	},
	computed: {},
	props: {
		detail: {
			type: Object,
			default: null
		}
	},
	created() {
		this.detail.id && this.getRichText();
	},
	methods: {
		getRichText() {
			this.$api('richtext', {
				id: this.detail.id
			}).then(res => {
				this.richText = res.data;
			});
		}
	}
};
</script>

<style lang="scss">
.sh-richtext-box {
	background: #fff;
	padding: 30rpx;
}
</style>
