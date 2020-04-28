<template>
	<!-- 今日必拼 -->
	<view class="group-goods" v-if="false">
		<view class="title-box x-bc" @tap="jump('/pages/goods/group-list')">
			<text class="title">今日必拼</text>
			<view class="group-people x-f">
				<view class="head-box x-f"><image v-for="i in 3" class="head-img" src="" mode="" :key="i"></image></view>
				<text class="tip">好友正在拼</text>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="goods-box x-f">
			<shopro-activity-goods :isTag="true" class="goods-item" v-for="item in 4" :key="item"><block slot="titleText">已拼111件</block></shopro-activity-goods>
		</view>
	</view>
</template>

<script>
import shoproActivityGoods from '@/components/goods/shopro-activity-goods.vue';
export default {
	components: {
		shoproActivityGoods
	},
	data() {
		return {};
	},
	computed: {},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss">
		// 今日必拼+限时抢购
		.group-goods,
		.seckill-goods {
			background: #fff;
			border-radius: 10rpx;
			margin: 20rpx;
			padding: 20rpx;
	
			.title-box {
				padding-bottom: 20rpx;
	
				.title {
					font-size: 36rpx;
					font-weight: bold;
				}
	
				.group-people {
					.time-box {
						font-size: 26rpx;
	
						.count-text {
							display: inline-block;
							width: 40rpx;
							height: 40rpx;
							border-radius: 50%;
							text-align: center;
							line-height: 40rpx;
							background: #000;
							color: rgba(#fff, 0.9);
							margin: 0 8rpx;
						}
					}
	
					.head-box {
						.head-img {
							width: 40rpx;
							height: 40rpx;
							border-radius: 50%;
							background: #ccc;
						}
					}
	
					.tip {
						font-size: 28rpx;
						padding: 0 20rpx;
					}
	
					.cuIcon-right {
						font-size: 30rpx;
						line-height: 28rpx;
					}
				}
			}
	
			.goods-box {
				.goods-item {
					margin-right: 30rpx;
	
					&:nth-child(4n) {
						margin-right: 0;
					}
				}
			}
		}
</style>
