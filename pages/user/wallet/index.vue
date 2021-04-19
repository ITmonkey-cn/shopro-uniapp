<<<<<<< HEAD
<!-- 我的钱包 -->
<template>
	<view class="page_box">
		<view class="head_box">
			<cu-custom :isBack="true">
				<block slot="backText"></block>
				<block slot="content">我的钱包</block>
			</cu-custom>
			<!-- <image class="resale-bg" src="/static/resale_bg.png" mode=""></image> -->
			<view class="card-box x-end x-bc">
				<view class="left y-start">
					<text class="title">可提现</text>
					<text class="money-num">{{ userinfo.money }}</text>
					<text class="add">{{ rules }}</text>
				</view>
				<button class="cu-btn cash-btn" @tap="onWithdrawals">提现</button>
			</view>
		</view>
		<view class="content_box">
			<view class="resale-list x-bc" @tap="jump('/pages/user/wallet/bind-bank')">
				<view class="x-f">
					<text class=" cuicon cuIcon-vipcard"></text>
					<text>绑定银行卡</text>
				</view>
				<text class="cuIcon-right"></text>
			</view>
			<view class="resale-list x-bc" @tap="jump('/pages/user/wallet/log')">
				<view class="x-f">
					<text class=" cuicon cuIcon-baby"></text>
					<text>钱包明细</text>
				</view>
				<text class="cuIcon-right"></text>
			</view>
			<!-- <view class="resale-list x-bc" @tap="jump('/pages/user/team/index')">
				<view class="x-f">
					<text class=" cuicon cuIcon-friend"></text>
					<text>我的团队</text>
				</view>
				<text class="cuIcon-right"></text>
			</view> -->
			<!-- <view class="resale-list x-bc" @tap="jump('/pages/user/poster')">
				<view class="x-f">
					<text class=" cuicon cuIcon-present"></text>
					<text>邀请好友</text>
				</view>
				<text class="cuIcon-right"></text>
			</view> -->
		</view>
		<view class="foot_box"></view>
		<shopro-modal v-model="showModal" style="z-index: 88;">
			<block slot="modalContent">
				<view class="modal-box">
					<view class="modal-head">
						<image class="modal-head-img"  :src="$IMG_URL + '/imgs/modal_bg.png'" mode=""></image>
						<text class="modal-head-title">提现金额</text>
					</view>
					<input class="inp" type="number" @input="onInput" v-model="money" placeholder="在此输入提现金额" placeholder-class="pl-inp" />
					<button class="cu-btn post-btn" @tap="postMoney">提现</button>
				</view>
			</block>
		</shopro-modal>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
	components: {},
	data() {
		return {
			showModal: false,
			money: '',
			rules: ''
		};
	},
	computed: {
		...mapState({
			userinfo: state => state.user.userInfo
		})
	},
	onLoad() {
		this.getApplyRules();
		this.getUserInfo();
	},
	methods: {
		...mapActions(['getUserInfo']),
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		postMoney() {
			this.apply();
			this.showModal = false;
		},
		onInput() {
			if (+this.userinfo.money > 0 && +this.userinfo.money < +this.money) {
				setTimeout(() => {
					this.money = this.userinfo.money;
				}, 0);
			}
		},
		// 提现
		apply() {
			let that = this;
			that.$api('user_wallet_apply.apply', {
				money: that.money
			}).then(res => {
				if (res.code === 1) {
					//  #ifdef MP-WEIXIN
					this.$store.dispatch('getMessageIds', 'wallet');
					//  #endif
					this.$tools.toast(res.msg);
					that.getUserInfo();
				}
			});
		},
		// 提现规则
		getApplyRules() {
			let that = this;
			that.$api('user_wallet_apply.rule').then(res => {
				if (res.code === 1) {
					that.rules = res.data;
				}
			});
		},
		onWithdrawals() {
			if (this.userinfo.money <= 0) {
				this.$tools.toast('暂无可提现余额');
			} else {
				this.showModal = true;
			}
		}
	}
};
</script>

<style lang="scss">
// 提现弹窗
.modal-box {
	background: #fff;
	width: 610rpx;
	margin: 0 auto;
	border-radius: 20rpx;
	.modal-head-img {
		width: 100%;
		height: 213rpx;
	}

	.modal-head-title {
		font-size: 35rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #6d5028;
		line-height: 42rpx;
	}

	.inp {
		width: 501rpx;
		height: 78rpx;
		border: 1rpx solid rgba(168, 112, 13, 1);
		margin: 60rpx auto 40rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #6d5028;

		.pl-inp {
			color: #bd9560;
		}
	}

	.radio {
		width: 500rpx;
		padding: 0 50rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(200, 150, 61, 1);
		margin-bottom: 20rpx;

		.radio-inp {
			transform: scale(0.7);
			margin-right: 10rpx;
		}
	}

	.post-btn {
		width: 492rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		padding: 0;
		margin-bottom: 60rpx;
	}
}

.head_box {
	width: 750rpx;
	height: 480rpx;
	background: linear-gradient(125deg, rgba(239, 196, 128, 1) 0%, rgba(248, 220, 165, 1) 100%);
	position: relative;

	.resale-bg {
		width: 750rpx;
		height: 64rpx;
		position: absolute;
		bottom: 0;
	}

	.card-box {
		width: 695rpx;
		height: 298rpx;
		padding: 40rpx;
		background: url($IMG_URL+'/imgs/money_wallet_bg.png') no-repeat;
		background-size: 100% 100%;
		box-shadow: 0px 0px 12rpx 9rpx rgba(#f8dca5, 0.82);
		border-radius: 30rpx;
		overflow: hidden;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 30rpx;
		z-index: 6;

		.left {
			display: flex;
			justify-content: space-between;
			height: 100%;
		}

		.cash-btn {
			width: 170rpx;
			height: 64rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			border: 2rpx solid rgba(230, 184, 115, 1);
			box-shadow: 0px 7px 6px 0px rgba(229, 138, 0, 0.22);
			border-radius: 32rpx;
			padding: 0;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}

		.title {
			font-size: 30rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: rgba(230, 184, 115, 1);
			line-height: 30rpx;
		}

		.money-num {
			font-size: 70rpx;
			font-family: FZHei-B01S;
			font-weight: 400;
			color: rgba(230, 184, 115, 1);
			line-height: 72rpx;
		}

		.add {
			font-size: 22rpx;
			width: 400rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(230, 184, 115, 1);
			line-height: 26rpx;
		}
	}
}

.resale-list {
	height: 96rpx;
	background: #fff;
	padding: 0 30rpx 0 40rpx;
	border-bottom: 1rpx solid #dfdfdf;
	font-size: 28rpx;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);

	.cuicon {
		font-size: 40rpx;
		color: #666;
		margin-right: 30rpx;
	}
}
</style>
=======
<!-- 我的钱包 -->
<template>
	<view class="page_box">
		<view class="head_box">
			<cu-custom :isBack="true">
				<block slot="backText"></block>
				<block slot="content">我的钱包</block>
			</cu-custom>
			<!-- <image class="resale-bg" src="/static/resale_bg.png" mode=""></image> -->
			<view class="card-box x-end x-bc">
				<view class="left y-start">
					<text class="title">可提现</text>
					<text class="money-num">{{ userinfo.money }}</text>
					<text class="add">{{ rules }}</text>
				</view>
				<button class="cu-btn cash-btn" @tap="onWithdrawals">提现</button>
			</view>
		</view>
		<view class="content_box">
			<view class="resale-list x-bc" @tap="jump('/pages/user/wallet/bind-bank')">
				<view class="x-f">
					<text class=" cuicon cuIcon-vipcard"></text>
					<text>绑定银行卡</text>
				</view>
				<text class="cuIcon-right"></text>
			</view>
			<view class="resale-list x-bc" @tap="jump('/pages/user/wallet/log')">
				<view class="x-f">
					<text class=" cuicon cuIcon-baby"></text>
					<text>钱包明细</text>
				</view>
				<text class="cuIcon-right"></text>
			</view>
			<!-- <view class="resale-list x-bc" @tap="jump('/pages/user/team/index')">
				<view class="x-f">
					<text class=" cuicon cuIcon-friend"></text>
					<text>我的团队</text>
				</view>
				<text class="cuIcon-right"></text>
			</view> -->
			<!-- <view class="resale-list x-bc" @tap="jump('/pages/user/poster')">
				<view class="x-f">
					<text class=" cuicon cuIcon-present"></text>
					<text>邀请好友</text>
				</view>
				<text class="cuIcon-right"></text>
			</view> -->
		</view>
		<view class="foot_box"></view>
		<shopro-modal v-model="showModal" style="z-index: 88;">
			<block slot="modalContent">
				<view class="modal-box">
					<view class="modal-head">
						<image class="modal-head-img"  :src="$IMG_URL + '/imgs/modal_bg.png'" mode=""></image>
						<text class="modal-head-title">提现金额</text>
					</view>
					<input class="inp" type="number" @input="onInput" v-model="money" placeholder="在此输入提现金额" placeholder-class="pl-inp" />
					<button class="cu-btn post-btn" @tap="postMoney">提现</button>
				</view>
			</block>
		</shopro-modal>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
	components: {},
	data() {
		return {
			showModal: false,
			money: '',
			rules: ''
		};
	},
	computed: {
		...mapState({
			userinfo: state => state.user.userInfo
		})
	},
	onLoad() {
		this.getApplyRules();
		this.getUserInfo();
	},
	methods: {
		...mapActions(['getUserInfo']),
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		postMoney() {
			this.apply();
			this.showModal = false;
		},
		onInput() {
			if (+this.userinfo.money > 0 && +this.userinfo.money < +this.money) {
				setTimeout(() => {
					this.money = this.userinfo.money;
				}, 0);
			}
		},
		// 提现
		apply() {
			let that = this;
			that.$api('user_wallet_apply.apply', {
				money: that.money
			}).then(res => {
				if (res.code === 1) {
					//  #ifdef MP-WEIXIN
					this.$store.dispatch('getMessageIds', 'wallet');
					//  #endif
					this.$tools.toast(res.msg);
					that.getUserInfo();
				}
			});
		},
		// 提现规则
		getApplyRules() {
			let that = this;
			that.$api('user_wallet_apply.rule').then(res => {
				if (res.code === 1) {
					that.rules = res.data;
				}
			});
		},
		onWithdrawals() {
			if (this.userinfo.money <= 0) {
				this.$tools.toast('暂无可提现余额');
			} else {
				this.showModal = true;
			}
		}
	}
};
</script>

<style lang="scss">
// 提现弹窗
.modal-box {
	background: #fff;
	width: 610rpx;
	margin: 0 auto;
	border-radius: 20rpx;
	.modal-head-img {
		width: 100%;
		height: 213rpx;
	}

	.modal-head-title {
		font-size: 35rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #6d5028;
		line-height: 42rpx;
	}

	.inp {
		width: 501rpx;
		height: 78rpx;
		border: 1rpx solid rgba(168, 112, 13, 1);
		margin: 60rpx auto 40rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #6d5028;

		.pl-inp {
			color: #bd9560;
		}
	}

	.radio {
		width: 500rpx;
		padding: 0 50rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(200, 150, 61, 1);
		margin-bottom: 20rpx;

		.radio-inp {
			transform: scale(0.7);
			margin-right: 10rpx;
		}
	}

	.post-btn {
		width: 492rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		padding: 0;
		margin-bottom: 60rpx;
	}
}

.head_box {
	width: 750rpx;
	height: 480rpx;
	background: linear-gradient(125deg, rgba(239, 196, 128, 1) 0%, rgba(248, 220, 165, 1) 100%);
	position: relative;

	.resale-bg {
		width: 750rpx;
		height: 64rpx;
		position: absolute;
		bottom: 0;
	}

	.card-box {
		width: 695rpx;
		height: 298rpx;
		padding: 40rpx;
		background: url($IMG_URL+'/imgs/money_wallet_bg.png') no-repeat;
		background-size: 100% 100%;
		box-shadow: 0px 0px 12rpx 9rpx rgba(#f8dca5, 0.82);
		border-radius: 30rpx;
		overflow: hidden;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 30rpx;
		z-index: 6;

		.left {
			display: flex;
			justify-content: space-between;
			height: 100%;
		}

		.cash-btn {
			width: 170rpx;
			height: 64rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			border: 2rpx solid rgba(230, 184, 115, 1);
			box-shadow: 0px 7px 6px 0px rgba(229, 138, 0, 0.22);
			border-radius: 32rpx;
			padding: 0;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}

		.title {
			font-size: 30rpx;
			font-family: Noto Sans S Chinese;
			font-weight: 400;
			color: rgba(230, 184, 115, 1);
			line-height: 30rpx;
		}

		.money-num {
			font-size: 70rpx;
			font-family: FZHei-B01S;
			font-weight: 400;
			color: rgba(230, 184, 115, 1);
			line-height: 72rpx;
		}

		.add {
			font-size: 22rpx;
			width: 400rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(230, 184, 115, 1);
			line-height: 26rpx;
		}
	}
}

.resale-list {
	height: 96rpx;
	background: #fff;
	padding: 0 30rpx 0 40rpx;
	border-bottom: 1rpx solid #dfdfdf;
	font-size: 28rpx;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);

	.cuicon {
		font-size: 40rpx;
		color: #666;
		margin-right: 30rpx;
	}
}
</style>
>>>>>>> 249bc3588ce88ed9a3079aee7eeff9b82ac50fe7
