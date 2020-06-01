<template>
	<view class="user-box">
		<view class="head_box">
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
		</view>
		<view class="content_box">
			<!-- 绑定手机 -->
			<view class="notice-box x-bc pad" v-if="!userInfo.mobile" @tap="jump('/pages/user/edit-phone', { fromType: 'bind' })">
				<view class="notice-detail one-t">点击绑定手机号，确保账户安全</view>
				<button class="bindPhone cu-btn">去绑定</button>
			</view>
			<!-- 绑定微信 -->
			<view class="notice-box x-bc pad" v-if="false" @tap="jump('/pages/user/edit-phone', { fromType: 'bind' })">
				<view class="notice-detail one-t">绑定微信用户！</view>
				<button class="bindPhone cu-btn">去绑定</button>
			</view>
			<!-- 订单卡片 -->
			<view class="order-wrap x-f">
				<view class="order-box x-f">
					<view class="order-item y-f" @tap="jump('/pages/order/list', { type: order.type })" v-for="order in orderNav" :key="order.id">
						<view class="y-f item-box">
							<image class="order-img" :src="order.img" mode=""></image>
							<text class="item-title">{{ order.title }}</text>
							<view class="cu-tag badge" v-if="orderNum[order.type]">{{ orderNum[order.type] }}</view>
						</view>
					</view>
				</view>
				<view class="order-item y-f all-order" @tap="jump('/pages/order/list', { type: 'all' })">
					<image class="cut-off--line" src="/static/imgs/user/cut_off_line.png" mode=""></image>
					<view class="y-f item-box">
						<image class="order-img" src="/static/imgs/user/all_order.png" mode="aspectFill"></image>
						<text class="item-title">全部订单</text>
						<!-- <view class="cu-tag badge" v-if="orderNum[order.type]">{{ orderNum[order.type] }}</view> -->
					</view>
				</view>
			</view>

			<!-- 钱包卡片 -->
			<view class="wallet-box x-f">
				<view class="x-f wallet-left">
					<view class="wallet-item y-f" @tap="jump('/pages/user/wallet/index')">
						<text class="wallet-item__detail item-balance">{{ userInfo.money || '0' }}</text>
						<text class="wallet-item__title">账户余额</text>
					</view>
					<view class="wallet-item y-f" @tap="jump('/pages/user/wallet/score-balance')">
						<text class="wallet-item__detail item-score">{{ userInfo.score || '0' }}</text>
						<text class="wallet-item__title">积分</text>
					</view>
					<view class="wallet-item y-f" @tap="jump('/pages/app/coupon/list')">
						<text class="wallet-item__detail item-coupon">{{ userInfo.coupons_num || '0' }}</text>
						<text class="wallet-item__title">优惠券</text>
					</view>
				</view>
				<view class="wallet-item y-f wallet-right" @tap="jump('/pages/user/wallet/index')">
					<image class="cut-off--line" src="/static/imgs/user/cut_off_line.png" mode=""></image>
					<image class="wallet-img" src="/static/imgs/user/wallet.png" mode="aspectFill"></image>
					<text class="wallet-item__title">我的钱包</text>
				</view>
			</view>
			<!-- 功能卡片 -->
			<view class="tools-box">
				<view class="tool-item y-f" @tap="jump(tool.url, tool.parmas)" v-for="tool in toolsNav" :key="tool.title">
					<image class="tool-img" :src="tool.img" mode=""></image>
					<text class="item-title">{{ tool.title }}</text>
				</view>
			</view>
		</view>
		<!-- 版本号 -->
		<view class="foot_box">
			<view class="copyright y-f" v-if="info">
				<view class="code1">{{ info.copyright[0] }}</view>
				<view class="code2">{{ info.copyright[1] }} {{ info.version }}</view>
			</view>
		</view>
		<!-- 广告弹窗 -->
		<shopro-popup-modal v-if="popupUser" :detail="popupUser"></shopro-popup-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
		<!-- 关注公众号 -->
		<sh-follow-wechat v-model="showFollowWechat"></sh-follow-wechat>
		<!-- 强制登录 -->
		<!-- #ifdef MP-WEIXIN -->
		<shopro-force-login></shopro-force-login>
		<!-- #endif -->
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import shoproForceLogin from '@/components/modal/shopro-force-login.vue';
// #endif
import Wechat from '@/common/wechat/wechat';
import shoproGoods from '@/components/goods/shopro-goods.vue';
import shoproPopupModal from '@/components/modal/shopro-popup-modal.vue';
import shFollowWechat from './user/children/sh-follow-wechat.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {
		shFollowWechat,
		shoproGoods,
		shoproPopupModal,
		// #ifdef MP-WEIXIN
		shoproForceLogin
		// #endif
	},
	data() {
		return {
			platform: uni.getStorageSync('platform'), //当前平台。
			isRefresh: false, //更新
			showFollowWechat: false, //绑定公众号
			orderScrollLeft: 0, //订单卡片滑动。
			orderNav: [
				{
					id: 1,
					title: '待付款',
					img: 'http://shopro.7wpp.com/imgs/user/tab11.png',
					type: 'nopay'
				},
				// {
				// 	id: 2,
				// 	title: '待发货',
				// 	img: 'http://shopro.7wpp.com/imgs/user/tab22.png',
				// 	type: 'nosend'
				// },
				{
					id: 3,
					title: '待收货',
					img: 'http://shopro.7wpp.com/imgs/user/tab33.png',
					type: 'noget'
				},
				{
					id: 4,
					title: '待评价',
					img: 'http://shopro.7wpp.com/imgs/user/tab44.png',
					type: 'nocomment'
				},
				{
					id: 5,
					title: '退换货',
					img: 'http://shopro.7wpp.com/imgs/user/tab55.png',
					type: 'aftersale'
				}
			],
			toolsNav: [
				{
					title: '商品收藏',
					img: 'http://shopro.7wpp.com/imgs/user/list1.png',
					url: '/pages/user/favorite'
				},
				{
					title: '浏览足迹',
					img: 'http://shopro.7wpp.com/imgs/user/user_log.png',
					url: '/pages/user/log'
				},

				{
					title: '常见问题',
					img: 'http://shopro.7wpp.com/imgs/user/list7.png',
					url: '/pages/public/faq'
				},
				{
					title: '邀请好友',
					img: 'http://shopro.7wpp.com/imgs/user/list11.png',
					url: '/pages/public/poster/index',
					parmas: { posterType: 'user' }
				},
				{
					title: '积分商城',
					img: 'http://shopro.7wpp.com/imgs/user/list12.png',
					url: '/pages/app/score/list'
				},
				{
					title: '我的拼团',
					img: 'http://shopro.7wpp.com/imgs/user/list5.png',
					url: '/pages/activity/groupon/my-groupon'
				},
				{
					title: '系统设置',
					img: 'http://shopro.7wpp.com/imgs/user/list8.png',
					url: '/pages/user/set'
				}
			]
		};
	},
	computed: {
		...mapState({
			initData: state => state.init.initData, //初始化数据
			userInfo: state => state.user.userInfo,
			orderNum: state => state.user.orderNum,
			cartNum: state => state.cart.cartNum,
			forceOauth: state => state.user.forceOauth
		}),
		info() {
			if (this.initData) {
				return this.initData.info;
			}
		},
		popupUser() {
			if (this.initData.popup) {
				return this.initData.popup.content.user;
			}
		}
	},
	onLoad() {},
	onShow() {
		this.$store.commit('CART_NUM');
		this.getUserInfo();
		this.getOrderNum();
	},
	methods: {
		...mapActions(['getUserInfo', 'getOrderNum']),
		jump(path, query) {
			this.$Router.push({
				path: path,
				query: query
			});
		},
		// 更新信息
		onRefresh() {
			const that = this;
			that.isRefresh = true;
			setTimeout(() => {
				that.isRefresh = false;
			}, 200);
		},
		refreshWechatUser(e) {
			this.onRefresh();
			if (this.platform === 'wxOfficialAccount') {
				let wechat = new Wechat();
				wechat.login();
			} else if (this.platform === 'wxMiniProgram') {
				this.$store.commit('FORCE_OAUTH', true);
			}
			// console.log('getuserinfo', e);
		}
	}
};
</script>

<style lang="scss">
.user-box {
	overflow-x: hidden;
}
// 微信登录蒙层
.login-box {
	position: fixed;
	z-index: 9999;
	width: 100%;
	height: 100%;
	background: none;
}

.head_box {
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

// 订单卡片
.order-wrap {
	height: 180rpx;
	background: #fff;
	margin-bottom: 20rpx;
	.order-box {
		flex: 4;
	}
	.all-order {
		position: relative;
		.cut-off--line {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: (750rpx/5) - 15rpx;
			width: 30rpx;
			height: 136rpx;
		}
	}
	.order-item {
		flex: 1;
		.item-box {
			position: relative;
		}
		.order-img {
			width: 46rpx;
			height: 46rpx;
			// background: #ccc;
		}

		.item-title {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			line-height: 24rpx;
			padding-top: 10rpx;
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
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(204, 149, 59, 1);
	}

	.bindPhone {
		width: 135rpx;
		height: 52rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border-radius: 26rpx;
		padding: 0;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
}

// 钱包卡片
.wallet-box {
	background: #fff;
	height: 180rpx;
	margin-bottom: 20rpx;
	position: relative;
	.wallet-left {
		flex: 4;
	}
	.wallet-right {
		position: relative;
		.cut-off--line {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: (750rpx/5) - 15rpx;
			width: 30rpx;
			height: 136rpx;
		}
	}
	.wallet-item {
		flex: 1;
		.wallet-img {
			width: 46rpx;
			height: 46rpx;
		}
		.wallet-item__detail {
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(168, 112, 13, 1);
		}
		.wallet-item__title {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			margin-top: 20rpx;
		}
		.item-balance::after {
			content: '元';
			font-size: 16rpx;
			margin-left: 4rpx;
		}
		.item-score::after {
			content: '个';
			font-size: 14rpx;
			margin-left: 4rpx;
		}
		.item-coupon::after {
			content: '张';
			font-size: 16rpx;
			margin-left: 4rpx;
		}
	}
}
.tools-box {
	background: #fff;
	display: flex;
	flex-wrap: wrap;
	padding-bottom: 40rpx;
	margin-bottom: 20rpx;

	.tool-item {
		width: (750rpx/4);
		padding-top: 40rpx;

		.tool-img {
			width: 44rpx;
			height: 44rpx;
			// background: #ccc;
		}

		.item-title {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			line-height: 24rpx;
			padding-top: 30rpx;
		}
	}
}

.foot_box {
	margin-top: 200rpx;
	padding-bottom: var(--window-bottom);
	margin-bottom: 50rpx;
}
.copyright {
	color: #999;
	.code1 {
		font-size: 24rpx;
	}

	.code2 {
		font-size: 20rpx;
		margin-top: 10rpx;
	}
}
</style>
