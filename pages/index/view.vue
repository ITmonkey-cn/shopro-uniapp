<!-- 自定义页面 -->
<template>
	<view class="home-wrap u-m-b-20">
		<!-- 空白页 -->
		<u-no-network @retry="init"></u-no-network>
		<shopro-empty v-if="isEmpty" :image="$IMG_URL + '/imgs/empty/template_empty.png'" tipText="暂未找到模板，请前往装修~"></shopro-empty>

		<view v-else-if="isRefresh" class="content-box">
			<!-- 自定义模块 -->
			<view class="template-box">
				<block v-for="(item, index) in viewTemplate" :key="item.id">
					<!-- 轮播 -->
					<sh-banner
						v-if="item.type === 'banner'"
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
					<sh-grid v-if="item.type === 'grid-list'" :detail="item.content.list"></sh-grid>
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
				</block>
			</view>
			<!-- 分类选项卡 -->
			<sh-category-tabs
				v-if="categoryTabsData && categoryTabsData.category_arr && categoryTabsData.category_arr.length"
				:enable="enable"
				:styleType="categoryTabsData.style"
				:tabsList="categoryTabsData.category_arr"
			></sh-category-tabs>
			<!-- 登录提示 -->
			<shopro-auth-modal></shopro-auth-modal>
			<!-- #ifdef H5 -->
			<view class="tabbar-hack" style="height: 120rpx; width:100%;"></view>
			<!-- #endif -->
		</view>
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
import { mapMutations, mapActions, mapState } from 'vuex';

// #ifdef MP-WEIXIN
import { HAS_LIVE } from '@/env';
import shLive from './components/sh-live.vue';
// #endif

// #ifdef H5
let listenMove = document.body; //禁止手机h5下拉刷新带动整个页面。
let handle = function(e) {
	e.preventDefault();
};
// #endif

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

		// #ifdef MP-WEIXIN
		shLive
		// #endif
	},
	data() {
		return {
			// #ifdef MP-WEIXIN
			HAS_LIVE: HAS_LIVE,
			// #endif
			enable: false, //是否开启吸顶。
			isScorll: false,
			viewTemplate: [], //自定义模板数据
			isEmpty: false,
			isRefresh: false, //刷新
			categoryTabsData: {} //分类选项卡
		};
	},
	computed: {
		...mapState({
			isLogin: ({ user }) => user.isLogin
		})
	},
	onPullDownRefresh() {
		this.getViewTemplate();
	},
	onPageScroll(e) {
		this.isScorll = e.scrollTop > 100 ? true : false;
	},
	onShow() {
		let that = this;
		this.enable = true;
		this.isLogin && this.getCartList();
	},
	onHide() {
		this.enable = false;
	},
	onLoad() {
		this.getViewTemplate();
	},
	methods: {
		...mapActions(['getCartList']),
		// 初始化
		getViewTemplate() {
			let that = this;
			that.isRefresh = false;
			that.$http('common.custom', {
				custom_id: that.$Route.query.id
			}).then(res => {
				uni.stopPullDownRefresh();
				that.isRefresh = true;
				if (res.code == 1) {
					that.viewTemplate = res.data.template;
					that.isEmpty = !that.viewTemplate.length;
					that.categoryTabsData = that.viewTemplate[that.viewTemplate.length - 1].content;
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
