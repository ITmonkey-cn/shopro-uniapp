<template>
	<view class="page_box shopro-selector">
		<!-- 导航栏 -->
		<view class="head_box " :style="{ background: bgcolor }" :class="{ active: bgcolor }">
			<cu-custom :isBack="true" v-if="info.name">
				<block slot="backText">
					<text class="nav-title shopro-selector-rect">{{ info.name || '商城' }}</text>
				</block>
			</cu-custom>
		</view>
		<view class="content_box " style="margin-top: -4rpx;">
			<scroll-view class="scroll-box" scroll-y="true" scroll-with-animation enable-back-to-top>
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
					<!-- 富文本 -->
					<sh-richtext v-if="item.type === 'rich-text'" :detail="item.content"></sh-richtext>
					<!-- 功能列表 -->
					<sh-nav v-if="item.type === 'nav'" :detail="item.content"></sh-nav>
					<!-- 九宫格列表 -->
					<sh-grid v-if="item.type === 'grid-list'" :detail="item.content"></sh-grid>
					<!-- 功能标题 -->
					<sh-title-card v-if="item.type === 'title-block'" :detail="item.content"></sh-title-card>
					<!-- 个人信息 -->
					<sh-userinfo v-if="item.type === 'user'" :detail="item.content"></sh-userinfo>
					<!-- 钱包 -->
					<sh-wallet v-if="item.type === 'wallet-card'" :detail="item.content"></sh-wallet>
					<!-- 订单卡片 -->
					<sh-order v-if="item.type === 'order-card'" :detail="item.content"></sh-order>
					<!-- 直播 -->
					<!-- #ifdef MP-WEIXIN -->
					<sh-live v-if="item.type === 'live' && HAS_LIVE" :detail="item.content"></sh-live>
					<!-- #endif -->
				</block>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
		<!-- 骨架屏 -->
		<shopro-skeleton :showSkeleton="!template.length"></shopro-skeleton>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
		<!-- 强制登录 -->
		<!-- #ifdef MP-WEIXIN -->
		<sh-force-login></sh-force-login>
		<!-- #endif -->
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
	</view>
</template>

<script>
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
import shGrid from './components/sh-grid.vue';
import shTitleCard from './components/sh-title-card.vue';
import shOrder from './components/sh-order.vue';
import shWallet from './components/sh-wallet.vue';

import shoproNoticeModal from '@/components/shopro-notice-modal/shopro-notice-modal.vue';
import shoproSkeletons from '@/components/shopro-skeletons/shopro-skeletons.vue';
// #ifdef MP-WEIXIN
import { HAS_LIVE } from '@/env';
import shLive from './components/sh-live.vue';
import shForceLogin from './components/sh-force-login.vue';
// #endif
import { mapMutations, mapActions, mapState } from 'vuex';

// #ifdef H5
import html2canvas from '@/common/utils/sdk/html2canvas.js';
// #endif

export default {
	components: {
		shSearch,
		shBanner,
		shUserinfo,
		shHotGoods,
		shTitleCard,
		shOrder,
		shWallet,
		shMenu,
		shAdv,
		shGrid,
		shCoupon,
		shSeckill,
		shGroupon,
		shRichtext,
		shNav,
		shoproNoticeModal,
		shoproSkeletons,
		// #ifdef MP-WEIXIN
		shLive,
		shForceLogin
		// #endif
	},
	data() {
		return {
			bgcolor: '',
			// #ifdef MP-WEIXIN
			HAS_LIVE: HAS_LIVE
			// #endif
		};
	},
	computed: {
		...mapState({
			initData: state => state.init.initData,
			template: state => state.init.templateData.home,
			cartNum: state => state.cart.cartNum,
			forceOauth: state => state.user.forceOauth
		}),
		popupIndex() {
			if (this.initData.popup) {
				return this.initData.popup.content.index;
			}
		},
		info() {
			if (this.initData.info) {
				return this.initData.info;
			}
		}
	},
	onLoad() {
		// 预览模式截图
		// #ifdef H5
		if (uni.getStorageSync('mode') == 'preview') {
			console.log("h5 preview")
			window.addEventListener('message', function (e) {
				console.log("h5", e)
				if (e.data.type == 'screenshot') {
					let div = window.window.document.getElementsByClassName("page_box");
					console.log("h5 div", div)
					html2canvas(div[0], {
						x: 0,
		                y: 0,
						scrollX: 0,
						scrollY: 0,
		                foreignObjectRendering: true,
		                allowTaint: false,
		                taintTest: true,
		                scale: 1,
						width: div[0].offsetWidth,
						height: div[0].offsetHeight,
		                useCORS: true,	//保证跨域图片的显示，如果为不添加改属性，或者值为false, 跨域的图片显示灰背景
					}).then((canvas) => {
						var screenShotBase64 = canvas.toDataURL();
						console.log("h5 dataUrl", screenShotBase64)
						window.parent.postMessage({
							type: 'screeshot',
							data: screenShotBase64
						}, '*');
					})
				}
			});
		}
		// #endif
	},
	mounted() {},
	onShow() {
		this.$store.commit('CART_NUM', this.cartNum);
		// #ifndef MP-WEIXIN
		if (this.info && this.info.name) {
			uni.setNavigationBarTitle({
				title: this.info.name
			});
		}
		// #endif
	},
	methods: {
		...mapMutations(['CART_NUM']),
		init() {
			return Promise.all([]);
		},
		getbgcolor(e) {
			this.bgcolor = e;
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
// 标题搜索栏
.active {
	transition: all linear 0.3s;
}
.head_box {
	width: 750rpx;
	// background: #fff;
	transition: all linear 0.3s;
	/deep/.cuIcon-back {
		display: none;
	}

	.nav-title {
		font-size: 38rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #fff;
	}
}
</style>
