<template>
	<view class="popup-box" v-if="!screenShot">
		<view v-for="(p, index) in newPopupList" :key="index">
			<view class="cu-modal" :class="{ show: showModal && popupCurrent === index }" cathctouchmove @tap="hideModal(p)">
				<view class="cu-dialog" @tap.stop="changePopup(p.path)" style="background: none;overflow: visible;">
					<view class="img-box">
						<image class="modal-img" :src="p.image" mode="widthFix"></image>
						<text class="cuIcon-roundclose" @tap.stop="hideModal(p)"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
let timer = null;
export default {
	name: 'shoproNoticeModal',
	components: {},
	data() {
		return {
			popupCurrent: 0,
			showModal: true,
			screenShot: uni.getStorageSync('screenShot')
		};
	},
	props: {
		detail: {}
	},
	computed: {
		...mapState({
			templateData: state => state.init.templateData.popup,
			showLoginTip: state => state.user.showLoginTip
		}),
		popupData() {
			if (this.templateData) {
				return this.templateData[0].content;
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
			if (this.popupData) {
				let arr = this.popupData.list.filter(item => {
					return item.page.includes(this.currentPath);
				});
				return arr;
			}
		}
	},
	created() {},
	methods: {
		hideModal(p) {
			clearTimeout(timer);
			this.showModal = false;
			if (p.style == 1) {
				this.$store.commit('delPopup', this.currentPath);
			}
			timer = setTimeout(() => {
				this.popupCurrent += 1;
				this.showModal = true;
			}, 500);
		},
		changePopup(path) {
			this.$tools.routerTo(path, null);
		}
	}
};
</script>

<style lang="scss">
.modal-img {
	width: 610rpx;
}

.cu-modal {
	z-index: 10000;
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
