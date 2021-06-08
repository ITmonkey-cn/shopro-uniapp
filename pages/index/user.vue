<!-- 个人中心 -->
<template>
	<view class="personal-wrap">
		<!-- 个人信息卡片 -->
		<userinfo-card :scrollTop="scrollTop" :detail="userHeadData" @onShare="onShare"></userinfo-card>

		<!-- 自定义模块 -->
		<view v-for="(item, index) in userTemplate" :key="item.id">
			<!-- 轮播 -->
			<sh-banner
				v-if="item.type === 'banner' && index !== 0"
				:Px="item.content.x"
				:Py="item.content.y"
				:borderRadius="item.content.radius"
				:height="item.content.height"
				:list="item.content.list"
			></sh-banner>

			<!-- 搜索 -->
			<sh-search v-if="item.type === 'search'"></sh-search>

			<!-- 滑动宫格 -->
			<sh-grid-swiper v-if="item.type === 'menu'" :list="item.content.list" :oneRowNum="item.content.style"></sh-grid-swiper>

			<!-- 推荐商品 -->
			<sh-hot-goods v-if="item.type === 'goods-list' || item.type === 'goods-group'" :detail="item.content"></sh-hot-goods>
			<!-- 广告魔方 -->
			<sh-adv v-if="item.type === 'adv'" :detail="item.content"></sh-adv>
			<!-- 优惠券 -->
			<sh-coupon v-if="item.type === 'coupons'" :detail="item.content"></sh-coupon>
			<!-- 秒杀-->
			<sh-seckill v-if="item.type === 'seckill'" :detail="item.content"></sh-seckill>
			<!-- 拼团 -->
			<sh-groupon v-if="item.type === 'groupon'" :detail="item.content"></sh-groupon>
			<!-- 富文本 -->
			<sh-richtext v-if="item.type === 'rich-text'" :richId="item.content.id"></sh-richtext>
			<!-- 功能列表 -->
			<sh-cell v-if="item.type === 'nav-list'" :list="item.content.list"></sh-cell>
			<!-- 九宫格列表 -->
			<sh-grid v-if="item.type === 'grid-list'" :list="item.content.list"></sh-grid>
			<!-- 功能标题 -->
			<sh-title-card v-if="item.type === 'title-block'" :title="item.content.name" :bgImage="item.content.image" :titleColor="item.content.color"></sh-title-card>
			<!-- 钱包 -->
			<sh-wallet v-if="item.type === 'wallet-card'"></sh-wallet>
			<!-- 订单卡片 -->
			<sh-order-card v-if="item.type === 'order-card'"></sh-order-card>
			<!-- 直播 -->
			<!-- #ifdef MP-WEIXIN -->
			<sh-live v-if="item.type === 'live' && HAS_LIVE" :detail="item.content"></sh-live>
			<!-- #endif -->
		</view>

		<!-- 分类选项卡 -->
		<sh-category-tabs
			v-if="categoryTabsData.category_arr && categoryTabsData.category_arr.length"
			:enable="enable"
			:styleType="categoryTabsData.style"
			:tabsList="categoryTabsData.category_arr"
		></sh-category-tabs>

		<!-- copyright -->
		<view class="copyright-box u-flex-col u-row-center u-col-center u-p-t-80 u-p-b-50" v-if="shop.copyright">
			<view class="copyright-text">{{ shop.copyright[0] }}</view>
			<view class="copyright-text">{{ shop.copyright[1] }}</view>
		</view>

		<!-- #ifdef H5 -->
		<view class="tabbar-hack" style="height: 120rpx; width:100%;"></view>
		<!-- #endif -->
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 登录提示 -->
		<shopro-auth-modal v-if="authType"></shopro-auth-modal>
		<!-- 分享组件 -->
		<shopro-share v-model="showShare" :shareDetail="shareInfo" posterType="user"></shopro-share>
	</view>
</template>

<script>
import shBanner from './components/sh-banner.vue';
import shGridSwiper from './components/sh-grid-swiper.vue';
import shHotGoods from './components/sh-hot-goods.vue';
import shAdv from './components/sh-adv.vue';
import shCoupon from './components/sh-coupon.vue';
import shSeckill from './components/sh-seckill.vue';
import shGroupon from './components/sh-groupon.vue';
import shRichtext from './components/sh-richtext.vue';
import shCell from './components/sh-cell.vue';
import shGrid from './components/sh-grid.vue';
import shTitleCard from './components/sh-title-card.vue';
import shOrderCard from './components/sh-order-card.vue';
import shWallet from './components/sh-wallet.vue';
import shSearch from './components/sh-search.vue';
import shCategoryTabs from './components/sh-category-tabs.vue';

import userinfoCard from './user/userinfo-card.vue';

import { mapMutations, mapActions, mapState } from 'vuex';

// #ifdef MP-WEIXIN
import { HAS_LIVE } from '@/env';
import shLive from './components/sh-live.vue';
// #endif

import share from '@/shopro/share';

export default {
	components: {
		shBanner,
		shGridSwiper,
		shGroupon,
		shHotGoods,
		shAdv,
		shCoupon,
		shSeckill,
		shRichtext,
		shCell,
		shGrid,
		shTitleCard,
		shWallet,
		shOrderCard,
		shSearch,
		shCategoryTabs,

		userinfoCard,

		// #ifdef MP-WEIXIN
		shLive
		// #endif
	},
	data() {
		return {
			// #ifdef MP-WEIXIN
			HAS_LIVE: HAS_LIVE,
			// #endif
			scrollTop: 0,
			showShare: false,
			enable: false //是否开启吸顶。
		};
	},
	computed: {
		...mapState({
			shop: ({ shopro }) => shopro.config?.shop, // 版本信息
			userTemplate: ({ shopro }) => shopro.template?.user, //模板数据
			userInfo: ({ user }) => user.userInfo,
			isLogin: ({ user }) => user.isLogin,
			authType: ({ user }) => user.authType
		}),
		userHeadData() {
			if (this.userTemplate?.length) {
				return this.userTemplate[0].content;
			}
		},
		//分类选项卡数据
		categoryTabsData() {
			if (this.userTemplate?.length) {
				return this.userTemplate[this.userTemplate.length - 1].content;
			}
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.init();
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},

	onShow() {
		if (this.isLogin) {
			this.init();
			this.getUserData();
		}
		this.enable = true;
		this.$store.commit('CART_NUM');
	},

	methods: {
		...mapActions(['getUserInfo', 'showAuthModal', 'getUserData']),
		onShare() {
			this.shareInfo = share.setShareInfo();
			this.showShare = true;
		},
		// 初始化
		init() {
			this.getUserInfo()
				.then(res => {
					uni.stopPullDownRefresh();
				})
				.catch(e => {
					uni.stopPullDownRefresh();
				});
		}
	}
};
</script>

<style lang="scss">
.copyright-box {
	.copyright-text {
		font-size: 22rpx;
		font-weight: 500;
		color: #c4c4c4;
	}
}
</style>
