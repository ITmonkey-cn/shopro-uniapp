<template>
	<view>
		<view class="sh-userinfo-box">
			<view class="head-wrap" :style="{ background: detail.image ? `url(${detail.image}) no-repeat center / 100% 100%` : detail.color }">
				<!-- 标题栏 -->
				<u-navbar backIconName="" :isFixed="isFixed" :borderBottom="isFixed" :background="navBackground" :backTextStyle="navbackTextStyle" backText="我的">
					<view slot="right" class="u-flex u-row-center u-col-center u-m-r-20" v-if="userData.is_store" @tap="goStore">
						<button class="u-reset-button merchant-btn">切换商家版</button>
					</view>
				</u-navbar>
				<view class="user-head u-flex u-row-between">
					<view class="u-flex">
						<!-- 个人信息 -->
						<view class="info-box">
							<view class="u-flex" @tap="$Router.push('/pages/user/info')">
								<view class="head-img-wrap">
									<image class="head-img" :src="userInfo.avatar || $IMG_URL + '/imgs/base_avatar.png'" mode="aspectFill"></image>
									<!-- 同步信息 -->
									<block v-if="showRefresh">
										<button @tap.stop="showModal = true" class="u-reset-button u-flex u-row-center u-col-center refresh-btn">
											<u-icon name="reload" size="24" color="#fff"></u-icon>
										</button>
									</block>
								</view>
								<text class="user-name u-ellipsis-1">{{ userInfo.nickname || '请登录~' }}</text>
							</view>
						</view>
						<!-- 等级 -->
						<view v-if="userInfo.group" class="grade-tag tag-box u-flex">
							<image v-if="userInfo.group.image" class="tag-img" :src="userInfo.group.image" mode=""></image>
							<text class="tag-title">{{ userInfo.group.name }}</text>
						</view>
					</view>
					<view class="u-flex" v-if="userInfo.nickname">
						<button class=" u-reset-button code-btn" @tap="onShare"><text class="iconfont iconqrcode"></text></button>
					</view>
				</view>
			</view>
		</view>
		<!-- 绑定手机 -->
		<view class="notice-box u-flex u-row-between u-p-30" v-if="userInfo.verification && !userInfo.verification.mobile" @tap="bindMobile">
			<view class="notice-detail">点击绑定手机号，确保账户安全</view>
			<button class="u-reset-button bindPhone">去绑定</button>
		</view>
		<!-- modal -->
		<u-modal
			ref="uModal"
			v-model="showModal"
			:show-cancel-button="true"
			confirm-color="#e9b461"
			cancel-color="#666666"
			@confirm="refreshWechatUser"
			confirm-text="确定"
			cancel-text="取消"
			content="更新微信信息？"
			title="提示"
		></u-modal>
	</view>
</template>

<script>
/**
 * 自定义之个人信息
 * @property {Object} detail - 个人信息
 */
import { mapMutations, mapActions, mapState } from 'vuex';
import wechat from '@/shopro/wechat/wechat';
export default {
	components: {},
	data() {
		return {
			showModal: false,
			platform: this.$platform.get(), //当前平台。
			isFixed: false,
			navBackground: {
				background: 'none'
			},
			navbackTextStyle: {
				color: '#fff',
				fontSize: '40rpx',
				fontWeight: '500'
			}
		};
	},
	mounted() {},
	props: {
		detail: {},
		scrollTop: {
			type: Number,
			default: 0
		}
	},
	watch: {
		scrollTop(val) {
			let backgroundText = this.detail.image ? `url(${this.detail.image})` : this.detail.color;
			this.isFixed = val > 50 ? true : false;
			this.navBackground.background = val > 50 ? backgroundText : 'none';
		}
	},
	computed: {
		...mapState({
			userInfo: ({ user }) => user.userInfo,
			isLogin: ({ user }) => user.isLogin,
			userData: ({ user }) => user.userData
		}),
		showRefresh() {
			if (this.isLogin) {
				if (this.platform === 'wxOfficialAccount') {
					return this.userInfo.verification.wxOfficialAccount;
				}
				if (this.platform === 'wxMiniProgram') {
					return this.userInfo.verification.wxMiniProgram;
				}
				if (this.platform === 'App') {
					return this.userInfo.verification.wxOpenPlatform;
				}
			}
			return false;
		}
	},
	methods: {
		...mapActions(['getUserInfo', 'showAuthModal']),
		jump(path, query) {
			this.$Router.push({
				path: path,
				query: query
			});
		},
		// 点击分享
		onShare() {
			this.$emit('onShare');
		},
		// 同步用户信息
		async refreshWechatUser() {
			let token = await wechat.refresh();
			if (token) {
				this.getUserInfo(token);
			}
		},
		// 跳转门店
		goStore() {
			if (this.userData.store_id) {
				uni.setStorageSync('storeId', this.userData.store_id);
				this.jump('/pages/app/merchant/index', { storeId: this.userData.store_id });
			} else {
				if (uni.getStorageSync('storeId')) {
					this.jump('/pages/app/merchant/index');
				} else {
					this.jump('/pages/app/merchant/list');
				}
			}
			//  #ifdef MP-WEIXIN
			this.$store.dispatch('getMessageIds', 'store');
			//  #endif
		},
		// 绑定手机号
		bindMobile() {
			this.showAuthModal('bindMobile');
		}
	}
};
</script>

<style lang="scss">
.sh-userinfo-box {
	position: relative;
	height: calc(var(--status-bar-height) + 300rpx);
	.head-wrap {
		powidth: 100%;
		height: 100%;
		.merchant-btn {
			width: 178rpx;
			height: 64rpx;
			line-height: 64rpx;
			background: #ffffff;
			border-radius: 32rpx;
			font-size: 26rpx;
			font-weight: 500;
			color: #a8700d;
		}
	}

	.user-head {
		width: 100%;
		padding-top: 30rpx;
		.info-box {
			padding-left: 30rpx;
			.head-img-wrap {
				position: relative;
				.refresh-btn {
					position: absolute;
					padding: 0;
					background: none;
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					background: #c9912c;
					top: -10rpx;
					right: 10rpx;
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

				font-weight: 500;
				color: #fff;
				line-height: 30rpx;
				width: 180rpx;
			}
		}
		.tag-box {
			background: rgba(0, 0, 0, 0.2);
			border-radius: 22rpx;
			margin-left: 10rpx;
			.tag-img {
				width: 40rpx;
				height: 40rpx;
				display: inline-block;
				border-radius: 50%;
			}
			.tag-title {
				font-size: 20rpx;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				line-height: 40rpx;
				padding: 0 10rpx;
			}
		}
		.code-btn {
			padding: 30rpx;
			.iconqrcode {
				font-size: 50rpx;
				color: #fff;
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
// 绑定微信公众号
.notice-box {
	width: 750rpx;
	height: 70rpx;
	background: rgba(253, 239, 216, 1);
	padding: 0 35rpx;

	.notice-detail {
		font-size: 24rpx;

		font-weight: 400;
		color: rgba(204, 149, 59, 1);
	}

	.bindPhone {
		width: 135rpx;
		line-height: 52rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border-radius: 26rpx;
		padding: 0;
		font-size: 26rpx;

		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
}
</style>
