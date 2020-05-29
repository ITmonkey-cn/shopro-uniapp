<template>
	<view class="cu-load load-modal" v-if="loadModal">
		<!-- <view class="cuIcon-emojifill text-orange"></view> -->
		<image class="load-img" src="/static/imgs//logo/logo.gif" mode="aspectFit"></image>
		<view class="locad-text">加载中...</view>
	</view>
</template>

<script>
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
