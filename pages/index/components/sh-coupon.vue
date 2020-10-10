<template>
	<!-- 首页优惠券卡片 -->
	<view class="coupon-category-box mb10 shopro-selector-rect" v-if="detail.ids">
		<swiper class="coupon-swiper-box" @change="onSwiper" circular :autoplay="true" :interval="5000" :duration="2000">
			<swiper-item class="swiper-item" v-for="(c, index) in couponList" :key="c.id">
				<view class="tab-list x-c" @tap="jump('/pages/app/coupon/detail', { id: c.id })"><shopro-coupon :couponData="c" :state="0"></shopro-coupon></view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import shoproCoupon from '@/components/shopro-coupon/shopro-coupon.vue';
export default {
	components: {
		shoproCoupon
	},
	data() {
		return {
			categoryCurrent: 0, //分类轮播下标
			couponList: []
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
		// 轮播
		onSwiper(e) {
			this.categoryCurrent = e.detail.current;
		},
		// 优惠券列表
		getCouponsList() {
			let that = this;
			that.$api('coupons.lists', {
				ids: that.detail.ids
			}).then(res => {
				if (res.code === 1) {
					that.couponList = res.data;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.coupon-category-box {
	padding: 20rpx 0;
	background: #fff;
	// margin-bottom: 20rpx;
}
.coupon-category-box,
.coupon-swiper-box {
	// position: relative;
	height: 210rpx;
	width: 100%;
	.swiper-item {
		// padding: 0 15rpx;
	}
	.tab-list {
		/deep/.coupon-wrap {
			width: 710rpx;
		}
	}

	.category-dots {
		display: flex;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 15rpx;

		.category-dot {
			width: 40rpx;
			height: 3rpx;
			background: #eeeeee;
			margin-right: 10rpx;
		}

		.category-dot-active {
			width: 40rpx;
			height: 3rpx;
			background: #a8700d;
			margin-right: 10rpx;
		}
	}
}
</style>
