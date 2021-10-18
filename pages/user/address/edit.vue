<!-- 添加修改地址 -->
<template>
	<view class="address-wrap">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<!-- 地址定位 -->
			<view class="location-item u-flex u-row-between u-p-20 u-m-b-20" @tap="getLocation">
				<view class="u-flex">
					<text class="u-iconfont uicon-map-fill" style="#a76f0d;"></text>
					<text>{{ chooseAddress }}</text>
				</view>
				<text class="u-iconfont uicon-arrow-right" style="color: #666"></text>
			</view>

			<view class="address-box">
				<!-- 地址表单 -->
				<u-form-item :labelStyle="labelStyle" 　 label-width="150" label-position="left" label="收货人:" prop="consignee">
					<u-input placeholder="请填写收货人姓名" v-model="model.consignee" type="text"></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" 　 label-width="150" label-position="left" label="手机号:" prop="phone">
					<u-input placeholder="请输入收货人手机号" v-model="model.phone" type="number"></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" label-width="150" label-position="left" label="所在地区:" prop="area_text">
					<u-input type="select" v-model="model.area_text" :select-open="showSelect" placeholder="请选择地区" @click="showSelect = true"></u-input>
				</u-form-item>
				<u-form-item :labelStyle="labelStyle" label-position="left" label-width="150" label="详细地址:" prop="address">
					<u-input border type="textarea" v-model="model.address" placeholder="如道路、门牌号、小区、楼栋号、单元室等" />
				</u-form-item>
			</view>

			<!-- 设置默认 -->
			<view class="default-box u-flex u-row-between">
				<text class="title">设为默认地址</text>
				<u-switch v-model="model.is_default" activeColor="#e9b461" size="40"></u-switch>
			</view>

			<!-- 功能按钮 -->
			<view class="foot_box u-p-30 u-m-t-50 u-flex u-row-around">
				<button v-show="addressId" class=" u-m-20 u-reset-button delete-btn u-flex-1" @tap="deleteAddress">删除收货地址</button>
				<button class=" u-m-20 u-reset-button save-btn u-flex-1" @tap="submit">保存收货地址</button>
			</view>
		</u-form>

		<!-- 省市区选择器 -->
		<u-select mode="mutil-column-auto" safe-area-inset-bottom :list="addressAreaList" v-model="showSelect" @confirm="regionConfirm"></u-select>
	</view>
</template>

<script>
import { MAP_KEY } from '@/env.js';
import Auth from '@/shopro/permission/index.js';
export default {
	components: {},
	data() {
		return {
			showSelect: false, //省市区
			addressAreaList: [],
			addressId: 0, //收货地址ID
			labelStyle: {
				'font-size': '28rpx',
				'font-weight': '600',
				color: '#595959'
			},
			model: {
				id: 0,
				consignee: '',
				phone: '',
				area_text: '',
				address: '',
				is_default: false,
				latitude: '',
				longitude: ''
			},
			rules: {
				phone: [
					{
						required: true,
						message: '请输入收货人手机号',
						trigger: ['change', 'blur']
					},
					{
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						trigger: ['change', 'blur']
					}
				],
				consignee: [
					{
						required: true,
						message: '请填写收货人姓名',
						trigger: ['change', 'blur']
					}
				],
				area_text: [
					{
						required: true,
						message: '请选择地区',
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
			},
			errorType: ['message'],
			chooseAddress: '点击选择地理位置' //定位地址
		};
	},
	computed: {},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	onLoad() {
		this.getArea();
		this.addressId = this.$Route.query.id ? this.$Route.query.id : 0;
		uni.setNavigationBarTitle({
			title: this.addressId ? '编辑收货地址' : '添加收货地址'
		});
		this.addressId && this.getAddressInfo();
		// 微信导入
		this.$Route.query.addressData && this.wxAddressInit();
	},
	methods: {
		// 获取省市区
		getArea() {
			this.$http('address.area').then(res => {
				if (res.code === 1) {
					let { provinceData, cityData, areaData } = res.data;
					provinceData.forEach((item, index) => {
						this.addressAreaList.push({ ...item, children: [] });
						this.addressAreaList[index].children.push(...cityData[index]);
						this.addressAreaList[index].children.forEach((item1, index1) => {
							item1['children'] = [];
							item1.children.push(...areaData[index][index1]);
						});
					});
				}
			});
		},
		// 微信导入数据格式
		wxAddressInit() {
			let wxAddress = this.$Route.query.addressData; //微信导入
			this.model.id = 0;
			this.model.consignee = wxAddress.userName;
			this.model.phone = wxAddress.telNumber;
			// #ifdef MP-WEIXIN
			this.model.area_text = `${wxAddress.provinceName}-${wxAddress.cityName}-${wxAddress.countyName}`;
			// #endif
			// #ifdef H5
			this.model.area_text = `${wxAddress.provinceName}-${wxAddress.cityName}-${wxAddress.countryName}`;
			// #endif
			this.model.address = wxAddress.detailInfo.replace(/%20/g, '');
			this.model.is_default = false;
		},

		// 确认省市区
		regionConfirm(e) {
			this.model.area_text = `${e[0].label}-${e[1].label}-${e[2].label}`;
		},

		// 获取定位
		async getLocation() {
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
				this.chooseAddress = res.data.regeocode.formatted_address;
				this.model.area_text = `${addressComponent.province}-${addressComponent.city.length ? addressComponent.city : addressComponent.province}-${
					addressComponent.district
				}`;
				this.model.address = res.data.regeocode.formatted_address.replace(`${addressComponent.province}${addressComponent.city}${addressComponent.district}`, '');
			} else {
				console.log('%c逆地址解析失败，请检查是否在env中配置地图key', 'color:green;background:yellow');
			}
		},

		// 提交
		submit() {
			this.$refs.uForm.validate(valid => {
				valid ? this.editAddress() : console.log('验证失败');
			});
		},

		// 编辑添加地址
		editAddress() {
			let that = this;
			that.$http(
				'address.edit',
				{
					...that.model,
					id: that.addressId
				},
				'保存中...'
			).then(res => {
				if (res.code === 1) {
					that.$Router.back();
				}
			});
		},

		// 地址信息
		getAddressInfo() {
			const that = this;
			this.$http('address.info', {
				id: that.$Route.query.id
			}).then(res => {
				if (res.code === 1) {
					let addressData = res.data;
					that.addressId = addressData.id;
					that.model.area_text = `${addressData.province_name}-${addressData.city_name}-${addressData.area_name}`;
					that.model.is_default = addressData.is_default === '1' ? true : false;
					that.model.address = addressData.address;
					that.model.phone = addressData.phone;
					that.model.consignee = addressData.consignee;
				}
			});
		},

		// 删除收货地址
		deleteAddress() {
			const that = this;
			that.$http(
				'address.del',
				{
					id: that.addressId
				},
				'删除中...'
			).then(res => {
				if (res.code === 1) {
					that.$Router.back();
				}
			});
		}
	}
};
</script>

<style lang="scss">
// 点击定位
.location-item {
	font-size: 28rpx;
	font-weight: 500;
	background-color: #fff;
	color: rgba(167, 111, 13, 1);
}

// 表单
.address-box {
	background-color: #fff;
	padding: 0 30rpx;
}
.address-item {
	height: 96rpx;
	background: #fff;
	border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);
	padding: 0 25rpx;

	.item-title {
		color: #333;
		font-size: 28rpx;
		white-space: nowrap;
	}
	.inp {
		color: #333;
		font-size: 28rpx;
	}
}
.area-box {
	min-height: 120rpx;
	padding-bottom: 60rpx;
	background: #fff;
	padding: 30rpx 25rpx;
	.item-title {
		font-size: 28rpx;
		line-height: 28rpx;
		vertical-align: middle;
		white-space: nowrap;
	}
	.area-inp {
		color: #333;
		font-size: 28rpx;
		vertical-align: middle;
		margin-top: 8rpx;
		width: 550rpx;
	}
}
.default-box {
	height: 100rpx;
	padding: 0 25rpx;
	background: #fff;
	margin-top: 20rpx;
	.title {
		font-size: 28rpx;
	}
	.switch {
		transform: scale(0.8);
	}
}
// 底部按钮
.foot_box {
	.delete-btn {
		line-height: 70rpx;
		background: linear-gradient(93deg, rgba(208, 19, 37, 1), rgba(237, 60, 48, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(#ed3c30, 0.22);
		font-size: 28rpx;

		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		border-radius: 35rpx;
		padding: 0;
		margin-right: 20rpx;
	}
	.save-btn {
		line-height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border: 1rpx solid rgba(238, 238, 238, 1);
		border-radius: 40rpx;
		color: rgba(#fff, 0.9);
	}
}
</style>
