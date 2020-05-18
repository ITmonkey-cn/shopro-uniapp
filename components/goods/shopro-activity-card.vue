<template>
	<view class="dis-goods x-bc" @tap="jump('/pages/goods/detail', { id: seckillData.id })">
		<view class="img-box">
			<view class="tag" v-if="isTag">TOP1</view>
			<image class="img" :src="seckillData.image" mode="widthFix"></image>
		</view>
		<view class="goods-right y-bc">
			<view class="title one-t">{{ seckillData.title }}</view>
			<view class="tip one-t">{{ seckillData.subtitle }}</view>
			<view class="slod-end"><slot name="slodEnd"></slot></view>
			<view class=" price-box">
				<view class="miso-font">
					<text class="current">￥{{ seckillData.price }}</text>
					<text class="original">￥{{ seckillData.original_price }}</text>
				</view>
			</view>
			<slot name="disBtn"></slot>
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
		isTag: {
			type: [Boolean, String],
			default: false
		},
		seckillData: {}
	},
	computed: {},
	created() {},
	methods: {
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({ path: path, query: parmas });
		}
	}
};
</script>

<style lang="scss">
.dis-goods {
	padding: 40rpx 20rpx;
	border-bottom: 1rpx solid #dfdfdf;
	background: #fff;

	.img-box {
		margin-right: 20rpx;
		width: 200rpx;
		height: 200rpx;
		overflow: hidden;
		position: relative;

		.tag {
			position: absolute;
			left: 0;
			top: 10rpx;
			z-index: 2;
			line-height: 35rpx;
			background: linear-gradient(132deg, rgba(255, 153, 93, 1), rgba(255, 99, 97, 1));
			border-radius: 0px 18rpx 18rpx 0px;
			padding: 0 10rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(255, 255, 255, 0.8);
		}

		.img {
			width: 100%;
			background-color: #ccc;
		}
	}

	.goods-right {
		width: 500rpx;
		min-height: 200rpx;
		align-items: flex-start;
		position: relative;
		.title {
			font-size: 28rpx;
			line-height: 28rpx;
			width: 500rpx;
		}

		.tip {
			font-size: 22rpx;
			color: #a8700d;
			width: 500rpx;
		}

		.price-box {
			.current {
				font-size: 28rpx;
				font-weight: 500;
				color: rgba(225, 33, 43, 1);
			}

			.original {
				font-size: 24rpx;
				font-weight: 400;
				text-decoration: line-through;
				color: rgba(153, 153, 153, 1);
				margin-left: 14rpx;
			}
		}
	}
}
</style>
