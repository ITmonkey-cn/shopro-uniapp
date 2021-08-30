<!-- 支付结果页 -->
<template>
	<view class="success-page">
		<view class="success-box u-flex-col u-row-center u-col-center">
			<image class="pay-img" :src="payImg[payState]" mode=""></image>
			<text class="notice">{{ payText[payState] }}</text>
			<text class="pay-money" v-if="payState === 'success' && orderDetail.total_fee">￥{{ orderDetail.total_fee }}</text>
			<view class="btn-box u-flex u-row-between">
				<block v-if="payState === 'success' && orderDetail.activity_type === 'groupon' && orderDetail.ext_arr.buy_type === 'groupon'">
					<button
						class="u-reset-button base-btn"
						v-if="orderDetail.ext_arr.groupon_id > 0"
						@tap="$Router.replace({ path: '/pages/activity/groupon/detail', query: { id: orderDetail.ext_arr.groupon_id } })"
					>
						拼团详情
					</button>
					<button class="u-reset-button base-btn" v-else @tap="$Router.push('/pages/activity/groupon/my-groupon')">我的拼团</button>
				</block>

				<button class="u-reset-button base-btn" v-else @tap="$Router.pushTab('/pages/index/index')">返回首页</button>
				<button class="u-reset-button base-btn u-m-l-10 u-m-r-10" @tap="$Router.replace({ path: '/pages/order/detail', query: { id: orderDetail.id } })">查看订单</button>
				<button class="u-reset-button again-pay " v-show="payState === 'fail'" @tap="onPay">重新支付</button>
			</view>
		</view>
		<!-- modal -->
		<!-- #ifdef MP-WEIXIN -->
		<u-modal
			v-if="payState === 'success'"
			ref="uModal"
			v-model="showModal"
			:show-cancel-button="true"
			confirm-color="#e9b461"
			cancel-color="#666666"
			@confirm="onConfirm"
			confirm-text="订阅消息"
			cancel-text="取消"
			content="是否订阅消息,追踪订单信息?"
			title="提示"
		></u-modal>
		<!-- #endif -->
	</view>
</template>

<script>
import Pay from '@/shopro/pay';
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
let payTimer = null;
const payCount = 5;
export default {
	components: {},
	data() {
		return {
			showModal: false,
			messageType: '',
			templateIds: [],
			wxOpenTags: '',
			orderDetail: {}, //订单详情
			payText: {
				fail: '支付失败',
				success: '支付成功',
				paying: '查询中...'
			},
			payImg: {
				fail: this.$IMG_URL + '/imgs/order/order_pay_fail.gif',
				success: this.$IMG_URL + '/imgs/order/order_pay_success.gif',
				paying: this.$IMG_URL + '/imgs/order/order_paying.gif'
			},
			payState: '' //支付状态
		};
	},
	computed: {
		...mapGetters(['subscribeMessageIdsMap'])
	},
	onLoad() {
		this.payState = this.$Route.query.payState ? this.$Route.query.payState : '';
		this.$Route.query.orderId && this.getOrderDetail();
		switch (this.payState) {
			case 'success':
				this.getCartList();
				break;
			case 'fail':
				break;
			case 'paying':
				this.checkTimer();
				break;
			default:
				break;
		}
	},
	onHide() {
		clearInterval(payTimer);
		payTimer = null;
	},
	methods: {
		...mapActions(['getCartList']),

		// 订阅消息
		onConfirm() {
			//  #ifdef MP-WEIXIN
			this.templateIds.length && this.$store.commit('subscribeMessage', this.messageType);
			//  #endif
		},

		// 支付订单信息
		getOrderDetail() {
			let that = this;
			that.$http('order.detail', {
				id: that.$Route.query.orderId
			}).then(async res => {
				if (res.code === 1) {
					that.orderDetail = res.data;
					if (res.data.status > 0) {
						this.messageType = this.orderDetail.activity_type == 'groupon' ? 'grouponResult' : 'result';
						this.templateIds = this.subscribeMessageIdsMap[this.messageType];
						this.showModal = this.templateIds.length;
					}
				}
			});
		},

		// 支付倒计时
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
			let res = await that.$http(
				'order.detail',
				{
					id: that.$Route.query.orderId
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
			let pay = new Pay(that.$Route.query.type, that.orderDetail);
		}
	}
};
</script>

<style lang="scss" scopeds>
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

		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 30rpx;
		margin-top: 30rpx;
	}
	.pay-money {
		font-size: 36rpx;
		color: #ff3000;
		font-weight: 600;
		margin-top: 20rpx;
	}
	.btn-box {
		margin-top: 30rpx;
		width: 660rpx;
		.base-btn {
			width: 320rpx;
			line-height: 70rpx;
			background: rgba(255, 255, 255, 1);
			border: 1rpx solid rgba(223, 223, 223, 0.5);
			border-radius: 35rpx;
			font-size: 28rpx;

			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			padding: 0;
		}
		.again-pay {
			width: 320rpx;
			line-height: 70rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
			border-radius: 35rpx;
			font-size: 28rpx;

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

		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		height: 80rpx;
	}
}
</style>
