<template>
	<view class="">
		<!-- 未领取，已领取 -->
		<view class="coupon-wrap" :style="gradientColor" :class="{ 'gray-wrap': state === 3 || state === 2 || couponData.status_code == 'cannot_get' }">
			<view class="coupon-item u-flex u-row-between">
				<view class="coupon-left  u-flex-col ">
					<view class="sum-box">
						<text class="unit " :style="{ color: priceColor }">￥</text>
						<text class="sum " :style="{ color: priceColor }">{{ couponData.amount }}</text>
						<text class="sub " :style="{ color: priceColor }">{{ couponData.name }}</text>
					</view>
					<view class="notice " :style="{ color: color }">满{{ couponData.enough }}元可用</view>
					<view class="notice" :style="{ color: color }">
						有效期：{{ $u.timeFormat(couponData.usetime.start, 'yyyy-mm-dd') }} 至 {{ $u.timeFormat(couponData.usetime.end, 'yyyy-mm-dd') }}
					</view>
				</view>
				<view class="coupon-right u-flex-col">
					<button class="get-btn" :style="{ color: btnTextColor }" v-if="state === 0" @tap.stop="getCoupon">{{ stateMap[couponData.status_code] ||　'立即领取' }}</button>
					<button class="get-btn" :style="{ color: btnTextColor }" v-if="state === 1">去使用</button>
					<button class="get-btn" :style="{ color: btnTextColor }" v-if="state === 2">暂不可用</button>
					<button class="get-btn" v-if="state === 3">{{ stateMap[couponData.status_code] }}</button>
					<view class="surplus-num" :style="{ color: color }" v-if="state === 0">仅剩{{ stock }}张</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * shoproCoupon-优惠券
 * @property {Number} state - 0:立即领取，1：去使用，2：查看详情，3：已失效。
 * @property {Object} couponData - 优惠劵数据。
 * @property {String} gradientColor - 渐变色。
 */
export default {
	components: {},
	data() {
		return {
			stock: 0,
			stateMap: {
				can_use: '立即使用',
				used: '已使用',
				expired: '已失效',
				cannot_use: '暂不可用',
				can_get: '立即领取',
				cannot_get: '已领取'
			}
		};
	},
	props: {
		state: 0, //0:立即领取，1：去使用，2：查看详情，3：已失效。
		couponData: {},
		gradientColor: {
			type: String,
			default: ''
		},
		color: {
			type: String,
			default: ''
		},
		btnTextColor: {
			type: String,
			default: ''
		},
		priceColor: {
			type: String,
			default: ''
		}
	},
	computed: {},
	created() {
		this.$nextTick(() => {
			this.stock = this.couponData.stock;
		});
	},
	methods: {
		getCoupon() {
			let that = this;

			that.$http(
				'coupons.get',
				{
					id: that.couponData.id
				},
				'领取中...'
			).then(res => {
				if (res.code === 1) {
					that.stock -= 1;
					that.$u.toast('领取成功');
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
// 失效
.gray-wrap {
	-webkit-filter: grayscale(1); /* Webkit */
	filter: gray; /* IE6-9 */
	filter: grayscale(1); /* W3C */
}
// 未领取，已领取
.coupon-wrap {
	mask: url($IMG_URL+'/imgs/coupon_bg1.png');
	-webkit-mask-box-image: url($IMG_URL+'/imgs/coupon_bg1.png');
	mask-size: 100% 100%;
	position: relative;
	border-radius: 10rpx;
	width: 710rpx;
	height: 170rpx;
	background: linear-gradient(to right, $u-type-warning-disabled, $u-type-warning);
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
				color: #fff;
			}

			.sum {
				font-size: 55rpx;
				font-weight: bold;
				color: #fff;
				line-height: 55rpx;
				padding-right: 10rpx;
			}

			.sub {
				font-size: 26rpx;
				color: #fff;
			}

			.notice {
				font-size: 22rpx;
				color: rgba(#fff, 0.7);
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
				background: #ffffff;
				border-radius: 27rpx;
				padding: 0;
				font-size: 24rpx;
				font-weight: 500;
				color: $u-type-warning;
			}

			.surplus-num {
				font-size: 22rpx;
				font-weight: 500;
				color: #fff;
				margin-top: 14rpx;
			}
		}
	}
}
</style>
