<template>
	<view class="grid-wap u-m-b-10 u-flex u-flex-wrap u-col-center" v-if="list.length">
		<view class="grid-item u-flex-col u-row-center u-col-center" v-for="(menu, index) in list" :key="index" @tap="jump(menu)">
			<image class="tool-img" :src="menu.image" mode="aspectFill"></image>
			<view class="item-title">{{ menu.name }}</view>
		</view>
	</view>
</template>

<script>
/**
 * shGrid-宫格列表
 * @property {Array} list  - 宫格列表
 */
export default {
	components: {},
	data() {
		return {};
	},
	computed: {},
	props: {
		list: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	created() {},
	methods: {
		jump(data) {
			this.$tools.routerTo(data.path);
		}
	}
};
</script>

<style lang="scss">
// 宫格
.grid-wap {
	background: #fff;
	width: 750rpx;
	padding: 30rpx 0 0;
	.grid-item {
		width: 25%;
		margin-bottom: 40rpx;
		.tool-img {
			width: 44rpx;
			height: 44rpx;
		}
		.item-title {
			font-size: 26rpx;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			line-height: 24rpx;
			padding-top: 20rpx;
		}
	}
}
</style>
