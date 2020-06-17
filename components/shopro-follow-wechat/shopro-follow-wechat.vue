<template>
	<view class="shopro-follow-wechat" v-if="showBtn">
		<button class="cu-btn wechat-btn" @tap="onWechat"><image class="wechat_img" src="/static/imgs/modal/follow-wechat.png" mode="aspectFill"></image></button>
		<view class="cu-modal" :class="[{ show: showWechat }, modalType]" cathctouchmove @tap="hideModal">
			<view class="cu-dialog" @tap.stop style="background: none;overflow: visible;">
				<view class="follow-wechat__wrap y-bc">
					<view class="follow-wechat__head">关注微信公众号</view>
					<image class="follow-wechat__code" src="/static/imgs/logo/logo.png" mode="aspectFill"></image>
					<view class="follow-wechat__notice">长按识别二维码，或保存添加</view>
					<button class="cu-btn save-btn" @tap="saveImage">保存二维码</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			showWechat: this.showModal
		};
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
			this.showWechat = false;
		},
		onWechat() {
			this.showWechat = true;
		},
		// 保存图片
		saveImage() {
			let that = this;
			let platform = uni.getStorageSync('platform');
			if (platform === 'wxOfficialAccount') {
				that.$tools.toast('长按图片保存');
			} else {
				uni.saveImageToPhotosAlbum({
					filePath: '/static/imgs/logo/logo.png',
					success: res => {
						that.$tools.toast('保存成功');
					},
					fail: err => {
						that.$tools.toast('保存失败');
					}
				});
			}
		}
	}
};
</script>

<style lang="scss">
// 按钮
.wechat-btn {
	position: fixed;
	bottom: calc(var(--window-bottom) + 30px);
	right: 30rpx;
	z-index: 888;
	background: none;
	padding: 0;
	.wechat_img {
		width: 80rpx;
		height: 94rpx;
	}
}
.follow-wechat__wrap {
	width: 612rpx;
	height: 725rpx;
	background: rgba(255, 255, 255, 1);
	border-radius: 20rpx;
	position: relative;
	left: 50%;
	transform: translateX(-50%);
	padding: 50rpx 0;
	.follow-wechat__head {
		font-size: 35rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(70, 53, 27, 1);
	}
	.follow-wechat__code {
		width: 241rpx;
		height: 241rpx;
		background: rgba(249, 241, 230, 1);
	}
	.follow-wechat__notice {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
	}
	.save-btn {
		width: 492rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
}
</style>
