<!-- 申请分销商 -->
<template>
	<view class="apply-commission-wrap">
		<!-- 标题栏 -->
		<view class="head-box" :style="{ backgroundImage: ' url(' + formHeadImg + ')' }">
			<shopro-navbar back-icon-color="#fff" :background="{}"></shopro-navbar>
		</view>

		<!-- 表单 -->
		<view class="apply-form">
			<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
				<block v-for="(form, index) in formList" :key="index">
					<u-form-item v-if="form.type === 'input'" :labelStyle="labelStyle" 　 label-width="150" label-position="left" :label="form.name" :prop="`value${index}`">
						<u-input
							:disabled="!hasPostBtn"
							:placeholder="`请输入${form.name}`"
							:placeholderStyle="placeholderStyle"
							v-model="model['value' + index]"
							type="text"
						></u-input>
					</u-form-item>
					<u-form-item v-if="form.type === 'number'" :labelStyle="labelStyle" label-position="left" :label="form.name" :prop="`value${index}`" label-width="150">
						<u-input
							:disabled="!hasPostBtn"
							:placeholder="`请输入${form.name}`"
							:placeholderStyle="placeholderStyle"
							v-model="model['value' + index]"
							type="number"
						></u-input>
					</u-form-item>
					<u-form-item
						v-if="form.type === 'image'"
						:labelStyle="labelStyle"
						:prop="`value${index}`"
						:label="form.name"
						label-position="top"
						label-width="150"
						:borderBottom="true"
					>
						<u-upload
							:deletable="hasPostBtn"
							:placeholderStyle="placeholderStyle"
							:showProgress="false"
							@on-uploaded="uploadSuccess($event, `value${index}`)"
							@on-remove="uploadRemove($event, `value${index}`)"
							:file-list="model[`valueList${index}`]"
							:action="`${$BASE_URL}/api/common/upload`"
							:header="{token: token}"
							width="148"
							height="148"
							maxCount="1"
						></u-upload>
					</u-form-item>
				</block>

				<view class="agreement u-flex" v-if="protocol && hasPostBtn">
					<u-checkbox v-model="model.agreement" activeColor="#b095ff" shape="circle" @change="onAgreement"></u-checkbox>
					<view class="agreement-text" @tap="$Router.push({ path: '/pages/public/richtext', query: { id: protocol.richtext_id } })">
						我已阅读并遵守
						<text class="text-underline">{{ protocol.name }}</text>
					</view>
				</view>
				<button class="u-reset-button save-btn" v-if="hasPostBtn" @tap="onSubmit" :disabled="isFormEnd">确认提交</button>
			</u-form>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			formList: [], //返回的表单
			formHeadImg: '', //表单头部背景
			protocol: null, //协议
			isFormEnd: false, //提交成功
			hasPostBtn: false, //是否显示提交按钮
			errorType: ['message'],
			labelStyle: {
				'font-size': '28rpx',
				'font-weight': '500',
				color: '#333'
			},
			placeholderStyle: 'font-size: 28rpx;color:#c4c4c4;',
			model: {},
			inputNumber: [
				{
					required: true,
					message: '内容不能为空！',
					trigger: ['change', 'blur']
				}
			],
			inputImage: [
				{
					required: true,
					message: '请上传图片',
					trigger: ['change', 'blur']
				}
			],
			rules: {},
			token: uni.getStorageSync('token')
		};
	},
	computed: {},
	onLoad() {
		this.getFrom();
	},
	methods: {
		// 上传图片成功-单图
		uploadSuccess(e, value) {
			this.model[value] = e[0].response.data.url;
		},

		// 移除图片
		uploadRemove(index, value) {
			this.model[value] = '';
		},

		// 勾选同意
		onAgreement(e) {
			this.model.agreement = e.value;
		},

		// 获取申请分销商表单
		getFrom() {
			let that = this;
			that.$http('commission.form').then(res => {
				if (res.code === 1) {
					that.protocol = res.data.apply_protocol; //表单协议同
					that.formList = res.data.apply_info; //表单
					that.hasPostBtn = res.data.apply_status; //是否显示提交按钮
					that.formHeadImg = res.data.background_image ? res.data.background_image : this.$IMG_URL + '/imgs/commission/apply_bg.png'; //头部背景
					that.initRules(); //规则
					that.$refs.uForm.setRules(that.rules);
				}
			});
		},

		// 构建验证规则
		initRules() {
			let that = this;
			that.formList.forEach((item, index) => {
				that.model = {
					...that.model,
					...{
						[`value${index}`]: item.value ? item.value : null
					}
				}; //构造model数据
				that.model.agreement = false;
				if (item.type === 'input' || item.type === 'number') {
					//构造表单验证规则
					that.rules = {
						...that.rules,
						...{
							[`value${index}`]: that.inputNumber
						}
					};
				}
				if (item.type === 'image') {
					if (item.value) {
						let arr = [];
						arr.push({ url: item.value });
						that.model = {
							...that.model,
							...{
								[`valueList${index}`]: arr
							}
						};
					}

					that.rules = {
						...that.rules,
						...{
							[`value${index}`]: that.inputImage
						}
					};
				}
			});
		},

		//申请分销商
		applyCommission(data) {
			let that = this;
			that.isFormEnd = true;
			that.$http(
				'commission.apply',
				{
					data: data
				},
				'申请中...'
			).then(res => {
				that.isFormEnd = false;
				if (res.code === 1) {
					uni.showToast({
						title: res.msg,
						success: () => {
							that.$Router.back();
						}
					});
				}
			});
		},

		// 提交
		onSubmit() {
			let that = this;
			this.$refs.uForm.validate(valid => {
				if (valid) {
					if (!this.model.agreement && this.protocol) return this.$u.toast('请勾选协议');
					let formData = this.formList;
					formData.map((item, index) => {
						item.value = that.model[`value${index}`];
					});
					this.applyCommission(formData);
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
		width: 100%;
		height: 400rpx;
		background-size: 100% auto;
		background-repeat: no-repeat;
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
			color: #b095ff;
			.text-underline {
				text-decoration: underline;
			}
		}
	}

	.save-btn {
		width: 690rpx;
		line-height: 86rpx;
		background: linear-gradient(-90deg, #a36fff, #5336ff);
		box-shadow: 0px 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
		border-radius: 43rpx;
		font-weight: 500;
		color: #ffffff;
		margin: 30rpx auto;
	}
}
</style>
