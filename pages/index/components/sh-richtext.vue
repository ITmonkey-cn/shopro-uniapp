<template>
	<view class="sh-richtext-box u-m-b-10" v-if="richText.content"><u-parse :html="richText.content"></u-parse></view>
</template>

<script>
/**
 * 自定义之富文本卡片
 * @property {Number|String} id - 富文本id
 */
export default {
	components: {},
	data() {
		return {
			richText: ''
		};
	},
	computed: {},
	props: {
		richId: {
			type: [Number, String],
			default: 0
		}
	},
	created() {
		this.richId && this.getRichText();
	},
	methods: {
		getRichText() {
			this.$http('common.richText', {
				id: this.richId
			}).then(res => {
				if (res.code === 1) {
					this.richText = res.data;
				}
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
