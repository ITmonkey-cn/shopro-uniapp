<template>
	<view class="container">
		<!-- 背景图 -->
		<view class="x-c"><image class="logo-bg" src="http://shopro.7wpp.com/imgs/logo_bg.png" mode=""></image></view>
		<!-- titleview -->
		<view class="head-box"><cu-custom :isBack="true"></cu-custom></view>
		<view class="wrapper">
			<!-- logo -->
			<view class="x-c"><image class="logo" v-if="initData.info" :src="sysInfo.logo" mode="widthFix"></image></view>
			<view class="x-c">
				<view class="tab-item x-c">
					<text class="tab-title">忘记密码</text>
					<view class="line-box"><text class="triangle"></text></view>
				</view>
			</view>
			<!-- 表单 -->
			<view class="login-box y-f">
				<view class="input-item x-c">
					<text class="inp-title">手机号</text>
					<input class="inp" v-model="userPhone" type="number" placeholder="请输入手机号" placeholder-class="pl" />
				</view>
				<view class="input-item x-c">
					<text class="inp-title">验证码</text>
					<input class="inp" v-model="code.value" type="text" placeholder="请输入验证码" placeholder-class="pl" />
					<button class="cu-btn code-btn" :disabled="code.status" @tap="getCode">{{ code.text }}</button>
				</view>
				<view class="input-item x-c">
					<text class="inp-title">新密码</text>
					<input class="inp" password v-model="userPassword" type="text" placeholder="请设置新密码" placeholder-class="pl" />
				</view>
			</view>
			<!-- 登录按钮 -->
			<view class="x-c y-f">
				<button class="cu-btn login-btn mb30" @tap="restPassword">确认</button>
				<button class="cu-btn tip-btn" @tap="jump('/pages/public/login')">返回登录</button>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';

export default {
	data() {
		return {
			code: {
				text: '获取验证码',
				status: false,
				value: ''
			},
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
	onLoad() {},
	methods: {
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 重置密码
		restPassword() {
			let that = this;
			that.$api('user.resetpwd', {
				mobile: that.userPhone,
				newpassword: that.userPassword,
				captcha: that.code.value
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast('重置密码成功');
					that.$Router.back();
				}
			});
		},
		// 获取短信
		async getCode() {
			let that = this;
			that.code.status = true;
			let countdown = 60;
			that.$api('sms.send', {
				mobile: that.userPhone,
				event: 'resetpwd'
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
							that.$set(that.code, 'status', false);
						}
					}, 1000);
				} else {
					that.$set(that.code, 'status', false);
				}
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
	// 标题
	.tab-item {
		flex: 1;
		height: 80rpx;
		position: relative;
		margin-top: 80rpx;
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

.wrapper {
	position: absolute;
	z-index: 90;
	padding-bottom: 40upx;
	padding-top: 115px;
	width: 100vw;
	height: 100vh;
	top: 0;

	// 输入
	.login-box {
		margin-top: 80rpx;
		.input-item {
			height: 108rpx;
			border-bottom: 1rpx solid rgba(#d0b17b, 0.3);
			width: 608rpx;

			.inp-title {
				font-size: 30rpx;
				color: #845708;
				padding-right: 30rpx;
			}

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
				border-left: 1rpx solid #d0b17b;
				border-radius: 0;
				height: 42rpx;
				width: 190rpx;
				padding: 0;
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

	.tip-btn {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		text-decoration: underline;
		color: rgba(200, 150, 61, 1);
		background: none;
	}
}
</style>
