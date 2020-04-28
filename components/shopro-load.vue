<template>
	<view class="cu-load load-modal" v-if="loadModal">
		<!-- <view class="cuIcon-emojifill text-orange"></view> -->
		<image src="/static/imgs/logo.gif" mode="aspectFit"></image>
		<view class="gray-text">加载中...</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
		};
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

<style lang="scss"></style>
