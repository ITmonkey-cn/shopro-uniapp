<!-- 自提点 -->
<template>
	<view class="map-box">
		<!-- 标题栏 -->
		<shopro-navbar>
			<view class="search-wrap u-flex" slot="content">
				<u-search
					class="u-m-r-20"
					placeholder="输入自提点名称"
					@change="onSearch"
					@search="onSearch"
					@clear="clearSearch"
					v-model="searchVal"
					:showAction="false"
					height="60"
				></u-search>
			</view>
		</shopro-navbar>

		<map id="map" :style="{ width: '750rpx', height: mapHeight + 'px' }" :latitude="latitude" :longitude="longitude" show-location @tap="onMap"></map>
		<view class="dragLayer safe-area-inset-bottom" :class="moveCard">
			<view class="oilStation">
				<!-- 上下箭头 -->
				<view class="oilStation-top">
					<view class="touch-guide u-flex u-row-center u-col-center" @tap="onShowCard">
						<image class="touch-jintou" :src="$IMG_URL + (showCard ? '/imgs/order/arrows2.png' : '/imgs/order/arrows1.png')" mode=""></image>
					</view>
				</view>

				<!-- 自提点列表 -->
				<scroll-view class="oilStation-bottom" enable-back-to-top scroll-y @scrolltolower="loadMore">
					<view class=" list-content">
						<u-radio-group style="width: 100%;" v-model="storeId" active-color="#e9b561">
							<view style="width: 100%;" @tap="selStoreAddress(address.id, index)" v-for="(address, index) in addressList" :key="address.id">
								<view class="address-item u-flex u-col-center u-row-between">
									<view class="address-left">
										<!-- 门店 -->
										<view class="address-name">{{ address.name }}</view>
										<!-- 时间 -->
										<view class="time-box ">
											<view class=" u-flex u-col-center">
												<text class="u-iconfont uicon-clock u-m-r-20" style="color: #999;"></text>
												{{ address.openhours }}
											</view>
											<view class="u-flex u-col-center u-p-l-30 u-m-t-20">
												<text v-for="week in address.openweeks_arr" :key="week">{{ weekMap[week] }}、</text>
											</view>
										</view>
										<!-- 地址 -->
										<view class="address-detail u-flex u-col-center">
											<text class="u-iconfont uicon-map u-m-r-20" style="color: #999;"></text>
											{{ address.province_name }}{{ address.city_name }}{{ address.area_name }}{{ address.address }}
										</view>
										<!-- 电话 -->
										<view class="address-phone u-flex u-col-center">
											<text class="u-iconfont uicon-phone u-m-r-20" style="color: #999;"></text>
											{{ address.phone }}
										</view>
									</view>
									<view class="address-right u-flex-col u-row-center u-col-center">
										<u-radio :name="address.id"></u-radio>
										<text class="address-distance u-m-t-10">{{ address.distance_text || 0 }}</text>
									</view>
								</view>
							</view>
						</u-radio-group>

						<!-- 更多 -->
						<u-loadmore v-if="addressList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
					</view>
				</scroll-view>
				<view class="foot_box u-flex u-row-center u-col-center"><button class="u-reset-button save-btn" @tap="onSave">确认</button></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			longitude: 0,
			latitude: 0,
			mapHeight: 0,
			showCard: false,
			moveCard: 'dragLayer-bottom',
			distance: 0,
			storeId: 0, //默认门店ID
			addressList: [], //门店列表
			storeInfo: [], //当前门店信息
			weekMap: {
				1: '周一',
				2: '周二',
				3: '周三',
				4: '周四',
				5: '周五',
				6: '周六',
				7: '周日'
			},
			loadStatus: 'loadmore',
			currentPage: 1,
			lastPage: 1,
			searchVal: ''
		};
	},
	computed: {},
	onLoad(options) {
		this.latitude = this.$Route.query.lat;
		this.longitude = this.$Route.query.lng;
		this.storeId = this.$Route.query.storeId;
		this.getStoreAddress();
	},
	onReady() {
		this.editHeight();
	},
	methods: {
		// 选中门店
		onSave() {
			if (this.storeId) {
				uni.$emit('SELECT_STORE', { storeInfo: JSON.stringify(this.storeInfo) });
				this.$Router.back();
			} else {
				this.$u.toast('请选择门店');
			}
		},
		// 搜索
		onSearch() {
			this.addressList = [];
			this.$u.debounce(this.getStoreAddress());
		},

		// 清除搜索框
		clearSearch() {
			this.searchVal = '';
			this.onSearch();
		},
		// 设置地图，卡片高度。
		editHeight() {
			let that = this;
			uni.getSystemInfo({
				success: res => {
					let view = uni
						.createSelectorQuery()
						.in(this)
						.select('.dragLayer');
					view.fields(
						{
							size: true,
							scrollOffset: true
						},
						data => {
							that.mapHeight = res.windowHeight - data.height;
							//#ifdef APP-PLUS
							that.mapHeight = res.windowHeight - data.height - 40;
							//#endif
						}
					).exec();
				}
			});
		},
		// 点击地图
		onMap() {
			this.showCard = false;
			this.moveCard = 'dragLayer-bottom';
		},
		// 选择门店
		selStoreAddress(id, index) {
			this.storeId = id;
			this.latitude = this.addressList[index].latitude;
			this.longitude = this.addressList[index].longitude;
			this.storeInfo = this.addressList[index];
		},
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getStoreAddress();
			}
		},
		// 获取商品支持的自提点。
		getStoreAddress() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http('goods.storeAddress', {
				id: that.$Route.query.goodsId,
				latitude: that.$Route.query.lat,
				longitude: that.$Route.query.lng,
				keyword: that.searchVal,
				page: that.currentPage,
				per_page: 3
			}).then(res => {
				if (res.code == 1) {
					that.addressList = [...that.addressList, ...res.data.data];
					that.lastPage = res.data.last_page;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
					if (this.currentPage === 1) {
						this.storeId = res.data.data[0].id;
						this.storeInfo = res.data.data[0];
					}
				}
			});
		},

		// 点击显隐
		onShowCard() {
			this.showCard = !this.showCard;
			this.moveCard = this.showCard ? 'dragLayer-top' : 'dragLayer-bottom';
		}
	}
};
</script>

<style lang="scss">
.search-wrap {
	/* #ifdef MP-WEIXIN */
	width: 460rpx;
	/* #endif */
	/* #ifndef MP-WEIXIN */
	width: 100%;
	/* #endif */
}
/* 浮层 */
.dragLayer {
	width: 750rpx;
	position: fixed;
	z-index: 996;
	background-color: #fff;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
	bottom: 0;
	box-shadow: 0px 1rpx 18rpx 0px rgba(83, 83, 83, 0.35);
	display: flex;
	height: 100%;
}

// 点击上下
.dragLayer-bottom {
	height: 450rpx !important;
	/*#ifdef APP-PLUS */
	height: 800rpx !important;
	/*#endif*/
	transition: all ease-in-out 0.2s;
}
.dragLayer-top {
	height: 800rpx !important;
	transition: all ease-in-out 0.2s;
}
.oilStation {
	width: 690rpx;
	margin: 0 30rpx;
	display: flex;
	flex-direction: column;
	flex: 1;
	height: 100%;
}
.oilStation-top {
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
.touch-guide {
	justify-content: center;
	align-items: center;
	height: 100rpx;
}
.touch-jintou {
	width: 60rpx;
	height: 8rpx;
}
// 确认门店
.foot_box {
	height: 100rpx;
	background-color: #fff;
	.save-btn {
		color: #fff;
		width: 690rpx;
		line-height: 80rpx;
		background: linear-gradient(90deg, rgba(233, 181, 97, 1), rgba(238, 204, 138, 1));
		box-shadow: 1rpx 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		border-radius: 40rpx;
		font-size: 28rpx;
	}
}

// 自提点列表
.oilStation-bottom {
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	flex: 1;
	height: 100%;
	overflow: hidden;
}
.list-content {
	background-color: #fff;
	overflow-x: hidden;
}
.address-item {
	border-bottom-width: 1px;
	border-bottom-style: solid;
	border-bottom-color: #eef1f4;
	padding: 15rpx 0 15rpx;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
}
.address-name {
	font-size: 30rpx;

	font-weight: 600;
	color: rgba(51, 51, 51, 1);
	margin-bottom: 30rpx;
}
.time-box,
.address-detail,
.address-phone {
	flex-direction: row;
	align-items: center;
	font-size: 24rpx;

	font-weight: 400;
	color: #666;
	margin-bottom: 20rpx;
}
.address-icon {
	color: #bdbdbd;
	margin-right: 10rpx;
	font-size: 30rpx;
}
.address-left {
	flex: 1;
}
.address-right {
	align-items: center;
	color: #a8700e;
	font-size: 24rpx;
	margin-bottom: 20rpx;
	white-space: nowrap;
}
.more {
	width: 750rpx;
	height: 90rpx;
	justify-content: center;
	align-items: center;
}

.more-text {
	font-size: 24rpx;
	color: #ccc;
}
</style>
