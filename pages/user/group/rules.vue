<template>
	<view class="scrabble-rules">
		<view class="activity-detail ">
			<view class="detail-title x-f">
				活动说明
			</view>
			<view class="detail-list" v-for="a in activityList" :key="a">
				{{a}}
			</view>
			<view class="x-c">
				<button class="cu-btn service-btn">联系客服</button>
			</view>
		</view>
	</view>
</template>

<script>
 export default {
	components:{},
	data() {
		return {
			activityList:[
				'1. 用户点击开团购买，成为团长，并邀请好友参团，在团有效时间内凑齐成团人数，即可拼购成功，商家将会发货；',
				'2. 开团有效时间内未凑齐成团人数，即拼购失败，系统自动取消订单并全额退款，退款金额将会原路退回付款账户； ',
				'3. 开团有效时间，即允许邀请好友参团的时间，可在拼购详情页查看倒计时；'
			]
		};
	},
	computed:{},
	onLoad() {},
	methods: {},

};
</script>

<style lang="scss">
	page{
		background: #fff;
	}
	.activity-detail{
		padding: 40rpx;
		.detail-title{
			height: 100rpx;
			font-weight: bold;
			font-size: 36rpx;
		}
		.detail-list{
			font-size:28rpx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(51,51,51,1);
			line-height:56rpx;
		}
		.service-btn{
			width:680rpx;
			height:70rpx;
			background:linear-gradient(90deg,rgba(244,71,57,1),rgba(254,117,49,1));
			border-radius:35rpx;
			font-size:28rpx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(255,255,255,0.9);
			margin-top: 40rpx;
			}
	}
</style>
