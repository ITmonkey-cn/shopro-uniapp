<!-- 充值 -->
<template>
	<view class="draw-money-wrap u-p-b-30">
		<view class="head-box">
			<shopro-navbar :background="{ background: navBackground }" :backTextStyle="{ color: '#fff' }" backText="充值"
				backIconColor="#fff"></shopro-navbar>
			<!-- 账户 -->
			<view class="wallet-num-box u-flex u-col-center u-row-between">
				<view class="">
					<view class="num-title">账户余额（元）</view>
					<view class="wallet-num">{{ userInfo.money || '0.00' }}</view>
				</view>
				<button class="u-reset-button log-btn"
					@tap="$Router.push({ path: '/pages/user/wallet/top-up-log' })">充值记录</button>
			</view>
		</view>
		<!-- 充值输入卡片-->
		<view class="draw-card">
			<view class="card-title">充值金额</view>
			<view class="input-box u-flex u-col-center">
				<view calss="unit">￥</view>
				<input class="u-flex-1 u-p-l-10" type="digit" @focus="onTopupFous" @input="onTopupInput" v-model="money"
					placeholder-style="font-size: 30rpx; font-weight: 500;color:#C2C7CF;" placeholder="请输入充值金额" />
			</view>
			<!-- 快捷充值 -->
			<view class="top-up-content u-p-b-30" v-if="initRecharge.moneys.length">
				<view class="card-title">快捷充值</view>
				<view class="u-flex u-flex-wrap">
					<view class="top-up-card u-flex u-row-center u-col-center u-m-b-30 u-m-r-30"
						:class="{'top-up-active':curMoneyCard === index}" v-for="(item,index) in initRecharge.moneys"
						:key="index" @tap="selectCard(index)">
						<view class="top-up-value">
							{{item.money}}
						</view>
					</view>
				</view>
			</view>
			<button class="u-reset-button save-btn" :style="{opacity:!money ? 0.7 : 1 }" :disabled="!money"
				@tap="confirmTopup">确认充值</button>
		</view>


		<!-- 充值说明 -->
		<view class="draw-notice">
			<view class="title">充值说明</view>
			<view class="draw-list">1.充值为在线支付，即时到账，不支持退款；</view>
			<view class="draw-list">
				2.充值后金额会自动进入您的余额账户，请注意查收。
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapActions, mapGetters } from 'vuex';
	import FormValidate from '@/shopro/validate/form';
	import wechat from '@/shopro/wechat/wechat';
	export default {
		components: {},
		data() {
			return {
				money: '', //提现金额
				showModal: false,
				curMoneyCard: '',
				navBackground: 'none'
			};
		},
		computed: {
			...mapGetters(['userInfo', 'initRecharge'])
		},
		async onLoad() {},
		onPageScroll(e) {
			this.navBackground = e.scrollTop > 50 ?
				`url(${this.$IMG_URL}/imgs/user/draw_money_head_bg.png) no-repeat top / 100% auto` : 'none';
		},
		methods: {
			// 充值输入框
			onTopupInput(e) {
				this.$nextTick(() => {
					this.money = this.clearNoNum(e.detail.value)
				})
			},
			// 获取焦点
			onTopupFous() {
				this.curMoneyCard = ''
			},

			// 选择充值卡片
			selectCard(index) {
				this.curMoneyCard = index
				this.money = this.initRecharge.moneys[index].money
			},

			confirmTopup() {
				const that = this;
				if (this.money <= 0) {
					this.$u.toast('请选择或输入充值金额');
					return;
				}
				that.$http(
					'money.recharge', {
						recharge_money: that.money
					},
					'确认中...'
				).then(res => {
					if (res.code === 1) {
						that.money = '';
						that.$Router.push({
							path: `/pages/order/payment/method`,
							query: {
								orderId: res.data.id,
								orderType: 'recharge'
							}
						});
					} else {
						that.$u.toast(res.msg);
					}
				});
			},

			// 校验金额
			clearNoNum(val) {
				if (val == ".") {
					val = "0.";
				}
				val = val.replace(/[^\d.]/g, "");
				//必须保证第一个为数字而不是.
				val = val.replace(/^\./g, "");
				//保证只有出现一个.而没有多个.
				val = val.replace(/\.{2,}/g, ".");
				//保证.只出现一次，而不能出现两次以上
				val = val
					.replace(".", "$#$")
					.replace(/\./g, "")
					.replace("$#$", ".");
				//只能输入两位小数
				val = val.replace(/^(-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
				if (val.indexOf(".") < 0 && val != "") {
					//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
					val = parseFloat(val);
				}
				return val
			}
		}
	};
</script>

<style lang="scss">
	.head-box {
		background: url($IMG_URL+'/imgs/user/draw_money_head_bg.png') no-repeat;
		background-size: 100% auto;
		min-height: 400rpx;
		padding-bottom: var(--status-bar-height);

		// 可提现
		.wallet-num-box {
			padding: 20rpx 40rpx 0;

			.num-title {
				font-size: 26rpx;
				font-weight: 500;
				color: #ffffff;
				margin-bottom: 20rpx;
			}

			.wallet-num {
				font-size: 60rpx;
				font-weight: 500;
				color: #ffffff;
			}

			.log-btn {
				width: 170rpx;
				height: 60rpx;
				line-height: 60rpx;
				background: rgba(255, 255, 255, 0.1);
				border: 1rpx solid #eeeeee;
				border-radius: 30rpx;
				padding: 0;
				font-size: 26rpx;
				font-weight: 500;
				color: #ffffff;
			}
		}
	}

	// 提现输入卡片
	.draw-card {
		background-color: #fff;
		border-radius: 20rpx;
		width: 690rpx;
		min-height: 400rpx;
		margin: -70rpx auto 30rpx;
		padding: 30rpx;

		.card-title {
			font-size: 30rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 30rpx;
		}

		.input-box {
			width: 624rpx;
			border-bottom: 1rpx solid #eee;
			height: 100rpx;
			margin-bottom: 40rpx;

			.unit {
				font-size: 48rpx;
				color: #333;
			}
		}

		.save-btn {
			width: 616rpx;
			height: 86rpx;
			line-height: 86rpx;
			background: linear-gradient(-90deg, #a36fff, #5336ff);
			box-shadow: 0px 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
			border-radius: 43rpx;
			font-size: 30rpx;
			font-weight: 500;
			color: #ffffff;
		}

		// 充值卡片
		.top-up-card {
			width: 190rpx;
			height: 124rpx;
			background: #F7F6FB;
			border-radius: 12rpx;
			transition: all linear 0.2s;

			&:nth-of-type(3n) {
				margin-right: 0 !important;
			}

			.top-up-value {
				font-size: 36rpx;
				font-weight: 500;
				color: #999999;

				&::after {
					content: '元';
					font-size: 24rpx;
				}
			}
		}

		.top-up-active {
			background: #564BBD;
			transition: all linear 0.2s;

			.top-up-value {
				color: #fff
			}
		}
	}

	// 提现说明
	.draw-notice {
		width: 684rpx;
		min-height: 180rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx 35rpx;
		margin: 20rpx auto;

		.title {
			font-size: 30rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 30rpx;
		}

		.draw-list {
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
			margin-bottom: 10rpx;
		}
	}
</style>
