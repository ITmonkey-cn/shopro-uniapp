<template>
	<!-- 轮播 -->
	<view class="banner-swiper-wrap u-m-b-10" :style="{ padding: `${Py}rpx ${Px}rpx` }">
		<swiper class="screen-swiper square-dot" :style="{ height: height + 'rpx' }" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500">
			<swiper-item :style="{ borderRadius: borderRadius + 'rpx' }" v-for="(item, index) in list" :key="index" @tap="onSwiper(index)">
				<image :src="item.image" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
/**
 * shBanner-轮播卡片
 * @property {Array} list 轮播图数据，
 * @property {String Number} height 轮播图组件高度，单位rpx（默认250）
 * @property {String} borderRadius 圆角值
 * @event {Function} click 点击轮播图时触发
 */
export default {
	components: {},
	data() {
		return {};
	},
	props: {
		Px: {
			type: [Number, String],
			default: 0
		},
		Py: {
			type: [Number, String],
			default: 0
		},
		// 轮播图的数据,格式如：[{image: 'xxxx', title: 'xxxx'}，{image: 'yyyy', title: 'yyyy'}]，其中title字段可选
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		// 圆角值
		borderRadius: {
			type: [Number, String],
			default: 0
		},
		// list的高度，单位rpx
		height: {
			type: [Number, String],
			default: 250
		}
	},
	computed: {},
	created() {},
	methods: {
		onSwiper(e) {
			this.$tools.routerTo(this.list[e].path);
		}
	}
};
</script>

<style lang="scss" scoped></style>
