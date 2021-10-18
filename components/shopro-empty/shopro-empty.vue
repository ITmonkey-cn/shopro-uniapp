<template>
	<view class="shopro-empty-wrap u-flex-col u-row-center u-col-center" :style="{ 'margin-top': marginTop }">
		<image class="empty-img" :src="image" mode="aspectFill"></image>
		<view class="empty-text u-tips-color u-font-26">{{ tipText }}</view>
		<view class="btn-box u-m-t-100" v-if="btnText">
			<button class="u-reset-button empty-btn" :style="customStyle" hover-class="none" @tap="onBtn">{{ btnText }}</button>
		</view>
	</view>
</template>

<script>
/**
 * shoproEmpty- 数据为空页
 * @property {String} image - 空白图。
 * @property {String} tipText - 提示语。
 * @property {String} btnText - 按钮文字。
 * @property {String} marginTop - 距离父级距离。
 * @property {Object} customStyle - 自定义按钮样式。
 * @event {Fuction} click - 点击按钮
 */
export default {
	name: 'shoproEmpty',
	props: {
		image: {
			type: [String,null],
			default: '/static/images/empty_network.png'
		},
		tipText: {
			type: String,
			default: ''
		},
		btnText: {
			type: String,
			default: ''
		},
		marginTop: {
			type: String,
			default: '300rpx'
		},
		customStyle: {
			type: Object,
			default: () => {
				return {
					width: '200rpx',
					height: '70rpx',
					background: 'linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1))',
					borderRradius: '35rpx',
					fontSize: '28rpx',
					color: '#fff',
					border: 0
				};
			}
		}
	},
	methods: {
		onBtn() {
			this.$emit('click');
		}
	}
};
</script>

<style lang="scss" scoped>
.empty-img {
	width: 540rpx;
	height: 290rpx;
}
.empty-btn {
	width: 320rpx;
	height: 70rpx;
	line-height: 70rpx;
	background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
	border-radius: 35rpx;
	font-size: 28rpx;
	color: rgba(#fff, 0.9);
}
</style>
