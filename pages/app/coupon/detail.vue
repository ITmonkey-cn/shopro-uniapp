<!-- 优惠劵详情 -->
<template>
	<view class="page_box">
		<!-- 标题栏 -->
		<shopro-navbar back-icon-color="#fff" :background="{}" :backTextStyle="{ color: '#fff', fontSize: '36rpx', fontWeight: '500' }" backText="优惠券详情"></shopro-navbar>
		<view class="content_box">
			<scroll-view class="scroll-box" scroll-y="true" scroll-with-animation enable-back-to-top :scroll-into-view="scrollId" @scroll="onScroll">
				<!-- 详情卡片 -->
				<view class="coupon-box">
					<view class="top u-flex-col u-col-center">
						<view class="img-box u-flex u-row-center u-col-center"><image class="coupon-img" :src="$IMG_URL + '/imgs/coupon.png'" mode=""></image></view>
						<view class="title">{{ couponDetail.amount || '0.00' }}元优惠券</view>
						<view class="tip">满{{ couponDetail.enough || '0.00' }}元可用</view>
						<button class="u-reset-button" :class="['can_use', 'can_get'].includes(btnStataus) ||　!btnStataus ? 'use-btn' : 'fail-btn'" @tap="goScroll">
							{{ btnStatusText[btnStataus] || '立即领取' }}
						</button>
						<view class="time" v-if="couponDetail.usetime && couponDetail.usetime.start">
							有效期：{{ $u.timeFormat(couponDetail.usetime.start, 'yyyy-mm-dd') }} 至 {{ $u.timeFormat(couponDetail.usetime.end, 'yyyy-mm-dd') }}
						</view>
						<view class="coupon-line"></view>
					</view>
					<view class="bottom">
						<view class="notice-item">
							<view class="notice-title">优惠券说明</view>
							<view class="notice-detail">{{ couponDetail.description || '暂无说明~' }}</view>
						</view>
					</view>
				</view>

				<!-- 适用商品 -->
				<view class="coupon-goods u-p-30" v-if="couponGoods.length">
					<view class="coupon-goods-title" id="couponGoods">适用商品</view>
					<view class="goods-list u-m-b-20 u-p-20" v-for="goods in couponGoods" :key="goods.id">
						<shopro-mini-card
							:image="goods.image"
							:title="goods.title"
							:subtitle="goods.subtitle"
							:price="goods.price"
							:originPrice="goods.original_price"
							@click="$Router.push({ path: '/pages/goods/detail', query: { id: goods.id } })"
						></shopro-mini-card>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			couponDetail: {},
			couponGoods: [],
			scrollId: '',
			nowTime: new Date().getTime(),
			options: {},
			btnStatusText: {
				can_use: '立即使用',
				used: '已使用',
				expired: '已失效',
				cannot_use: '暂不可用',
				can_get: '立即领取',
				cannot_get: '不可领取'
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
			that.$http(
				'coupons.get',
				{
					id: that.$Route.query.id
				},
				'领取中...'
			).then(res => {
				if (res.code === 1) {
					this.options.userCouponId = res.data.id;
					that.getCouponDetail();
					that.$u.toast('领取成功')
				}
			});
		},
		// 优惠券详情
		getCouponDetail() {
			let that = this;
			that.$http('coupons.detail', {
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
			that.$http('coupons.goods', {
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
				if (this.couponDetail.goods_ids === '0' && this.btnStataus == 'can_use') {
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
	border-radius: 20rpx;
	background-color: #fff;
	.top {
		border-radius: 20rpx 20rpx 0 0;
		background-image: radial-gradient(circle at bottom left, #f6d69d, #f6d69d 16rpx, transparent 17rpx),
			radial-gradient(circle at bottom right, #f6d69d, #f6d69d 16rpx, transparent 17rpx);
		padding: 110rpx 0 40rpx 0;
		position: relative;
		z-index: 5;
		.coupon-line {
			width: 95%;
			border-bottom: 2rpx dashed #f3ce90;
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			z-index: 6;
		}
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
			line-height: 80rpx;
			background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
			border-radius: 40rpx;
			color: rgba(#fff, 0.9);
			margin-bottom: 30rpx;
		}
		.fail-btn {
			width: 386rpx;
			line-height: 80rpx;
			background: rgba(245, 245, 245, 1);
			border-radius: 40rpx;
			font-size: 30rpx;

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
		background-image: radial-gradient(circle at top left, #f6d69d, #f6d69d 16rpx, transparent 17rpx),
			radial-gradient(circle at top right, #f6d69d, #f6d69d 16rpx, transparent 17rpx);
		padding: 40rpx 30rpx;
		.notice-item {
			border-bottom: 1rpx solid #eeeeee;
			min-height: 90rpx;
			width: 100%;
			.notice-title {
				font-weight: 500;
				font-size: 26rpx;
			}
			.notice-detail {
				font-size: 24rpx;
				color: #666;
				margin-top: 10rpx;
				padding-bottom: 10rpx;
				text-indent: 30rpx;
			}
		}
	}
}
// 优惠券商品
.coupon-goods {
	.coupon-goods-title {
		font-size: 30rpx;
		font-weight: bold;
		height: 80rpx;
	}
	.goods-list {
		background: #fff;
		border-radius: 20rpx;
	}
}
</style>
