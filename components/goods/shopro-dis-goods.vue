<template>
	<view class="dis-goods x-bc" @tap="jump('/pages/goods/detail')">
		<view class="img-box">
			<view class="tag" v-if="isTag">
				TOP1
			</view>
			<image class="img" src="" mode=""></image>
		</view>
		<view class="goods-right y-bc">
			<view class="title one-t">
				泰国TSM防晒喷雾学生户外泰国TSM防晒喷雾学生户外...
			</view>
			<view class="tip">
				高效防晒，清爽不油腻
			</view>
			<view class="slod-end">
				<slot name="slodEnd"></slot>
			</view>
			<view class=" price-box">
				<view class="miso-font">
					<text class="current">￥55</text>
					<text class="original">￥100</text>
				</view>
			</view>
			<button class="cu-btn buy-btn">马上抢</button>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {};
		},
		props:{
			  isTag:{
				  type:[Boolean,String],
				  default:false
			  }
		},
		computed: {},
		methods: {
			// 路由跳转
			jump(path,parmas){
				this.$Router.push({ path: path, query: parmas})
			}
		},

	};
</script>

<style lang="scss">
	.dis-goods {
		padding: 40rpx 20rpx;
		border-bottom: 1rpx solid #DFDFDF;
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
				background:linear-gradient(132deg,rgba(255,153,93,1),rgba(255,99,97,1));
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
			width: 410rpx;
			height: 200rpx;
			align-items: flex-start;
			position: relative;
			.title {
				font-size: 28rpx;
				line-height: 28rpx;
				width: 450rpx;
			}

			.tip {
				font-size: 22rpx;
				color: #A8700D;
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
			.buy-btn{
				position: absolute;
				right: 0;
				bottom: 0;
				width:140rpx;
				height:60rpx;
				background:linear-gradient(90deg,rgba(233,180,97,1),rgba(238,204,137,1));
				box-shadow:0px 7rpx 6rpx 0px rgba(229,138,0,0.22);
				border-radius:30rpx;
				font-size:26rpx;
				font-family:PingFang SC;
				font-weight:400;
				color:rgba(255,255,255,1);
				padding: 0;
			}
		}
	}
</style>
