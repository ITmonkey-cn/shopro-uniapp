<template>
	<!-- 轮播 -->
	<view class="banner-swiper-box mb10" v-if="detail.list">
		<canvas canvas-id="colorThief" class="hide-canvas"></canvas>
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
import colorThief from 'miniapp-color-thief';

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
	created: async function() {
		await this.doColorThief();
	},
	computed: {},
	methods: {
		async doColorThief() {
			let that = this;
			let item = this.detail.list[this.swiperCurrent];
			let bgcolor = item.bgcolor;
			if (bgcolor === '') {
				let ctx = uni.createCanvasContext('colorThief', that);
				if (0 === that.webviewId || ctx.webviewId === that.webviewId) {
					that.webviewId = ctx.webviewId;
					uni.getImageInfo({
						src: item.image,
						success: function(image) {
							ctx.drawImage(image.path, 0, 0, image.width, image.height);
							ctx.draw(true, function(e) {
								uni.canvasGetImageData(
									{
										canvasId: 'colorThief',
										x: 0,
										y: 0,
										width: parseInt(image.width),
										height: parseInt(image.height),
										success(res) {
											let bgcolor = colorThief(res.data)
												.color()
												.getHex();
											that.$set(item, 'bgcolor', bgcolor);
											that.$emit('getbgcolor', bgcolor);
										}
									},
									that
								);
							});
						}
					});
				}
			} else {
				that.$set(item, 'bgcolor', bgcolor);
				that.$emit('getbgcolor', bgcolor);
			}
		},
		swiperChange(e) {
			this.swiperCurrent = e.detail.current;
			this.doColorThief();
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
