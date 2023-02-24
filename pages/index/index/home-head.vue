<template>
	<!-- 首页标题栏，轮播图整合插件 -->
	<view class="banner-swiper-wrap u-m-b-10">
		<!-- 标题栏 -->
		<view class="u-navbar u-navbar-fixed" :style="[navbarStyle]">
			<view class="nav-bg" :style="[navBg]"></view>
			<view class="u-status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="u-navbar-inner" :style="[navbarInnerStyle]">
				<view class="u-back-wrap">
					<view class="u-icon-wrap u-back-text u-line-1" :style="[navTitleStyle, navTitleColor]">
						{{ navTitle || '' }}
					</view>
				</view>
				<view
					hover-class="hover-search"
					class="search-box u-flex u-row-center u-col-center u-m-r-30"
					@tap="$Router.push('/pages/public/search')"
				>
					<view class="u-iconfont uicon-search" :style="[navTitleColor]"></view>
				</view>
			</view>
		</view>
		<!-- 轮播组件 -->
		<swiper
			class="screen-swiper square-dot"
			@change="onChange"
			style="height: 520rpx"
			:indicator-dots="true"
			:circular="true"
			:autoplay="true"
			interval="5000"
			duration="500"
		>
			<swiper-item v-for="(item, index) in list" :key="index" @tap="onSwiper(index)">
				<image :src="item.image" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
/**
 * home-head-轮播卡片,主要为了处理数据
 * @property {Array} list 轮播图数据，
 * @property {String} mode 指示器模式
 * @property {String} navTitle 项目名称
 */
export default {
	components: {},
	data() {
		return {
			navBgImage: '',
			changeNavBackground: false,
			swiperCur: 0,
			statusBarHeight: systemInfo.statusBarHeight,
			navBg: { opacity: 0 },
			navTitleColor: {
				color: '#fff'
			}
		};
	},
	props: {
		scrollTop: {
			type: [String, Number],
			default: 0
		},
		// 轮播图的数据,格式如：[{image: 'xxxx', title: 'xxxx'}，{image: 'yyyy', title: 'yyyy'}]，其中title字段可选
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		navTitle: {
			type: String,
			default: 'Shopro商城'
		},
		navTitleStyle: {
			type: Object,
			default: () => {
				return {
					color: '#fff',
					fontSize: '38rpx'
				};
			}
		}
	},
	watch: {
		scrollTop(newValue, oldValue) {
			let top = newValue;
			this.navBg = {
				opacity: top > this.navbarHeight ? 1 : top * 0.01
			};
			this.navTitleColor = {
				color: top > this.navbarHeight ? '#000' : '#fff'
			};
			this.setStatusStyle(top > this.navbarHeight ? 'dark' : 'light');
		}
	},
	computed: {
		// 导航栏内部盒子的样式
		navbarInnerStyle() {
			let style = {};
			style.height = this.navbarHeight + 'px';
			// #ifdef MP
			let rightButtonWidth = systemInfo.windowWidth - menuButtonInfo.left;
			style.marginRight = rightButtonWidth + 'px';
			// #endif
			return style;
		},
		// 整个导航栏的样式
		navbarStyle() {
			let style = {};
			style.zIndex = this.$u.zIndex.navbar;
			style.background = 'none';
			Object.assign(style, this.background);
			return style;
		},
		navbarHeight() {
			// #ifdef APP-PLUS || H5
			return 44;
			// #endif
			// #ifdef MP
			return systemInfo.platform == 'ios' ? 44 : 48;
			// #endif
		}
	},
	created() {
		this.navBgImage = this.list[0].image;
	},
	methods: {
		onSwiper(e) {
			this.$tools.routerTo(this.list[e].path);
		},
		onChange(e) {
			this.swiperCur = e.detail.current;
		},
		setStatusStyle(status) {
			// #ifdef H5
			return false;
			// #endif
			if (status == 'light') {
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: '#000000',
					animation: {
						duration: 200,
						timingFunc: 'easeIn'
					}
				});
				// #ifdef APP-PLUS
				plus.navigator.setStatusBarStyle('light');
				// #endif
			} else {
				uni.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: '#ffffff',
					animation: {
						duration: 200,
						timingFunc: 'easeIn'
					}
				});

				// #ifdef APP-PLUS
				plus.navigator.setStatusBarStyle('dark');
				// #endif
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@mixin vue-flex($direction: row) {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: $direction;
	/* #endif */
}
// 轮播
.banner-swiper-wrap {
	height: 520rpx;
	position: relative;
	z-index: 100;
	.search-box {
		width: 66rpx;
		height: 66rpx;
		background: rgba(#000, 0.18);
		border-radius: 100%;
	}
	.hover-search {
		background: rgba(#fff, 0.18);
	}
}

.u-navbar {
	width: 100%;
}

.u-navbar-fixed {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	z-index: 991;
	.nav-bg {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 980;
		width: 100%;
		height: 100%;
		background-color: #fff;
		box-shadow: 0px 4px 6px rgba(140, 140, 140, 0.32);
	}
}

.u-status-bar {
	width: 100%;
}

.u-navbar-inner {
	@include vue-flex;
	justify-content: space-between;
	position: relative;
	align-items: center;
	position: relative;
	z-index: 990;
}

.u-back-wrap {
	@include vue-flex;
	align-items: center;
	flex: 1;
	flex-grow: 0;
	padding: 14rpx 14rpx 14rpx 24rpx;
}
</style>
