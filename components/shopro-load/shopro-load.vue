<template>
	<view class="cu-load load-modal" v-show="loadModal">
		<image class="load-img" src="/static/imgs//logo/logo.gif" mode="aspectFit"></image>
		<view class="locad-text">加载中...</view>
	</view>
</template>

<script>
/**
 * 一个简单的loading组件 图片是gif的
 * @property {Boolean|String} value 用v-model控制的一个属性。 
 */

export default {
	components: {},
	data() {
		return {};
	},
	props: {
		value: {}
	},
	computed: {
		loadModal: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			}
		}
	},
	methods: {}
};
</script>

<style lang="scss">
.cu-load.load-modal {
	box-shadow: none;
	background: none;
	&:after {
		content: none;
	}
	.locad-text {
		color: #666;
	}
	.load-img {
		width: 80rpx;
		height: 80rpx;
	}
}
</style>
