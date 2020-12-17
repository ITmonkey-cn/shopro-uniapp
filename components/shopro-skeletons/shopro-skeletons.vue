<template>
	<view class="skeletons_box">
		<image class="img" :src="skeletonsDot[type]" mode="widthFix"></image>
		<image class="loading" src="/static/imgs/logo/logo.gif" mode=""></image>
	</view>
</template>

<script>
/**
 * 图片居家屏
 */
export default {
	name: 'shoproSkeletons',
	components: {},
	data() {
		return {
			skeletonsDot: {
				detail: '/static/imgs/skeleton_screen/detail.jpg'
			}
		};
	},
	props: {
		type: String
	},
	computed: {},
	methods: {}
};
</script>

<style lang="scss">
.skeletons_box {
	width: 750rpx;
	overflow: hidden;
	height: 100%;
	position: fixed;
	z-index: 99999;
	.img {
		width: 100%;
	}
	.loading {
		width: 140rpx;
		height: 140rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 999;
		&::after {
			content: '' !important;
		}
		&::before {
			background-color: transparent;
		}
	}
}
</style>
