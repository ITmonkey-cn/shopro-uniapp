<template>
	<!-- #ifndef MP-WEIXIN  -->
	<view class="cu-modal" v-if="showLogin && !screenShot" :class="[{ show: showLogin }, modalType]" cathctouchmove @tap="hideModal">
		<view class="cu-dialog" @tap.stop style="background: none;overflow: visible;">
			<view class="modal-box">
				<image class="head-bg" src="http://shopro.7wpp.com/imgs/nologin_bg.png" mode=""></image>
				<view class="detail">
					<view class="title1">您还没有登录</view>
					<view class="title2">登录即刻开启品质生活</view>
				</view>
				<view class="btn-box y-f">
					<button class="cu-btn login-btn" @tap="onLogin">立即登录</button>
					<button class="cu-btn close-btn" @tap="hideModal">取消</button>
				</view>
			</view>
		</view>
	</view>
	<!-- #endif  -->
	<!-- #ifdef MP-WEIXIN  -->
	<view class="force-login-wrap" v-if="forceOauth || showLogin">
		<image class="logo-bg" src="http://shopro.7wpp.com/imgs/logo_bg.png" mode="aspectFill"></image>
		<view class="force-login__content y-f">
			<open-data class="user-avatar" type="userAvatarUrl"></open-data>
			<open-data class="user-name" type="userNickName"></open-data>
			<view class="login-notice">为了提供更优质的服务，需要获取您的头像昵称</view>
			<button class="cu-btn author-btn" @getuserinfo="getuserinfo" open-type="getUserInfo">授权并查看</button>
			<button class="cu-btn close-btn" @tap="closeAuth">暂不授权</button>
		</view>
	</view>
	<!-- #endif  -->
</template>

<script>
import Wechat from '@/common/wechat/wechat';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	name: 'shoproLoginModal',
	components: {},
	data() {
		return {
			screenShot: uni.getStorageSync('screenShot')
		};
	},
	props: {
		value: {},
		modalType: {
			type: String,
			default: ''
		}
	},
	computed: {
		...mapState({
			showLoginTip: state => state.user.showLoginTip,
			forceOauth: state => state.user.forceOauth
		}),
		showLogin: {
			get() {
				return this.showLoginTip;
			},
			set(val) {
				this.$store.commit('LOGIN_TIP', val);
			}
		}
	},
	methods: {
		...mapActions(['setTokenAndBack']),

		// 隐藏登录弹窗
		hideModal() {
			this.showLogin = false;
		},

		// 去登录
		onLogin() {
			this.showLogin = false;
			uni.setStorageSync('fromLogin', this.$Route);
			this.$Router.push({
				path: '/pages/public/login'
			});
		},

		// 小程序，获取用户信息登录
		async getuserinfo(e) {
			var wechat = new Wechat();
			let token = await wechat.wxMiniProgramLogin(e);
			this.$store.commit('FORCE_OAUTH', false);
			this.$store.commit('LOGIN_TIP', false);
			uni.setStorageSync('fromLogin', this.$Route);
			this.setTokenAndBack(token);
		},

		// 小程序，取消登录
		closeAuth() {
			this.$store.commit('FORCE_OAUTH', false);
			this.$store.commit('LOGIN_TIP', false);
		}
	}
};
</script>

<style lang="scss">
// 登录提示
.modal-box {
	width: 610rpx;
	border-radius: 20rpx;
	background: #fff;
	position: relative;
	left: 50%;
	transform: translateX(-50%);
	padding-bottom: 30rpx;

	.head-bg {
		width: 100%;
		height: 210rpx;
	}

	.detail {
		.title1 {
			color: #46351b;
			font-size: 35rpx;
			font-weight: bold;
		}

		.title2 {
			font-size: 28rpx;
			color: #999;
			padding-top: 20rpx;
		}
	}

	.btn-box {
		margin-top: 80rpx;

		.login-btn {
			width: 492rpx;
			height: 70rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
			border-radius: 35rpx;
			font-size: 28rpx;
			color: rgba(#fff, 0.9);
		}

		.close-btn {
			width: 492rpx;
			height: 70rpx;
			color: #e9b766;
			font-size: 26rpx;
			margin-top: 20rpx;
			background: none;
		}
	}
}

// 小程序登录提醒
/* #ifdef MP-WEIXIN */
.force-login-wrap {
	position: fixed;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	z-index: 11111;
	top: 0;
	background: linear-gradient(180deg, rgba(239, 196, 128, 1) 0%, rgba(248, 220, 165, 1) 25%, rgba(255, 255, 255, 1) 98%);
	.logo-bg {
		width: 640rpx;
		height: 300rpx;
	}
	.force-login__content {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		.user-avatar {
			width: 160rpx;
			height: 160rpx;
			border-radius: 50%;
			overflow: hidden;
			margin-bottom: 40rpx;
		}
		.user-name {
			font-size: 35rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(132, 87, 8, 1);
			margin-bottom: 30rpx;
		}
		.login-notice {
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(200, 150, 61, 1);
			line-height: 44rpx;
			width: 400rpx;
			text-align: center;
			margin-bottom: 80rpx;
		}
		.author-btn {
			width: 630rpx;
			height: 80rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
			border-radius: 40rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
		}
		.close-btn {
			width: 630rpx;
			height: 80rpx;
			margin-top: 30rpx;
			border-radius: 40rpx;
			border: 2rpx solid rgba(233, 180, 97, 1);
			background: none;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(233, 180, 97, 1);
		}
	}
}
/* #endif */
</style>
