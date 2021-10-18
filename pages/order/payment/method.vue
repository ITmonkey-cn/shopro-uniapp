<!-- 收银台 -->
<template>
	<view class="pay-method-wrap">
		<view class="u-flex-col u-col-center money-box" v-if="orderDetail.total_fee">
			<text class="time" v-show="isCountDown">{{ timeText }}</text>
			<view class="money">{{ orderDetail.total_fee }}</view>
		</view>

		<!-- 支付方式单选项 -->
		<u-radio-group v-if="initPayment.length" class="pay-box" v-model="payType" active-color="#f0c785">
			<!-- 微信支付 -->
			<view class="u-flex u-row-between pay-item" v-show="initPayment.includes('wechat')" @tap="payType = 'wechat'">
				<view class="u-flex">
					<image class="pay-img" :src="$IMG_URL + '/imgs/order/order_wx_pay.png'" mode=""></image>
					<text>微信支付</text>
				</view>
				<u-radio shape="circle" name="wechat"></u-radio>
			</view>
			<!-- 支付宝支付 -->
			<view class="u-flex u-row-between pay-item" v-show="initPayment.includes('alipay')" @tap="payType = 'alipay'">
				<view class="u-flex">
					<image class="pay-img" :src="$IMG_URL + '/imgs/order/order_ali_pay.png'" mode=""></image>
					<text>支付宝支付</text>
				</view>
				<u-radio shape="circle" name="alipay"></u-radio>
			</view>
			<!-- 苹果支付 -->
			<view class="u-flex u-row-between pay-item" v-show="initPayment.includes('iospay') && appPlatfrom === 'ios'" @tap="payType = 'iospay'">
				<view class="u-flex">
					<image class="pay-img" :src="$IMG_URL + '/imgs/order/order_apple_pay.png'" mode=""></image>
					<text>ApplePay</text>
				</view>
				<u-radio shape="circle" name="iospay"></u-radio>
			</view>
			<!-- 余额支付 -->
			<view class="u-flex u-row-between pay-item" v-show="initPayment.includes('wallet')" @tap="payType = 'wallet'">
				<view class="u-flex">
					<image class="pay-img" :src="$IMG_URL + '/imgs/order/order_wallet_pay.png'" mode=""></image>
					<text>余额支付</text>
				</view>
				<u-radio shape="circle" name="wallet"></u-radio>
			</view>
		</u-radio-group>

		<button class="u-reset-button pay-btn" @tap="confirmPay">确认支付 ￥{{ orderDetail.total_fee || '0.00' }}</button>
	</view>
</template>

<script>
import Pay from '@/shopro/pay';
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
let timer;
export default {
	components: {},
	data() {
		return {
			payType: '', //支付方式
			isCountDown: true, //是否显示订单倒计时。
			orderDetail: {},
			timeText: '', //倒计时文本
			platform: this.$platform.get(),
			appPlatfrom: ''
		};
	},
	computed: {
		...mapGetters(['initPayment'])
	},
	onShow() {
		this.orderDetail.id && this.countDown();
	},
	onLoad() {
		if (this.$platform.get() === 'wxOfficialAccount' && this.$platform.device() === 'ios' && this.$platform.entry() !== location.href) location.reload();
		this.getOrderDetail();
		if (this.initPayment.length) {
			this.payType = this.initPayment[0];
		}
	},
	onHide() {
		clearInterval(timer);
		timer = null;
	},
	methods: {
		// 倒计时
		countDown() {
			let that = this;
			let t = parseInt(that.orderDetail.ext_arr.expired_time * 1000) - parseInt(new Date().getTime());
			t = t / 1000;
			timer = setInterval(() => {
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
			let pay = null;
			if (!that.payType) {
				this.$u.toast('请选择支付方式');
				return;
			}
			if (that.payType === 'wallet') {
				uni.showModal({
					title: '支付提示',
					confirmColor: '#f0c785',
					content: `是否确认使用余额支付:${that.orderDetail.total_fee || '0.00'}元?`,
					success: res => {
						if (res.confirm) {
							pay = new Pay(that.payType, that.orderDetail);
						}
					}
				});
			} else {
				pay = new Pay(that.payType, that.orderDetail);
			}
		},

		// 支付信息
		getOrderDetail() {
			let that = this;
			that.$http('order.detail', {
				id: that.$Route.query.orderId
			}).then(res => {
				if (res.code === 1) {
					that.orderDetail = res.data;
					if (res.data.ext_arr !== null) {
						that.countDown();
					} else {
						that.isCountDown = false;
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

		.pay-img {
			width: 40rpx;
			height: 40rpx;
			margin-right: 25rpx;
		}
	}
}

.pay-btn {
	width: 690rpx;
	line-height: 80rpx;
	background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
	border-radius: 40rpx;
	color: rgba(#fff, 0.9);
	margin: 100rpx auto 0;
}
</style>
