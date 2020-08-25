<template>
	<form>
		<view class="page_box">
			<view class="head_box"></view>
			<view class="content_box pad">
				<view class="form-item">
					<view class="inp-title">
						请选择类型
						<text v-if="errTips.type" style="color: red; font-size: 24rpx;">({{ errTips.type }})</text>
					</view>
					<view class="err-msg"></view>
					<radio-group class="y-start radio-box">
						<label class="radio-item x-f" v-for="type in typeList" :key="type.code" @tap="changeType(type.code)">
							<radio class="orange radio-inp" :class="{ chekced: type === type.code }" :checked="type === type.code"></radio>
							<text class="radio-title">{{ type.name }}</text>
						</label>
					</radio-group>
				</view>
				<view class="form-item">
					<label>
						<view class="inp-title">相关描述</view>
						<view class="area-box">
							<textarea
								class="inp-area"
								v-model="content"
								name="message"
								placeholder="客官~您对我们的服务还满意吗，请给予我们你的意见我 们将做的更好~"
								placeholder-class="pl-style"
							/>
							<view class="img-box">
								<view class="preview-box" v-for="(item, index) in imgList" :key="index">
									<image class="preview-img" :src="item" mode="aspectFill"></image>
									<text class="cuIcon-close" @tap="DelImg(index)"></text>
								</view>
								<view class="choose-img x-c" @tap="onChooseImg" v-if="imgList.length < 10"><text class="cuIcon-cameraadd"></text></view>
							</view>
						</view>
					</label>
				</view>
				<view class="form-item">
					<label>
						<view class="inp-title">联系方式</view>
						<input class="inp" v-model="phone" name="phone" type="number" placeholder="请输入您的联系电话" placeholder-class="pl-style" />
					</label>
				</view>
			</view>
			<view class="foot_box x-bc pad">
				<button class="cu-btn post-btn" @tap="addFeedback">提交</button>
				<button class="cu-btn contact-btn" @tap="onService">联系客服</button>
			</view>
		</view>
	</form>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			imgList: [], //图片
			type: '', //类型
			content: '', //描述
			phone: '', //电话
			typeList: [],
			errTips: {}
		};
	},
	computed: {},
	onLoad() {
		this.getFeedbackType();
	},
	methods: {
		// 跳转客服
		onService() {
			this.$Router.push('/pages/public/kefu/index');
		},
		// 获取意见分类
		getFeedbackType() {
			let that = this;
			that.$api('feedback.type').then(res => {
				if (res.code === 1) {
					that.typeList = res.data;
				}
			});
		},

		addFeedback() {
			let that = this;
			let formData = {
				type: that.type,
				content: that.content,
				images: that.imgList,
				phone: that.phone
			};
			that.$api('feedback.add', formData).then(res => {
				if (res.code === 1) {
					that.$tools.toast('提交成功');
					setTimeout(() => {
						that.$Router.back();
					}, 300);
				}
			});
		},
		changeType(e) {
			this.type = e;
		},
		// 选择图片
		onChooseImg() {
			let that = this;
			that.$tools.chooseImage(1).then(res => {
				res.forEach(img => {
					that.$tools.uploadImage('index/upload', img).then(res => {
						that.imgList.push(res.full_url);
					});
				});
			});
		},
		DelImg(index) {
			uni.showModal({
				title: '删除照片',
				content: '确定要删除这张照片么？',
				cancelText: '取消',
				confirmText: '删除',
				success: res => {
					if (res.confirm) {
						this.imgList.splice(index, 1);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.page_box {
	background: #fff;
}
.form-item {
	margin-top: 30rpx;
	.inp-title {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		align-items: center;
		margin-bottom: 30rpx;
	}
	.inp {
		width: 690rpx;
		height: 84rpx;
		background: rgba(249, 250, 251, 1);
		border-radius: 20rpx;
		padding: 0 30rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333;
		margin-bottom: 38rpx;
	}
	.inp-house {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(177, 179, 199, 1);
	}
	.area-inp {
		height: 190upx;
		padding: 30rpx;
	}
	.pl-style {
		font-size: 26rpx;
		font-family: PingFang SC;
		color: rgba(177, 179, 199, 1);
	}
}
.area-box {
	width: 690rpx;
	min-height: 306rpx;
	background: rgba(249, 250, 251, 1);
	border-radius: 20rpx;
	padding: 28rpx;
	.pl-style {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(177, 179, 199, 1);
		line-height: 50rpx;
	}
	.inp-area {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333;
		line-height: 50rpx;
		width: 100%;
	}
	.img-box {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 20rpx;
		.choose-img,
		.preview-box {
			width: 108rpx;
			height: 108rpx;
			background: rgba(249, 250, 251, 1);
			border: 1rpx solid rgba(223, 223, 223, 1);
			margin-right: 25rpx;
			margin-bottom: 25rpx;
			position: relative;
			&:nth-child(5n) {
				margin-right: 0;
			}
			.cuIcon-cameraadd {
				font-size: 50rpx;
				color: #dfdfdf;
			}
			.preview-img {
				width: 100%;
				height: 100%;
			}
			.cuIcon-close {
				background: linear-gradient(90deg, rgba(216, 159, 100, 1), rgba(235, 193, 150, 1));
				border-radius: 50%;
				width: 40rpx;
				line-height: 40rpx;
				color: #fff;
				text-align: center;
				position: absolute;
				top: -10rpx;
				right: -10rpx;
			}
		}
	}
}
.foot_box {
	border-top: 1rpx solid #eeeeee;
	height: 100rpx;
	.contact-btn {
		flex: 1;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(103, 104, 105, 1), rgba(82, 82, 82, 1));
		box-shadow: 0px 2rpx 5rpx 0px rgba(102, 103, 104, 0.46);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
	.post-btn {
		flex: 1;
		height: 74rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0rpx rgba(229, 138, 0, 0.22);
		border-radius: 37rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
}

.radio-box {
	margin-top: 30rpx;
	.radio-item {
		margin-bottom: 40rpx;
		.radio-inp {
			transform: scale(0.7);
			margin-right: 10rpx;
		}
		.radio-title {
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
		}
	}
}
.uni-radio-input-checked {
	background-color: #f37b1d !important;
	border: #f37b1d !important;
}
</style>
