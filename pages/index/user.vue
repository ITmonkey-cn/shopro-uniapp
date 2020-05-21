<template>
	<view class="user-box">
		<!-- #ifdef MP-WEIXIN -->
		<button v-if="auth" open-type="getUserInfo" @getuserinfo="getuserinfo" class="login-box"></button>
		<!-- #endif -->
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
						<view class="info-box" @tap="jump('/pages/user/info')">
							<view class="x-f">
								<image class="head-img" :src="userInfo.avatar || '/static/imgs/base_avatar.png'" mode=""></image>
								<text class="user-name one-t">{{ userInfo.nickname || '请登录~' }}</text>
							</view>
						</view>
						<view class="grade-tag tag-box x-f" v-if="userInfo.group">
							<image class="tag-img" :src="userInfo.group.image" mode=""></image>
							<text class="tag-title">{{ userInfo.group.name }}</text>
						</view>
					</view>
					<button class="cu-btn code-btn" v-if="userInfo.avatar" @tap="jump('/pages/user/poster')"><text class="cuIcon-qr_code"></text></button>
				</view>
				<view class="wallet x-f" v-if="userInfo.avatar">
					<view class="money" @tap="jump('/pages/money/index')">
						<text class="tag-title">余额 {{ userInfo.money }}</text>
					</view>
					<view class="score" @tap="jump('/pages/score/index')">
						<text class="tag-title">积分 {{ userInfo.score }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="content_box">
			<scroll-view class="scroll-box" scroll-y="true">
				<view class="order-head x-bc">
					<text class="order-head-title">我的订单</text>
					<view class="x-f all-order" @tap="jump('/pages/order/list', { type: 'all' })">
						<text>全部订单</text>
						<text class="cuIcon-right"></text>
					</view>
				</view>
				<view class="order-box x-f">
					<view class="order-item y-f" @tap="jump('/pages/order/list', { type: order.type })" v-for="order in orderNav" :key="order.id">
						<view class="y-f item-box">
							<image class="order-img" :src="order.img" mode=""></image>
							<text class="item-title">{{ order.title }}</text>
							<view class="cu-tag badge" v-if="orderNum[order.type]">{{ orderNum[order.type] }}</view>
						</view>
					</view>
				</view>
				<!-- <view class="notice-box x-bc pad" @tap="jump('/pages/public/msg/index')">
					<view class="x-f">
						<view class="type-title">公告</view>
						<view class="notice-detail one-t">温馨提示，您有一张优惠券过期！</view>
					</view>
					<text class="cuIcon-right"></text>
				</view> -->
				<view class="tools-box">
					<view class="tool-item y-f" @tap="jump(tool.url)" v-for="tool in toolsNav" :key="tool.title">
						<image class="tool-img" :src="tool.img" mode=""></image>
						<text class="item-title">{{ tool.title }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="foot_box">
			<view class="copyright y-f" v-if="info">
				<view class="code1">{{ info.copyright[0] }}</view>
				<view class="code2">{{ info.copyright[1] }} {{ info.version }}</view>
			</view>
		</view>
		<shopro-popup-modal v-if="popupUser" :detail="popupUser"></shopro-popup-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import shoproGoods from '@/components/goods/shopro-goods.vue';
import shoproPopupModal from '@/components/modal/shopro-popup-modal.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {
		shoproGoods,
		shoproPopupModal
	},
	data() {
		return {
			StatusBar: this.StatusBar,
			CustomBar: this.CustomBar,
			platform: uni.getStorageSync('platform'), //系统平台
			orderNav: [
				{
					id: 1,
					title: '待付款',
					img: 'http://shopro.7wpp.com/imgs/user/tab11.png',
					type: 'nopay'
				},
				{
					id: 2,
					title: '待发货',
					img: 'http://shopro.7wpp.com/imgs/user/tab22.png',
					type: 'nosend'
				},
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
					title: '积分余额',
					img: 'http://shopro.7wpp.com/imgs/user/list2.png',
					url: '/pages/score/index'
				},
				{
					title: '我的钱包',
					img: 'http://shopro.7wpp.com/imgs/user/list3.png',
					url: '/pages/money/index'
				},
				{
					title: '优惠券',
					img: 'http://shopro.7wpp.com/imgs/user/list4.png',
					url: '/pages/coupons/index'
				},
				{
					title: '我的拼团',
					img: 'http://shopro.7wpp.com/imgs/user/list5.png',
					url: '/pages/user/group/index'
				},
				// {
				// 	title: '联系客服',
				// 	img: 'http://shopro.7wpp.com/imgs/user/list6.png',
				// 	url: ''
				// },
				{
					title: '常见问题',
					img: 'http://shopro.7wpp.com/imgs/user/list7.png',
					url: '/pages/public/problems'
				},

				// {
				// 	title: '业绩明细',
				// 	img: 'http://shopro.7wpp.com/imgs/user/list9.png',
				// 	url: '/pages/user/performance'
				// },
				// {
				// 	title: '余额互转',
				// 	img: 'http://shopro.7wpp.com/imgs/user/list10.png',
				// 	url: '/pages/money/turn'
				// },
				{
					title: '邀请好友',
					img: 'http://shopro.7wpp.com/imgs/user/list11.png',
					url: '/pages/user/poster'
				},
				{
					title: '积分商城',
					img: 'http://shopro.7wpp.com/imgs/user/list12.png',
					url: '/pages/score/score-shop'
				},
				{
					title: '浏览足迹',
					img: 'http://shopro.7wpp.com/imgs/user/user_log.png',
					url: '/pages/user/log'
				},
				{
					title: '系统设置',
					img: 'http://shopro.7wpp.com/imgs/user/list8.png',
					url: '/pages/user/set'
				}
			],
			auth: false
		};
	},
	computed: {
		...mapState({
			initData: state => state.init.initData, //初始化数据
			userInfo: state => state.user.userInfo,
			orderNum: state => state.user.orderNum,
			cartNum: state => state.cart.cartNum
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
	onLoad() {
		this.getUserInfo();
	},
	onShow() {
		this.$store.commit('CART_NUM');
		this.getOrderNum();
	},
	methods: {
		...mapActions(['getUserInfo', 'getOrderNum']),
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
			padding: 0 20rpx;

			.head-img {
				width: 88rpx;
				height: 88rpx;
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

.order-head {
	height: 100rpx;
	background: #fff;
	padding: 0 20rpx;

	.order-head-title {
		font-size: 30rpx;
		font-weight: bold;
	}

	.all-order {
		font-size: 26rpx;
		color: #999;
	}
}

.order-box {
	height: 150rpx;
	background: #fff;
	border-bottom: 1rpx solid rgba(#dcdcdc, 0.6);

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

.notice-box {
	height: 75rpx;
	margin-bottom: 20rpx;
	background: #fff;

	.type-title {
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(168, 112, 13, 1);
		line-height: 38rpx;
		border: 1rpx solid rgba(168, 112, 13, 1);
		border-radius: 6rpx;
		width: 70rpx;
		text-align: center;
		margin-right: 20rpx;
	}

	.notice-detail {
		width: 550rpx;
		font-size: 22rpx;
	}

	.cuIcon-right {
		font-size: 28rpx;
		color: rgba(153, 153, 153, 1);
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
