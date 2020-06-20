<template>
	<view class="popup-box">
		<block v-for="(p, index) in newPopupList" :key="index">
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
			template: state => state.init.templateData
		}),
		popupData() {
			if (this.template.popup) {
				return this.template.popup[0].content;
			}
		},
		currentPath() {
			let pages = getCurrentPages();
			let currPage = null;
			if (pages.length) {
				currPage = pages[pages.length - 1].route;
			}
			return '/' + currPage;
		},
		newPopupList() {
			let arr = this.popupData.list.filter(item => {
				return item.page == this.currentPath;
			});
			return arr;
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
