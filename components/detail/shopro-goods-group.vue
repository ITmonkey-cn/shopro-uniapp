<template>
	<view class="group-people">
		<view class="groupon-box y-bc">
			<view class="title-box x-f">
				<view class="title-text">
					我正在参团，还差
					<text class="group-num">1</text>
					人拼团成功
				</view>
				<view class="count-down x-f">
					<text class="count-down-tip">还剩</text>
					<view class="time-box x-f">
						<view class="count-text">{{ time.h || '00' }}</view>
						:
						<view class="count-text">{{ time.m || '00' }}</view>
						:
						<view class="count-text">{{ time.s || '00' }}</view>
					</view>
				</view>
			</view>
			<view class="people-box x-f">
				<view class="img-box">
					<image class="img" src="" mode=""></image>
					<view class="tag">团长</view>
				</view>
				<view class="img-box">
					<image class="img" src="" mode=""></image>
				</view>
			</view>
			<button class="cu-btn add-btn">一键参团</button>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			time: 0
		};
	},
	computed: {},
	created() {
		this.countDown()
	},
	methods: {
		// 倒计时
		countDown() {
			let _self = this;
			let t = this.activityData.endtime * 1000 - new Date().getTime();
			let timer = setInterval(() => {
				if (t > 0) {
					_self.time = _self.$tools.format(t);
					t--;
				} else {
					clearInterval(timer);
					_self.time = '倒计时结束';
				}
			}, 1000);
		}
	}
};
</script>

<style lang="scss">
// 拼团人数
.group-people {
	background-color: #fff;
	padding: 20rpx;
	margin-top: 20rpx;
	.groupon-box {
		border: 2rpx dashed rgba(232, 180, 100, 1);
		border-radius: 20rpx;
		padding: 30rpx 0;
		min-height: 320rpx;
		.title-box {
			font-size: 26rpx;
			font-weight: bold;
			color: #333;
			.group-num {
				color: #f8002c;
			}
			.count-down-tip {
				font-size: 24rpx;
				padding-left: 10rpx;
			}
			.time-box {
				font-size: 18rpx;
				.count-text {
					display: inline-block;
					background-color: #383a46;
					color: #fff;
					font-size: 18rpx;
					border-radius: 2rpx;
					padding: 0 5rpx;
					height: 28rpx;
					text-align: center;
					line-height: 28rpx;
					margin: 0 6rpx;
				}
			}
		}
		.people-box {
			.img-box{
				position: relative;
				margin-right: 10rpx;
				.img{
					width: 56rpx;
					height: 56rpx;
					border-radius: 50%;
					background: #ccc;
				}
				.tag{
					background: #E8B464;
					color: #fff;
					font-size: 16rpx;
					padding: 2rpx 8rpx;
					position: absolute;
					top: -12rpx;
					right: -10rpx;
					border-radius: 20rpx;
				}
			}
		}
		.add-btn{
			width:650rpx;
			height:70rpx;
			background:linear-gradient(90deg,rgba(254,131,42,1),rgba(255,102,0,1));
			box-shadow:0px 7rpx 6rpx 0px rgba(229,138,0,0.22);
			border-radius:35rpx;
			font-size: 28rpx;
			color: rgba(#fff,0.9);
		}
	}
}
</style>
