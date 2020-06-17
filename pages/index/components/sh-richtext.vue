<template>
	<view class="sh-richtext-box"><uni-parse :content="richText.content"></uni-parse></view>
</template>

<script>
import uniParse from '@/components/uni-parse/uni-parse.vue';
export default {
	components: {
		uniParse
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
		this.getRichText();
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
