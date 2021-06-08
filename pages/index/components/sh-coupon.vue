<template>
	<!-- 首页优惠券卡片 -->
	<view class="coupon-box u-m-b-10 u-p-20" v-if="detail.ids && couponList.length">
		<view class="head-box u-flex u-row-between u-m-b-20">
			<view class="head-title u-ellipsis-1">领券专区</view>
			<view class="head-more u-flex u-col-center" @tap="$Router.push('/pages/app/coupon/list')">
				<text class="more-text u-m-r-10">查看更多</text>
				<text class="iconfont iconyoujiantou-tianchong more-icon"></text>
			</view>
		</view>
		<scroll-view class="groupon-scroll" enable-flex scroll-anchoring scroll-x scroll-with-animation>
			<view class="groupon-card-wrap u-flex ">
				<view class="" v-for="(item, index) in couponList" :key="item.id">
					<!-- mini -->
					<view
						class="coupon-card u-flex u-row-between u-m-r-16"
						v-if="detail.style === 2"
						:style="{ background: `linear-gradient(to right, ${detail.bgcolor1}, ${detail.bgcolor2})` }"
					>
						<view class="card-left u-flex-col u-row-center u-p-l-30">
							<view class="price u-m-b-10" :style="{ color: detail.pricecolor }">{{ item.amount }}</view>
							<view class="notice" :style="{ color: detail.color }">满{{ item.enough }}元可用</view>
							<view class="notice u-m-b-10" :style="{ color: detail.color }">仅剩{{ item.stock }}张</view>
						</view>
						<view class="card-right u-p-y-20 u-p-r-10 u-flex-col u-row-center u-col-center">
							<button class="u-reset-button get-btn u-m-b-10" :style="{ color: detail.color }" @tap="getCoupon(item.id, index)">领券购买</button>
						</view>
					</view>
					<!-- big -->
					<view v-if="detail.style === 1" class="u-p-r-16">
						<shopro-coupon
							:couponData="item"
							:gradientColor="`background: linear-gradient(to right, ${detail.bgcolor1}, ${detail.bgcolor2});`"
							:priceColor="detail.pricecolor"
							:color="detail.color"
							:btnTextColor="detail.bgcolor1"
							:state="0"
						></shopro-coupon>
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

			that.$http(
				'coupons.get',
				{
					id: id
				},
				'领取中...'
			).then(res => {
				if (res.code === 1) {
					that.couponList[index].stock -= 1;
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.groupon-scroll {
	height: 170rpx;
	width: 730rpx;
}
.groupon-card-wrap {
	height: 170rpx;
	width: 730rpx;
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
</style>
