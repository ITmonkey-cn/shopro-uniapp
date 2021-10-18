<!-- 商家信息 -->
<template>
	<view class="merchant-info-box">
		<label class="u-flex u-col-center form-item">
			<text class="form-tilte">门店名称：</text>
			<view class="form-content">{{ storeDetail.name }}</view>
		</label>
		<label class="u-flex u-col-center form-item">
			<text class="form-tilte">联系电话：</text>
			<view class="form-content">{{ storeDetail.phone }}</view>
		</label>
		<!-- 营业时间 -->
		<label class="u-flex u-col-center form-item">
			<text class="form-tilte">营业时间：</text>
			<view class="form-content">{{ storeDetail.openhours }}</view>
		</label>
		<!-- 选择星期 -->
		<view class="u-flex u-col-top form-item u-m-b-20">
			<text class="form-tilte">营业星期：</text>
			<view class="form-content u-flex u-flex-wrap u-row-left">
				<button class="cu-btn sm u-m-r-10 u-m-b-10 u-m-l-0" :class="!storeWeek.includes(week.value)?'line-green':'bg-green'" v-for="week in weekList" :key="week.title">
					{{ week.title }}
				</button>
			</view>
		</view>

		<!-- 选择省市 -->
		<label class="u-flex u-col-top form-item ">
			<text class="form-tilte">门店地址：</text>
			<view class="form-content">{{ storeDetail.province_name }}{{ storeDetail.city_name }}{{ storeDetail.area_name }}{{ storeDetail.address }}</view>
		</label>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			storeWeek: [],
			storeDetail: {}, //门店信息
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
					value: '7'
				}
			]
		};
	},
	computed: {},
	onLoad() {
		this.getStoreDetail();
	},
	methods: {
		getStoreDetail() {
			let that = this;
			that.$http('store.info', {
				store_id: uni.getStorageSync('storeId')
			}).then(res => {
				if (res.code === 1) {
					that.storeDetail = res.data;
					that.storeWeek = res.data.openweeks.split(',');
				}
			});
		}
	}
};
</script>

<style lang="scss">
.merchant-info-box {
	border-top: 1rpx solid #f5f5f5;
	.form-item {
		background-color: #fff;
		border-bottom: 1rpx solid #f5f5f5;
		padding: 20rpx 30rpx;
		.form-title {
			font-size: 28rpx;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
		}
		.form-content {
			font-size: 28rpx;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			flex: 1;
		}
	}
}
</style>
