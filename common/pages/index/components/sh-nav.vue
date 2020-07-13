<template>
	<view class="sh-user-menu-box mb10">
		<view class="menu-list-box">
			<view class="menu-item x-bc" v-for="(nav, index) in detail.list" :key="index" @tap="jump(nav)">
				<view class="x-f">
					<image v-if="nav.image" class="item-img" :src="nav.image" mode=""></image>
					<text class="item-title">{{ nav.name }}</text>
				</view>
				<text class="cuIcon-right item-arrow"></text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
	},
	props: {
		detail: {
			type: Object,
			default: null
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

<style lang="scss">
// 宫格
.tools-box {
	background: #fff;
	display: flex;
	flex-wrap: wrap;
	padding-bottom: 40rpx;
	margin-bottom: 20rpx;

	.tool-item {
		width: (750rpx/4);
		padding-top: 40rpx;

		.tool-img {
			width: 44rpx;
			height: 44rpx;
			// background: #ccc;
		}

		.item-title {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			line-height: 24rpx;
			padding-top: 30rpx;
		}
	}
}
// 列表
.menu-list-box {
	.menu-item {
		height: 100rpx;
		padding: 0 30rpx;
		background: #fff;
		border-bottom: 1rpx solid #f3f3f3;
		.item-img {
			width: 44rpx;
			height: 44rpx;
			margin-right: 20rpx;
			// background: #ccc;
		}

		.item-title {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			line-height: 24rpx;
		}
		.item-arrow {
			color: rgba(153, 153, 153, 1);
		}
	}
}
</style>
