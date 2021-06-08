<template>
	<!-- 轮播 -->
	<view class="banner-swiper-wrap u-m-b-10">
		<u-navbar
			backIconName=""
			immersive
			:borderBottom="false"
			:is-fixed="true"
			:background="{ background: changeNavBackground ? `url(${navBgImage}) no-repeat top / 100% auto` : 'none' }"
			:backTextStyle="navTitleStyle"
			:backText="navTitle"
		>
			<view slot="right" hover-class="hover-search" class="search-box u-flex u-row-center u-col-center u-m-r-30" @tap="$Router.push('/pages/public/search')">
				<u-icon name="search" color="#fff"></u-icon>
			</view>
		</u-navbar>

		<u-swiper
			:height="height"
			:list="list"
			:autoplay="autoplay"
			:borderRadius="borderRadius"
			:indicator-pos="indicatorPos"
			:mode="mode"
			:interval="interval"
			:duration="duration"
			:circular="circular"
			:imgMode="imgMode"
			:bgColor="bgColor"
			@click="onSwiper"
			@change="onChange"
		></u-swiper>
	</view>
</template>

<script>
/**
 * home-head-轮播卡片,主要为了处理数据
 * @property {Array} list 轮播图数据，
 * @property {String} mode 指示器模式
 * @property {String} navTitle 项目名称
 * @property {String Number} height 轮播图组件高度，单位rpx（默认250）
 * @property {String} indicator-pos 指示器的位置（默认bottomCenter）
 * @property {Boolean} autoplay 是否自动播放（默认true）
 * @property {Boolean} circular 是否衔接播放（默认true）
 * @property {String Number} interval 隔多久换，单位ms（默认2500）
 * @property {String Number} duration 自动轮播时间间隔，单位ms（默认500）
 * @property {String} img-mode 图片的裁剪模式，详见image组件裁剪模式（默认aspectFill）
 * @property {String} borderRadius 圆角值
 * @property {String} bgColor 背景色
 * @event {Function} click 点击轮播图时触发
 */
export default {
	components: {},
	data() {
		return {
			navBgImage: '',
			changeNavBackground: false,
			swiperCur: 0
		};
	},
	props: {
		isScorll: {
			type: Boolean,
			default: false
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
		},
		// 圆角值
		borderRadius: {
			type: [Number, String],
			default: 0
		},
		// 隔多久自动切换
		interval: {
			type: [String, Number],
			default: 3000
		},
		// 指示器的模式，rect|dot|number|round
		mode: {
			type: String,
			default: 'round'
		},
		// list的高度，单位rpx
		height: {
			type: [Number, String],
			default: 520
		},
		// 指示器的位置，topLeft|topCenter|topRight|bottomLeft|bottomCenter|bottomRight
		indicatorPos: {
			type: String,
			default: 'bottomCenter'
		},

		// 是否自动播放
		autoplay: {
			type: Boolean,
			default: true
		},
		// 自动轮播时间间隔，单位ms
		duration: {
			type: [Number, String],
			default: 500
		},
		// 是否衔接滑动，即到最后一张时接着滑动，是否自动切换到第一张
		circular: {
			type: Boolean,
			default: true
		},
		// 图片的裁剪模式
		imgMode: {
			type: String,
			default: 'widthFix'
		},
		// 背景颜色
		bgColor: {
			type: String,
			default: '#f3f4f6'
		}
	},
	watch: {
		isScorll(newValue, oldValue) {
			this.changeNavBackground = newValue;
			this.navBgImage = this.list[this.swiperCur].image;
		}
	},
	computed: {},
	created() {
		this.navBgImage = this.list[0].image;
	},
	methods: {
		onSwiper(e) {
			this.$tools.routerTo(this.list[e].path);
		},
		onChange(e) {
			this.swiperCur = e;
		}
	}
};
</script>

<style lang="scss" scoped>
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
</style>
