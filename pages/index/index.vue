<template>
	<block>
		<shopro-skeletons :type="'index'" v-if="!initData.template"></shopro-skeletons>
		<view class="page_box" v-else>
			<view class="head_box" :style="{ background: bgcolor }" :class="{ active: bgcolor }">
				<cu-custom :isBack="true" v-if="template">
					<block slot="backText">
						<text class="nav-title">{{ info.name || '商城' }}</text>
					</block>
				</cu-custom>
			</view>
			<view class="content_box" style="margin-top: -4rpx;">
				<scroll-view class="scroll-box" scroll-y="true" scroll-with-animation enable-back-to-top>
					<block v-for="(item, index) in template" :key="index">
						<shopro-search v-if="item.type === 'search'" :detail="item" :bgcolor="bgcolor"></shopro-search>
						<shopro-banner v-if="item.type === 'banner'" :detail="item.content" @getbgcolor="getbgcolor"></shopro-banner>
						<shopro-menu v-if="item.type === 'menu'" :detail="item.content" :menu="item.content.style" :imgW="94"></shopro-menu>
						<shopro-goods-group v-if="item.type === 'goods-list' || item.type === 'goods-group'" :detail="item.content"></shopro-goods-group>
						<shopro-adv v-if="item.type === 'adv'" :detail="item.content"></shopro-adv>
						<shopro-coupons v-if="item.type === 'coupons'" :detail="item.content"></shopro-coupons>
						<shopro-seckill v-if="item.type === 'seckill'" :detail="item.content"></shopro-seckill>
						 <!-- #ifdef MP-WEIXIN -->
						<shopro-live v-if="item.type === 'live' && HAS_LIVE" :detail="item.content"></shopro-live>
						 <!-- #endif -->
					</block>
				</scroll-view>
			</view>
			<view class="foot_box"></view>
			<shopro-popup-modal v-if="popupIndex" :detail="popupIndex"></shopro-popup-modal>
			<shopro-login-modal></shopro-login-modal>
			<!-- 强制登录 -->
			 <!-- #ifdef MP-WEIXIN -->
			<shopro-force-login></shopro-force-login>
			 <!-- #endif -->
		</view>
	</block>
</template>

<script>
import shoproSearch from '@/components/common/shopro-search.vue';
import shoproBanner from '@/components/common/shopro-banner.vue';
import shoproGoodsGroup from '@/components/common/shopro-goods-group.vue';
import shoproMenu from '@/components/common/shopro-menu.vue';
import shoproAdv from '@/components/common/shopro-adv.vue';
import shoproPopupModal from '@/components/modal/shopro-popup-modal.vue';
import shoproSkeletons from '@/components/shopro-skeletons.vue';
import shoproCoupons from '@/components/common/shopro-coupons.vue';
import shoproSeckill from '@/components/common/shopro-seckill.vue';
import shoproGroup from '@/components/common/shopro-group.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
import store from '@/common/store';
// #ifdef MP-WEIXIN
import { HAS_LIVE } from '@/env';
import shoproLive from '@/components/common/shopro-live.vue';
import shoproForceLogin from '@/components/modal/shopro-force-login.vue';
// #endif

export default {
	components: {
		shoproSearch,
		shoproBanner,
		shoproGoodsGroup,
		shoproMenu,
		shoproAdv,
		shoproPopupModal,
		shoproSkeletons,
		shoproCoupons,
		shoproSeckill,
		shoproGroup,
		// #ifdef MP-WEIXIN
		shoproLive,
		shoproForceLogin,
		// #endif
	},
	data() {
		return {
			bgcolor: '',
			// #ifdef MP-WEIXIN
			HAS_LIVE: HAS_LIVE,
			// #endif
		};
	},
	computed: {
		...mapState({
			initData: state => state.init.initData,
			template: state => state.init.initData.template,
			cartNum: state => state.cart.cartNum,
			
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
	onLoad(options) {
		this.init();
		uni.hideTabBar(); //这个还有控制强制登录开关，都放vuex,在app.vue调用。
	},
	onReady() {
		// #ifndef MP-WEIXIN
		uni.setNavigationBarTitle({
			title: this.info.name
		});
		// #endif
	},
	onShow() {
		this.$store.commit('CART_NUM', this.cartNum);
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
