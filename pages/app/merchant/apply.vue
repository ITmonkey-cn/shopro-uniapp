<!-- 门店入驻 -->
<template>
	<view class="apply-commission-wrap page_box">
		<!-- 标题栏 -->
		<view class="head-box">
			<view class="nav-box"><cu-custom isBack></cu-custom></view>
		</view>
		<!-- 表单 -->
		<view class="apply-form content_box">
			<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
				<u-form-item :labelStyle="labelStyle" 　 label-width="150" label-position="left" label="姓名" prop="realname">
					<u-input placeholder="请输入姓名" :placeholderStyle="placeholderStyle" v-model="model.realname" type="text"></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" label-position="left" label="手机号" prop="phone" label-width="150">
					<u-input placeholder="请输入手机号" :placeholderStyle="placeholderStyle" v-model="model.phone" type="number"></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" label-width="150" label-position="left" label="门店名称" prop="name">
					<u-input placeholder="请输入门店名称" :placeholderStyle="placeholderStyle" v-model="model.name" type="text"></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" prop="images" label="门店图片" label-position="top" label-width="150" :borderBottom="true">
					<u-upload
						:placeholderStyle="placeholderStyle"
						:showProgress="false"
						@on-uploaded="uploadSuccess($event, 'storeImg')"
						@on-remove="uploadRemove($event, 'storeImg')"
						:action="`${upLoadUrl}/index/upload`"
						:file-list="model.fileImages"
						width="148"
						height="148"
						maxCount="1"
					></u-upload>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" 　 label-width="150" label-position="left" label="营业时间" prop="openhours">
					<u-input
						type="select"
						:select-open="selectShow"
						v-model="model.openhours"
						placeholder="请选择营业时间"
						:placeholderStyle="placeholderStyle"
						@click="onSelect('time')"
					></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" 　 label-width="150" label-position="left" label="营业天数" prop="weeks">
					<u-input type="select" placeholder="请选择营业天数" disabled :placeholderStyle="placeholderStyle" v-model="model.weeks" @click="onSelect('week')"></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" 　 label-width="150" label-position="left" label="所在地区" prop="area_id">
					<u-input type="select" :select-open="pickerShow" v-model="model.area" placeholder="请选择地区" @click="pickerShow = true"></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" label-width="150" label-position="left" label="详细地址" prop="address">
					<u-input
						type="textarea"
						disabled
						border
						placeholder="点击获取详细地址"
						:placeholderStyle="placeholderStyle"
						@click="chooseLocation"
						v-model="model.address"
					></u-input>
				</u-form-item>
				<view class="agreement x-f">
					<u-checkbox v-model="model.agreement" activeColor="#4CB89D" shape="circle" @tap="onAgreement"></u-checkbox>
					<view class="agreement-text">勾选代表同意申请分销商协议</view>
				</view>
				<button class="cu-btn save-btn" @tap="onSubmit" :disabled="isFormEnd">
					<text v-if="isFormEnd" class="cuIcon-loading2 cuIconfont-spin"></text>
					确认提交
				</button>
			</u-form>
		</view>
		<u-select :mode="selectMode" :list="selectList" v-model="selectShow" @confirm="selectConfirm"></u-select>
		<u-picker mode="region" v-model="pickerShow" @confirm="regionConfirm"></u-picker>
		<view class="cu-modal bottom-modal" :class="{ show: showWeeksModal }" @tap="hideWeekModal">
			<view class="cu-dialog" @tap.stop>
				<view class="cu-bar bg-white">
					<view class="action text-blue" @tap="hideWeekModal">取消</view>
					<view class="action text-green" @tap="saveWeekModal">确定</view>
				</view>
				<view class="grid col-3 padding-sm">
					<view v-for="(item, index) in weekcheckbox" class="padding-xs" :key="index">
						<button class="cu-btn orange mini block" :class="item.checked ? 'bg-green' : 'line-green'" @tap="onSelectWeek(index)">{{ item.name }}</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 权限验证 -->
		<view class="auth-box cu-modal" :class="{ show: showNotice }">
			<view class="notice-box cu-dialog">
				<view class="img-wrap"><image class="notice-img" :src="authNotice.img" mode=""></image></view>
				<view class="notice-title">{{ authNotice.title }}</view>
				<view class="notice-detail">{{ authNotice.detail }}</view>
				<button class="cu-btn notice-btn" @tap="onAuthBtn(authNotice.btnPath)">{{ authNotice.btnText }}</button>
				<button class="cu-btn back-btn" @tap="$Router.back()">返回</button>
			</view>
		</view>
	</view>
</template>

<script>
import { API_URL } from '@/env.js';
export default {
	components: {},
	data() {
		return {
			upLoadUrl: API_URL,
			showNotice: false,
			showWeeksModal: false,
			isFormEnd: false,
			weekcheckbox: [
				{
					value: '1',
					name: '周一',
					checked: false
				},

				{
					value: '2',
					name: '周二',
					checked: false
				},
				{
					value: '3',
					name: '周三',
					checked: false
				},
				{
					value: '4',
					name: '周四',
					checked: false
				},
				{
					value: '5',
					name: '周五',
					checked: false
				},
				{
					value: '6',
					name: '周六',
					checked: false
				},
				{
					value: '7',
					name: '周日',
					checked: false
				}
			],
			authNotice: {
				//权限提示内容
				// img: this.$IMG_URL + '/imgs/commission/auth_check.png',
				// title: '正在审核中！',
				// detail: '请耐心等候',
				// btnText: '知道了'
			},
			// 表单
			errorType: ['message'],
			pickerShow: false,
			selectShow: false,
			selectMode: 'mutil-column', // single-column, mutil-column, mutil-column-auto
			selectType: '',
			selectList: [],
			labelStyle: {
				'font-size': '28rpx',
				'font-weight': '500',
				color: '#333'
			},
			placeholderStyle: 'font-size: 28rpx;color:#c4c4c4;',
			model: {
				name: '', //门店名称
				phone: '', //手机号
				realname: '', //真实姓名
				openhours: '', //营业时间
				openweeks: '', //营业周期
				weeks: '',
				area: '',
				area_id: '', //行政区域ID
				address: '', //门店地址
				latitude: '', //纬度
				longitude: '', //京都
				images: [], //门店图片
				images_original: [],
				fileImages: [],
				agreement: false
			},
			rules: {
				name: [
					{
						required: true,
						message: '请输入门店名称',
						trigger: ['change', 'blur']
					}
				],
				realname: [
					{
						required: true,
						message: '请输入真实姓名',
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
				openhours: [
					{
						required: true,
						message: '请选择营业时间',
						trigger: ['change', 'blur']
					}
				],
				weeks: [
					{
						required: true,
						message: '请选择营业天数',
						trigger: ['change', 'blur']
					}
				],
				area: [
					{
						required: true,
						message: '请选择所在地区',
						trigger: ['change', 'blur']
					}
				],
				address: [
					{
						required: true,
						message: '请输入详细地址',
						trigger: ['change', 'blur']
					}
				]
			}
		};
	},
	computed: {
		selectWorkerTime() {
			let mArr = [];
			for (let i = 0; i <= 24; i++) {
				let t = String(i).padStart(2, '0');
				mArr.push(
					{
						value: `${t}:00`,
						label: `${t}:00`
					},
					{
						value: `${t}:30`,
						label: `${t}:30`
					}
				);
			}
			mArr.pop();
			return [mArr, mArr];
		}
	},
	onLoad() {
		this.getStoreInfo();
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		// 选择星期
		saveWeekModal() {
			this.showWeeksModal = false;
			let arr = [];
			let arr2 = [];
			this.weekcheckbox.forEach(item => {
				if (item.checked) {
					arr.push(item.value);
					arr2.push(item.name);
				}
			});
			this.model.openweeks = arr.join(',');
			this.model.weeks = arr2.join(',');
		},
		hideWeekModal() {
			this.showWeeksModal = false;
		},
		onSelectWeek(index) {
			this.weekcheckbox[index].checked = !this.weekcheckbox[index].checked;
		},

		// 弹窗按钮
		onAuthBtn(path) {
			if (path) {
				this.$Router.push({
					path: path
				});
			}
			this.showNotice = false;
		},

		// 上传图片成功
		uploadSuccess(e, type) {
			switch (type) {
				case 'storeImg':
					this.model.images = [];
					e.forEach(item => {
						this.model.images.push(item.response.data.url);
					});
					break;
				default:
					return;
			}
		},

		// 移除图片
		uploadRemove(index, type) {
			switch (type) {
				case 'storeImg':
					this.model.images.splice(index, 1);
					break;
				default:
					return;
			}
		},

		// 地址选择
		chooseLocation() {
			uni.chooseLocation({
				success: res => {
					this.model.address = res.address;
					this.model.latitude = res.latitude;
					this.model.longitude = res.longitude;
				},
				fail: err => {
					console.log(err);
				}
			});
		},

		onSelect(type) {
			this.selectType = type;
			switch (type) {
				case 'time':
					this.selectShow = true;
					this.selectMode = 'mutil-column';
					this.selectList = this.selectWorkerTime;
					break;
				case 'week':
					this.showWeeksModal = true;
					break;
				default:
					return;
			}
		},

		// 选择时间
		selectConfirm(e) {
			switch (this.selectType) {
				case 'time':
					this.model.openhours = '';
					e.map((val, index) => {
						this.model.openhours += this.model.openhours == '' ? val.label : ' - ' + val.label;
					});
					break;
				default:
					return;
			}
		},

		// 选择地区回调
		regionConfirm(e) {
			this.model.area = e.province.label + '-' + e.city.label + '-' + e.area.label;
			this.model.area_id = e.area.value;
		},

		// 勾选同意
		onAgreement(e) {
			this.model.agreement = !this.model.agreement;
		},

		// 门店详情
		getStoreInfo() {
			let that = this;
			that.$api('store.shopInfo').then(res => {
				if (res.code === 1) {
					this.authStatus(res.data);
				}
			});
		},

		// 初始化model
		initModel() {
			// 构建星期
			let weeksArr = this.model.openweeks.split(',');
			let weekTextArr = [];
			this.weekcheckbox.forEach(item => {
				if (weeksArr.includes(item.value)) {
					weekTextArr.push(item.name);
				}
			});
			this.model.weeks = weekTextArr.join(',');
			// 构建省市区
			if (this.model.province_name) {
				this.model.area = `${this.model.province_name}-${this.model.city_name}-${this.model.area_name}`;
			}
			if (this.model.images) {
				this.model.images.forEach(item => {
					this.model.fileImages.push({
						url: item
					});
				});
			}
			// 协议
			this.$set(this.model, 'agreement', false);
		},

		// 状态鉴权
		authStatus(data) {
			switch (String(data.status)) {
				case '0':
					this.showNotice = true;
					this.model = { ...this.model, ...data };
					this.initModel();
					this.authNotice = {
						img: this.$IMG_URL + '/imgs/commission/auth_check.png',
						title: '正在审核中',
						detail: data.msg,
						btnText: '修改信息',
						btnPath: ''
					};
					break;
				case '-1':
					this.showNotice = true;
					this.model = { ...this.model, ...data };
					this.initModel();
					this.authNotice = {
						img: this.$IMG_URL + '/imgs/commission/auth_reject.png',
						title: '您的申请已被驳回！',
						detail: data.msg,
						btnText: '重新申请',
						btnPath: ''
					};
					break;
				case '1':
					this.showNotice = false;
					break;

				default:
			}
		},

		// 申请门店
		applyStore() {
			let that = this;
			this.isFormEnd = false;
			that.$api('store.apply', that.model).then(res => {
				if (res.code === 1) {
					this.isFormEnd = true;
					//  #ifdef MP-WEIXIN
					this.$store.dispatch('getMessageIds', 'storeApply');
					//  #endif
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
					this.applyStore();
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
		background: url($IMG_URL+'/imgs/user/sh_shop_apply_head.png') no-repeat;
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
			color: #4cb89d;
		}
	}
	.save-btn {
		width: 616rpx;
		height: 86rpx;
		background: linear-gradient(90deg, #2dae9c, #6bc29e);
		box-shadow: 0px 7rpx 11rpx 2rpx rgba(61, 179, 156, 0.34);
		border-radius: 43rpx;
		font-weight: 500;
		color: #ffffff;
		margin: 30rpx 0;
	}
}

.auth-box {
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: fixed;
	z-index: 99;
	.notice-box {
		position: fixed;
		z-index: 1111;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		top: 50%;
		left: 50%;
		width: 612rpx;
		min-height: 658rpx;
		background: #ffffff;
		padding: 30rpx;
		border-radius: 20rpx;
		transform: translate(-50%, -50%);
		.img-wrap {
			margin-bottom: 50rpx;
			.notice-img {
				width: 180rpx;
				height: 170rpx;
			}
		}
		.notice-title {
			font-size: 35rpx;
			font-weight: bold;
			color: #46351b;
			margin-bottom: 28rpx;
		}
		.notice-detail {
			font-size: 28rpx;
			font-weight: 400;
			color: #999999;
			line-height: 36rpx;
			margin-bottom: 50rpx;
		}
		.notice-btn {
			width: 492rpx;
			height: 70rpx;
			background: linear-gradient(-90deg, #a36fff, #5336ff);
			box-shadow: 0px 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
			border-radius: 35rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #ffffff;
			margin-bottom: 10rpx;
		}
		.back-btn {
			width: 492rpx;
			height: 70rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #c5b8fb;
			background: none;
		}
	}
}
</style>
