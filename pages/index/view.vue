<template>
	<view class="view-box">
		<cu-custom :isBack="true" :bgColor="bgColor" :bgImage="bgImage">
			<block slot="content">{{ customData.name }}</block>
		</cu-custom>
		<block v-if="viewData.length" v-for="(item, index) in viewData" :key="index">
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
			<sh-nav v-if="item.type === 'nav-list'" :detail="item.content"></sh-nav>
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

		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
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
// #ifdef MP-WEIXIN
import { HAS_LIVE } from '@/env';
import shLive from './components/sh-live.vue';
// #endif

import { mapMutations, mapActions, mapState } from 'vuex';
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
		// #ifdef MP-WEIXIN
		shLive
		// #endif
	},
	data() {
		return {
			viewData: {},
			// #ifdef MP-WEIXIN
			HAS_LIVE: HAS_LIVE,
			// #endif
			viewId: 0,
			bgColor: '',
			bgImage: '',
			customData: {}
		};
	},
	computed: {},
	onLoad() {
		this.viewId = this.$Route.query.id;
	},
	onShow() {
		this.getViewData();
	},
	methods: {
		getViewData() {
			let that = this;
			that.$api('custom', {
				id: that.viewId
			}).then(res => {
				if (res.code == 1) {
					that.viewData = res.data.template;
					that.customData = res.data;
					uni.setNavigationBarTitle({
						title: res.data.name
					});
				}
			});
		}
	}
};
</script>

<style lang="scss"></style>
