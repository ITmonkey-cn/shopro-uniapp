<template>
	<view class="page_box">
		<view class="head_box">
			<cu-custom :isBack="true">
				<block slot="backText">优惠券详情</block>
				<block slot="content"></block>
			</cu-custom>
		</view>
		<view class="content_box">
			<scroll-view class="scroll-box" scroll-y="true" scroll-with-animation enable-back-to-top :scroll-into-view="scrollId" @scroll="onScroll">
				<view class="coupon-box">
					<view class="top y-f">
						<view class="img-box x-c"><image class="coupon-img" src="http://shopro.7wpp.com/imgs/coupon.png" mode=""></image></view>
						<view class="title">{{ couponDetail.amount }}元优惠券</view>
						<view class="tip">满{{ couponDetail.enough }}元可用</view>
						<button class="cu-btn " :class="btnStataus == 'no_use' || !btnStataus ? 'use-btn' : 'fail-btn'" @tap="goScroll">
							{{ btnStatusText[btnStataus] || '立即领取' }}
						</button>
						<view class="time" v-if="couponDetail.usetime">
							有效期：{{ tools.timestamp(couponDetail.usetime.start) }} 至 {{ tools.timestamp(couponDetail.usetime.end) }}
						</view>
					</view>
					<view class="bottom y-start">
						<view class="notice-item y-start">
							<view class="notice-title">优惠券说明</view>
							<text class="notice-detail">{{ couponDetail.description }}</text>
						</view>
					</view>
				</view>
				<view class="coupon-goods" v-if="couponGoods.length">
					<view class="coupon-goods-title x-f" id="couponGoods">适用商品</view>
					<view class="goods-list" v-for="goods in couponGoods" :key="goods.id"><shopro-mini-card :detail="goods"></shopro-mini-card></view>
				</view>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import shoproMiniCard from '@/components/shopro-mini-card/shopro-mini-card.vue';
export default {
	components: {
		shoproMiniCard
	},
	data() {
		return {
			couponDetail: {},
			tools: this.$tools,
			couponGoods: [],
			scrollId: '',
			nowTime: new Date().getTime(),
			options: {},
			btnStatusText: {
				no_use: '立即使用',
				used: '已使用',
				expired: '已失效',
				no_can_use: '暂不可用'
			},
			btnStataus: ''
		};
	},
	computed: {},
	onLoad() {
		this.options = this.$Route.query;
		this.getCouponDetail();
		this.getCouponGoods();
	},
	methods: {
		// 领取优惠劵
		getCoupon() {
			let that = this;
			that.$api('coupons.get', {
				id: that.$Route.query.id
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast(res.msg);
					this.options.userCouponId = res.data.id;
					that.getCouponDetail();
				}
			});
		},
		// 优惠券详情
		getCouponDetail() {
			let that = this;
			that.$api('coupons.detail', {
				id: that.$Route.query.id,
				user_coupons_id: that.options.userCouponId
			}).then(res => {
				if (res.code === 1) {
					that.couponDetail = res.data;
					if (res.data.status_code) {
						this.btnStataus = res.data.status_code;
					}
				}
			});
		},
		// 适用商品
		getCouponGoods() {
			let that = this;
			that.$api('coupons.goods', {
				id: that.$Route.query.id
			}).then(res => {
				if (res.code === 1) {
					that.couponGoods = res.data.data;
				}
			});
		},
		onScroll() {
			this.scrollId = '';
		},
		goScroll() {
			if (!this.options.userCouponId) {
				this.getCoupon();
			} else {
				if (this.couponDetail.goods_ids === '0' && this.btnStataus == 'no_use') {
					this.$Router.push({
						path: '/pages/goods/list'
					});
				}
				this.scrollId = 'couponGoods';
			}
		}
	}
};
</script>

<style lang="scss">
.page_box {
	background: linear-gradient(180deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
}
.coupon-box {
	margin: 100rpx 30rpx 0;
	background: #fff;
	border-radius: 20rpx;
	.top {
		border-radius: 20rpx 20rpx 0 0;
		background-image: radial-gradient(circle at bottom left, #f0c785, #f0c785 16rpx, transparent 17rpx),
			radial-gradient(circle at bottom right, #f0c785, #f0c785 16rpx, transparent 17rpx);
		padding: 110rpx 0 40rpx 0;
		border-bottom: 1rpx dashed #f3ce90;
		position: relative;
		.img-box {
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			background: #fff;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: -70rpx;
			.coupon-img {
				width: 100rpx;
				height: 100rpx;
			}
		}
		.title {
			font-size: 40rpx;
			font-weight: bold;
			line-height: 40rpx;
			margin-bottom: 30rpx;
		}
		.tip {
			font-size: 28rpx;
			font-weight: 500;
			margin-bottom: 50rpx;
		}
		.use-btn {
			width: 386rpx;
			height: 80rpx;
			background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
			border-radius: 40rpx;
			color: rgba(#fff, 0.9);
			margin-bottom: 30rpx;
		}
		.fail-btn {
			width: 386rpx;
			height: 80rpx;
			background: rgba(245, 245, 245, 1);
			border-radius: 40rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(188, 188, 188, 1);
			margin-bottom: 30rpx;
		}
		.time {
			color: #999;
			font-size: 26rpx;
		}
	}
	.bottom {
		border-radius: 0 0 20rpx 20rpx;
		background-image: radial-gradient(circle at top left, #f0c785, #f0c785 16rpx, transparent 17rpx),
			radial-gradient(circle at top right, #f0c785, #f0c785 16rpx, transparent 17rpx);
		padding: 40rpx 30rpx;
		.notice-item {
			border-bottom: 1rpx solid #eeeeee;
			height: 90rpx;
			width: 100%;
			.notice-title {
				font-weight: 500;
				font-size: 26rpx;
			}
			.notice-detail {
				font-size: 24rpx;
				color: #666;
				margin-top: 10rpx;
			}
		}
	}
}
// 优惠券商品
.coupon-goods {
	background: #fff;
	margin: 20rpx;
	padding: 20rpx;
	border-radius: 20rpx;
	/deep/.goods-title {
		width: 420rpx;
	}
	.goods-list {
		padding: 20rpx 0;
		border-bottom: 1rpx solid rgba(223, 223, 223, 0.5);
	}
	.coupon-goods-title {
		font-size: 30rpx;
		font-weight: bold;
		height: 80rpx;
	}
}
</style>
