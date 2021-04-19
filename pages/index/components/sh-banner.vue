<template>
	<!-- 轮播 -->
	<view class="banner-swiper-box mb10" v-if="detail.list">
		<swiper class="banner-carousel shopro-selector-rect" circular @change="swiperChange" :autoplay="true">
			<swiper-item v-for="(item, index) in detail.list" :key="index" class="carousel-item " @tap="routerTo(item.path)">
				<image class="swiper-image " :src="item.image" mode="widthFix" lazy-load></image>
			</swiper-item>
		</swiper>
		<view class="banner-swiper-dots">
			<text :class="swiperCurrent === index ? 'banner-dot-active' : 'banner-dot'" v-for="(dot, index) in detail.list.length" :key="index"></text>
		</view>
	</view>
</template>

<script>
/**
 * 自定义之轮播卡片
 * @property {Object} detail - 轮播信息
 */
export default {
	components: {},
	data() {
		return {
			swiperCurrent: 0, //轮播下标
			webviewId: 0,
			routerTo: this.$tools.routerTo
		};
	},
	props: {
		detail: {
			type: Object,
			default: null
		}
	},
	computed: {},
	created() {
		this.initBgColor();
	},
	methods: {
		// 轮播切换
		swiperChange(e) {
			this.swiperCurrent = e.detail.current;
			this.initBgColor();
		},
		// 初始化背景颜色，轮播图没滚动前
		initBgColor() {
			let bgcolor = this.detail.list[this.swiperCurrent].bgcolor;
			this.$emit('getbgcolor', bgcolor);
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
.hide-canvas {
	position: fixed !important;
	top: -99999upx;
	left: -99999upx;
	z-index: -99999;
}

// 轮播
.banner-swiper-box {
	background: #fff;
}

.banner-swiper-box,
.banner-carousel {
	width: 750rpx;
	height: 350rpx;
	position: relative;

	.carousel-item {
		width: 100%;
		height: 100%;
		// padding: 0 28upx;
		overflow: hidden;
	}

	.swiper-image {
		width: 100%;
		height: 100%;
		// border-radius: 10upx;
		// background: #ccc;
	}
}

.banner-swiper-dots {
	display: flex;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: 20rpx;
	z-index: 66;

	.banner-dot {
		width: 14rpx;
		height: 14rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.banner-dot-active {
		width: 14rpx;
		height: 14rpx;
		background: #a8700d;
		border-radius: 50%;
		margin-right: 10rpx;
	}
}
</style>
