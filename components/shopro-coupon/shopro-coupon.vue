<template>
	<view class="" v-if="couponData">
		<!-- 未领取，已领取 -->
		<view class="coupon-wrap" v-if="state !== 3">
			<view class="coupon-item x-bc">
				<view class="coupon-left y-start ">
					<view class="sum-box">
						<text class="unit">￥</text>
						<text class="miso-font sum">{{ couponData.amount }}</text>
						<text class="sub">{{ couponData.name }}</text>
					</view>
					<view class="notice">满{{ couponData.enough }}元可用</view>
					<view class="notice">有效期：{{ tools.timestamp(couponData.usetime.start) }} 至 {{ tools.timestamp(couponData.usetime.end) }}</view>
				</view>
				<view class="coupon-right y-f">
					<button class="cu-btn get-btn" v-if="state === 0" @tap.stop="getCoupon">立即领取</button>
					<button class="cu-btn get-btn" v-if="state === 1">去使用</button>
					<button class="cu-btn get-btn" v-if="state === 2">查看详情</button>
					<view class="surplus-num" v-if="state === 0">仅剩{{ couponData.stock }}张</view>
				</view>
			</view>
		</view>
		<!-- 失效 -->
		<view class="close-wrap" v-if="state === 3">
			<view class="coupon-item x-f">
				<view class="coupon-left y-start ">
					<view class="sum-box">
						<text class="unit">￥</text>
						<text class="miso-font sum">{{ couponData.amount }}</text>
						<text class="sub">{{ couponData.name }}</text>
					</view>
					<view class="notice">有效期：{{ tools.timestamp(couponData.usetime.start) }} 至 {{ tools.timestamp(couponData.usetime.end) }}</view>
				</view>
				<view class="coupon-right y-f">
					<button class="cu-btn get-btn">已失效</button>
					<view class="surplus-num"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'shoproCoupon',
	components: {},
	data() {
		return {
			tools: this.$tools
		};
	},
	props: {
		state: {}, //0:立即领取，1：去使用，2：查看详情，3：已失效。
		couponData: {}
	},
	computed: {},
	methods: {
		getCoupon() {
			let that = this;
			that.$api('coupons.get', {
				id: that.couponData.id
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast(res.msg);
					that.couponData.stock -= 1;
				}
			});
		}
	}
};
</script>

<style lang="scss">
// 未领取，已领取
.coupon-wrap {
	background: url('http://shopro.7wpp.com/imgs/coupon_bg1.png') no-repeat;
	background-size: 100% 100%;
	position: relative;
	border-radius: 10rpx;
	width: 710rpx;
	.coupon-item {
		width: 100%;
		height: 168rpx;
		border-radius: 10rpx;

		.coupon-left {
			height: 100%;
			justify-content: center;
			padding-left: 40rpx;

			.unit {
				font-size: 24rpx;
				color: #4f3a1e;
			}

			.sum {
				font-size: 55rpx;
				font-weight: bold;
				color: #4f3a1e;
				line-height: 55rpx;
				padding-right: 10rpx;
			}

			.sub {
				font-size: 26rpx;
				color: #4f3a1e;
			}

			.notice {
				font-size: 22rpx;
				color: #a8700d;
				margin-top: 6rpx;
			}
		}

		.coupon-right {
			height: 100%;
			width: 220rpx;
			justify-content: center;
			align-items: center;

			.get-btn {
				width: 142rpx;
				height: 54rpx;
				background: linear-gradient(90deg, rgba(45, 34, 17, 1), rgba(84, 62, 32, 1));
				box-shadow: 0px 2rpx 5rpx 0px rgba(206, 158, 106, 0.46);
				border-radius: 27rpx;
				padding: 0;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(239, 197, 130, 1);
			}

			.surplus-num {
				font-size: 22rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(168, 112, 13, 1);
				margin-top: 14rpx;
			}
		}
	}
}

// 失效
.close-wrap {
	position: relative;
	border-radius: 10rpx;
	background: url('http://shopro.7wpp.com/imgs/coupon_bg2.png') no-repeat;
	background-size: 100% 100%;

	.coupon-item {
		width: 100%;
		height: 168rpx;
		border-radius: 10rpx;

		.coupon-left {
			height: 100%;
			width: 480rpx;
			justify-content: center;
			padding-left: 40rpx;

			.unit {
				font-size: 24rpx;
				color: #838383;
			}

			.sum {
				font-size: 55rpx;
				font-weight: bold;
				color: #838383;
				line-height: 55rpx;
				padding-right: 10rpx;
			}

			.sub {
				font-size: 26rpx;
				color: #838383;
			}

			.notice {
				font-size: 22rpx;
				color: #a6a6a6;
			}
		}

		.coupon-right {
			height: 100%;
			flex: 1;
			justify-content: center;

			.get-btn {
				width: 142rpx;
				height: 54rpx;
				border-radius: 27rpx;
				background: #fff;
				padding: 0;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #838383;
			}

			.surplus-num {
				font-size: 22rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(168, 112, 13, 1);
				margin-top: 14rpx;
			}
		}
	}
}
</style>
