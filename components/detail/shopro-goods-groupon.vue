<template>
 <view class="group-people">
 	<view class="into-title x-bc">
 		<text>已有1150人参与活动</text>
 		<text class="cuIcon-right"></text>
 	</view>
 	<view class="into-item x-bc">
 		<view class="x-f">
 			<image class="into-img" src="" mode=""></image>
 			<text class="into-name">马超</text>
 		</view>
 		<view class="y-end">
 			<view class="num">
 				还差<text class="num-color">1人</text>成团
 			</view>
 			<view class="time">
 				剩余时间17:15:26
 			</view>
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
  computed: {},
  methods: {}
};
</script>

<style lang="scss">
	// 拼团人数
	.group-people {
		background-color: #fff;
		padding: 0 20rpx;
		margin-top: 20rpx;
	
		.into-title {
			height: 80rpx;
			font-size: 26rpx;
			font-weight: bold;
		}
	
		.into-item {
			height: 120rpx;
			border-bottom: 1rpx solid #DFDFDF;
	
			&:last-child {
				border-bottom: 0;
			}
	
			.into-img {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				margin-right: 23rpx;
				background-color: #ccc;
			}
	
			.into-name {
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
			}
	
			.num {
				font-size: 26rpx;
				color: #666;
	
				.num-color {
					font-size: 24rpx;
					color: #A8700D;
				}
			}
	
			.time {
				font-size: 22rpx;
				margin-top: 10rpx;
				color: #999;
			}
		}
	}
	
</style>
