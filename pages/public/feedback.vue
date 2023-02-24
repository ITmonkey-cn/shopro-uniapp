<!-- 问题反馈 -->
<template>
	<u-form :model="model" ref="uForm">
		<view class="feedback-wrap u-p-30">
			<!-- 选择类型 -->
			<u-form-item label-position="top" :border-bottom="false" :labelStyle="labelStyle" label="请选择类型" prop="type" label-width="150">
				<u-radio-group v-model="model.type" width="100%" active-color="#f37b1d">
					<u-radio shape="circle" v-for="(item, index) in typeList" :key="index" :name="item.code">{{ item.name }}</u-radio>
				</u-radio-group>
			</u-form-item>

			<!-- 相关描述 -->
			<view class="form-item">
				<label>
					<view class="inp-title">相关描述</view>
					<view class="area-box">
						<textarea
							class="inp-area"
							v-model="model.content"
							name="message"
							placeholder="客官~您对我们的服务还满意吗，请给予我们你的意见我们将做的更好~"
							placeholder-class="pl-style"
						/>
						<view class="img-box">
							<u-upload
								:showProgress="false"
								@on-uploaded="uploadSuccess"
								@on-remove="uploadRemove"
								:action="`${$BASE_URL}/api/common/upload`"
								:header="{token: token}"
								width="140"
								height="140"
								maxCount="9"
							></u-upload>
						</view>
					</view>
				</label>
			</view>

			<!-- 联系方式 -->
			<view class="form-item">
				<label>
					<view class="inp-title">联系方式</view>
					<input class="inp" v-model="model.phone" name="phone" type="number" placeholder="请输入您的联系电话" placeholder-class="pl-style" />
				</label>
			</view>

			<!-- 底部按钮 -->
			<view class="foot_box u-flex u-row-between u-col-center">
				<button class="u-reset-button post-btn" @tap="addFeedback">提交</button>
				<button class="u-reset-button contact-btn" @tap="onService">联系客服</button>
			</view>
		</view>
	</u-form>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			model: {
				type: '',
				content: '',
				phone: '',
				images: []
			},
			labelStyle: {
				'font-size': '30rpx',
				'font-weight': '600',
				color: '#333'
			},
			imgList: [], //图片
			typeList: [] ,//类型列表
			token: uni.getStorageSync('token')
		};
	},
	computed: {},
	onLoad() {
		this.getFeedbackType();
	},
	methods: {
		// 跳转客服
		onService() {
			this.$Router.push('/pages/public/chat/index');
		},

		// 获取意见分类
		getFeedbackType() {
			let that = this;
			that.$http('other.feedbackType').then(res => {
				if (res.code === 1) {
					that.typeList = res.data;
				}
			});
		},

		// 上传图片成功
		uploadSuccess(e) {
			this.model.images = [];
			e.forEach(item => {
				this.model.images.push(item.response.data.url);
			});
		},

		// 移除图片
		uploadRemove(index) {
			this.model.images.splice(index, 1);
		},

		// 提交意见
		addFeedback() {
			let that = this;
			that.$http('other.feedbackAdd', that.model, '提交中...').then(res => {
				uni.hideKeyboard();
				if (res.code === 1) {
					that.$u.toast('提交成功');
					that.$Router.back();
				}
			});
		}
	}
};
</script>

<style lang="scss">
.feedback-wrap {
	background: #fff;
}

.form-item {
	margin-top: 30rpx;
	.inp-title {
		font-size: 30rpx;

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

		font-weight: 500;
		color: #333;
		margin-bottom: 38rpx;
	}
	.area-inp {
		height: 190upx;
		padding: 30rpx;
	}
	.pl-style {
		font-size: 26rpx;

		color: rgba(177, 179, 199, 1);
	}
}
.area-box {
	width: 690rpx;
	min-height: 306rpx;
	background: rgba(249, 250, 251, 1);
	border-radius: 20rpx;
	padding: 20rpx;
	.pl-style {
		font-size: 26rpx;
		font-weight: 500;
		color: rgba(177, 179, 199, 1);
		line-height: 50rpx;
	}
	.inp-area {
		font-size: 26rpx;
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
	}
}

// 底部按钮
.foot_box {
	height: 100rpx;
	width: 100%;
	margin-top: 100rpx;
	.contact-btn {
		width: 340rpx;
		line-height: 74rpx;
		background: linear-gradient(90deg, rgba(103, 104, 105, 1), rgba(82, 82, 82, 1));
		box-shadow: 0px 2rpx 5rpx 0px rgba(102, 103, 104, 0.46);
		border-radius: 35rpx;
		font-size: 28rpx;

		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
	.post-btn {
		width: 340rpx;
		line-height: 74rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0rpx rgba(229, 138, 0, 0.22);
		border-radius: 37rpx;
		font-size: 28rpx;

		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
}
</style>
