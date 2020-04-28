<template>
	<view class="cu-modal" :class="[{ show: showModal }, modalType]" cathctouchmove @tap="hideModal">
		<view class="cu-dialog" @tap.stop style="background: none;overflow: visible;"><slot name="modalContent"></slot></view>
	</view>
</template>

<script>
export default {
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
			this.$store.commit('LOGIN_TIP', false);
		}
	}
};
</script>

<style lang="scss">
.modal-img {
	width: 610rpx;
}

.img-box {
	position: relative;

	.cuIcon-roundclose {
		position: absolute;
		left: 50%;
		transform: translate(-50%);
		bottom: -80rpx;
		color: #fff;
		font-size: 60rpx;
		z-index: 99;
	}
}
</style>
