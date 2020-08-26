<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="content_box">
			<view class="address-list" v-for="address in addressList" :key="address.id" @tap="useAddress(address)">
				<view class="top x-f">
					<text class="name">{{ address.consignee }}</text>
					<text class="phone">{{ address.phone }}</text>
					<text class="tag" v-if="address.is_default === '1'">默认</text>
				</view>
				<view class="detail">{{ address.province_name }}{{ address.city_name }}{{ address.area_name }}{{ address.address }}</view>
				<button class="cu-btn set-btn" @tap.stop="jump('/pages/user/address/edit', { id: address.id })">编辑</button>
			</view>
		</view>
		<view class="foot_box x-ac">
			<button class="cu-btn sync-wxaddress mr20" @tap="getWXaddress" v-if="platform == 'wxMiniProgram' || platform == 'wxOfficialAccount'">
				<text class="cuIcon-weixin"></text>
				导入微信地址
			</button>
			<button class="cu-btn add-btn" @tap="jump('/pages/user/address/edit', { id: 0, from: from })">添加新的收货地址</button>
		</view>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			addressList: [],
			from: '',
			platform: uni.getStorageSync('platform')
		};
	},
	computed: {},
	onLoad() {
		if (this.$Route.query.from) {
			this.from = this.$Route.query.from;
		}
	},
	onShow() {
		this.init();
	},
	methods: {
		init() {
			return Promise.all([this.getAddressList()]);
		},
		useAddress(address) {
			let pages = getCurrentPages();

			// #ifdef MP-WEIXIN || APP-PLUS
			let currPage = pages[pages.length - 1].$vm;
			let prevPage = pages[pages.length - 2].$vm; //上一个页面
			// #endif

			// #ifdef H5
			let currPage = pages[pages.length - 1];
			let prevPage = pages[pages.length - 2]; //上一个页面
			// #endif
			prevPage.address = address;

			uni.navigateBack({
				delta: 1
			});
		},
		// 获取微信收货地址
		async getWXaddress() {
			// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ
			let status = await this.getSetting();
			if (status === 2) {
				this.openSetting();
				return;
			}
			// #endif

			this.openWXaddress();
		},
		openWXaddress() {
			// #ifdef MP-WEIXIN
			uni.chooseAddress({
				success: res => {
					let data = JSON.stringify(res);
					this.jump('/pages/user/address/edit', { addressData: data });
				},
				fail: err => {}
			});
			// #endif
			// #ifdef H5
			this.$wxsdk.openAddress(res => {
				let data = JSON.stringify(res);
				this.jump('/pages/user/address/edit', { addressData: data });
			});
			// #endif
		},
		getSetting: function() {
			return new Promise((resolve, reject) => {
				uni.getSetting({
					success: res => {
						if (res.authSetting['scope.address'] === undefined) {
							resolve(0);
							return;
						}
						if (res.authSetting['scope.address']) {
							resolve(1);
						} else {
							resolve(2);
						}
					}
				});
			});
		},
		openSetting: function() {
			uni.openSetting({
				success: res => {
					if (res.authSetting && res.authSetting['scope.address']) {
						this.openWXaddress();
					}
				},
				fail: err => {}
			});
		},
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		getAddressList() {
			this.$api('address.list').then(res => {
				if (res.code === 1) {
					this.addressList = res.data;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.address-list {
	padding: 40rpx;
	position: relative;
	background: #fff;
	margin-bottom: 20rpx;

	.name,
	.phone {
		font-size: 30rpx;
		font-weight: 600;
	}

	.phone {
		margin: 0 20rpx;
	}

	.tag {
		background: rgba(233, 191, 113, 0.2);
		border-radius: 6rpx;
		padding: 0 16rpx;
		line-height: 38rpx;
		color: #a8700d;
		font-size: 22rpx;
	}

	.detail {
		margin-top: 25rpx;
		width: 543rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 40rpx;
	}

	.set-btn {
		background: none;
		position: absolute;
		font-size: 26rpx;
		color: #a8700d;
		top: 40rpx;
		right: 20rpx;
	}
}

.foot_box {
	padding: 20rpx;
	.sync-wxaddress {
		flex: 1;
		height: 80rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 40rpx;
		.cuIcon-weixin {
			color: #1ea907;
			margin-right: 10rpx;
			font-size: 40rpx;
		}
	}
	.add-btn {
		height: 80rpx;
		flex: 1;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border: 1rpx solid rgba(238, 238, 238, 1);
		border-radius: 40rpx;
		color: rgba(#fff, 0.9);
	}
}
</style>
