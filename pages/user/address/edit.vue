<template>
	<view class="page_box" style="overflow-x: hidden;">
		<view class="head_box"></view>
		<view class="content_box">
			<view class="location-item x-bc pa20 mb20" @tap="chooseLocation">
				<view class="x-f">
					<text class="cuIcon-focus"></text>
					<text>{{ addressData.latitude ? chooseAddress : '点击定位当前地点' }}</text>
				</view>
				<text class="cuIcon-right"></text>
			</view>
			<view class="address-item x-f">
				<label class="x-f flex-sub">
					<text class="item-title">收货人：</text>
					<input class="inp flex-sub" placeholder="请填写收货人姓名" type="text" v-model="addressData.consignee" />
				</label>
			</view>
			<view class="address-item x-f">
				<label class="x-f flex-sub">
					<text class="item-title">手机号：</text>
					<input class="inp flex-sub" placeholder="请输入收货人手机号" type="number" v-model="addressData.phone" />
				</label>
			</view>
			<view class="address-item x-f" @tap="selCity">
				<label class="x-f flex-sub">
					<text class="item-title">所在地区：</text>
					<input class="inp flex-sub" disabled type="text" placeholder="点击选择所在地区" v-model="area_text" />
				</label>
			</view>
			<view class="area-box x-f">
				<label class="x-f x-start">
					<view class="area-item"><text class="item-title">详细地址：</text></view>
					<textarea
						auto-height
						class="area-inp"
						type="text"
						placeholder="如道路、门牌号、小区、楼栋号、单元室等"
						placeholder-class="area-pl"
						v-model="addressData.address"
					/>
				</label>
			</view>
			<view class="default-box x-bc">
				<text class="title">设为默认地址</text>
				<switch class="olive switch" @tap="onSwitch" :class="{ checked: addressData.is_default }" :checked="addressData.is_default"></switch>
			</view>
		</view>
		<view v-if="addressData.id != 0" class="foot_box x-bc">
			<button class="cu-btn delete-btn" @tap="deleteAddress">删除收货地址</button>
			<button class="cu-btn save-btn" @tap="editAddress">保存收货地址</button>
		</view>
		<view v-else class="foot_box "><button class="cu-btn add-btn" @tap="editAddress">保存收货地址</button></view>
		<shopro-picker ref="shoproCityPicker" :pickerValueDefault="cityPickerValueDefault" @onCancel="onCancel" @onConfirm="onConfirm"></shopro-picker>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			addressData: {
				id: 0,
				consignee: '',
				phone: '',
				area_id: '',
				address: '',
				is_default: false,
				latitude: '',
				longitude: ''
			},
			chooseAddress: '', //定位地址
			area_text: '',
			// 城市
			cityPickerValueDefault: [0, 0, 0],
			pickerData: {},
			from: ''
		};
	},
	computed: {},
	onLoad() {
		let addressId = this.$Route.query.id;
		this.addressData.id = this.$Route.query.id;
		if (this.$Route.query.addressData) {
			let wxAddress = JSON.parse(this.$Route.query.addressData); //微信导入
			this.addressData.id = 0;
			addressId = 0;
			this.addressData.consignee = wxAddress.userName;
			this.addressData.phone = wxAddress.telNumber;
			// #ifdef MP-WEIXIN
			this.area_text = `${wxAddress.provinceName}-${wxAddress.cityName}-${wxAddress.countyName}`;
			// #endif
			// #ifdef H5
			this.area_text = `${wxAddress.provinceName}-${wxAddress.cityName}-${wxAddress.countryName}`;
			// #endif

			this.addressData.area_id = wxAddress.nationalCode;
			this.addressData.address = wxAddress.detailInfo.replace(/%20/g, '');
			this.addressData.is_default = false;
		}

		if (this.addressData.id != 0) {
			this.getAddressInfo();
		}
		uni.setNavigationBarTitle({
			title: addressId != 0 ? '编辑收货地址' : '添加收货地址'
		});
		if (this.$Route.query.from) {
			this.from = this.$Route.query.from;
		}
	},
	methods: {
		// 地图选择地址
		chooseLocation() {
			uni.chooseLocation({
				success: res => {
					this.chooseAddress = res.address;
					this.addressData.latitude = res.latitude;
					this.addressData.longitude = res.longitude;
					if (this.addressData.id == 0) {
						this.addressData.address = res.address;
					}
				},
				fail: err => {
					console.log(err);
				}
			});
			// #ifdef H5
			this.$wxsdk.openAddress(res => {
				this.chooseAddress = res.address;
				this.addressData.latitude = res.latitude;
				this.addressData.longitude = res.longitude;
				if (this.addressData.id == 0) {
					this.addressData.address = res.address;
				}
			});
			// #endif
		},
		onSwitch() {
			this.addressData.is_default = !this.addressData.is_default;
		},
		selCity() {
			this.$refs.shoproCityPicker.show();
		},
		// 编辑添加地址
		editAddress() {
			let that = this;
			that.$api('address.edit', that.addressData).then(res => {
				if (res.code === 1) {
					if (that.from === 'order') {
						that.$Router.back();
					} else {
						that.$Router.back();
					}
				}
			});
		},
		// 地址信息
		getAddressInfo() {
			this.$api('address.info', {
				id: this.addressData.id
			}).then(res => {
				if (res.code === 1) {
					let data = res.data;
					let areaText = `${data.province_name}-${data.city_name}-${data.area_name}`;
					let is_default = data.is_default === '1' ? true : false;
					this.addressData = res.data;
					this.area_text = areaText;
					this.addressData.is_default = is_default;
				}
			});
		},
		onConfirm(e) {
			this.addressData.area_id = e.cityCode;
			this.area_text = e.label;
		},
		onCancel(e) {
			this.addressData.area_id = e.cityCode;
			this.area_text = e.label;
		},
		// 删除收货地址
		deleteAddress() {
			this.$api('address.del', {
				id: this.addressData.id
			}).then(res => {
				if (res.code === 1) {
					uni.showToast({
						title: '删除成功',
						icon: 'none',
						success: () => {
							uni.navigateBack({
								delta: 1
							});
						}
					});
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
	font-family: PingFang SC;
	font-weight: 500;
	background-color: #fff;
	color: rgba(167, 111, 13, 1);
	.address-box {
		border-radius: 6rpx;
		height: 72rpx;
		padding: 0 30rpx;
		width: 340rpx;
	}

	.cuIcon-focus,
	.cuIcon-location {
		font-size: 34rpx;
		margin-right: 10rpx;
	}
	.cuIcon-right {
		font-size: 32rpx;
	}
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
.foot_box {
	padding: 20rpx;

	.add-btn {
		width: 710rpx;
		height: 80rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border: 1rpx solid rgba(238, 238, 238, 1);
		border-radius: 40rpx;
		color: rgba(#fff, 0.9);
	}
	.delete-btn {
		width: 432rpx;
		height: 70rpx;
		background: linear-gradient(93deg, rgba(208, 19, 37, 1), rgba(237, 60, 48, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(#ed3c30, 0.22);
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		border-radius: 35rpx;
		padding: 0;
		margin-right: 20rpx;
	}
	.save-btn {
		width: 432rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border: 1rpx solid rgba(238, 238, 238, 1);
		border-radius: 40rpx;
		color: rgba(#fff, 0.9);
	}
}
</style>
