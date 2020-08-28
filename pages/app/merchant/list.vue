<template>
	<view class="page_box store-list-wrap">
		<view class="head_box"></view>
		<view class="content_box">
			<label v-for="store in storeList" :key="store.id" @tap="selStore(store.id)">
				<view class="store-item x-bc">
					<view class="x-f">
						<view class="img-box"><image class="store-img" :src="store.image_first" mode="aspectFill" lazy-load></image></view>
						<view class="item-left y-start">
							<text class="store-title">{{ store.name }}</text>
							<text class="store-content">{{ store.city_name }}{{ store.area_name }}{{ store.address }}</text>
						</view>
					</view>

					<radio style="transform: scale(0.7);" class="orange" :checked="storeId == store.id" :class="{ checked: storeId == store.id }"></radio>
				</view>
			</label>
		</view>
		<view class="foot_box x-c"><button class="cu-btn save-btn" @tap="saveStore">确认</button></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			storeList: [],
			storeId: uni.getStorageSync('storeId')
		};
	},
	computed: {},
	onLoad() {
		this.getStoreAddress();
	},
	methods: {
		// 选择门店
		selStore(id) {
			this.storeId = id;
		},
		// 确认门店
		saveStore() {
			uni.setStorageSync('storeId', this.storeId);
			this.$Router.replace({
				path: '/pages/app/merchant/index'
			});
		},
		// 获取门店列表
		getStoreAddress() {
			let that = this;
			that.$api('store.list').then(res => {
				if (res.code == 1) {
					that.storeList = res.data;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.store-item {
	padding: 0 30rpx;
	height: 180rpx;
	background-color: #fff;
	border-bottom: 1rpx solid rgba(223, 223, 223, 0.6);
	width: 100%;
	.img-box {
		width: 100rpx;
		height: 100rpx;
		border-radius: 6rpx;
		overflow: hidden;
		margin-right: 20rpx;
		.store-img {
			width: 100rpx;
			height: 100rpx;
			border-radius: 6rpx;
		}
	}
	.store-title {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 600;
		color: rgba(52, 52, 52, 1);
		margin-bottom: 10rpx;
	}
	.store-content {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
	}
}
.foot_box {
	height: 100rpx;
	background: rgba(255, 255, 255, 1);
	padding: 0 20rpx;
	.save-btn {
		width: 710rpx;
		height: 80rpx;
		background: linear-gradient(90deg, #2eae9c, #6cc29f);
		border: 1rpx solid rgba(238, 238, 238, 1);
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		padding: 0;
		border-radius: 40rpx;
	}
}
</style>
