<!-- 富文本 -->
<template>
	<view class="rich-wrap">
		<view class="content_box"><u-parse :html="richText.content"></u-parse></view>
	</view>
</template>

<script>
import Auth from '@/shopro/permission/index.js';
export default {
	components: {},
	data() {
		return {
			richText: ''
		};
	},
	computed: {},
	onLoad() {
		this.$Route.query.id && this.getRichText();
	},
	methods: {
		getRichText() {
			this.$http('common.richText', {
				id: this.$Route.query.id
			}).then(res => {
				if (res.code === 1) {
					this.richText = res.data;
					uni.setNavigationBarTitle({
						title: res.data.title
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
.content_box {
	background: #fff;
	padding: 30rpx;
}
</style>
