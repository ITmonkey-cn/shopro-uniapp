<!-- 个人中心 -->
<template>
	<view class="personal-wrap">
		<!-- 个人信息卡片 -->
		<userinfo-card v-if="userHeadData && userHeadData.style" :scrollTop="scrollTop" :detail="userHeadData" @onShare="onShare"></userinfo-card>
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
			<!-- 滑动宫格 -->
			<sh-grid-swiper v-if="item.type === 'menu'" :list="item.content.list" :oneRowNum="item.content.style"></sh-grid-swiper>
			<!-- 广告魔方 -->
			<sh-adv v-if="item.type === 'adv'" :detail="item.content"></sh-adv>
			<!-- 推荐商品 -->
			<sh-hot-goods v-if="item.type === 'goods-list' || item.type === 'goods-group'" :detail="item.content"></sh-hot-goods>
			<!-- 富文本 -->
			<sh-richtext v-if="item.type === 'rich-text'" :richId="item.content.id"></sh-richtext>
			<!-- 功能列表 -->
			<sh-cell v-if="item.type === 'nav-list'" :list="item.content.list"></sh-cell>
			<!-- 九宫格列表 -->
			<sh-grid v-if="item.type === 'grid-list'" :list="item.content.list"></sh-grid>
			<!-- 钱包 -->
			<sh-wallet v-if="item.type === 'wallet-card'"></sh-wallet>
			<!-- 订单卡片 -->
			<sh-order-card v-if="item.type === 'order-card'"></sh-order-card>
		</view>
		<!-- copyright -->
		<view class="copyright-box u-flex-col u-row-center u-col-center u-p-t-80 u-p-b-50" v-if="initShop.copyright">
			<view class="copyright-text">{{ initShop.copyright[0] }}</view>
			<view class="copyright-text">{{ initShop.copyright[1] }}</view>
		</view>

		<!-- #ifdef H5 -->
		<view class="tabbar-hack" style="height: 120rpx; width:100%;"></view>
		<!-- #endif -->
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 登录提示 -->
		<shopro-auth-modal></shopro-auth-modal>
		<!-- 分享组件 -->
		<shopro-share v-model="showShare" posterType="user"></shopro-share>
		<!-- <shopro-tabbar></shopro-tabbar> -->
	</view>
</template>

<script>
import shBanner from './components/sh-banner.vue';
import shGridSwiper from './components/sh-grid-swiper.vue';
import shAdv from './components/sh-adv.vue';
import shRichtext from './components/sh-richtext.vue';
import shCell from './components/sh-cell.vue';
import shGrid from './components/sh-grid.vue';
import shOrderCard from './components/sh-order-card.vue';
import shWallet from './components/sh-wallet.vue';
import shHotGoods from './components/sh-hot-goods.vue';

import userinfoCard from './user/userinfo-card.vue';

import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';

import share from '@/shopro/share';

export default {
	components: {
		shBanner,
		shGridSwiper,
		shAdv,
		shRichtext,
		shCell,
		shGrid,
		shWallet,
		shOrderCard,
		shHotGoods,

		userinfoCard
	},
	data() {
		return {
			scrollTop: 0,
			showShare: false,
			enable: false //是否开启吸顶。
		};
	},
	computed: {
		...mapGetters(['initShop', 'userTemplate', 'isLogin', 'userInfo', 'authType']),
		userHeadData() {
			if (this.userTemplate?.length) {
				return this.userTemplate[0].content;
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
	},

	methods: {
		...mapActions(['getUserInfo', 'showAuthModal', 'getUserData']),
		onShare() {
			this.showShare = true;
			uni.hideTabBar();
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
