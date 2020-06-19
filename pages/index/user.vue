<template>
	<view class="user-box">
		<!-- 上拉显示的标题栏 -->
		<view :class="scrollTop < 50 ? 'transtion-head' : 'transtion-head--active'">
			<cu-custom><text slot="content" style="font-weight: bold;font-size: 34rpx;">我的</text></cu-custom>
		</view>

		<block v-if="template.length" v-for="(item, index) in template" :key="index">
			<!-- 搜索 -->
			<sh-search v-if="item.type === 'search'" :detail="item" :bgcolor="bgcolor"></sh-search>
			<!-- 轮播 -->
			<sh-banner v-if="item.type === 'banner'" :detail="item.content" @getbgcolor="getbgcolor"></sh-banner>
			<!-- 菜单 -->
			<sh-menu v-if="item.type === 'menu'" :detail="item.content" :menu="item.content.style" :imgW="94"></sh-menu>
			<!-- 推荐商品 -->
			<sh-hot-goods v-if="item.type === 'goods-list' || item.type === 'goods-group'" :detail="item.content"></sh-hot-goods>
			<!-- 广告魔方 -->
			<sh-adv v-if="item.type === 'adv'" :detail="item.content"></sh-adv>
			<!-- 优惠券 -->
			<sh-coupon v-if="item.type === 'coupons'" :detail="item.content"></sh-coupon>
			<!-- 秒杀 -->
			<sh-seckill v-if="item.type === 'seckill'" :detail="item.content"></sh-seckill>
			<!-- 拼团 -->
			<sh-groupon v-if="item.type === 'groupon'" :detail="item.content"></sh-groupon>
			<!-- 个人信息 -->
			<sh-userinfo v-if="item.type === 'user'" :detail="item.content"></sh-userinfo>
			<!-- 订单卡片 -->
			<sh-order v-if="item.type === 'order-card'" :detail="item.content"></sh-order>
			<!-- 功能列表 -->
			<sh-nav v-if="item.type === 'nav'" :detail="item.content"></sh-nav>
			<!-- 钱包 -->
			<sh-wallet v-if="item.type === 'wallet-card'" :detail="item.content"></sh-wallet>
			<!-- 九宫格列表 -->
			<sh-grid v-if="item.type === 'grid-list'" :detail="item.content"></sh-grid>
			<!-- 富文本 -->
			<sh-richtext v-if="item.type === 'rich-text'" :detail="item.content"></sh-richtext>
			<!-- 功能标题 -->
			<sh-title-card v-if="item.type === 'title-block'" :detail="item.content"></sh-title-card>
			<!-- 直播 -->
			<!-- #ifdef MP-WEIXIN -->
			<sh-live v-if="item.type === 'live' && HAS_LIVE" :detail="item.content"></sh-live>
			<!-- #endif -->
		</block>
		<!-- 版本号 -->
		<view class="foot_box">
			<view class="copyright y-f" v-if="info">
				<view class="code1">{{ info.copyright[0] }}</view>
				<view class="code2">{{ info.copyright[1] }} {{ info.version }}</view>
			</view>
		</view>
		<shopro-tabbar></shopro-tabbar>
		<!-- 广告弹窗 -->
		<shopro-notice-modal v-if="popupUser" :detail="popupUser"></shopro-notice-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
		<!-- 关注公众号 -->
		<shopro-float-btn v-model="showFollowWechat"></shopro-float-btn>
		<!-- 强制登录 -->
		<!-- #ifdef MP-WEIXIN -->
		<sh-force-login></sh-force-login>
		<!-- #endif -->
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import shForceLogin from './components/sh-force-login.vue';
// #endif
import Wechat from '@/common/wechat/wechat';

import shSearch from './components/sh-search.vue';
import shBanner from './components/sh-banner.vue';
import shHotGoods from './components/sh-hot-goods.vue';
import shMenu from './components/sh-menu.vue';
import shAdv from './components/sh-adv.vue';
import shCoupon from './components/sh-coupon.vue';
import shSeckill from './components/sh-seckill.vue';
import shGroupon from './components/sh-groupon.vue';
import shRichtext from './components/sh-richtext.vue';
import shNav from './components/sh-nav.vue';
import shUserinfo from './components/sh-userinfo.vue';
import shOrder from './components/sh-order.vue';
import shWallet from './components/sh-wallet.vue';
import shGrid from './components/sh-grid.vue'
import shTitleCard from './components/sh-title-card.vue'

import shoproNoticeModal from '@/components/shopro-notice-modal/shopro-notice-modal.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {
		shSearch,
		shBanner,
		shHotGoods,
		shMenu,
		shAdv,
		shCoupon,
		shSeckill,
		shGroupon,
		shRichtext,
		shNav,
		shUserinfo,
		shOrder,
		shWallet,
		shGrid,
		shTitleCard,
		shoproNoticeModal,
		// #ifdef MP-WEIXIN
		shForceLogin
		// #endif
	},
	data() {
		return {
			platform: uni.getStorageSync('platform'), //当前平台。
			isRefresh: false, //更新
			showFollowWechat: true, //绑定公众号
			orderScrollLeft: 0, //订单卡片滑动。
			scrollTop: 0, //页面滚动距离
			bgcolor: '',
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
			template: state => state.init.templateData.user, //模板数据
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
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
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
		},
		getbgcolor(e) {
			this.bgcolor = e;
		}
	}
};
</script>

<style lang="scss">
.user-box {
	overflow-x: hidden;
	position: relative;
}
// 微信登录蒙层
.login-box {
	position: fixed;
	z-index: 9999;
	width: 100%;
	height: 100%;
	background: none;
}

// 顶部
.transtion-head {
	height: 120rpx;
	background: #fff;
	width: 100%;
	position: fixed;
	top: 0;
	z-index: 99;
	transition: all 0.2s linear;
	transform: translateY(-120rpx);
	border-bottom: 1rpx solid #f2f2f2;
}
.transtion-head--active {
	height: 120rpx;
	background: #fff;
	width: 100%;
	position: fixed;
	top: 0;
	z-index: 99;
	transition: all 0.2s linear;
	transform: translateY(0rpx);
	border-bottom: 1rpx solid #f2f2f2;
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

.foot_box {
	padding-top: 200rpx;
	padding-bottom: calc(var(--window-bottom) + 30px);
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
