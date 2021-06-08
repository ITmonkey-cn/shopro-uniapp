<template>
	<view class="search u-flex u-row-center u-col-center u-m-b-10 u-p-x-20" @tap="$Router.push('/pages/public/search')">
		<view style="width: 710rpx;"><u-search disabled :show-action="false" placeholder="搜索"></u-search></view>
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
}
</style>
