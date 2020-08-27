<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="content_box">
			<view class="y-f money-box" v-if="orderDetail.total_fee">
				<text class="time" v-if="isPast">{{ timeText }}</text>
				<view class="money">{{ orderDetail.total_fee }}</view>
			</view>
			<radio-group @change="selPay" class="pay-box" v-if="payment">
				<label class="x-bc pay-item" v-if="payment.includes('wechat')">
					<view class="x-f">
						<image class="pay-img" src="http://shopro.7wpp.com/imgs/wx_pay.png" mode=""></image>
						<text>微信支付</text>
					</view>
					<radio value="wechat" :class="{ checked: payType === 'wechat' }" class=" pay-radio orange" :checked="payType === 'wechat'"></radio>
				</label>
				<label class="x-bc pay-item" v-if="payment.includes('alipay')">
					<view class="x-f">
						<image class="pay-img" src="http://shopro.7wpp.com/imgs/ali_pay.png" mode=""></image>
						<text>支付宝支付</text>
					</view>
					<radio value="alipay" :class="{ checked: payType === 'alipay' }" class="pay-radio orange" :checked="payType === 'alipay'"></radio>
				</label>
				<label class="x-bc pay-item" v-if="payment.includes('iospay') && !isAndroid">
					<view class="x-f">
						<image class="pay-img" src="http://shopro.7wpp.com/imgs/apple_pay.png" mode=""></image>
						<text>ApplePay</text>
					</view>
					<radio value="iospay" :class="{ checked: payType === 'iospay' }" class="pay-radio orange" :checked="payType === 'iospay'"></radio>
				</label>
				<label class="x-bc pay-item" v-if="payment.includes('wallet')">
					<view class="x-f">
						<image class="pay-img" src="http://shopro.7wpp.com/imgs/wallet_pay.png" mode=""></image>
						<text>余额支付</text>
					</view>
					<radio value="wallet" :class="{ checked: payType === 'wallet' }" class="pay-radio orange" :checked="payType === 'wallet'"></radio>
				</label>
			</radio-group>
			<view class="x-c">
				<button class="cu-btn pay-btn" @tap="confirmPay">确认支付 ￥{{ orderDetail.total_fee }}</button>
			</view>
		</view>
		<view class="foot_box"></view>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import ShoproPay from '@/common/shopro-pay';
import { mapMutations, mapActions, mapState } from 'vuex';

let timer;
export default {
	components: {},
	data() {
		return {
			payType: 'wechat',
			options: {},
			orderDetail: {},
			timeText: '',
			isPast: true, //是否显示订单倒计时。
			isAndroid: uni.getStorageSync('isAndroid'),
			platform: uni.getStorageSync('platform')
		};
	},
	computed: {
		...mapState({
			payment: state => state.init.initData.payment
		})
	},
	onLoad(options) {
		this.options = options;
		if (options.openid) {
			//检测到回传openid
			uni.setStorageSync('openid', options.openid);
		}
		// #ifdef H5
		if (uni.getStorageSync('platform') === 'wxOfficialAccount' && uni.getSystemInfoSync().platform === 'ios' && !uni.getStorageSync('payReload')) {
			//检测到IOS支付路径问题
			uni.setStorageSync('payReload', true);
			window.location.reload();
			throw 'stop';
		}
		uni.removeStorageSync('payReload');
		// #endif
		this.init();
	},
	onShow() {},
	onHide() {
		clearInterval(timer);
	},
	methods: {
		init() {
			return Promise.all([this.getOrderDetail()]);
		},
		selPay(e) {
			this.payType = e.detail.value;
		},
		// 倒计时
		countDown() {
			let that = this;
			let t = parseInt(that.orderDetail.ext_arr.expired_time * 1000) - parseInt(new Date().getTime());
			t = t / 1000;
			let timer = setInterval(() => {
				if (t > 0) {
					let time = that.$tools.format(t);
					that.timeText = `支付剩余时间 ${time.m}:${time.s}`;
					t--;
				} else {
					clearInterval(timer);
					that.timeText = '订单已过期!';
				}
			}, 1000);
		},
		// 发起支付
		confirmPay() {
			let that = this;

			let pay = new ShoproPay(that.payType, that.orderDetail);
		},
		// 支付信息
		getOrderDetail() {
			let that = this;
			that.$api('order.detail', {
				id: that.options.orderId
			}).then(res => {
				if (res.code === 1) {
					that.orderDetail = res.data;
					if (res.data.ext_arr !== null) {
						that.countDown();
					} else {
						that.isPast = false;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.money-box {
	background: #fff;
	height: 250rpx;
	margin-bottom: 20rpx;
	padding-top: 30rpx;

	.time {
		font-size: 28rpx;
		color: #c4c4c4;
	}

	.money {
		color: #e1212b;
		font-size: 60rpx;
		margin-top: 60rpx;

		&::before {
			content: '￥';
			font-size: 46rpx;
		}
	}
}

.pay-box {
	.pay-item {
		height: 90rpx;
		padding: 0 30rpx;
		font-size: 26rpx;
		background: #fff;
		width: 750rpx;
		border-bottom: 1rpx solid #eeeeee;

		&:last-child {
			border-bottom: none;
		}

		.pay-radio {
			transform: scale(0.8);
		}

		.pay-img {
			width: 40rpx;
			height: 40rpx;
			// background: #ccc;
			margin-right: 25rpx;
		}
	}
}

.pay-btn {
	width: 690rpx;
	height: 80rpx;
	background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
	border-radius: 40rpx;
	color: rgba(#fff, 0.9);
	margin-top: 100rpx;
}
</style>
