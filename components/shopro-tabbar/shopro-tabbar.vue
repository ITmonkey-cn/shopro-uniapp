<template>
	<view class="shopro-tabbar-wrap" v-if="tabbarList && tabbarList.length && showTabbar">
		<view class="tabbar-box" :style="{ background: tabbarData.bgcolor || '#fff' }">
			<view class="tabbar-item" v-for="(tab, index) in tabbarList" :key="tab.name" @tap="switchTabbar(tab, index)">
				<view class="img-box">
					<image
						class="tabbar-icon"
						v-if="tabbarData.style == 1 || tabbarData.style == 2"
						:src="currentPath == tab.path ? tab.activeImage : tab.image"
						mode="aspectFill"
					></image>
					<!-- 购物车角标 -->
					<view v-if="tab.path == '/pages/index/cart' && cartNum" class="badge">{{ cartNum }}</view>
				</view>

				<view
					class="tabbar-text"
					v-if="tabbarData.style == 1 || tabbarData.style == 3"
					:style="{ color: currentPath == tab.path ? tabbarData.activeColor : tabbarData.color }"
				>
					{{ tab.name }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 自定义底部导航
 * @property {Array} tabbarList - vuex初始化的底部导航数据
 * @property {String} currentPath -computed解析当前页面路径。
 */
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
import { router } from '@/shopro/router';
export default {
	name: 'shoproTabbar',
	components: {},
	data() {
		return {};
	},
	computed: {
		...mapState({
			tabbarInfo: ({ shopro }) => shopro?.template?.tabbar,
			cartNum: ({ cart }) => cart.cartNum
		}),
		// 底部导航栏配置数据
		tabbarData() {
			if (this.tabbarInfo) {
				return this.tabbarInfo[0].content;
			}
		},
		// 底部导航栏列表
		tabbarList() {
			if (this.tabbarData) {
				return this.tabbarData.list;
			}
		},

		/**
		 * 当前页面路径
		 * 去掉首页携带的参数拼接，后台装修是不会带参数
		 */
		currentPath() {
			return this.$Route.path === '/pages/index/index' ? this.$Route.path : this.$Route.fullPath;
		},
		// 后台tabbarList数据中必需含有'/pages/index/index',不然逻辑混乱
		showTabbar() {
			if (this.tabbarData && this.tabbarData.list) {
				let arr = ['/pages/index/index'];
				let path = '';
				for (let item of this.tabbarData.list) {
					arr.push(item.path);
				}
				return arr.includes(this.currentPath);
			}
		}
	},
	methods: {
		// 切换tabbar
		switchTabbar(tab, index) {
			this.$tools.routerTo(tab.path, true);
		}
	}
};
</script>

<style lang="scss">
.shopro-tabbar-wrap {
	height: calc(100rpx + env(safe-area-inset-bottom) / 2);
	padding-bottom: calc(env(safe-area-inset-bottom) / 2);
	position: relative;
	width: 100%;
	z-index: 70;

	.tabbar-box {
		position: fixed;
		display: flex;
		align-items: center;
		width: 100%;
		height: calc(100rpx + env(safe-area-inset-bottom) / 2);
		border-top: 1rpx solid #eeeeee;
		background-color: #fff;
		z-index: 998;
		bottom: 0;
		padding-bottom: calc(env(safe-area-inset-bottom) / 2);

		.tabbar-item {
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			flex: 1;

			.img-box {
				position: relative;

				.badge {
					position: absolute;
					/* #ifndef APP-NVUE */
					display: inline-flex;
					/* #endif */
					justify-content: center;
					align-items: center;
					line-height: 24rpx;
					padding: 4rpx 10rpx;
					border-radius: 100rpx;
					color: #fff;
					font-size: 24rpx;
					z-index: 9;
					background-color: $u-type-error;
					transform: scale(0.8);
					transform-origin: center center;
					top: 0;
					left: 46rpx;
					white-space: nowrap;
				}
			}

			.tabbar-icon {
				width: 50rpx;
				height: 50rpx;
				display: block;
			}

			.tabbar-text {
				font-size: 20rpx;
				margin-top: 4rpx;
			}
		}
	}
}
</style>
