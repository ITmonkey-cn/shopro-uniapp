<template>
	<view class="popup-box">
		<block v-for="(p, index) in newPopupList" :key="index">
			<view class="cu-modal" :class="{ show: p.page.includes(currentPath) && showModal && popupCurrent === index }" cathctouchmove @tap="hideModal(p)">
				<view class="cu-dialog" @tap.stop="changePopup(p.path)" style="background: none;overflow: visible;">
					<view class="img-box">
						<image class="modal-img" :src="p.image" mode="widthFix" lazy-load></image>
						<text class="cuIcon-roundclose" @tap.stop="hideModal(p)"></text>
					</view>
				</view>
			</view>
		</block>
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
			showModal: true
		};
	},
	props: {
		detail: {}
	},
	computed: {
		...mapState({
			popupData: state => state.init.templateData.popup[0].content
		}),
		// popupData(){
		// 	if(this.template.length){
		// 		return this.template.popup[0].content
		// 	}
		// },
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
			timer = setTimeout(() => {
				this.popupCurrent += 1;
				this.showModal = true;
			}, 500);
			p.style == 1 && this.$store.commit('delPopup', this.currentPath);
		},
		changePopup(path) {
			this.$tools.routerTo(path);
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
