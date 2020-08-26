<template>
	<view class="map-box">
		<text class="cuIcon-back" @tap="$Router.back()"></text>
		<map
			id="map"
			:style="{ width: '750rpx', height: mapHeight + 'px' }"
			:latitude="latitude"
			:longitude="longitude"
			:markers="markers"
			:polyline="polyline"
			:include-points="includePoints"
			show-location
			@tap="onMap"
		></map>
		<view ref="testdiv" class="dragLayer" :class="moveCard" @touchstart="handleTouchStart" @touchend="handleTouchEnd" @touchmove="handleTouchMove">
			<view ref="oilStation" class="oilStation">
				<!-- #ifndef APP-PLUS -->
				<view class="oilStation-top">
					<view class="touch-guide x-c" @tap="onShowCard">
						<image class="touch-jintou" v-if="!showCard" src="/static/imgs/order/arrows1.png" mode=""></image>
						<image class="touch-jintou" v-if="showCard" src="/static/imgs/order/arrows2.png" mode=""></image>
					</view>
					<!-- <div class="search-box x-f">
						<text class="cuIcon-search"></text>
						<input class="search-inp" placeholder-class="search-pl" placeholder="输入地址寻找周边自提点" type="text" value="" />
					</div> -->
				</view>
				<!-- #endif -->
				<scroll-view class="oilStation-bottom" enable-back-to-top :scroll-y="scrollable" @scrolltoupper="scrolltoupper" @scroll="scroll" @scrolltolower="scrolltolower">
					<view class="page_box">
						<view class="content_box" style="background-color: #fff;overflow-x: hidden;">
							<label @tap="selStoreAddress(address.id, index)" v-for="(address, index) in addressList" :key="address.id">
								<view class="address-item x-f">
									<view class="address-left">
										<view class="address-name">{{ address.name }}</view>
										<view class="time-box ">
											<view class="x-f">
												<text class="cuIcon-time address-icon"></text>
												{{ address.openhours }}
											</view>
											<view class="x-f" style="padding-left: 30rpx;margin-top: 20rpx;">
												<text v-for="week in address.openweeks_arr" :key="week">{{ weekMap[week] }}、</text>
											</view>
										</view>
										<view class="address-detail x-f">
											<text class="cuIcon-location address-icon"></text>
											{{ address.province_name }}{{ address.city_name }}{{ address.area_name }}{{ address.address }}
										</view>
										<view class="address-phone x-f">
											<text class="cuIcon-phone address-icon"></text>
											{{ address.phone }}
										</view>
									</view>
									<view class="address-right y-f">
										<radio class="round address-checked orange" :class="{ checked: storeId == address.id }" :checked="storeId == address.id"></radio>
										<text class="address-distance">{{ address.distance_text || 0 }}</text>
									</view>
								</view>
							</label>

							<view class="more x-c"><text class="more-text">更多自提点，敬请期待</text></view>
						</view>
						<view class="foot_box x-c"><button class="cu-btn save-btn" @tap="onSave">确认</button></view>
					</view>
				</scroll-view>
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
			cardHeight: 0,
			showCard: false,
			scrollable: false, // 初始化禁止滑动
			moveCard: 'dragLayer-bottom',
			// markers: [], //标记点
			polyline: [],
			distance: 0,
			storeId: 0, //默认门店ID
			includePoints: [], //可视区域点
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
			}
		};
	},
	computed: {
		markers() {
			if (this.addressList.length) {
				let arr = [];
				this.addressList.forEach(item => {
					let obj = {
						id: item.id,
						latitude: item.latitude,
						longitude: item.longitude,
						// #ifdef APP-PLUS
						iconPath: '/static/imgs/order/e1.png',
						width: 100,
						height: 100
						// #endif
					};
					arr.push(obj);
				});
				return arr;
			}
		}
	},
	onLoad(options) {
		this.latitude = this.$Route.query.lat;
		this.longitude = this.$Route.query.lng;
		this.storeId = this.$Route.query.storeId;
		this.getStoreAddress();
	},
	onReady() {
		let that = this;
		this.editHeight();
	},
	onShow() {},
	methods: {
		// 选中门店
		onSave() {
			let pages = getCurrentPages();

			// #ifdef MP-WEIXIN || APP-PLUS
			let currPage = pages[pages.length - 1].$vm;
			let prevPage = pages[pages.length - 2].$vm; //上一个页面
			// #endif

			// #ifdef H5
			let currPage = pages[pages.length - 1];
			let prevPage = pages[pages.length - 2]; //上一个页面
			// #endif
			prevPage.storeInfo = this.storeInfo.id ? this.storeInfo : this.addressList[0];
			this.storeId == 0 ? this.$tools.toast('请选择门店') : this.$Router.back();
		},
		// 点击地图
		onMap() {
			this.showCard = false;
			this.moveCard = 'dragLayer-bottom';
			this.scrollable = false;
		},
		// 选择门店
		selStoreAddress(id, index) {
			this.storeId = id;
			this.latitude = this.addressList[index].latitude;
			this.longitude = this.addressList[index].longitude;
			this.storeInfo = this.addressList[index];
		},
		// 获取商品支持的自提点。
		getStoreAddress() {
			let that = this;
			that.$api('goods.storeAddress', {
				id: that.$Route.query.goodsId,
				latitude: that.$Route.query.lat,
				longitude: that.$Route.query.lng
			}).then(res => {
				if (res.code == 1) {
					that.addressList = res.data;
					this.storeId = res.data[0].id;
				}
			});
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
							that.mapHeight = res.screenHeight - data.height;
							console.log('card-height', data.height);
						}
					).exec();
				}
			});
		},
		// 获取角度
		getAngle(angx, angy) {
			return (Math.atan2(angy, angx) * 180) / Math.PI;
		},
		// 根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
		getDirection(startx, starty, endx, endy) {
			var angx = endx - startx;
			var angy = endy - starty;
			var result = 0;
			//如果滑动距离太短
			if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
				return result;
			}
			var angle = this.getAngle(angx, angy);
			if (angle >= -135 && angle <= -45) {
				result = 1;
			} else if (angle > 45 && angle < 135) {
				result = 2;
			} else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
				result = 3;
			} else if (angle >= -45 && angle <= 45) {
				result = 4;
			}
			return result;
		},
		// 手势滑动开始
		handleTouchStart(e) {
			this.startx = e.changedTouches[0].pageX;
			this.starty = e.changedTouches[0].pageY;
		},
		handleTouchMove(e) {},
		// 手势滑动结束
		handleTouchEnd(e) {
			var endx, endy;
			endx = e.changedTouches[0].pageX;
			endy = e.changedTouches[0].pageY;
			var direction = this.getDirection(this.startx, this.starty, endx, endy);
			switch (direction) {
				// 未滑动！
				case 0:
					break;
				// 向上滑动
				case 1:
					this.showCard = true;
					this.moveCard = 'dragLayer-top';
					this.scrollable = true;
					break;
				// 向下滑动
				case 2:
					break;
				// 向左
				case 3:
					break;
				// 向右
				case 4:
					break;
				default:
			}
		},
		scroll(e) {},
		scrolltoupper(e) {},
		scrolltolower(e) {},
		// 点击显隐
		onShowCard() {
			this.showCard = !this.showCard;
			if (this.showCard) {
				this.moveCard = 'dragLayer-top';
				this.scrollable = true;
			} else {
				this.moveCard = 'dragLayer-bottom';
				this.scrollable = false;
			}
		}
	}
};
</script>

<style lang="scss">
.cuIcon-back {
	position: fixed;
	top: 50rpx;
	left: 30rpx;
	width: 70rpx;
	line-height: 70rpx;
	font-size: 40rpx;
	text-align: center;
	background: rgba(0, 0, 0, 0.2);
	z-index: 10;
	border-radius: 50%;
	color: #fff;
}
/* 浮层 */
.dragLayer {
	width: 750rpx;
	/* height: auto; */
	position: fixed;
	background-color: #fff;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
	bottom: 0;
	box-shadow: 0px 1rpx 18rpx 0px rgba(83, 83, 83, 0.35);
	display: flex;
	height: 100%;
}
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
	height: 80rpx;
}
.touch-jintou {
	width: 60rpx;
	height: 8rpx;
}
.search-box {
	flex: 1;
	height: 60rpx;
	background: rgba(243, 243, 243, 1);
	border-radius: 30rpx;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 0 25rpx;
	margin-top: 30rpx;
}
// 确认门店
.foot_box {
	height: 100rpx;
	background-color: #fff;
	.save-btn {
		color: #fff;
		width: 690rpx;
		height: 80rpx;
		background: linear-gradient(90deg, rgba(233, 181, 97, 1), rgba(238, 204, 138, 1));
		box-shadow: 1rpx 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		border-radius: 40rpx;
		font-size: 28rpx;
	}
}

.cuIcon-search {
	color: #bdbdbd;
	font-size: 40rpx;
	margin-right: 20rpx;
}
.search-inp {
	flex: 1;
	font-size: 24rpx;
	color: #333;
}
.search-pl {
	font-size: 24rpx;
	font-family: PingFang SC;
	font-weight: 400;
	color: rgba(153, 153, 153, 1);
}
.oilStation-bottom {
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	flex: 1;
	height: 100%;
	overflow: hidden;
}
.address-item {
	border-bottom-width: 1px;
	border-bottom-style: solid;
	border-bottom-color: #eef1f4;
	padding: 15rpx 0 15rpx;
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
}
.address-name {
	font-size: 30rpx;
	font-family: PingFang SC;
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
	font-family: PingFang SC;
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
.address-checked {
	transform: scale(0.7);
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
