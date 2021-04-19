<template>
	<view class="y-f" :class="{ 'shopro-empty': isFixed }">
		<image class="empty-img" :src="emptyData.img" mode="aspectFill"></image>
		<view class="empty-text">{{ emptyData.tip }}</view>
		<view class="btn-box" v-if="emptyData.path || emptyData.type === 'netWork'">
			<button class="cu-btn empty-btn" @tap="jump">{{ emptyData.pathText }}</button>
		</view>
	</view>
</template>

<script>
/**
 * 数据为空页
 * @property {Object} emptyData - 数据为空页页面数据。
 * @property {Boolean} isFixed - 是否开启绝对定位,用于局部数据为空，整页数据为空。
 */
export default {
	name: 'shoproEmpty',
	components: {},
	data() {
		return {
			tools: this.$tools
		};
	},
	props: {
		emptyData: {
			// img:空白页图片, tip:空白页提示语 ,path:空白页跳转路径, pathText:跳转按钮文本。
			type: Object,
			default: {}
		},
		isFixed: {
			//是否开启绝对定位。
			type: Boolean,
			default: true
		}
	},
	computed: {},
	methods: {
		jump() {
			if (this.emptyData.type === 'netWork') {
				this.$emit('click');
			} else {
				this.tools.routerTo(this.emptyData.path);
			}
		}
	}
};
</script>

<style lang="scss">
.shopro-empty {
	position: fixed;
	z-index: 11;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.empty-img {
	width: 540rpx;
	height: 290rpx;
}
.empty-text {
	font-size: 26rpx;
	color: #999;
}
.btn-box {
	margin-top: 100rpx;
	.empty-btn {
		width: 320rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border-radius: 35rpx;
		font-size: 28rpx;
		color: rgba(#fff, 0.9);
	}
}
</style>
