<template>
	<view>
		<view v-for="(p, index) in detail" :key="index">
			<view class="cu-modal" :class="{ show: popupCurrent === index && showModal }" cathctouchmove @tap="hideModal">
				<view class="cu-dialog" @tap.stop style="background: none;overflow: visible;">
					<view class="img-box">
						<image class="modal-img" :src="p.image" mode="widthFix"></image>
						<text class="cuIcon-roundclose" @tap="hideModal"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'shoproNoticeModal',
	components: {},
	data() {
		return {
			popupCurrent: 0,
			showModal: false
		};
	},
	props: {
		detail: {}
	},
	computed: {},
	methods: {
		hideModal() {
			clearTimeout(timer);
			this.showModal = false;
			let timer = setTimeout(() => {
				this.popupCurrent += 1;
				this.showModal = true;
			}, 500);
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
