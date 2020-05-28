<template>
	<view class="activity-goods-box x-bc" @tap="jump('/pages/goods/detail/index', { id: cardId })">
		<view class="img-box">
			<slot name="tag"></slot>
			<image class="img" :src="img" mode="aspectFill"></image>
		</view>
		<view class="goods-right y-bc">
			<view class="title one-t">{{ title }}</view>
			<view class="tip one-t">{{ subtitle }}</view>
			<view class="slod-end"><slot name="sell"></slot></view>
			<view class=" price-box">
				<view class="x-f">
					<view class="current">￥{{ price }}</view>
					<view class="original">￥{{ originalPrice }}</view>
				</view>
			</view>
			<slot name="btn"></slot>
		</view>
	</view>
</template>

<script>
export default {
	name: 'shoproActivityCard',
	components: {},
	data() {
		return {};
	},
	props: {
		cardId: 0,
		img: '',
		title: '',
		subtitle: '',
		price: '',
		originalPrice: ''
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
.activity-goods-box {
	padding: 40rpx 20rpx;
	background: #fff;

	.img-box {
		margin-right: 20rpx;
		width: 200rpx;
		height: 200rpx;
		overflow: hidden;
		position: relative;

		.img {
			width: 200rpx;
			height: 200rpx;
			background-color: #ccc;
		}
	}

	.goods-right {
		width: 450rpx;
		min-height: 200rpx;
		align-items: flex-start;
		position: relative;
		.title {
			font-size: 28rpx;
			line-height: 28rpx;
			width: 450rpx;
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
				font-size: 22rpx;
				font-weight: 400;
				text-decoration: line-through;
				color: rgba(153, 153, 153, 1);
				margin-left: 14rpx;
			}
		}
	}
}
</style>
