<<<<<<< HEAD
<!-- 支付结果页 -->
<template>
	<view class="success-page">
		<view class="success-box flex flex-direction align-center">
			<image class="pay-img" :src="payImg[payState]" mode=""></image>
			<text class="notice">{{ payText[payState] }}</text>
			<text class="pay-money" v-if="payState === 'success' && orderDetail.total_fee">￥{{ orderDetail.total_fee }}</text>
			<view class="btn-box flex justify-between">
				<block v-if="payState === 'success' && orderDetail.activity_type === 'groupon' && orderDetail.ext_arr.buy_type === 'groupon'">
					<button
						class="cu-btn base-btn"
						v-if="orderDetail.ext_arr.groupon_id > 0"
						@tap="replace('/pages/activity/groupon/detail', { id: orderDetail.ext_arr.groupon_id })"
					>
						拼团详情
					</button>
					<button class="cu-btn base-btn" v-else @tap="replace('/pages/activity/groupon/my-groupon')">我的拼团</button>
				</block>

				<button class="cu-btn base-btn" v-else @tap="routerTo.push('/pages/index/index')">返回首页</button>
				<button class="cu-btn base-btn mx10" @tap="onOrder">查看订单</button>
				<button class="again-pay cu-btn" v-if="payState === 'fail'" @tap="onPay">重新支付</button>
			</view>
		</view>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import ShoproPay from '@/common/shopro-pay';
import { mapMutations, mapActions, mapState } from 'vuex';
let payTimer = null;
const payCount = 5;
export default {
	components: {},
	data() {
		return {
			routerTo: this.$Router,
			orderDetail: {},
			payStatusMap: {
				'0': 'fail',
				'1': 'success',
				undefined: 'paying'
			},
			payText: {
				fail: '支付失败',
				success: '支付成功',
				paying: '查询中...'
			},
			payImg: {
				fail: this.$IMG_URL + '/imgs/order/order_pay_fail.gif',
				success: this.$IMG_URL + '/imgs/order/order_pay_success.gif',
				paying: this.$IMG_URL + '/imgs/base_loading.gif'
			},
			payState: null
		};
	},
	computed: {},
	onLoad(options) {
		if (String(options.pay) !== 'undefined') {
			if (options.pay) {
				this.getCartList();
			}
			this.payState = this.payStatusMap[String(options.pay)];
		} else {
			this.checkTimer();
		}
		this.getOrderDetail();
	},
	onHide() {
		clearInterval(payTimer);
	},
	methods: {
		...mapActions(['getCartList']),
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		replace(path, parmas) {
			this.$Router.replace({
				path: path,
				query: parmas
			});
		},
		// 查看订单
		onOrder() {
			this.$Router.replace({
				path: '/pages/order/detail',
				query: { id: this.orderDetail.id }
			});
		},
		// 支付信息
		getOrderDetail() {
			let that = this;
			that.$api('order.detail', {
				order_sn: that.$Route.query.orderSn
			}).then(res => {
				if (res.code === 1) {
					that.orderDetail = res.data;
				}
			});
		},
		checkTimer() {
			let that = this;
			let count = 0;
			that.payState = 'paying';
			payTimer = setInterval(() => {
				count++;
				if (count < payCount) {
					that.checkPay();
				} else {
					clearInterval(payTimer);
					that.payState = 'fail';
				}
			}, 800);
		},
		// 检测支付
		async checkPay() {
			let that = this;
			let res = await that.$api(
				'order.detail',
				{
					order_sn: that.$Route.query.orderSn
				},
				false
			);
			if (res.code === 1 && res.data.status > 0) {
				that.payState = 'success';
				clearInterval(payTimer);
			}
		},
		// 重新支付
		onPay() {
			let that = this;
			let pay = new ShoproPay(that.$Route.query.type, that.orderDetail);
		}
	}
};
</script>

<style lang="scss">
.success-box {
	background: #fff;
	width: 750rpx;
	padding: 40rpx 0;
	.pay-img {
		width: 130rpx;
		height: 130rpx;
	}
	.notice {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 30rpx;
		margin-top: 30rpx;
	}
	.pay-money {
		font-size: 36rpx;
		color: #e1212b;
		font-weight: 600;
		margin-top: 20rpx;
	}
	.btn-box {
		margin-top: 30rpx;
		width: 660rpx;
		.base-btn {
			width: 320rpx;
			height: 70rpx;
			background: rgba(255, 255, 255, 1);
			border: 1rpx solid rgba(223, 223, 223, 0.5);
			border-radius: 35rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			padding: 0;
		}
		.again-pay {
			width: 320rpx;
			height: 70rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
			border-radius: 35rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, 0.8);
			padding: 0;
		}
	}
}
.hot-box {
	background: #fff;
	padding: 20rpx;
	margin-top: 20rpx;
	.hot-title {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		height: 80rpx;
	}
}
</style>
=======
<!-- 支付结果页 -->
<template>
	<view class="success-page">
		<view class="success-box flex flex-direction align-center">
			<image class="pay-img" :src="payImg[payState]" mode=""></image>
			<text class="notice">{{ payText[payState] }}</text>
			<text class="pay-money" v-if="payState === 'success' && orderDetail.total_fee">￥{{ orderDetail.total_fee }}</text>
			<view class="btn-box flex justify-between">
				<block v-if="payState === 'success' && orderDetail.activity_type === 'groupon' && orderDetail.ext_arr.buy_type === 'groupon'">
					<button
						class="cu-btn base-btn"
						v-if="orderDetail.ext_arr.groupon_id > 0"
						@tap="replace('/pages/activity/groupon/detail', { id: orderDetail.ext_arr.groupon_id })"
					>
						拼团详情
					</button>
					<button class="cu-btn base-btn" v-else @tap="replace('/pages/activity/groupon/my-groupon')">我的拼团</button>
				</block>

				<button class="cu-btn base-btn" v-else @tap="routerTo.push('/pages/index/index')">返回首页</button>
				<button class="cu-btn base-btn mx10" @tap="onOrder">查看订单</button>
				<button class="again-pay cu-btn" v-if="payState === 'fail'" @tap="onPay">重新支付</button>
			</view>
		</view>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import ShoproPay from '@/common/shopro-pay';
import { mapMutations, mapActions, mapState } from 'vuex';
let payTimer = null;
const payCount = 5;
export default {
	components: {},
	data() {
		return {
			routerTo: this.$Router,
			orderDetail: {},
			payStatusMap: {
				'0': 'fail',
				'1': 'success',
				undefined: 'paying'
			},
			payText: {
				fail: '支付失败',
				success: '支付成功',
				paying: '查询中...'
			},
			payImg: {
				fail: this.$IMG_URL + '/imgs/order/order_pay_fail.gif',
				success: this.$IMG_URL + '/imgs/order/order_pay_success.gif',
				paying: this.$IMG_URL + '/imgs/base_loading.gif'
			},
			payState: null
		};
	},
	computed: {},
	onLoad(options) {
		if (String(options.pay) !== 'undefined') {
			if (options.pay) {
				this.getCartList();
			}
			this.payState = this.payStatusMap[String(options.pay)];
		} else {
			this.checkTimer();
		}
		this.getOrderDetail();
	},
	onHide() {
		clearInterval(payTimer);
	},
	methods: {
		...mapActions(['getCartList']),
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		replace(path, parmas) {
			this.$Router.replace({
				path: path,
				query: parmas
			});
		},
		// 查看订单
		onOrder() {
			this.$Router.replace({
				path: '/pages/order/detail',
				query: { id: this.orderDetail.id }
			});
		},
		// 支付信息
		getOrderDetail() {
			let that = this;
			that.$api('order.detail', {
				order_sn: that.$Route.query.orderSn
			}).then(res => {
				if (res.code === 1) {
					that.orderDetail = res.data;
				}
			});
		},
		checkTimer() {
			let that = this;
			let count = 0;
			that.payState = 'paying';
			payTimer = setInterval(() => {
				count++;
				if (count < payCount) {
					that.checkPay();
				} else {
					clearInterval(payTimer);
					that.payState = 'fail';
				}
			}, 800);
		},
		// 检测支付
		async checkPay() {
			let that = this;
			let res = await that.$api(
				'order.detail',
				{
					order_sn: that.$Route.query.orderSn
				},
				false
			);
			if (res.code === 1 && res.data.status > 0) {
				that.payState = 'success';
				clearInterval(payTimer);
			}
		},
		// 重新支付
		onPay() {
			let that = this;
			let pay = new ShoproPay(that.$Route.query.type, that.orderDetail);
		}
	}
};
</script>

<style lang="scss">
.success-box {
	background: #fff;
	width: 750rpx;
	padding: 40rpx 0;
	.pay-img {
		width: 130rpx;
		height: 130rpx;
	}
	.notice {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 30rpx;
		margin-top: 30rpx;
	}
	.pay-money {
		font-size: 36rpx;
		color: #e1212b;
		font-weight: 600;
		margin-top: 20rpx;
	}
	.btn-box {
		margin-top: 30rpx;
		width: 660rpx;
		.base-btn {
			width: 320rpx;
			height: 70rpx;
			background: rgba(255, 255, 255, 1);
			border: 1rpx solid rgba(223, 223, 223, 0.5);
			border-radius: 35rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			padding: 0;
		}
		.again-pay {
			width: 320rpx;
			height: 70rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
			border-radius: 35rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, 0.8);
			padding: 0;
		}
	}
}
.hot-box {
	background: #fff;
	padding: 20rpx;
	margin-top: 20rpx;
	.hot-title {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		height: 80rpx;
	}
}
</style>
>>>>>>> 249bc3588ce88ed9a3079aee7eeff9b82ac50fe7
