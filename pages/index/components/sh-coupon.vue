<template>
	<!-- 首页优惠券卡片 -->
	<view class="coupon-box u-m-b-10 u-p-20" v-if="detail.ids && couponList.length">
		<view class="head-box u-flex u-row-between u-m-b-20">
			<view class="head-title u-ellipsis-1">领券专区</view>
			<view class="head-more u-flex u-col-center" @tap="$Router.push('/pages/app/coupon/list')">
				<text class="more-text u-m-r-10">查看更多</text>
				<text class="iconfont icon-youjiantou-tianchong more-icon"></text>
			</view>
		</view>
		<scroll-view class="groupon-scroll" scroll-anchoring scroll-x scroll-with-animation>
			<view class="groupon-card-wrap u-flex ">
				<view :class="{ 'gray-wrap': item.status_code === 'cannot_get' }" v-for="(item, index) in couponList" :key="item.id">
					<!-- mini -->
					<view class="coupon-card u-flex u-row-between u-m-r-16" v-if="couponType === 2" :style="{ background: `linear-gradient(to right, ${bgColor1}, ${bgColor2})` }">
						<view class="card-left u-flex-col u-row-center u-p-l-30">
							<view class="price u-m-b-10" :style="{ color: priceColor }">{{ item.amount }}</view>
							<view class="notice" :style="{ color: color }">满{{ item.enough }}元可用</view>
							<view class="notice u-m-b-10" :style="{ color: color }">仅剩{{ item.stock }}张</view>
						</view>
						<view class="card-right u-p-y-20 u-p-r-10 u-flex-col u-row-center u-col-center">
							<button class="u-reset-button get-btn u-m-b-10" :style="{ color: color }" @tap="getCoupon(item.id, index)">
								{{ item.status_code === 'cannot_get' ? '不可领取' : '领券购买' }}
							</button>
						</view>
					</view>
					<!-- big -->
					<view v-if="couponType === 1" class="u-p-r-16">
						<view class="coupon-wrap " :style="{ background: `linear-gradient(to right, ${bgColor1}, ${bgColor2})` }">
							<view class="coupon-item u-flex u-row-between">
								<view class="coupon-left  u-flex-col ">
									<view class="sum-box">
										<text class="unit " :style="{ color: priceColor }">￥</text>
										<text class="sum " :style="{ color: priceColor }">{{ item.amount }}</text>
										<text class="sub " :style="{ color: priceColor }">{{ item.name }}</text>
									</view>
									<view class="notice " :style="{ color: color }">满{{ item.enough }}元可用</view>
									<view class="notice" :style="{ color: color }">
										有效期：{{ $u.timeFormat(item.usetime.start, 'yyyy-mm-dd') }} 至 {{ $u.timeFormat(item.usetime.end, 'yyyy-mm-dd') }}
									</view>
								</view>
								<view class="coupon-right u-flex-col">
									<button class="get-btn" :style="{ color: bgColor1 }" @tap.stop="getCoupon(item.id, index)">
										{{ item.status_code === 'cannot_get' ? '不可领取' : '立即领取' }}
									</button>
									<view class="surplus-num" :style="{ color: color }">仅剩{{ item.stock }}张</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
/**
 * 自定义之优惠券卡片
 * @property {Object} detail - 优惠券信息
 */
export default {
	components: {},
	data() {
		return {
			currentIndex: 0,
			couponList: [],

			couponType: this.detail.style,
			priceColor: this.detail.pricecolor,
			color: this.detail.color,
			bgColor1: this.detail.bgcolor1,
			bgColor2: this.detail.bgcolor2
		};
	},
	props: {
		detail: {}
	},
	computed: {},
	created() {
		this.detail.ids && this.getCouponsList();
	},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 优惠券列表
		getCouponsList() {
			let that = this;
			that.$http('coupons.templateList', {
				ids: that.detail.ids
			}).then(res => {
				if (res.code === 1) {
					that.couponList = res.data;
				}
			});
		},
		// 领取
		getCoupon(id, index) {
			let that = this;
			uni.showLoading({
				title: '领取中'
			});
			that.$http('coupons.get', {
				id: id
			}).then(res => {
				uni.hideLoading();
				if (res.code === 1) {
					that.couponList[index].stock -= 1;
					this.$u.toast('领取成功');
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
// 失效
.gray-wrap {
	filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1) !important;
	-webkit-filter: grayscale(100%) !important;
	-moz-filter: grayscale(100%) !important;
	-ms-filter: grayscale(100%) !important;
	-o-filter: grayscale(100%) !important;
	filter: grayscale(100%) !important;
	filter: gray !important;
}
.groupon-scroll {
	height: 170rpx;
	width: 730rpx;
	.groupon-card-wrap {
		height: 170rpx;
		width: 730rpx;
	}
}

.coupon-box {
	background-color: #fff;

	.head-box {
		.head-title {
			width: 300rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
		}
		.head-more {
			.more-text {
				font-size: 22rpx;
				font-weight: 500;
				color: #333333;
			}
			.more-icon {
				color: #333333;
				font-size: 24rpx;
			}
		}
	}
	.coupon-card {
		width: 343rpx;
		height: 170rpx;
		background: linear-gradient(90deg, #f8dca5, #efc480);
		border-radius: 10rpx;
		mask: url($IMG_URL+'/imgs/coupon_mini_bg.png');
		-webkit-mask-box-image: url($IMG_URL+'/imgs/coupon_mini_bg.png');
		mask-size: 100% 100%;
		.card-left {
			height: 100%;
			width: 260rpx;
			.price {
				color: #4f3a1e;
				font-size: 30rpx;
				font-weight: bold;
				&::before {
					content: '￥';
					font-size: 20rpx;
				}
			}
			.notice {
				font-size: 22rpx;
				font-weight: 500;
				color: #a8700d;
			}
		}
		.card-right {
			height: 100%;
			width: 60rpx;
			.get-btn {
				font-size: 24rpx;
				font-weight: 500;
				text-align: right;
				color: #a8700d;
				writing-mode: vertical-lr; /*从左向右 从右向左是 writing-mode: vertical-rl;*/
				writing-mode: tb-lr; /*IE浏览器的从左向右 从右向左是 writing-mode: tb-rl；*/
			}
		}
	}
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
