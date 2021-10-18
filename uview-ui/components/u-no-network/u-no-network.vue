<template>
	<view class="u-no-network" v-if="!isConnected" :style="{ 'z-index': uZIndex }" @touchmove.stop.prevent="() => {}">
		<view class="u-inner">
			<image class="u-error-icon" :src="image" mode="widthFix"></image>
			<view class="u-tips">{{ tips }}</view>
			<!-- 只有APP平台，才能跳转设置页，因为需要调用plus环境 -->
			<!-- #ifdef APP-PLUS -->
			<view class="u-to-setting">
				请检查网络，或前往
				<text class="u-setting-btn" @tap="openSettings">设置</text>
			</view>
			<!-- #endif -->
			<view class="u-retry" :hover-stay-time="150" @tap="retry" hover-class="u-retry-hover">重试</view>
		</view>
	</view>
</template>

<script>
/**
 * noNetwork 无网络提示
 * @description 该组件无需任何配置，引入即可，内部自动处理所有功能和事件。
 * @tutorial https://www.uviewui.com/components/noNetwork.html
 * @property {String} tips 没有网络时的提示语（默认哎呀，网络信号丢失）
 * @property {String Number} zIndex 组件的z-index值（默认1080）
 * @property {String} image 无网络的图片提示，可用的src地址或base64图片
 * @event {Function} retry 用户点击页面的"重试"按钮时触发
 * @example <u-no-network></u-no-network>
 */

let networkType = 'none'; // 网络类型
export default {
	name: 'u-no-network',
	props: {
		// 页面文字提示
		tips: {
			type: String,
			default: '哎呀，网络信号丢失'
		},
		// 一个z-index值，用于设置没有网络这个组件的层次，因为页面可能会有其他定位的元素层级过高，导致此组件被覆盖
		zIndex: {
			type: [Number, String],
			default: ''
		},
		// image 没有网络的图片提示
		image: {
			type: String,
			default: '/static/images/empty_network.png'
		}
	},
	data() {
		return {
			isConnected: true // 是否有网络连接
		};
	},
	computed: {
		uZIndex() {
			return this.zIndex ? this.zIndex : this.$u.zIndex.noNetwork;
		}
	},
	mounted() {
		this.isIOS = uni.getSystemInfoSync().platform === 'ios';
		uni.onNetworkStatusChange(res => {
			this.isConnected = res.isConnected;
			networkType = res.networkType;
		});
		uni.getNetworkType({
			success: res => {
				networkType = res.networkType;
				if (res.networkType == 'none') {
					this.isConnected = false;
				} else {
					this.isConnected = true;
				}
			}
		});
	},
	methods: {
		retry() {
			// 重新检查网络
			uni.getNetworkType({
				success: res => {
					networkType = res.networkType;
					if (res.networkType == 'none') {
						uni.showToast({
							title: '无网络连接',
							icon: 'none',
							position: 'top'
						});
						this.isConnected = false;
					} else {
						uni.showToast({
							title: '网络已连接',
							icon: 'none',
							position: 'top'
						});
						this.isConnected = true;
					}
				}
			});
			this.$emit('retry');
		},
		async openSettings() {
			if (networkType == 'none') {
				this.openSystemSettings();
				return;
			}
		},
		openAppSettings() {
			this.gotoAppSetting();
		},
		openSystemSettings() {
			// 以下方法来自5+范畴，如需深究，请自行查阅相关文档
			// https://ask.dcloud.net.cn/docs/
			if (this.isIOS) {
				this.gotoiOSSetting();
			} else {
				this.gotoAndroidSetting();
			}
		},
		network() {
			var result = null;
			var cellularData = plus.ios.newObject('CTCellularData');
			var state = cellularData.plusGetAttribute('restrictedState');
			if (state == 0) {
				result = null;
			} else if (state == 2) {
				result = 1;
			} else if (state == 1) {
				result = 2;
			}
			plus.ios.deleteObject(cellularData);
			return result;
		},
		gotoAppSetting() {
			if (this.isIOS) {
				var UIApplication = plus.ios.import('UIApplication');
				var application2 = UIApplication.sharedApplication();
				var NSURL2 = plus.ios.import('NSURL');
				var setting2 = NSURL2.URLWithString('app-settings:');
				application2.openURL(setting2);
				plus.ios.deleteObject(setting2);
				plus.ios.deleteObject(NSURL2);
				plus.ios.deleteObject(application2);
			} else {
				var Intent = plus.android.importClass('android.content.Intent');
				var Settings = plus.android.importClass('android.provider.Settings');
				var Uri = plus.android.importClass('android.net.Uri');
				var mainActivity = plus.android.runtimeMainActivity();
				var intent = new Intent();
				intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
				var uri = Uri.fromParts('package', mainActivity.getPackageName(), null);
				intent.setData(uri);
				mainActivity.startActivity(intent);
			}
		},
		gotoiOSSetting() {
			var UIApplication = plus.ios.import('UIApplication');
			var application2 = UIApplication.sharedApplication();
			var NSURL2 = plus.ios.import('NSURL');
			var setting2 = NSURL2.URLWithString('App-prefs:root=General');
			application2.openURL(setting2);
			plus.ios.deleteObject(setting2);
			plus.ios.deleteObject(NSURL2);
			plus.ios.deleteObject(application2);
		},
		gotoAndroidSetting() {
			var Intent = plus.android.importClass('android.content.Intent');
			var Settings = plus.android.importClass('android.provider.Settings');
			var mainActivity = plus.android.runtimeMainActivity();
			var intent = new Intent(Settings.ACTION_SETTINGS);
			mainActivity.startActivity(intent);
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../libs/css/style.components.scss';

.u-no-network {
	background-color: #fff;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

.u-inner {
	height: 100vh;
	@include vue-flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-top: -15%;
}

.u-tips {
	color: $u-tips-color;
	font-size: 28rpx;
	padding: 30rpx 0;
}

.u-error-icon {
	width: 300rpx;
}

.u-to-setting {
	color: $u-light-color;
	font-size: 26rpx;
}

.u-setting-btn {
	font-size: 26rpx;
	color: $u-type-primary;
}

.u-retry {
	margin-top: 30rpx;
	border: 1px solid $u-tips-color;
	color: $u-tips-color;
	font-size: 28rpx;
	padding: 6rpx 30rpx;
	border-radius: 3px;
}

.u-retry-hover {
	color: #fff;
	background-color: $u-tips-color;
}
</style>
