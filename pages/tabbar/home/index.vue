<template>
	<block>
		<shopro-skeletons :type="'index'" v-if="!initData.template"></shopro-skeletons>
		<view class="page_box" v-else>
			<!-- 导航栏 -->
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
						<!-- 直播 -->
						<!-- #ifdef MP-WEIXIN -->
						<sh-live v-if="item.type === 'live' && HAS_LIVE" :detail="item.content"></sh-live>
						<!-- #endif -->
					</block>
				</scroll-view>
			</view>
			<view class="foot_box"></view>
			<!-- 连续弹窗提醒 -->
			<shopro-popup-modal v-if="popupIndex" :detail="popupIndex"></shopro-popup-modal>
			<!-- 登录提示 -->
			<shopro-login-modal></shopro-login-modal>
			<!-- 强制登录 -->
			<!-- #ifdef MP-WEIXIN -->
			<shopro-force-login></shopro-force-login>
			<!-- #endif -->
		</view>
	</block>
</template>

<script>
import shSearch from './children/sh-search.vue';
import shBanner from './children/sh-banner.vue';
import shHotGoods from './children/sh-hot-goods.vue';
import shMenu from './children/sh-menu.vue';
import shAdv from './children/sh-adv.vue';
import shCoupon from './children/sh-coupon.vue';
import shSeckill from './children/sh-seckill.vue';
import shGroupon from './children/sh-groupon.vue';
import shoproPopupModal from '@/components/modal/shopro-popup-modal.vue';
import shoproSkeletons from '@/components/shopro-skeletons.vue';
// #ifdef MP-WEIXIN
import { HAS_LIVE } from '@/env';
import shLive from './children/sh-live.vue';
import shoproForceLogin from '@/components/modal/shopro-force-login.vue';
// #endif
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
		shoproPopupModal,
		shoproSkeletons,
		// #ifdef MP-WEIXIN
		shLive,
		shoproForceLogin
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
			template: state => state.init.initData.template,
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
				// #ifndef MP-WEIXIN
				uni.setNavigationBarTitle({
					title: this.initData.info.name
				});
				// #endif
				return this.initData.info;
			}
		}
	},
	onLoad(options) {},
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
