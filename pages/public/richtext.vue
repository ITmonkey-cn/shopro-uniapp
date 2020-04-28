<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="content_box"><shopro-parse :content="richText.content"></shopro-parse></view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
import shoproParse from '@/components/parse/parse.vue';
export default {
	components: {
		shoproParse
	},
	data() {
		return {
			richText: ''
		};
	},
	computed: {},
	onLoad() {
		this.init();
	},
	methods: {
		init() {
			return Promise.all([this.getRichText()]);
		},
		getRichText() {
			this.$api('richtext', {
				id: this.$Route.query.id
			}).then(res => {
				this.richText = res.data;
				uni.setNavigationBarTitle({
					title: res.data.title
				});
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
