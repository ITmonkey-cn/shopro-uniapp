<!-- 申请分销商 -->
<template>
	<view class="apply-commission-wrap">
		<!-- 标题栏 -->
		<view class="head-box">
			<view class="nav-box"><cu-custom isBack></cu-custom></view>
		</view>
		<!-- 头部卡片 -->

		<!-- 表单 -->
		<view class="apply-form">
			<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
				<u-form-item :labelStyle="labelStyle" 　 label-width="100" label-position="left" label="姓名" prop="name">
					<u-input placeholder="请输入姓名" :placeholderStyle="placeholderStyle" v-model="model.name" type="text"></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" label-position="left" label="手机号" prop="phone" label-width="100">
					<u-input placeholder="请输入手机号" :placeholderStyle="placeholderStyle" v-model="model.phone" type="number"></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" label-width="100" label-position="left" label="微信号" prop="wxcode">
					<u-input placeholder="请输入微信号" :placeholderStyle="placeholderStyle" v-model="model.wxcode" type="text"></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" prop="images" label="身份证正面" label-position="top" label-width="150" :borderBottom="true">
					<u-upload
						:placeholderStyle="placeholderStyle"
						:showProgress="false"
						@on-uploaded="uploadSuccess($event, 'front')"
						@on-remove="uploadRemove($event, 'front')"
						:action="`${this.$API_URL}/index/upload`"
						width="148"
						height="148"
						maxCount="1"
					></u-upload>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" prop="images" label="身份证反面" label-position="top" label-width="150" :borderBottom="true">
					<u-upload
						:placeholderStyle="placeholderStyle"
						:showProgress="false"
						@on-uploaded="uploadSuccess($event, 'reverse')"
						@on-remove="uploadRemove($event, 'reverse')"
						:action="`${this.$API_URL}/index/upload`"
						width="148"
						height="148"
						maxCount="1"
					></u-upload>
				</u-form-item>
				<view class="agreement x-f">
					<u-checkbox v-model="model.agreement" activeColor="#D0C1FB" shape="circle" @change="onAgreement"></u-checkbox>
					<view class="agreement-text">勾选代表同意申请分销商协议</view>
				</view>
				<button class="cu-btn save-btn" @tap="onSubmit">确认提交</button>
			</u-form>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			// 表单
			errorType: ['message'],
			labelStyle: {
				'font-size': '28rpx',
				'font-weight': '500',
				color: '#333'
			},
			placeholderStyle: 'font-size: 28rpx;color:#c4c4c4;',
			model: {
				name: '',
				phone: '',
				wxcode: '',
				frontImages: [],
				reverseImages: [],
				agreement: false
			},
			rules: {
				name: [
					{
						required: true,
						message: '请输入姓名',
						trigger: ['change', 'blur']
					}
				],
				phone: [
					{
						required: true,
						message: '请输入手机号',
						trigger: ['change', 'blur']
					},
					{
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ['change', 'blur']
					}
				],
				wxcode: [
					{
						required: true,
						message: '请输入微信号',
						trigger: ['change', 'blur']
					}
				]
			}
		};
	},
	computed: {},
	onLoad() {},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		// 上传图片成功
		uploadSuccess(e, type) {
			let imgArr = [];
			e.forEach(item => {
				imgArr.push(item.url);
			});
			switch (type) {
				case 'reverse':
					this.model.frontImages = imgArr;
					break;
				case 'front':
					this.model.reverseImages = imgArr;
					break;
				default:
					imgArr = [];
					return;
			}
		},

		// 移除图片
		uploadRemove(index, type) {
			switch (type) {
				case 'reverse':
					this.model.frontImages.splice(index, 1);
					break;
				case 'front':
					this.model.reverseImages.splice(index, 1);
					break;
				default:
					return;
			}
		},

		// 勾选同意
		onAgreement(e) {
			this.model.agreement = e.value;
		},

		// 提交
		onSubmit() {
			let that = this;
			this.$refs.uForm.validate(valid => {
				if (valid) {
					if (!this.model.agreement) return this.$u.toast('请勾选协议');
					console.log('提交成功');
				} else {
					this.$u.toast('请完善表单');
				}
			});
		}
	}
};
</script>

<style lang="scss">
.apply-commission-wrap {
	height: 100%;
	background-color: #fff;
	.head-box {
		background: url('http://shopro.7wpp.com/imgs/commission/apply_bg.png') no-repeat;
		background-size: 100% auto;
		height: 370rpx;
	}
}
.nav-box {
	/deep/ .cu-back {
		color: #fff;
		font-size: 40rpx;
	}
}
// 表单
.apply-form {
	width: 750rpx;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	.agreement {
		margin-top: 20rpx;
		.agreement-text {
			font-size: 24rpx;
			font-weight: 500;
			color: #d0c1fb;
		}
	}
	.save-btn {
		width: 616rpx;
		height: 86rpx;
		background: linear-gradient(90deg, #a36fff, #5336ff);
		box-shadow: 0px 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
		border-radius: 43rpx;
		font-weight: 500;
		color: #ffffff;
		margin: 30rpx 0;
	}
}
</style>
