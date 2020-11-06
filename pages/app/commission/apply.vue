<!-- 申请分销商 -->
<template>
	<view class="apply-commission-wrap">
		<!-- 标题栏 -->
		<view class="head-box" :style="'background-image:url('+formHeadImg+')'">
			<view class="nav-box">
				<cu-custom isBack></cu-custom>
			</view>
		</view>
		<!-- 表单 -->
		<view class="apply-form">
			<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
				<block v-for="(form, index) in formList" :key="index">
					<u-form-item v-if="form.type === 'input'" :labelStyle="labelStyle" 　 label-width="150" label-position="left"
					 :label="form.name" :prop="`value${index}`">
						<u-input :placeholder="`请输入${form.name}`" :placeholderStyle="placeholderStyle" v-model="model[`value${index}`]"
						 type="text"></u-input>
					</u-form-item>
					<u-form-item v-if="form.type === 'number'" :labelStyle="labelStyle" label-position="left" :label="form.name" :prop="`value${index}`"
					 label-width="150">
						<u-input :placeholder="`请输入${form.name}`" :placeholderStyle="placeholderStyle" v-model="model[`value${index}`]"
						 type="number"></u-input>
					</u-form-item>
					<u-form-item v-if="form.type === 'image'" :labelStyle="labelStyle" :prop="`value${index}`" :label="form.name"
					 label-position="top" label-width="150" :borderBottom="true">
						<u-upload :placeholderStyle="placeholderStyle" :showProgress="false" @on-uploaded="uploadSuccess($event, `value${index}`)"
						 @on-remove="uploadRemove($event, `value${index}`)" :action="`${upLoadUrl}/index/upload`" width="148" height="148"
						 maxCount="1"></u-upload>
					</u-form-item>
				</block>

				<view class="agreement x-f" v-if="protocol">
					<u-checkbox v-model="model.agreement" activeColor="#A36FFF" shape="circle" @change="onAgreement"></u-checkbox>
					<view class="agreement-text" @tap="Router.push({ path: '/pages/public/richtext', query: { id: protocol.richtext_id } })">{{ protocol.name }}</view>
				</view>
				<button class="cu-btn save-btn" @tap="onSubmit" :disabled="isFormEnd">
					<text v-if="isFormEnd" class="cuIcon-loading2 cuIconfont-spin"></text>
					确认提交
				</button>
			</u-form>
		</view>
	</view>
</template>

<script>
	import {
		API_URL
	} from '@/env.js';
	export default {
		components: {},
		data() {
			return {
				Router: this.$Router,
				formList: [], //返回的表单
				formHeadImg: '', //表单头部背景
				protocol: null, //协议
				isFormEnd: false, //提交成功
				upLoadUrl: API_URL,
				errorType: ['message'],
				labelStyle: {
					'font-size': '28rpx',
					'font-weight': '500',
					color: '#333'
				},
				placeholderStyle: 'font-size: 28rpx;color:#c4c4c4;',
				model: {},
				inputNumber: [{
					required: true,
					message: '内容不能为空！',
					trigger: ['change', 'blur']
				}],
				inputImage: [{
					required: true,
					message: '请上传图片',
					trigger: ['change', 'blur']
				}],
				rules: {}
			};
		},
		computed: {},
		onLoad() {
			this.getFrom();
		},
		onReady() {
			this.$nextTick(() => {
				this.$refs.uForm.setRules(this.rules);
			});
		},
		methods: {
			// 上传图片成功
			uploadSuccess(e, value) {
				let imgArr = [];
				e.forEach(item => {
					imgArr.push(item.response.data.url);
				});
				this.$set(this.model, value, imgArr);
			},

			// 移除图片
			uploadRemove(index, value) {
				this.model[value].splice(index, 1);
			},

			// 勾选同意
			onAgreement(e) {
				this.model.agreement = e.value;
			},

			// 获取申请分销商表单
			getFrom() {
				let that = this;
				that.$api('commission.form').then(res => {
					if (res.code === 1) {
						that.protocol = res.data.apply_protocol; //表单协议同
						that.formList = res.data.content; //表单
						that.formHeadImg = res.data.background_image ? res.data.background_image :
							'http://shopro.7wpp.com/imgs/commission/apply_bg.png'; //头部背景
						that.formList.forEach((item, index) => {
							that.model = { ...that.model,
								...{
									[`value${index}`]: null
								}
							}; //构造model数据
							that.model.agreement = false;
							if (item.type === 'input' || item.type === 'number') {
								//构造表单验证规则
								that.rules = { ...that.rules,
									...{
										[`value${index}`]: that.inputNumber
									}
								};
							}
							if (item.type === 'image') {
								that.rules = { ...that.rules,
									...{
										[`value${index}`]: that.inputImage
									}
								};
							}
						});
					}
				});
			},

			//申请分销商
			applyCommission(data) {
				let that = this;
				that.isFormEnd = true;
				that.$api('commission.apply', {
					data: data
				}).then(res => {
					if (res.code === 1) {
						that.isFormEnd = false;
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
						if (!this.model.agreement) return this.$u.toast('请勾选协议');
						let formData = this.formList;
						formData.map((item, index) => {
							if (item.type === 'image') {
								item.value = that.model[`value${index}`][0];
							} else {
								item.value = that.model[`value${index}`];
							}
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
			background-repeat: no-repeat;
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
			width: 690rpx;
			height: 86rpx;
			background: linear-gradient(-90deg, #a36fff, #5336ff);
			box-shadow: 0px 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
			border-radius: 43rpx;
			font-weight: 500;
			color: #ffffff;
			margin: 30rpx auto;
		}
	}
</style>
