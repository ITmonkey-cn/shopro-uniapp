<template>
	<view class="merchant-info-box">
		<label class="x-f form-item">
			<text class="form-tilte">门店名称：</text>
			<input class="form-input" type="text" v-model="merchantInfo.shopName" placeholder-class="form-input--pl" placeholder="请填写门店名称" />
		</label>
		<label class="x-f form-item">
			<text class="form-tilte">联系电话：</text>
			<input class="form-input" type="number" v-model="merchantInfo.shopPhone" placeholder-class="form-input--pl" placeholder="请输入手机号" />
		</label>
		<!-- 营业时间 -->
		<label class="x-f form-item">
			<text class="form-tilte">营业时间：</text>
			<picker class="flex-sub" mode="time" @change="selTime($event, 'star')" v-model="merchantInfo.starTime" style="margin-right: 20rpx;">
				<view class="time-box x-f">
					<view class="time-content">开始时间：{{ merchantInfo.starTime }}</view>
					<text class="cuIcon-triangledownfill"></text>
				</view>
			</picker>
			<picker class="flex-sub" @change="selTime($event, 'end')" mode="time" v-model="merchantInfo.endTime">
				<view class="time-box x-f">
					<view class="time-content">结束时间：{{ merchantInfo.endTime }}</view>
					<text class="cuIcon-triangledownfill"></text>
				</view>
			</picker>
		</label>
		<!-- 选择星期 -->
		<checkbox-group class="week-box x-ac" style="margin-bottom: 20rpx;">
			<label class="week-tiem" v-for="week in weekList" :key="week.title" @tap="selWeek(week.value)">
				<checkbox class="round orange" :class="{ checked: merchantInfo.week.includes(week.value) }" style="transform:scale(0.6)" />
				<text class="week-title">{{ week.title }}</text>
			</label>
		</checkbox-group>
		<!-- 选择省市 -->
		<label class="x-f form-item" @tap="selCity">
			<text class="form-tilte">门店地址：</text>
			<input class="form-input" type="text" disabled="" v-model="merchantInfo.area" placeholder-class="form-input--pl" placeholder="请选择省/市/区/" />
			<text class="cuIcon-right"></text>
		</label>
		<!-- 详细地址 -->
		<view class="address-box form-item">
			<textarea
				class="form-textarea form-input"
				v-model="merchantInfo.address"
				placeholder-class="form-input--pl"
				placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等"
			/>
		</view>
		<shopro-picker ref="shoproCityPicker" :pickerValueDefault="cityPickerValueDefault" @onCancel="onCancel" @onConfirm="onConfirm"></shopro-picker>
		<!-- 提交 -->
		<view class="x-c"><button class="cu-btn save-btn" @tap="onSave">保存</button></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			merchantInfo: {
				shopName: '',
				shopPhone: '',
				starTime: '',
				endTime: '',
				week: [],
				area: '',
				address: ''
			},
			weekList: [
				//星期
				{
					title: '周一',
					value: '1'
				},
				{
					title: '周二',
					value: '2'
				},
				{
					title: '周三',
					value: '3'
				},
				{
					title: '周四',
					value: '4'
				},
				{
					title: '周五',
					value: '5'
				},
				{
					title: '周六',
					value: '6'
				},
				{
					title: '周日',
					value: '0'
				}
			],
			cityPickerValueDefault: [0, 0, 0] //城市
		};
	},
	computed: {},
	onLoad() {},
	methods: {
		// 选择时间
		selTime(e, type) {
			switch (type) {
				case 'star':
					this.merchantInfo.starTime = e.detail.value;
					break;
				case 'end':
					this.merchantInfo.endTime = e.detail.value;
					break;
				default:
					break;
			}
		},
		// 选择日期
		selWeek(val) {
			if (this.merchantInfo.week.includes(val)) {
				let index = this.merchantInfo.week.indexOf(val);
				this.merchantInfo.week.splice(index, 1);
			} else {
				this.merchantInfo.week.push(val);
			}
		},
		// 选择省市区
		selCity() {
			this.$refs.shoproCityPicker.show();
		},
		onConfirm(e) {
			// this.merchantInfo.area_id = e.cityCode;
			this.merchantInfo.area = e.label;
		},
		onCancel(e) {
			// this.addressData.area_id = e.cityCode;
			this.merchantInfo.area = e.label;
		},
		// 提交
		onSave() {
			console.log('门店提交信息', this.merchantInfo);
		}
	}
};
</script>

<style lang="scss">
.merchant-info-box {
	border-top: 1rpx solid #f5f5f5;
	.form-item {
		height: 96rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #f5f5f5;
		padding: 0 30rpx;
		.form-title {
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
		}
		.form-input {
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			flex: 1;
		}
		.form-input--pl {
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #999999;
		}
		.cuIcon-right {
			color: #999;
		}
		.time-box {
			flex: 1;
			background: #f5f5f5;
			height: 56rpx;
			border-radius: 10rpx;
			padding: 0 10rpx;
			.time-content {
				color: #ccc;
				font-size: 26rpx;
				flex: 1;
			}
			.cuIcon-triangledownfill {
				color: #ccc;
			}
		}
	}
}
// 选择星期
.week-box {
	height: 100rpx;
	padding: 0 20rpx;
	background-color: #fff;
	.week-tiem {
		.week-title {
			font-size: 22rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
		}
	}
}
// 详细地址
.address-box {
	background: #fff;
	min-height: 200rpx;
	.form-textarea {
		width: 100%;
		padding: 30rpx 0;
		height: 200rpx;
	}
}
// 提交
.save-btn {
	width: 710rpx;
	height: 80rpx;
	background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
	border: 1rpx solid rgba(238, 238, 238, 1);
	border-radius: 40rpx;
	color: #fff;
	font-size: 30rpx;
	font-family: PingFang SC;
	font-weight: 500;
	margin-top: 300rpx;
}
</style>
