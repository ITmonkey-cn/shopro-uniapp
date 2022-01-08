<!-- 提现 -->
<template>
	<view class="draw-money-wrap">
		<view class="head-box">
			<shopro-navbar :background="{ background: 'none' }" :backTextStyle="{ color: '#fff' }" backText="提现" backIconColor="#fff"></shopro-navbar>
			<!-- 可提现 -->
			<view class="wallet-num-box u-flex u-col-center u-row-between">
				<view class="">
					<view class="num-title">可提现金额（元）</view>
					<view class="wallet-num">{{ userInfo.money || '0.00' }}</view>
				</view>
				<button class="u-reset-button log-btn" @tap="$Router.push({ path: '/pages/user/wallet/withdraw-log' })">提现记录</button>
			</view>
		</view>
		<!-- 提现输入卡片-->
		<view class="draw-card">
			<view class="card-title">提现金额</view>
			<view class="input-box u-flex u-col-center">
				<view calss="unit">￥</view>
				<input class="u-flex-1 u-p-l-10" type="number" @input="onWithdrawInput" v-model="money" :placeholder-style="placeholderStyle" placeholder="请输入提现金额" />
			</view>
			<view class="bank-box u-flex u-col-center u-row-between u-m-b-30">
				<view class="name">提现至</view>
				<view class="bank-list u-flex" @tap="showWithdrawList = true">
					<view class="empty-text" v-if="!withdrawType">请选择提现方式</view>
					<view class="sel-box u-flex u-col-center" v-else>
						<image class="item-img" :src="withdrawList[withdrawType].icon" mode=""></image>
						<view class="item-title u-m-l-20">{{ withdrawList[withdrawType].title }}</view>
					</view>
					<text class="u-iconfont uicon-arrow-right" style="#C4C4C4;"></text>
				</view>
			</view>
			<!-- 提现信息 -->
			<view class="bank-info u-m-b-80">
				<view class="u-flex u-row-between u-col-center" v-if="withdrawType">
					<block v-if="withdrawType === 'wechat'">
						<view class="bank-info-title">
							{{ !withdrawInfo ? '暂无微信授权信息' : `${withdrawInfo.bank_name || ''}  [${withdrawInfo.card_no || ''}] ${withdrawInfo.real_name || ''}` }}
						</view>
						<button v-if="!withdrawInfo" class="u-reset-button bind-btn u-m-l-20" @tap="bindThirdOauth()">绑定</button>
					</block>
					<block v-else>
						<view class="bank-info-title">
							{{
								!withdrawInfo
									? `暂无${withdrawList[withdrawType].title}信息`
									: `${withdrawInfo.bank_name || ''}  [${withdrawInfo.card_no || ''}] ${withdrawInfo.real_name || ''}`
							}}
						</view>
						<button class="u-reset-button bind-btn u-m-l-20" @tap="toBind">{{ withdrawInfo ? '修改' : '添加' }}</button>
					</block>
				</view>
			</view>
			<button class="u-reset-button save-btn" @tap="withdraw">确认提现</button>
		</view>
		<!-- 提现说明 -->
		<view class="draw-notice">
			<view class="title">提现说明</view>
			<view class="draw-list">1.单次最低提现 {{ ruleInfo.min }} 元，最高提现 {{ ruleInfo.max }} 元；</view>
			<view class="draw-list">
				2.每日最多可提现次数: {{ ruleInfo.perday_num ? ruleInfo.perday_num : '不限' }}；每日最多提现金额(元):
				{{ ruleInfo.perday_amount ? ruleInfo.perday_amount : '不限' }}；
			</view>
			<view class="draw-list">3.每笔收取提现手续费 {{ ruleInfo.service_fee }}%；</view>
			<view class="draw-list">4.提现结果请查收对应渠道服务通知；</view>
			<view class="draw-list">5.如有疑问请及时联系客服。</view>
		</view>
		<!-- 提现方式 -->
		<u-popup v-if="ruleInfo && ruleInfo.methods.length" v-model="showWithdrawList" mode="bottom" safe-area-inset-bottom :closeable="false" border-radius="30">
			<view class="page_box withdraw-modal">
				<view class="modal-head u-flex u-row-center u-col-center">选择提现方式</view>
				<view class="content_box modal-content">
					<u-radio-group v-model="selectedWithdrawType" activeColor="#A36FFF" wrap>
						<view class="type-item u-p-x-24 u-p-y-30" v-if="ruleInfo.methods.includes(item.value)" v-for="(item, index) in withdrawList" :key="index">
							<u-radio shape="circle" iconSize="30" :name="item.value" labelWidth="100%">
								<view class="item-left u-flex u-col-center u-m-l-30">
									<image class="item-img" :src="item.icon" mode=""></image>
									<view class="item-title u-m-l-20">{{ item.title }}</view>
								</view>
							</u-radio>
						</view>
					</u-radio-group>
				</view>
				<view class="modal-bottom"><button class="u-reset-button modal-save-btn" @tap="onSaveWithdrawType">确定</button></view>
			</view>
		</u-popup>

		<!-- 绑定修改银行信息 -->
		<u-popup v-model="showBindForm" mode="bottom" safe-area-inset-bottom @close="initForm" :closeable="false" border-radius="30">
			<!-- 标题 -->
			<view class="form-box u-p-20">
				<view class="head-title u-flex u-col-center u-row-center">{{ formTitle }}</view>
				<!-- 绑定银行卡 -->
				<u-form v-if="withdrawType === 'bank'" :model="form.data" :rules="form.bankRules" ref="bank" :errorType="errorType">
					<u-form-item :labelStyle="labelStyle" label-width="150" label-position="left" label="持卡人:" prop="real_name">
						<u-input placeholder="请输入持卡人" :placeholderStyle="placeholderStyle" v-model="form.data.real_name" type="text"></u-input>
					</u-form-item>
					<u-form-item :labelStyle="labelStyle" label-width="150" label-position="left" label="开户行:" prop="bank_name">
						<u-input placeholder="请输入开户行" :placeholderStyle="placeholderStyle" v-model="form.data.bank_name" type="text"></u-input>
					</u-form-item>
					<u-form-item :labelStyle="labelStyle" label-position="left" label="银行卡号:" prop="card_no" label-width="150">
						<u-input placeholder="请输入银行卡号" :placeholderStyle="placeholderStyle" v-model="form.data.card_no" type="number"></u-input>
					</u-form-item>
				</u-form>
				<!-- 绑定支付宝 -->
				<u-form v-if="withdrawType === 'alipay'" :model="form.data" :rules="form.aliPayRules" ref="alipay" :errorType="errorType">
					<u-form-item :labelStyle="labelStyle" label-width="150" label-position="left" label="真实姓名:" prop="real_name">
						<u-input placeholder="请输入真实姓名" :placeholderStyle="placeholderStyle" v-model="form.data.real_name" type="text"></u-input>
					</u-form-item>
					<u-form-item :labelStyle="labelStyle" label-position="left" label="支付宝账号:" prop="card_no" label-width="170">
						<u-input placeholder="请输入支付宝账号" :placeholderStyle="placeholderStyle" v-model="form.data.card_no" type="text"></u-input>
					</u-form-item>
				</u-form>
				<view class="u-flex u-col-center u-row-between">
					<button class="u-reset-button form-cancel-btn u-m-y-40" @tap="showBindForm = false">取消</button>
					<button class="u-reset-button form-save-btn u-m-y-40" @tap="saveForm">确定</button>
				</view>
			</view>
		</u-popup>

		<!-- modal -->
		<u-modal
			ref="uModal"
			v-model="showModal"
			:show-cancel-button="true"
			confirm-color="#7063D2"
			cancel-color="#666666"
			@confirm="$Router.push('/pages/user/wallet/withdraw-log')"
			confirm-text="查看记录"
			cancel-text="继续提现"
			content="您的申请提现已提交"
			title="申请成功"
		></u-modal>
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
			showModal: false,
			money: '', //提现金额
			ruleInfo: '', //提现规则
			formTitle: '',
			withdrawType: '',
			showBindForm: false,
			selectedWithdrawType: '',
			withdrawInfo: {}, //提现信息
			showWithdrawList: false,
			withdrawList: {
				bank: {
					icon: this.$IMG_URL + '/imgs/wallet/bank_type.png',
					title: '银行卡转账',
					value: 'bank'
				},
				wechat: {
					icon: this.$IMG_URL + '/imgs/wallet/wx_type.png',
					title: '微信零钱',
					value: 'wechat'
				},
				alipay: {
					icon: this.$IMG_URL + '/imgs/wallet/ali_type.png',
					title: '支付宝账户',
					value: 'alipay'
				}
			},
			// 表单样式
			errorType: ['message'],
			labelStyle: {
				'font-size': '30rpx',
				'font-weight': '500',
				color: '#333'
			},
			placeholderStyle: 'font-size: 30rpx; font-weight: 500;color:#C2C7CF;',
			form: {
				data: {
					real_name: '',
					bank_name: '',
					card_no: ''
				},
				bankRules: {
					real_name: FormValidate.realName,
					bank_name: FormValidate.bankName,
					card_no: FormValidate.bankCode
				},
				alipayRules: {
					real_name: FormValidate.realName,
					card_no: FormValidate.alipayAccount
				}
			}
		};
	},
	computed: {
		...mapGetters(['userInfo','initRecharge'])
	},
	async onLoad() {
		this.getWithdrawRules();
	},
	methods: {
		// 确认提现方式
		onSaveWithdrawType() {
			this.withdrawType = this.selectedWithdrawType;
			this.showWithdrawList = false;
			this.getWithdrawInfo();
		},
		async bindThirdOauth() {
			let that = this;
			wechat.bind();
			that.getWithdrawInfo();
		},
		// 提现检验
		onWithdrawInput(e) {
			let sVal = String(e.detail.value);
			sVal = sVal.replace(/\b(0+)/gi, '');
			sVal = sVal.replace(/[^\d]/g, '');
			this.money = sVal;
		},
		// 提现
		withdraw() {
			const that = this;
			if (!this.withdrawType) {
				this.$u.toast('请选择提现方式');
				return;
			}
			if (this.money <= 0) {
				this.$u.toast('请输入提现金额');
				return;
			}
			that.$http(
				'money.walletApply',
				{
					type: that.withdrawType,
					money: that.money
				},
				'申请中...',
				false
			).then(res => {
				if (res.code === 1) {
					that.money = '';
					that.showModal = true;
					//  #ifdef MP-WEIXIN
					this.$store.commit('subscribeMessage', 'wallet');
					//  #endif
					that.$store.dispatch('getUserInfo');
				} else {
					that.$u.toast(res.msg);
				}
			});
		},
		initForm() {
			this.form.data = {
				real_name: '',
				bank_name: '',
				card_no: ''
			};
		},

		// 绑定,修改
		toBind() {
			this.showBindForm = true;
			this.form.data = {
				...this.form.data,
				...this.withdrawInfo
			};
			switch (this.withdrawType) {
				case 'bank':
					this.formTitle = this.withdrawInfo ? '修改银行卡' : '添加银行卡';
					this.$nextTick(() => {
						this.$refs.bank.setRules(this.form.bankRules);
					});
					break;
				case 'alipay':
					this.formTitle = this.withdrawInfo ? '修改支付宝' : '添加支付宝';
					this.$nextTick(() => {
						this.$refs.alipay.setRules(this.form.alipayRules);
					});
					break;
				default:
					break;
			}
		},
		// 确认提交表单
		saveForm() {
			let that = this;
			this.$refs[this.withdrawType].validate().then(res => {
				if (res) {
					that.$http(
						'money.bankEdit',
						{
							type: that.withdrawType,
							...that.form.data
						},
						'提交中...'
					).then(res => {
						if (res.code === 1) {
							that.showBindForm = false;
							that.$u.toast(res.msg);
							that.initForm();
							that.getWithdrawInfo();
						}
					});
				}
			});
		},
		// 提现规则
		getWithdrawRules() {
			let that = this;
			that.$http('money.walletRule').then(res => {
				if (res.code === 1) {
					that.ruleInfo = res.data;
					that.selectedWithdrawType = that.ruleInfo.methods[0];
				}
			});
		},
		// 获取提现信息
		getWithdrawInfo() {
			let that = this;
			that.$http(
				'money.bankInfo',
				{
					type: that.withdrawType
				},
				'',
				false
			).then(res => {
				that.withdrawInfo = res.code === 1 ? res.data : null;
			});
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
	min-height: 530rpx;
	margin: -70rpx auto 0;
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
	.bank-box {
		.name {
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
		}
		.bank-list {
			.empty-text {
				font-size: 28rpx;
				font-weight: 400;
				color: #999999;
			}

			.sel-box {
				.item-img {
					width: 36rpx;
					height: 36rpx;
				}
				.item-title {
					font-size: 28rpx;
					color: #333333;
				}
			}
		}
	}
	.bank-info {
		height: 50rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #999999;
		.bank-info-title {
			width: 500rpx;
		}
		.bind-btn {
			padding: 0 20rpx;
			line-height: 50rpx;
			background: #f5f6f8;
			border-radius: 20rpx;
			color: #999;
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
}
// 提现说明
.draw-notice {
	width: 684rpx;
	min-height: 327rpx;
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
// 提现费方式
.withdraw-modal {
	min-height: 600rpx;
	background-color: #fff;
	.modal-head {
		height: 80rpx;
		font-size: 30rpx;
		font-weight: 600;
		color: #333333;
		border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);
	}
	.modal-content {
		.type-item {
			height: 100rpx;
			border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);
			width: 750rpx;
			.item-img {
				width: 36rpx;
				height: 36rpx;
			}
			.item-title {
				font-size: 28rpx;
				color: #333333;
			}
		}
	}
	.modal-bottom {
		padding: 30rpx;
		.modal-save-btn {
			width: 690rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: linear-gradient(90deg, #a36fff, #5336ff);
			box-shadow: 0 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
			border-radius: 40rpx;
			font-weight: 500;
			color: #ffffff;
		}
	}
}

// 绑定
.form-box {
	.head-title {
		height: 100rpx;
		font-size: 34rpx;
		font-weight: 600;
	}
	.form-save-btn {
		width: 340rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: linear-gradient(90deg, #a36fff, #5336ff);
		box-shadow: 0 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
		border-radius: 40rpx;
		font-weight: 500;
		color: #ffffff;
	}
	.form-cancel-btn {
		width: 340rpx;
		height: 80rpx;
		line-height: 80rpx;
		border: 1rpx solid #999;
		border-radius: 40rpx;
		font-weight: 500;
		color: #999;
	}
}
</style>
