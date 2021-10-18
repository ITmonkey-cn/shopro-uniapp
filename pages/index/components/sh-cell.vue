<template>
	<view class="sh-user-menu-box u-m-b-10">
		<view class="menu-item u-flex u-row-between u-border-bottom" hover-stay-time="150" hover-class="u-cell-hover" v-for="(item, index) in list" :key="index" @tap="jump(item)">
			<view class="menu-head u-flex u-col-center">
				<image class="menu-img u-m-r-10" :src="item.image" mode=""></image>
				<view class="menu-title ">{{ item.name }}</view>
			</view>
			<view class="u-iconfont uicon-arrow-right" style="color: #969799;font-size: 28rpx;"></view>
		</view>
	</view>
</template>

<script>
/**
 *shCell-功能列表
 * @property {Array} list - 列表信息
 */
export default {
	components: {},
	data() {
		return {};
	},
	props: {
		list: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	computed: {},
	methods: {
		jump(data) {
			this.$tools.routerTo(data.path);
		}
	}
};
</script>

<style lang="scss" scoped>
.menu-item {
	background-color: #fff;
	width: 100%;
	padding: 26rpx 32rpx;
	font-size: 28rpx;
	line-height: 54rpx;
	.menu-img {
		width: 36rpx;
		height: 36rpx;
	}
	.menu-title {
		font-size: 26rpx;
		color: #999;
	}
}
</style>
