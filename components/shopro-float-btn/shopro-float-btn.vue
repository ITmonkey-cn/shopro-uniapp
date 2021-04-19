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
		<view class="cu-modal" :class="{ show: showModal }" cathctouchmove @tap="hideModal" v-if="showModal">
			<view class="cu-dialog" @tap.stop style="background: none;overflow: visible;">
				<view class="img-box">
					<view class="img-wrap"><image class="modal-img" :src="modalImg" mode="widthFix" @tap="saveImage(modalImg)"></image></view>
					<text class="cuIcon-roundclose" @tap="hideModal"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 悬浮按钮，悬浮菜单。全局通用，数据为vuex初始化导入。
 * @property {Array} floatList - 悬浮按钮菜单数据列表
 */
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
		// 当前页面路径
		currentPath() {
			let pages = getCurrentPages();
			let currPage = null;
			if (pages.length) {
				currPage = pages[pages.length - 1].route;
			}
			return '/' + currPage;
		},
		// 悬浮按钮数据列表
		floatList() {
			if (this.floatData) {
				let arr = this.floatData.list.filter(item => {
					return item.page.includes(this.currentPath);
				});
				return arr;
			}
		}
	},
	created() {},
	methods: {
		hideModal() {
			this.showModal = false;
			this.showBtnList = false;
		},
		hideBtnModal() {
			this.showBtnList = false;
		},
		// 如果悬浮按钮数据为一条，按钮图片为唯一菜单项图片和标题
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
		// 微信权限判断
		getSetting: function() {
			return new Promise((resolve, reject) => {
				uni.getSetting({
					success: res => {
						if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
							resolve(0);
							return;
						}
						if (res.authSetting['scope.writePhotosAlbum']) {
							resolve(1);
						} else {
							resolve(2);
						}
					}
				});
			});
		},
		// 微信打开权限设置
		openSetting: function() {
			uni.openSetting({
				success: res => {
					console.log(res);
				},
				fail: err => {
					console.log(err);
					this.$tools.toast('请开启相册权限');
				}
			});
		},
		saveImageToPhotosAlbum(path) {
			uni.saveImageToPhotosAlbum({
				filePath: path,
				success: res => {
					this.$tools.toast('保存成功');
				},
				fail: err => {
					console.log(`图片保存失败:`, err);
					this.$tools.toast('保存失败');
				}
			});
		},
		// 保存图片
		async saveImage(path) {
			let that = this;
			let platform = uni.getStorageSync('platform');
			let checkPermission = await that.$tools.checkAppAlbum();
			if (platform === 'wxOfficialAccount') {
				that.$tools.toast('长按图片保存');
			} else if (checkPermission) {
				// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ
				await uni.authorize({
					scope: 'scope.writePhotosAlbum'
				});

				let status = await this.getSetting();
				if (status === 1) {
					const res = await uni.downloadFile({
						url: path
					});
					if (res[1].statusCode === 200) {
						await this.saveImageToPhotosAlbum(res[1].tempFilePath);
					}
					return;
				} else {
					if (status === 2) {
						that.openSetting();
						return;
					}
				}
				// #endif
				this.saveImageToPhotosAlbum(path);
			}
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

.cu-dialog {
	width: 610rpx;
}
.img-box {
	position: relative;
	.modal-img {
		width: 100%;
	}
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
