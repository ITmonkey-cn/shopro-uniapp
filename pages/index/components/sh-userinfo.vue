<template>
	<view class="sh-userinfo-box">
		<image class="user-bg" src="http://shopro.7wpp.com/imgs/user/user_bg.png" mode=""></image>
		<view class="head-wrap pad">
			<view class="titleNav ">
				<view class="status-bar"></view>
				<text class="nav-title x-f">我的</text>
			</view>
			<view class="user-head x-bc">
				<view class="x-f">
					<!-- 微信小程序 -->
					<view class="info-box">
						<view class="x-f">
							<view class="head-img-wrap">
								<image class="head-img" @tap.stop="jump('/pages/user/info')" :src="userInfo.avatar || '/static/imgs/base_avatar.png'" mode="aspectFill"></image>
								<block v-if="platform !== 'H5'">
									<button v-if="platform === 'wxMiniProgram'" open-type="getUserInfo" @getuserinfo="refreshWechatUser" class="cu-btn refresh-btn x-c">
										<text class="cuIcon-refresh" :class="{ 'refresh-rotate': isRefresh }"></text>
									</button>
									<button v-if="platform === 'wxOfficialAccount'" @tap="refreshWechatUser" class="cu-btn refresh-btn x-c">
										<text class="cuIcon-refresh" :class="{ 'refresh-rotate': isRefresh }"></text>
									</button>
								</block>
							</view>
							<text @tap.stop="jump('/pages/user/info')" class="user-name one-t">{{ userInfo.nickname || '请登录~' }}</text>
						</view>
					</view>
					<view class="grade-tag tag-box x-f" v-if="userInfo.group">
						<image class="tag-img" :src="userInfo.group.image" mode=""></image>
						<text class="tag-title">{{ userInfo.group.name }}</text>
					</view>
				</view>
				<button class="cu-btn code-btn" v-if="userInfo.avatar" @tap="jump('/pages/public/poster/index', { posterType: 'user' })">
					<text class="cuIcon-qr_code"></text>
				</button>
			</view>
		</view>
		<!-- 绑定手机 -->
		<view class="notice-box x-bc pad" v-if="!userInfo.mobile && userInfo.nickname" @tap="jump('/pages/user/edit-phone', { fromType: 'bind' })">
			<view class="notice-detail one-t">点击绑定手机号，确保账户安全</view>
			<button class="bindPhone cu-btn">去绑定</button>
		</view>
		<!-- 绑定微信 -->
		<view class="notice-box x-bc pad" v-if="false" @tap="jump('/pages/user/edit-phone', { fromType: 'bind' })">
			<view class="notice-detail one-t">绑定微信用户！</view>
			<button class="bindPhone cu-btn">去绑定</button>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			platform: uni.getStorageSync('platform') //当前平台。
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},
	methods: {
		jump(path, query) {
			this.$Router.push({
				path: path,
				query: query
			});
		}
	}
};
</script>

<style lang="scss">
.sh-userinfo-box {
	position: relative;
	height: 320rpx;
	.user-bg {
		width: 100%;
		height: 320rpx;
	}
	.head-wrap {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		z-index: 9;
		top: 0;
		.nav-title {
			font-size: 38rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}
		.status-bar {
			// #ifndef H5
			height: var(--status-bar-height);
			// #endif
			// #ifdef H5
			height: 50rpx;
			// #endif
			width: 750rpx;
		}
	}

	.user-head {
		padding-top: 50rpx;
		.info-box {
			// padding: 0 20rpx;
			.head-img-wrap {
				position: relative;
				.refresh-btn {
					position: absolute;
					padding: 0;
					background: none;
					width: 34rpx;
					height: 34rpx;
					border-radius: 50%;
					background: #c9912c;
					top: 0;
					right: 20rpx;
					.cuIcon-refresh {
						color: #fff;
						font-size: 24rpx;
					}
					.refresh-rotate {
						transform: rotate(360deg);
						transition: all 0.2s;
					}
				}
			}
			.head-img {
				width: 94rpx;
				height: 94rpx;
				border-radius: 50%;
				background: #ccc;
				margin-right: 25rpx;
				overflow: hidden;
			}

			.user-name {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				line-height: 30rpx;
				width: 150rpx;
			}
		}
		.tag-box {
			background: rgba(0, 0, 0, 0.2);
			border-radius: 21rpx;
			line-height: 38rpx;
			padding-right: 10rpx;
			margin-left: 10rpx;
			.cuIcon-refresh {
				color: #fff;
				margin: 0 10rpx;
			}
			.tag-img {
				width: 40rpx;
				height: 40rpx;
				margin-right: 6rpx;
				border-radius: 50%;
			}

			.tag-title {
				font-size: 20rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				line-height: 20rpx;
			}
		}
		.code-btn {
			background: none;
			.cuIcon-qr_code {
				font-size: 50rpx;
			}
		}
	}
	.wallet {
		font-size: 20rpx;
		padding-left: 140rpx;
		.money {
			margin-right: 40rpx;
		}
	}
}
</style>
