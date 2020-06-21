<template>
	<view v-if="floatList.length && floatList[0].page.includes(currentPath)" class="shopro-float-btn">
		<view :class="{ 'btn-mark': showBtnList }" cathctouchmove @tap="hideBtnModal"></view>
		<button class="cu-btn wechat-btn" @tap="onBtn">
			<image class="wechat_img" :src="floatList.length == 1 ? floatList[0].btnimage : floatData.image" mode="widthFix"></image>
		</button>
		<view :class="showBtnList ? 'float--active' : 'float-list-box'">
			<view class="btn-img-box y-f" @tap="onBtnItem(item)" v-for="item in floatList" :key="item.btnimage">
				<image class="btn-img" :src="item.btnimage" mode="aspectFill"></image>
			</view>
		</view>
		<view class="cu-modal" :class="{ show: showModal }" cathctouchmove @tap="hideModal">
			<view class="cu-dialog" @tap.stop style="background: none;overflow: visible;">
				<view class="img-box">
					<image class="modal-img" :src="modalImg" mode="widthFix"></image>
					<text class="cuIcon-roundclose" @tap="hideModal"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {},
	data() {
		return {
			showModal: false,
			showBtnList: false,
			modalImg: ''
		};
	},
	props: {},
	computed: {
		...mapState({
			floatData: ({ init }) => init.templateData['float-button'][0].content
		}),
		currentPath() {
			let pages = getCurrentPages();
			let currPage = null;
			if (pages.length) {
				currPage = pages[pages.length - 1].route;
			}
			return '/' + currPage;
		},
		floatList() {
			if (this.floatData) {
				let arr = this.floatData.list.filter(item => {
					return item.page.includes(this.currentPath);
				});
				return arr;
			}
		}
	},
	created() {
	},
	methods: {
		hideModal() {
			this.showModal = false;
		},
		hideBtnModal() {
			this.showBtnList = false;
		},
		onBtnItem(item) {
			item.path && this.$tools.routerTo(item.path);
			this.modalImg = item.image;
			this.showModal = true;
		},
		onBtn() {
			if (this.floatList.length == 1) {
				this.modalImg = this.floatList[0].image;
				this.floatList[0].path ? this.$tools.routerTo(this.floatList[0].path) : (this.showModal = true);
			} else {
				this.showBtnList = !this.showBtnList;
			}
		}
	}
};
</script>

<style lang="scss">
.btn-mark {
	z-index: -1;
	position: fixed;
	width: 100%;
	height: 100%;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
.cu-modal {
	z-index: 999999;
}
.shopro-float-btn {
	position: fixed;
	bottom: 130rpx;
	right: 30rpx;
	z-index: 888;
	.float--active {
		position: absolute;
		bottom: 90rpx;
		left: 50%;
		margin-left: -25%;
		transform: scale(1);
		transition: all 0.2s linear;
	}
	.float-list-box {
		position: absolute;
		bottom: 0;
		left: 50%;
		margin-left: -25%;
		transform: scale(0);
		transition: all 0.2s linear;
	}
	.btn-img {
		// background-color: #ccc;
		width: 50rpx;
		height: 50rpx;
		margin-bottom: 20rpx;
	}
	.wechat-btn {
		// background: #ccc;
		padding: 0;
		.wechat_img {
			width: 80rpx;
			height: 80rpx;
		}
	}
}
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
