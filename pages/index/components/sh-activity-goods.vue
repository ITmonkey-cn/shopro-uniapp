<template>
	<view class="min-goods" @tap="jump('/pages/goods/detail/index', { id: detail.id })">
		<view class="img-box">
			<view class="tag" v-if="detail.activity_type === 'groupon'">{{ detail.activity.rules.team_num }}人团</view>
			<image class="img" :src="detail.image" mode="widthFix"></image>
		</view>
		<view class="price-box">
			<view class="y-f">
				<text class="seckill-current">￥{{ detail.activity_type === 'groupon' ? detail.groupon_price : detail.price }}</text>
				<text class="original">￥{{ detail.original_price }}</text>
			</view>
		</view>
		<view class="title"><slot name="titleText"></slot></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
	},
	props: {
		detail: Object
	},
	computed: {},
	methods: {
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({ path: path, query: parmas });
		}
	}
};
</script>

<style lang="scss">
.min-goods {
	width: 152rpx;
	background: #fff;
	.img-box {
		width: 152rpx;
		height: 152rpx;
		overflow: hidden;
		position: relative;
		.tag {
			position: absolute;
			left: 0;
			bottom: 0rpx;
			z-index: 2;
			line-height: 35rpx;
			background: linear-gradient(132deg, rgba(243, 223, 177, 1), rgba(243, 223, 177, 1), rgba(236, 190, 96, 1));
			border-radius: 0px 18rpx 18rpx 0px;
			padding: 0 10rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(120, 79, 6, 1);
		}
		.img {
			width: 100%;
			background-color: #ccc;
		}
	}
	.price-box {
		width: 100%;
		margin-top: 10rpx;
		.seckill-current {
			font-size: 30rpx;
			font-weight: 500;
			color: rgba(225, 33, 43, 1);
		}
		.original {
			font-size: 20rpx;
			font-weight: 400;
			text-decoration: line-through;
			color: rgba(153, 153, 153, 1);
			margin-left: 14rpx;
		}
	}
	.title {
		font-size: 26rpx;
	}
}
</style>
