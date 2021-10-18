<template>
	<view class="search u-flex u-row-center u-col-center u-m-b-10 u-p-x-20" @tap="$Router.push('/pages/public/search')">
		<view class="search-content u-flex u-col-center">
			<text class="u-iconfont uicon-search search-icon"></text>
			<view class="pl-text">搜索</view>
		</view>
	</view>
</template>

<script>
/**
 * 自定义之搜索样式卡片
 * @property {Object} detail - 搜索信息
 */
export default {
	components: {},
	data() {
		return {};
	},
	computed: {},
	methods: {}
};
</script>

<style lang="scss">
.search {
	height: 100rpx;
	width: 750rpx;
	background: #fff;
	.search-content {
		width: 710rpx;
		padding: 0 18rpx;
		background-color: #f2f2f2;
		border-radius: 100rpx;
		height: 64rpx;
		.search-icon {
			color: #606266;
			size: 34rpx;
		}
		.pl-text {
			color: $u-tips-color;
			margin-left: 10rpx;
		}
	}
}
</style>
