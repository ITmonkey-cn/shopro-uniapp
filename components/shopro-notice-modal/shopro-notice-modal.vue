<template>
	<view class="popup-box" v-if="popupData.type === 'popup'">
		<block v-for="(p, index) in popupData.content.list" :key="index">
			<view class="cu-modal" :class="{ show: currentPath == p.page && showModal }" cathctouchmove @tap="hideModal">
				<view class="cu-dialog" @tap.stop style="background: none;overflow: visible;">
					<view class="img-box">
						<image class="modal-img" :src="p.image" mode="widthFix"></image>
						<text class="cuIcon-roundclose" @tap="hideModal"></text>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	name: 'shoproNoticeModal',
	components: {},
	data() {
		return {
			popupCurrent: 0,
			showModal: true
		};
	},
	props: {
		detail: {}
	},
	computed: {
		...mapState({
			popupData: state => state.init.templateData.popup[0]
		}),
		currentPath() {
			return '/' + this.$route.meta.pagePath;
		},
		newPopup() {
			let obj = {};
			this.detail.list.forEach(item => {
				obj[item.page] = 0;
			});
			return obj;
		}
	},
	created() {},
	methods: {
		hideModal() {
			this.showModal = false;
		},
		changePopup(path) {}
	}
};
</script>

<style lang="scss">
.modal-img {
	width: 610rpx;
}
.cu-modal {
	z-index: 99999;
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
