<template>
	<view class="cu-modal" :class="[{ show: showModal }]" cathctouchmove @tap="hideModal">
		<view class="cu-dialog cu-dialog1" @tap.stop style="background: none;overflow: visible;">
			<image class="guide-img"  :src="$IMG_URL + '/imgs/modal/share_guide.png'" mode=""></image>
		</view>
	</view>
</template>

<script>
	/**
	 * 指引
	 */
export default {
	name: 'shoproShareGuide',
	components: {},
	data() {
		return {};
	},
	props: {
		value: {},
		modalType: {
			type: String,
			default: ''
		}
	},
	computed: {
		showModal: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			}
		}
	},
	methods: {
		hideModal() {
			this.showModal = false;
		}
	}
};
</script>

<style lang="scss">
.guide-img {
	width: 580rpx;
	height: 430rpx;
}
.cu-dialog1 {
	vertical-align: top;
}
</style>
