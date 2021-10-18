<template>
	<view class="sh-title-card u-m-b-10">
		<view class="title-box">
			<image class="title-bg" :src="bgImage" mode="aspectFill"></image>
			<view class="title-text" :style="{ color: titleColor }">{{ title }}</view>
		</view>
	</view>
</template>

<script>
/**
 * shTitleCard 组件标题栏
 * @property {String} bgImage - 背景图
 * @property {String} title - 标题
 * @property {String} titleColor - 标题颜色
 */
export default {
	components: {},
	data() {
		return {};
	},
	computed: {},
	props: {
		bgImage: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
		titleColor: {
			type: String,
			default: ''
		}
	},
	methods: {}
};
</script>

<style lang="scss">
.sh-title-card {
	width: 750rpx;
}
.title-box {
	width: 710rpx;
	height: 88rpx;
	margin: 0 auto;
	position: relative;
	border-radius: 30rpx;

	.title-bg {
		width: 100%;
		height: 100%;
	}
	.title-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-weight: bold;
	}
}
</style>
