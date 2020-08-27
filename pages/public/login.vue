<template>
	<view class="container">
		<!-- 背景图 -->
		<view class="x-c"><image class="logo-bg" src="http://shopro.7wpp.com/imgs/logo_bg.png" mode=""></image></view>
		<!-- titleview -->
		<view class="head-box"><cu-custom :isBack="true"></cu-custom></view>
		<view class="wrapper">
			<!-- logo -->
			<view class="x-c"><image class="logo" :src="sysInfo.logo" mode="widthFix"></image></view>
			<!-- 登录tab -->
			<view class="tab-box x-f">
				<view class="tab-item x-c" @tap="onLoginWay(0)">
					<text class="tab-title">手机登录</text>
					<view class="line-box" v-show="loginWay === 0"><text class="triangle"></text></view>
				</view>
				<view class="tab-item x-c" @tap="onLoginWay(1)">
					<text class="tab-title">密码登录</text>
					<view class="line-box" password v-show="loginWay === 1"><text class="triangle"></text></view>
				</view>
			</view>
			<!-- 表单 -->
			<view class="login-box y-f" v-show="loginWay === 0">
				<view class="input-item x-c"><input class="inp" v-model="userPhone" type="number" placeholder="请输入手机号" placeholder-class="pl" /></view>
				<view class="input-item x-c">
					<input class="inp" v-model="code.value" type="number" placeholder="请输入验证码" placeholder-class="pl" />
					<button class="cu-btn code-btn" :disabled="code.status" @tap="getCode">{{ code.text }}</button>
				</view>
			</view>
			<view class="login-box y-f" v-show="loginWay === 1">
				<view class="input-item x-c"><input class="inp" v-model="userPhone" type="number" placeholder="请输入账号" placeholder-class="pl" /></view>
				<view class="input-item x-c"><input class="inp" password v-model="userPassword" type="text" placeholder="请输入密码" placeholder-class="pl" /></view>
			</view>
			<!-- 登录按钮 -->
			<view class="x-c y-f">
				<button class="cu-btn login-btn mb30" @tap="toLogin">登录</button>
				<view class="x-bc tip-box ">
					<button class="cu-btn tip-btn" @tap="jump('/pages/public/register')">立即注册</button>
					<view class="" v-show="loginWay === 1"><button class="cu-btn tip-btn" @tap="jump('/pages/public/forgot')">忘记密码</button></view>
				</view>
			</view>
			<view class="third-party y-f">
				<!-- #ifdef H5 -->
				<button class="cu-btn wx-logo-box y-f" @tap="wxLogin">
					<image class="auto-login" src="http://shopro.7wpp.com/imgs/auto_login.png" mode=""></image>
					<view class="">微信一键登录</view>
				</button>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<button class="cu-btn wx-logo-box y-f" open-type="getUserInfo" @getuserinfo="getuserinfo">
					<image class="auto-login" src="http://shopro.7wpp.com/imgs/auto_login.png" mode=""></image>
					<view class="">微信一键登录</view>
				</button>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<button class="cu-btn wx-logo-box y-f" @tap="wxLogin">
					<image class="auto-login" src="http://shopro.7wpp.com/imgs/auto_login.png" mode=""></image>
					<view class="">微信一键登录</view>
				</button>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
import Wechat from '@/common/wechat/wechat';
import { mapMutations, mapActions, mapState } from 'vuex';
import store from '@/common/store';
export default {
	data() {
		return {
			code: {
				text: '获取验证码',
				status: false,
				value: ''
			},
			loginWay: 0,
			userPhone: '',
			userPassword: '',
			sysInfo: uni.getStorageSync('sysInfo')
		};
	},
	computed: {
		...mapState({
			initData: state => state.init.initData
		})
	},
	onLoad() {
		if (this.$Route.query.token) {
			this.setTokenAndBack(this.$Route.query.token);
		}
	},
	onShow() {},
	methods: {
		...mapActions(['getUserInfo', 'setTokenAndBack']),
		// #ifdef MP-WEIXIN
		async getuserinfo(e) {
			var wechat = new Wechat();
			let token = await wechat.wxMiniProgramLogin(e);
			store.commit('FORCE_OAUTH', false);
			this.setTokenAndBack(token);
		},
		// #endif
		async wxLogin() {
			let wechat = new Wechat();
			let token = await wechat.login();
			if (token !== undefined) {
				this.setTokenAndBack(token);
			}
		},
		onLoginWay(flag) {
			this.loginWay = flag;
		},
		toLogin() {
			let that = this;
			if (that.loginWay === 0) {
				that.$api('user.mobileLogin', {
					mobile: that.userPhone,
					code: that.code.value
				}).then(res => {
					if (res.code === 1) {
						that.setTokenAndBack(res.data.userinfo.token);
					}
				});
			}
			if (that.loginWay === 1) {
				that.$api('user.accountLogin', {
					account: that.userPhone,
					password: that.userPassword
				}).then(res => {
					if (res.code === 1) {
						that.setTokenAndBack(res.data.userinfo.token);
					}
				});
			}
		},

		// 获取短信
		async getCode() {
			let that = this;
			that.code.status = true;
			let countdown = 60;
			that.$api('sms.send', {
				mobile: that.userPhone,
				event: 'mobilelogin'
			}).then(res => {
				if (res.code === 1) {
					that.code.text = countdown + '秒';
					that.code.status = true;
					let timer = setInterval(() => {
						if (countdown > 0) {
							that.code.text = countdown - 1 + '秒';
							countdown--;
						} else {
							clearInterval(timer);
							that.code.text = '获取验证码';
							that.code.status = false;
						}
					}, 1000);
				} else {
					that.code.status = false;
				}
			});
		},
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		}
	}
};
</script>

<style lang="scss">
.container {
	position: relative;
	width: 100vw;
	height: 100vh;
	// overflow: hidden;
	background: linear-gradient(180deg, rgba(239, 196, 128, 1) 0%, rgba(248, 220, 165, 1) 25%, rgba(255, 255, 255, 1) 98%);

	// titleview
	.head-box {
		.cuIcon-back {
			font-size: 50rpx !important;
			font-weight: 500;
		}
	}

	// logo
	.logo {
		width: 410rpx;
		height: 120rpx;
	}

	.logo-bg {
		width: 640rpx;
		height: 300rpx;
	}
}

.wrapper {
	position: absolute;
	z-index: 90;
	padding-bottom: 40upx;
	padding-top: 115px;
	width: 100vw;
	height: 100vh;
	top: 0;

	// 登录选项卡
	.tab-box {
		margin: 60rpx auto 30rpx;
		width: 608rpx;

		.tab-item {
			flex: 1;
			height: 80rpx;
			position: relative;

			.tab-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #845708;
			}

			.line-box {
				position: absolute;
				width: 300rpx;
				height: 4rpx;
				background: rgba(233, 181, 98, 1);
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);

				.triangle {
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					disply: block;
					width: 0;
					height: 0;
					border-width: 10rpx;
					border-style: solid;
					border-color: transparent transparent #e9b562 transparent;
				}
			}
		}
	}

	// 输入
	.login-box {
		.input-item {
			height: 108rpx;
			border-bottom: 1rpx solid rgba(#d0b17b, 0.3);
			width: 608rpx;

			.inp {
				flex: 1;
				height: 100%;
				font-size: 28rpx;
			}

			.pl {
				color: #c8963d;
			}

			.code-btn {
				background: none;
				font-size: 28rpx;
				color: #845708;
			}
		}
	}

	// 登录
	.login-btn {
		width: 630upx;
		height: 80upx;
		border-radius: 40rpx;
		margin-top: 70upx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		color: #fff;
	}

	.tip-box {
		width: 630rpx;

		.tip-btn {
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			text-decoration: underline;
			color: rgba(200, 150, 61, 1);
			background: none;
		}
	}

	// 一键登录按钮
	.wx-logo-box {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(200, 150, 61, 1);
		margin-top: 80rpx;
		background: none;
		display: block;
		&:hover {
			background: none;
		}
		.auto-login {
			width: 80rpx;
			height: 80rpx;
			overflow: hidden;
			margin-bottom: 10rpx;
		}
	}
}
</style>
