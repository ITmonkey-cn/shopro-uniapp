<template>
	<view class="page_box">
		<view class="head_box">
			<view class="coupon-nav x-f">
				<view class="nav-item y-f" v-for="nav in couponsState" :key="nav.id" @tap="onNav(nav.id)">
					<view class="item-title">{{ nav.title }}</view>
					<text class="nav-line" :class="{ 'line-active': stateCurrent === nav.id }"></text>
				</view>
			</view>
		</view>
		<view class="content_box">
			<view class="coupon-list" @tap="jump('/pages/app/coupon/detail',{couponId:c.id,state:stateCurrent})" v-for="c in couponList" :key="c.id">
				<shoprp-coupon :state="stateCurrent" :couponData="c"></shoprp-coupon>
			</view>
		</view>
		<view class="foot_box"></view>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-follow-wechat></shopro-follow-wechat>
	</view>
</template>

<script>
import shoprpCoupon from '@/components/shopro-coupon/shopro-coupon.vue';
export default {
	components: {
		shoprpCoupon
	},
	data() {
		return {
			stateCurrent: 0,
			couponsState: [
				{
					id: 0,
					title: '领券中心'
				},
				{
					id: 1,
					title: '可使用'
				},
				{
					id: 2,
					title: '已使用'
				},
				{
					id: 3,
					title: '已失效'
				}
			],
			couponList: []
		};
	},
	computed: {},
	onLoad() {
		this.getCouponList();
	},
	methods: {
		onNav(id) {
			this.stateCurrent = id;
			this.getCouponList();
		},
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		getCouponList() {
			let that = this;
			that.$api('coupons.list', {
				type: that.stateCurrent
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
.page_box {
	background: #fff;
}
.coupon-nav {
	background: #fff;
	height: 100rpx;

	.nav-item {
		flex: 1;

		.item-title {
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 76rpx;
		}

		.nav-line {
			width: 120rpx;
			height: 4rpx;
			background: #fff;
		}

		.line-active {
			background: rgba(230, 184, 115, 1);
		}
	}
}
.coupon-list {
	margin: 30rpx 20rpx;
}
</style>
