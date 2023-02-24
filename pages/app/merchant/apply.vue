<!-- 门店入驻 -->
<template>
	<view class="apply-commission-wrap page_box">
		<!-- 标题栏 -->
		<view class="head-box">
			<shopro-navbar back-icon-color="#fff" :background="{}"></shopro-navbar>
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
				<u-form-item :labelStyle="labelStyle" label-width="150" label-position="left" label="申请名称" prop="name">
					<u-input placeholder="请输入门店名称" :placeholderStyle="placeholderStyle" v-model="model.name" type="text"></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" prop="images" label="展示图片" label-position="top" label-width="150" :borderBottom="true">
					<u-upload :placeholderStyle="placeholderStyle" :showProgress="false" @on-uploaded="uploadSuccess($event, 'storeImg')" @on-remove="uploadRemove($event, 'storeImg')" :action="`${$BASE_URL}/api/common/upload`" :header="{token: token}" :file-list="model.fileImages" width="148" height="148" maxCount="1"></u-upload>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" 　 label-width="150" label-position="left" label="营业时间" prop="openhours">
					<u-input type="select" :select-open="selectShow" v-model="model.openhours" placeholder="请选择营业时间" :placeholderStyle="placeholderStyle" @click="onSelect('time')"></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" label-width="150" label-position="left" label="营业天数" prop="weeks">
					<u-input type="select" placeholder="请选择营业天数" disabled :placeholderStyle="placeholderStyle" v-model="model.weeks" @click="onSelect('week')"></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" right-icon="map-fill" :right-icon-style="{color:'#4CB89D'}" label-width="150" label-position="left" label="所在地区" prop="area">
					<u-input type="text" disabled v-model="model.area" placeholder="请点击定位" @click="chooseLocation"></u-input>
				</u-form-item>
				<u-form-item :border-bottom="false" :labelStyle="labelStyle" label-width="150" label-position="left" label="详细地址" prop="address">
					<u-input type="textarea" border placeholder="请输入详细地址~" :placeholderStyle="placeholderStyle" v-model="model.address"></u-input>
				</u-form-item>
				<view class="agreement u-flex u-col-center">
					<u-checkbox v-model="model.agreement" activeColor="#4CB89D" shape="circle" @change="onAgreement"></u-checkbox>
					<view class="agreement-text" @tap="toProtocol">勾选代表同意《申请协议》</view>
				</view>
				<view class="u-flex u-row-center u-col-center"><button class="u-reset-button save-btn" @tap="onSubmit" :disabled="isFormEnd">确认提交</button></view>
			</u-form>
		</view>

		<!-- 弹窗 -->
		<u-select v-if="selectShow" :mode="selectMode" :list="selectList" v-model="selectShow" @confirm="selectConfirm"></u-select>

		<!-- 选择星期 -->
		<u-popup v-model="showWeeksModal" safe-area-inset-bottom mode="bottom">
			<view class="week-modal">
				<view class="u-flex u-row-between u-p-x-30 week-modal--head ">
					<view></view>
					<view class="action text-green" @tap="saveWeekModal">确定</view>
				</view>
				<view class="u-flex u-flex-wrap u-p-x-30 u-p-y-30 week-modal--content">
					<view v-for="(item, index) in weekcheckbox" class="week-btn" :key="index">
						<button @tap="onSelectWeek(index)" class="cu-btn" :class="!item.checked ? 'line-green' : 'bg-green'">{{ item.name }}</button>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 权限验证 -->
		<u-popup v-model="showNotice" mode="center" border-radius="20">
			<view class="notice-modal">
				<view class="img-wrap">
					<image class="notice-img" :src="authNotice.img" mode=""></image>
				</view>
				<view class="notice-title">{{ authNotice.title }}</view>
				<view class="notice-detail">{{ authNotice.detail || '' }}</view>
				<button class="u-reset-button notice-btn" @tap="onAuthBtn(authNotice.btnPath)">{{ authNotice.btnText }}</button>
				<button class="u-reset-button back-btn" @tap="$Router.back()">返回</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Auth from '@/shopro/permission/index.js';
	import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
	import { MAP_KEY } from '@/env.js';
	export default {
		components: {},
		data() {
			return {
				showNotice: false,
				showWeeksModal: false, //星期弹窗
				isFormEnd: false,
				weekcheckbox: [{
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
				authNotice: {},
				// 表单
				errorType: ['message'],
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
					name: [{
						required: true,
						message: '请输入门店名称',
						trigger: ['change', 'blur']
					}],
					realname: [{
						required: true,
						message: '请输入真实姓名',
						trigger: ['change', 'blur']
					}],
					area: [{
						required: true,
						message: '请定位所在地区',
						trigger: ['change', 'blur']
					}],
					phone: [{
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
					openhours: [{
						required: true,
						message: '请选择营业时间',
						trigger: ['change', 'blur']
					}],
					weeks: [{
						required: true,
						message: '请选择营业天数',
						trigger: ['change', 'blur']
					}],
					address: [{
						required: true,
						message: '请输入详细地址',
						trigger: ['change', 'blur']
					}]
				},
				token: uni.getStorageSync('token')
			};
		},
		computed: {
			...mapGetters(['initStore']),
			selectWorkerTime() {
				let mArr = [];
				for (let i = 0; i <= 24; i++) {
					let t = String(i).padStart(2, '0');
					mArr.push({
						value: `${t}:00`,
						label: `${t}:00`
					}, {
						value: `${t}:30`,
						label: `${t}:30`
					});
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

			// 选择星期
			onSelectWeek(index) {
				this.weekcheckbox[index].checked = !this.weekcheckbox[index].checked;
			},

			// 弹窗按钮
			onAuthBtn(path) {
				path &&
					this.$Router.push({
						path: path
					});
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
			async chooseLocation() {
				let authState = await new Auth('userLocation').check();
				authState &&
					uni.chooseLocation({
						success: res => {
							this.model.latitude = res.latitude;
							this.model.longitude = res.longitude;
							this.getLocationInfo();
						},
						fail: err => {
							console.log(err);
						}
					});
			},

			//逆坐标解析
			async getLocationInfo() {
				this.chooseAddress = '定位中...';
				const [error, res] = await uni.request({
					url: `https://restapi.amap.com/v3/geocode/regeo?location=${this.model.longitude},${this.model.latitude}&key=${MAP_KEY}`
				});
				if (res.data.status === '1') {
					const addressComponent = res.data.regeocode.addressComponent;
					this.model.area_id = addressComponent.adcode;
					this.model.area = `${addressComponent.province}-${addressComponent.city.length ? addressComponent.city : addressComponent.province}-${addressComponent.district.length ?addressComponent.district:addressComponent.township }`;
					this.model.address = res.data.regeocode.formatted_address.replace(`${addressComponent.province}${addressComponent.city}${addressComponent.district}`, '');
				} else {
					console.log('%c逆地址解析失败，请检查是否在env中配置地图key', 'color:green;background:yellow');
				}
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

			// 勾选同意
			onAgreement(e) {
				this.model.agreement = e.value;
			},

			// 门店详情
			getStoreInfo() {
				let that = this;
				that.$http('store.shopInfo').then(res => {
					if (res.code === 1) {
						res.data && this.authStatus(res.data);
					}
				});
			},
			// 跳转门店协议
			toProtocol() {
				this.initStore.protocol && this.jump('/pages/public/richtext', { id: this.initStore.protocol })
			},

			// 初始化model
			initModel() {
				// 构建星期
				let weeksArr = this.model.openweeks.split(',');
				let weekTextArr = [];
				this.weekcheckbox.forEach(item => {
					if (weeksArr.includes(item.value)) {
						weekTextArr.push(item.name);
						item.checked = true;
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
							detail: data.status_msg,
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
							detail: data.status_msg,
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
				that.$http('store.apply', that.model, '提交中...').then(res => {
					this.isFormEnd = true;
					if (res.code === 1) {
						//  #ifdef MP-WEIXIN
						this.$store.commit('subscribeMessage', 'storeApply');
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
				if (!that.model.images.length) {
					this.$u.toast('请上传门店图片');
					return;
				}
				this.$refs.uForm.validate(valid => {
					if (valid) {
						if (!this.model.agreement) return this.$u.toast('请勾选协议');
						this.applyStore();
					} else {
						this.$u.toast('请完善表单');
					}
				});
			},
			jump(path, parmas) {
				this.$Router.push({
					path: path,
					query: parmas
				});
			}
		}
	};
</script>

<style lang="scss">
	.apply-commission-wrap {
		background-color: #fff;

		.head-box {
			background: url($IMG_URL+'/imgs/user/sh_leader_apply_head.png') no-repeat;
			background-size: 100% auto;
			height: 370rpx;
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
			width: 690rpx;
			line-height: 86rpx;
			background: linear-gradient(90deg, #2dae9c, #6bc29e);
			box-shadow: 0px 7rpx 11rpx 2rpx rgba(61, 179, 156, 0.34);
			border-radius: 43rpx;
			font-weight: 500;
			color: #ffffff;
			margin: 30rpx 0;
		}
	}

	// 星期
	.week-modal {
		.week-modal--head {
			height: 100rpx;
			border-bottom: 1rpx solid $u-border-color;

			.text-cancel {
				color: #ccc;
			}

			.text-green {
				color: #18b566;
			}
		}

		.week-modal--content {
			.week-btn {
				margin-right: 56rpx;
				margin-bottom: 30rpx;

				&:nth-of-type(4n) {
					margin-right: 0;
				}
			}
		}
	}

	// 提示
	.notice-modal {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 612rpx;
		min-height: 658rpx;
		background: #ffffff;
		padding: 30rpx;
		border-radius: 20rpx;
	
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
			line-height: 70rpx;
			background: linear-gradient(90deg, #2dae9c, #6bc29e);
			box-shadow: 0 7rpx 11rpx 2rpx rgba(61, 179, 156, 0.34);
			border-radius: 35rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #ffffff;
			margin-bottom: 10rpx;
		}

		.back-btn {
			width: 492rpx;
			height: 70rpx;
			line-height: 70rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #3ab29c;
			background: none;
		}
	}
</style>
