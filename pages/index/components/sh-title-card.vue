<template>
	<view class="sh-title-card mb10">
		<view class="title-box">
			<image class="title-bg" :src="detail.image" mode="aspectFill"></image>
			<view class="title-text" :style="{ color: detail.color }">{{ detail.name }}</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
	},
	computed: {},
	props: {
		detail: {
			type: Object,
			default: null
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
