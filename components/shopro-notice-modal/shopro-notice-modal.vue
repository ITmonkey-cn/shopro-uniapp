<template>
	<view class="popup-box" v-if="newPopupList && newPopupList.length">
		<view v-for="(p, index) in newPopupList" :key="index">
			<u-popup
				v-if="popupCurrent === index && p.image"
				v-model="showModal"
				:bgStyle="{
					background: 'none'
				}"
				@close="hideModal(p, index)"
				:border-radius="20"
				mode="center"
				length="auto"
				:closeable="false"
			>
				<view class="cu-dialog" @tap.stop="onPopup(p.path)">
					<view class="img-box"><image class="modal-img" :src="p.image" mode="aspectFit"></image></view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
/**
 * 广告模态框。连续弹窗和只弹一次。
 * @property {Object} newPopupList  - vuex 初始化传过来的数据
 */
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
	props: {},
	computed: {
		...mapState({
			popupData: ({ shopro }) => shopro.template?.popup?.[0]?.content,
			isLogin: ({ user }) => user.isLogin
		}),
		newPopupList() {
			if (this.popupData) {
				return this.popupData.list;
			}
		}
	},
	beforeDestroy() {
		clearTimeout(timer);
		timer = null;
	},
	methods: {
		hideModal(p, index) {
			clearTimeout(timer);
			this.showModal = false;
			if (p.style == 1) {
				this.$store.commit('delPopup', index);
			}
			timer = setTimeout(() => {
				this.popupCurrent += 1;
				this.showModal = true;
			}, 500);
		},
		onPopup(path) {
			this.$tools.routerTo(path);
		}
	}
};
</script>

<style lang="scss">
.img-box {
	position: relative;
	width: 610rpx;
	.modal-img {
		width: 100%;
		will-change: transform;
		height: 830rpx;
	}
}
</style>
