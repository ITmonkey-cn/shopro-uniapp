<template>
	<view v-if="floatList && floatList.length" class="shopro-float-btn">
		<view :class="{ 'btn-mark': showBtnList }" cathctouchmove @tap="hideBtnModal"></view>
		<button class="cu-btn wechat-btn" @tap="onBtn">
			<image class="wechat_img" :src="floatList.length == 1 ? floatList[0].btnimage : floatData.image" mode="widthFix"></image>
		</button>
		<view :class="showBtnList ? 'float--active' : 'float-list-box'">
			<view class="btn-img-box y-f" @tap="onBtnItem(item)" v-for="item in floatList" :key="item.btnimage">
				<view class="btn-item">
					<image class="btn-img" :src="item.btnimage" mode="aspectFill"></image>
					<view class="btn-name">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="{ show: showModal }" cathctouchmove @tap="hideModal">
			<view class="cu-dialog" @tap.stop style="background: none;overflow: visible;">
				<view class="img-box">
					<image class="modal-img" :src="modalImg" mode="widthFix" @longtap="saveImg(modalImg)"></image>
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
			modalImg: '',
			showBtn: false
		};
	},
	props: {},
	computed: {
		...mapState({
			template: state => state.init.templateData['float-button']
		}),
		floatData() {
			if (this.template) {
				return this.template[0].content;
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
		// setInterval(function(){
		// 	console.log(this.template,123)
		// 	}, 100);
	},
	methods: {
		hideModal() {
			this.showModal = false;
		},
		hideBtnModal() {
			this.showBtnList = false;
		},
		onBtnItem(item) {
			if (item.style == 2) {
				this.$tools.routerTo(item.path);
				this.showModal = false;
				this.showBtnList = false;
			} else {
				this.modalImg = item.image;
				this.showModal = true;
			}
		},
		// 保存图片
		saveImg(img) {
			let that = this;
			uni.saveImageToPhotosAlbum({
				filePath: img,
				success: res => {
					that.$tools.toast('保存成功');
				},
				fail: err => {
					that.$tools.toast('保存失败');
				}
			});
		},
		onBtn() {
			if (this.floatList.length == 1) {
				this.modalImg = this.floatList[0].image;
				this.floatList[0].style == 2 ? this.$tools.routerTo(this.floatList[0].path) : (this.showModal = true);
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
	background: rgba(#000, 0.4);
}
.cu-modal {
	z-index: 999999;
}
.shopro-float-btn {
	position: fixed;
	bottom: 200rpx;
	right: 30rpx;
	z-index: 888;
	.float--active {
		position: absolute;
		bottom: 80rpx;
		left: 10rpx;
		transform: scale(1);
		transition: all 0.2s linear;
	}
	.float-list-box {
		position: absolute;
		bottom: 0;
		left: 10rpx;
		transform: scale(0);
		transform-origin: bottom;
		opacity: 0;
		transition: all 0.2s linear;
	}
	.btn-item {
		margin-bottom: 20rpx;
		.btn-img {
			// background-color: #ccc;
			width: 60rpx;
			height: 60rpx;
		}
		.btn-name {
			font-size: 20rpx;
			color: #fff;
			text-align: center;
			white-space: nowrap;
		}
	}

	.wechat-btn {
		// background: #ccc;
		box-shadow: 0px 0px 20px 4px rgba(199, 199, 199, 0.22);
		border-radius: 50%;
		background: none;
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
