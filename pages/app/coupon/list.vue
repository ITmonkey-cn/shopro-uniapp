<!-- 优惠劵列表  -->
<template>
	<view class="page_box">
		<view class="head_box u-m-b-20">
			<shopro-navbar back-icon-color="#333" :background="{ backgroundColor: '#fff' }">
				<view slot="content" class="u-flex nav-wrap">
					<view class="nav-item u-flex-1 u-flex-col u-row-center u-col-center" v-for="nav in navbarHeadState" :key="nav.value" @tap="onHead(nav.value)">
						<view class="item-title" :class="{ 'title-active': navState === nav.value }">{{ nav.title }}</view>
						<text class="nav-line" :class="{ 'line-active': navState === nav.value }"></text>
					</view>
				</view>
			</shopro-navbar>
			<view class="coupon-nav u-flex" v-show="navState === 'user'">
				<button
					class=" cu-btn nav-btn u-flex-col u-row-center u-col-center"
					:class="{ 'btn-active': nav.id == stateCurrent }"
					v-for="nav in couponsState"
					:key="nav.id"
					@tap="onNav(nav.id)"
				>
					<view class="item-title">{{ nav.title }}</view>
				</button>
			</view>
		</view>
		<view class="content_box">
			<view class="coupon-list" v-for="(c, index) in couponList" :key="index" @tap="toCouponDetail(c)">
				<shopro-coupon :state="stateCurrent" :couponData="c"></shopro-coupon>
			</view>
			<!-- 缺省页 -->
			<shopro-empty marginTop="300rpx" v-if="isEmpty" :image="$IMG_URL + '/imgs/empty/empty_goods.png'" tipText="暂无此类优惠券"></shopro-empty>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			stateCurrent: 0,
			isEmpty: false,
			navState: 'event',
			navbarHeadState: [
				{
					value: 'event',
					title: '领券中心'
				},
				{
					value: 'user',
					title: '我的优惠券'
				}
			],
			couponsState: [
				{
					id: 1,
					title: '可使用'
				},
				{
					id: 2,
					title: '暂不可用'
				},
				{
					id: 3,
					title: '无效优惠券'
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
			if (this.stateCurrent !== id) {
				this.stateCurrent = id;
				this.couponList = [];
				this.getCouponList();
			}
		},
		onHead(value) {
			if (this.navState !== value) {
				this.navState = value;
				if (value === 'event') {
					this.stateCurrent = 0;
				}
				if (value === 'user') {
					this.stateCurrent = 1;
				}
				this.couponList = [];
				this.getCouponList();
			}
		},
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		getCouponList() {
			let that = this;
			that.$http('coupons.list', {
				type: that.stateCurrent
			}).then(res => {
				if (res.code === 1) {
					that.couponList = res.data;
					that.isEmpty = !that.couponList.length;
				}
			});
		},

		//跳转优惠券详情
		toCouponDetail(data) {
			if (data.user_coupons_id) {
				this.jump('/pages/app/coupon/detail', { id: data.id, userCouponId: data.user_coupons_id });
			} else {
				this.jump('/pages/app/coupon/detail', { id: data.id });
			}
		}
	}
};
</script>

<style lang="scss">
.nav-item {
	flex: 1;
	height: 100%;
	.item-title {
		font-size: 30rpx;
		font-weight: 400;
		color: #666;
	}
	.title-active {
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
	}
	.nav-line {
		width: 128rpx;
		height: 6rpx;
		border-radius: 3rpx;
		background: #fff;
	}

	.line-active {
		background: #e9b664;
	}
}
.nav-wrap {
	/* #ifdef MP-WEIXIN */
	width: 460rpx;
	/* #endif */
	/* #ifndef MP-WEIXIN */
	width: 100%;
	/* #endif */
}
.coupon-nav {
	background: #fff;
	height: 100rpx;
	padding: 0 30rpx;
	.nav-btn {
		margin-right: 10rpx;
		font-size: 26rpx;
		color: #666;
	}
	.btn-active {
		font-size: 26rpx;
		color: #fff;
		background-color: #faae0c;
	}
}
.coupon-list {
	margin: 30rpx 20rpx;
}
</style>
