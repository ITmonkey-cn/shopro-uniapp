<template>
	<view class="container">
		<!-- 背景图 -->
		<view class="x-c"><image class="logo-bg" src="http://shopro.7wpp.com/imgs/logo_bg.png" mode=""></image></view>
		<!-- titleview -->
		<view class="head-box"><cu-custom :isBack="true"></cu-custom></view>
		<view class="wrapper">
			<!-- logo -->
			<view class="x-c"><image class="logo" :src="sysInfo.logo" mode="widthFix"></image></view>
			<!-- 表单 -->
			<view class="login-box y-f">
				<view class="input-item x-c">
					<text class="inp-title">手机号</text>
					<input class="inp" v-model="mobile" type="number" placeholder="请输入手机号" placeholder-class="pl" />
				</view>
				<view class="input-item x-c">
					<text class="inp-title">验证码</text>
					<input class="inp" v-model="code.value" type="number" placeholder="请输入验证码" placeholder-class="pl" />
					<button class="cu-btn code-btn" :disabled="code.status" @tap="getCode">{{ code.text }}</button>
				</view>
				<view class="input-item x-c">
					<text class="inp-title">密&emsp;码</text>
					<input class="inp" password v-model="password" type="text" placeholder="请输入6-14位密码" placeholder-class="pl" />
				</view>
				<view class="tip-box" @tap="onTcp">
					<label class="x-f">
						<radio class="tcp-radio brown" :class="{ checked: isTcp }" :checked="isTcp"></radio>
						<view class="">
							我已阅读并遵守
							<text class="tcp" @tap="jump('/pages/public/richtext', { id: 1 })">《用户协议》</text>
							与
							<text class="tcp" @tap="jump('/pages/public/richtext', { id: 2 })">《隐私协议》</text>
						</view>
					</label>
				</view>
			</view>
			<!-- 登录按钮 -->
			<view class="x-c y-f"><button class="cu-btn login-btn" @tap="register">立即注册</button></view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';

export default {
	data() {
		return {
			mobile: '',
			code: {
				text: '获取验证码',
				status: false,
				value: ''
			},
			password: '',
			isTcp: false, //协议
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
		...mapActions(['setTokenAndBack']),
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		async getCode() {
			let that = this;
			that.code.status = true;
			let countdown = 60;
			that.$api('sms.send', {
				mobile: that.mobile,
				event: 'register'
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

		register() {
			let that = this;
			if (this.isTcp) {
				this.$api('user.register', {
					mobile: this.mobile,
					code: this.code.value,
					password: this.password
				}).then(res => {
					if (res.code === 1) {
						uni.showToast({
							title: res.msg || '注册成功,请前往登录',
							icon: 'success',
							duration: 1000,
							mask: true,
							success: function() {
								that.setTokenAndBack(res.data.userinfo.token);
							}
						});
					}
				});
			} else {
				this.$tools.toast('请先同意协议！');
			}
		},

		onTcp() {
			this.isTcp = !this.isTcp;
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

	// 输入
	.login-box {
		margin-top: 140rpx;

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

	.tip-box {
		width: 630rpx;
		line-height: 108rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: rgba(200, 150, 61, 1);

		.tcp-radio {
			transform: scale(0.5);
		}

		.tcp {
			text-decoration: underline;
		}
	}
}
</style>
