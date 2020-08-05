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
		></map>
		<div ref="testdiv" class="dragLayer" :class="moveCard" @touchstart="handleTouchStart" @touchend="handleTouchEnd" @touchmove="handleTouchMove">
			<div ref="oilStation" class="oilStation">
				<div class="oilStation-top">
					<view class="touch-guide x-c" @tap="onShowCard">
						<text v-if="!showCard" class="iconfont touch-jintou icon-xiangxia2"></text>
						<text v-if="showCard" class="iconfont touch-jintou icon-xiangshang21"></text>
					</view>
					<div class="search-box x-f">
						<text class="cuIcon-search"></text>
						<input class="search-inp" placeholder-class="search-pl" placeholder="输入地址寻找周边自提点" type="text" value="" />
					</div>
				</div>
				<scroll-view class="oilStation-bottom" enable-back-to-top :scroll-y="scrollable" @scrolltoupper="scrolltoupper" @scroll="scroll" @scrolltolower="scrolltolower">
					<view class="address-item x-f" v-for="a in 8" :key="a">
						<view class="address-left">
							<view class="address-name">龙宇国际店</view>
							<view class="time-box x-f">
								<text class="cuIcon-time address-icon"></text>
								08:00-18:00
							</view>
							<view class="address-detail x-f">
								<text class="cuIcon-location address-icon"></text>
								郑东新区运动场东路龙宇国际A座
							</view>
							<view class="address-phone x-f">
								<text class="cuIcon-phone address-icon"></text>
								12345678911
							</view>
						</view>
						<view class="address-right y-f">
							<radio class="round address-checked orange checked" :checked="true"></radio>
							<text class="address-distance">{{ distance }}</text>
						</view>
					</view>
					<view class="more x-c"><text class="more-text">更多自提点，敬请期待</text></view>
				</scroll-view>
			</div>
		</div>
	</view>
</template>

<script>
export default {
	data() {
		return {
			longitude: 108.921672,
			latitude: 34.250646,
			mapHeight: 0,
			topSize: 0,
			showCard: false,
			scrollable: false, // 初始化禁止滑动
			moveCard: 'dragLayer-bottom',
			markers: [
				{
					id: 0,
					latitude: 39.98406,
					longitude: 116.30752,
					iconPath: '/static/imgs/order/e1.png',
					width: 50,
					height: 55
				}
			],
			polyline: [],
			distance: 0,
			includePoints: [{ longitude: 108.921672, latitude: 34.250646 }, { latitude: 39.98406, longitude: 116.30752 }]
		};
	},
	computed: {},
	onLoad() {},
	onReady() {
		let that = this;
		this.editHeight();
	},
	onShow() {},
	methods: {
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
			console.log(this.moveCard);
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

<style>
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
	padding-bottom: 30rpx;
}
.touch-guide {
	justify-content: center;
	align-items: flex-start;
	height: 54rpx;
}
.touch-jintou {
	color: #e5e5e5;
	font-size: 80rpx;
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
	padding: 35rpx 0 15rpx;
	width: 690rpx;
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
	color: rgba(102, 102, 102, 1);
	margin-bottom: 20rpx;
}
.address-icon {
	color: #bdbdbd;
	margin-right: 10rpx;
	font-size: 30rpx;
}
.address-right {
	align-items: center;
	color: #a8700e;
	font-size: 24rpx;
	margin-bottom: 20rpx;
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
