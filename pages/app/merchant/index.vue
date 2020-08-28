<template>
	<view class="">
		<view class="mask" v-if="isShowDropDown" cathctouchmove @tap.stop="onHideDropDown"></view>
		<!-- 商家信息 -->
		<view class="shopinfo-box">
			<image class="user-bg" src="http://shopro.7wpp.com/imgs/shop_headbg.png" mode=""></image>
			<view class="head-wrap">
				<view class="titleNav pad">
					<view class="status-bar"></view>
					<text class="nav-title x-f">商家中心</text>
				</view>
				<view class="user-head x-bc">
					<view class="shop-info">
						<view class="x-f mb30" @tap="goStoreList">
							<text class="shop-title">{{ storeDetail.name }}</text>
							<text class="cuIcon-roundrightfill"></text>
						</view>
						<view class="shop-address" @tap="jump('/pages/app/merchant/info')">
							{{ storeDetail.province_name || '' }}{{ storeDetail.city_name || '' }}{{ storeDetail.area_name || '' }}{{ storeDetail.address || '' }}
						</view>
					</view>

					<button v-if="true" @tap="jump('/pages/index/user')" class="cu-btn merchant-btn">切换个人版</button>
				</view>
			</view>
		</view>
		<!-- 信息卡片 -->
		<view class="info-card-box x-bc">
			<view class="info-card">
				<image class="card-bg" src="/static/imgs/user/shop_info.png" mode="aspectFill"></image>
				<view class="card-content y-c">
					<view class="card-title">输码核销</view>
					<view class="x-f card-detail-box" @tap="onEditCode">
						<text class="cuIcon-edit card-icon"></text>
						<text class="card-detail">输码</text>
					</view>
				</view>
			</view>
			<view class="info-card" @tap="scanCode">
				<image class="card-bg" src="/static/imgs/user/shop_qrcode.png" mode="aspectFill"></image>
				<view class="card-content y-c">
					<view class="card-title">扫码核销</view>
					<view class="x-f card-detail-box">
						<text class="cuIcon-qr_code card-icon" style="color: #129BF9;"></text>
						<text class="card-detail" style="color: #129BF9;">扫码</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 核销商品信息 -->
		<view class="cancel-shop-box">
			<view class="cancel-nav x-f">
				<view class="nav-item x-f" v-for="nav in cancelTypeList" :key="nav.id" @tap="onNav(nav.type)">
					<view class="y-f" style="width: 100%;">
						<view class="item-title x-f" :class="{ 'title-active': cancelType === nav.type }">
							<text>{{ nav.title }}</text>
							<view :class="{ 'icon-active': cancelType === nav.type }">
								<text class="cuIcon-triangledownfill" :class="{ 'icon-active': cancelType === nav.type }"></text>
							</view>
						</view>
						<text class="nav-line" :class="{ 'line-active': cancelType === nav.type }"></text>
					</view>
				</view>
				<!-- 下拉窗 -->
				<view class="drop-down-box" :class="{ 'hide-drop-down': !isShowDropDown }">
					<view class="drop-down-item x-bc" v-for="(item, index) in dropDown[cancelType]" :key="index" @tap="onFilter(item.value, item.title)">
						<text class="item-title">{{ item.title }}</text>
						<text class="cuIcon-check" v-if="filter[cancelType] == item.value"></text>
					</view>
				</view>
			</view>
			<!-- 销量 -->
			<view class="sales-volume-box x-bc pa30">
				<view class="sales-volume x-c">订单量(单)：{{ orderInfo.total_num }}</view>
				<view class="sales-volume x-c">交易额(元)：{{ orderInfo.total_money }}</view>
			</view>
		</view>
		<!-- 订单列表 -->
		<view class="order-list" v-for="order in storeOrderList" :key="order.order_sn" @tap.stop="jump('/pages/app/merchant/detail', { orderId: order.id })">
			<view class="order-head x-bc">
				<text class="no">订单编号：{{ order.order_sn }}</text>
				<text class="state">{{ order.status_name }}</text>
			</view>
			<view class="goods-order" v-for="item in order.item" :key="item.id">
				<view class="order-content"><shopro-mini-card :type="'order'" :detail="item"></shopro-mini-card></view>
			</view>
			<view class="order-bottom x-f">
				<text class="total-price-title">实付款：</text>
				<text class="total-price">{{ order.pay_fee }}</text>
			</view>
		</view>

		<!-- 更多 -->
		<view v-if="storeOrderList.length" class="cu-load text-gray" :class="loadStatus"></view>

		<!-- 日期选择 -->
		<uni-calendar
			v-model="showCalendar"
			:mode="mode"
			:start-text="startText"
			:end-text="endText"
			:range-color="rangeColor"
			:range-bg-color="rangeBgColor"
			:active-bg-color="activeBgColor"
			@change="selDate"
		></uni-calendar>
		<!-- 输码弹窗 -->
		<shopro-modal v-model="showInputModal" style="z-index: 88;">
			<block slot="modalContent">
				<view class="modal-box">
					<view class="modal-head">
						<image class="modal-head-img" src="/static/imgs/modal/store_check.png" mode=""></image>
						<text class="modal-head-title">输码核销</text>
					</view>
					<input class="inp" type="number" v-model="qrcode" placeholder="在此输入核销码" placeholder-class="pl-inp" />
					<button class="cu-btn post-btn" @tap="onConfirm">核销</button>
				</view>
			</block>
		</shopro-modal>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			storeOrderList: [], //订单商品列表
			orderInfo: {}, //订单统计信息
			storeDetail: {}, //门店信息
			cancelType: '', //核销分类
			scanCodes: [], //扫码内容。
			cancelTypeList: [
				{
					id: 0,
					title: '今日',
					type: 'date'
				},
				{
					id: 1,
					title: '全部',
					type: 'status'
				}
			],
			showInputModal: false, //输码核销
			qrcode: '', //输码
			showCalendar: false, //日期选择
			mode: 'range',
			result: '请选择日期',
			startText: '开始',
			endText: '结束',
			rangeColor: '#4CB89D',
			rangeBgColor: 'rgba(76,184,157,0.13)',
			activeBgColor: '#4CB89D',
			isShowDropDown: false, //是否显示下拉菜单
			filter: {
				date: 'today',
				status: 'all',
				custom: []
			},
			dropDown: {
				date: [
					{ title: '今日', value: 'today', isChecked: false },
					{ title: '昨日', value: 'yesterday', isChecked: false },
					{ title: '本周', value: 'week', isChecked: false },
					{ title: '本月', value: 'month', isChecked: false },
					{ title: '自定义', value: 'custom', isChecked: false }
				],
				status: [
					{ title: '全部', value: 'all', isChecked: false },
					{ title: '待发货', value: 'nosend', isChecked: false },
					{ title: '待完成', value: 'noget', isChecked: false },
					{ title: '已完成', value: 'finish', isChecked: true }
				]
			},
			loadStatus: '', //loading,over
			currentPage: 1,
			lastPage: 1
		};
	},
	computed: {},
	onLoad(options) {
		if (options.storeId) {
			uni.setStorageSync('storeId', options.storeId);
		}
		this.getStoreDetail();
		this.getStoreOrder();
	},
	onPullDownRefresh() {
		this.storeOrderList = [];
		this.currentPage = 1;
		this.getStoreOrder();
	},
	onReachBottom() {
		if (this.currentPage < this.lastPage) {
			this.currentPage += 1;
			this.getStoreOrder();
		}
	},
	methods: {
		jump(path, query) {
			this.$Router.push({
				path: path,
				query: query
			});
		},
		// 选择门店
		goStoreList() {
			this.$Router.replace({
				path: '/pages/app/merchant/list'
			});
		},
		// 获取门店信息
		getStoreDetail() {
			let that = this;
			that.$api('store.info', {
				store_id: uni.getStorageSync('storeId')
			}).then(res => {
				if (res.code === 1) {
					that.storeDetail = res.data;
				}
			});
		},

		// 扫码
		scanCode() {
			let platform = uni.getStorageSync('platform');
			switch (platform) {
				case 'wxOfficialAccount':
					// #ifdef H5
					this.$wxsdk.scanQRCode(res => {
						this.scanCodes = res.resultStr.split(',');
						this.postOrderConfirm();
					});
					// #endif
					break;
				case 'wxMiniProgram' || 'App':
					uni.scanCode({
						success: res => {
							this.scanCodes = res.result.split(',');
							this.postOrderConfirm();
						},
						fail: err => {
							console.log(err);
						}
					});
					break;
				case 'App':
					uni.scanCode({
						success: res => {
							this.scanCodes = res.result.split(',');
							this.postOrderConfirm();
						},
						fail: err => {
							console.log(err);
						}
					});
					break;
				default:
					this.$tools.toast('请使用小程序或微信浏览器');
			}
		},

		// 输码
		onConfirm() {
			this.showInputModal = false;
			this.scanCodes.push(this.qrcode);
			this.postOrderConfirm();
		},
		// 核销
		postOrderConfirm() {
			let that = this;
			that.$api('store.orderConfirm', {
				codes: that.scanCodes,
				store_id: uni.getStorageSync('storeId')
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast(res.msg);
					that.scanCodes = [];
					that.qrcode = '';
					that.getStoreOrder();
				}
			});
		},
		// 门店订单列表
		getStoreOrder() {
			let that = this;
			that.loadStatus = 'loading';
			that.$api('store.order', {
				date_type: that.filter.date,
				date: that.filter.custom,
				type: that.filter.status,
				page: that.currentPage,
				store_id: uni.getStorageSync('storeId')
			}).then(res => {
				if (res.code == 1) {
					uni.stopPullDownRefresh();
					that.storeOrderList = [...that.storeOrderList, ...res.data.result.data];
					that.orderInfo = res.data;
					that.lastPage = res.data.result.last_page;
					if (that.currentPage < res.data.result.last_page) {
						that.loadStatus = '';
					} else {
						that.loadStatus = 'over';
					}
				}
			});
		},
		// 切换核销分类
		onNav(type) {
			this.isShowDropDown = this.cancelType == type ? false : true;
			this.cancelType = this.cancelType == type ? '' : type;
		},
		// 选择日期
		selDate(e) {
			this.filter.custom.push(e.startDate);
			this.filter.custom.push(e.endDate);
			this.isShowDropDown = false;
			this.cancelTypeList[0].title = `${e.startDate.replace(/-/g, ':')}-${e.endDate.replace(/-/g, ':')}`;
			this.storeOrderList = [];
			this.currentPage = 1;
			this.getStoreOrder();
		},
		// 下拉筛选
		onHideDropDown() {
			this.isShowDropDown = false;
			this.cancelType = '';
		},
		// 选择筛选
		onFilter(val, title) {
			this.isShowDropDown = false;
			if (val == 'custom') {
				this.showCalendar = true;
			}
			if (this.cancelType == 'date') {
				this.cancelTypeList[0].title = title;
			}
			if (this.cancelType == 'status') {
				this.cancelTypeList[1].title = title;
			}
			this.filter[this.cancelType] = val;
			this.storeOrderList = [];
			this.currentPage = 1;
			this.getStoreOrder();
			this.cancelType = '';
		},
		//输码
		onEditCode() {
			this.showInputModal = true;
		}
	}
};
</script>

<style lang="scss">
// 遮罩
.mask {
	width: 100%;
	height: 100%;
	position: fixed;
	z-index: 20;
}
// 商户信息
.shopinfo-box {
	position: relative;
	height: 320rpx;
	.user-bg {
		width: 100%;
		height: 320rpx;
	}
	.head-wrap {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		z-index: 9;
		top: 0;
		.nav-title {
			font-size: 38rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #fff;
		}
		.status-bar {
			// #ifndef H5
			height: var(--status-bar-height);
			// #endif
			// #ifdef H5
			height: 50rpx;
			// #endif
			width: 700rpx;
		}
	}

	.user-head {
		padding-top: 50rpx;
		.shop-info {
			padding-left: 30rpx;
			.shop-title {
				font-size: 34rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
			}
			.cuIcon-roundrightfill {
				color: rgba(255, 255, 255, 1);
				font-size: 34rpx;
				margin-left: 10rpx;
				transform: rotate(90deg);
			}
			.shop-address {
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				width: 560rpx;
			}
		}
		.merchant-btn {
			padding: 0;
			width: 136rpx;
			height: 46rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 23rpx 0px 0px 23rpx;
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #3eb49c;
		}
	}
}
// 卡片
.info-card-box {
	background-color: #fff;
	padding: 30rpx 20rpx;
	.info-card {
		position: relative;
		width: 344rpx;
		height: 165rpx;
		border-radius: 10rpx;
		overflow: hidden;
		.card-bg {
			width: 100%;
			height: 100%;
		}
		.card-content {
			position: absolute;
			width: 100%;
			height: 100%;
			z-index: 3;
			top: 0;
			left: 0;
			padding: 30rpx 0 0 30rpx;
			.card-title {
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
			}
			.card-detail-box {
				padding: 10rpx 20rpx;
				height: 45rpx;
				background: rgba(255, 255, 255, 1);
				width: 150rpx;
				border-radius: 23rpx;
				margin-top: 20rpx;
				.card-detail {
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(0, 187, 206, 1);
				}
				.cuIcon-qr_code {
					color: #0f98f9;
				}
				.cuIcon-edit {
					color: #00b6ce;
				}
				.card-icon {
					font-size: 36rpx;
					margin-right: 14rpx;
				}
			}
		}
	}
}
// 核销nav
.cancel-nav {
	background: #fff;
	margin: 10rpx 0 0;
	position: relative;
	z-index: 22;
	.nav-item {
		flex: 1;
		&:first-child {
			&::after {
				content: '';
				height: 30rpx;
				width: 2rpx;
				background-color: #bdbdbd;
				display: inline-block;
			}
		}

		.item-title {
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #666;
			line-height: 100rpx;
		}
		.cuIcon-triangleupfill {
			color: #666;
			transition: all linear 0.2s;
		}
		.icon-active {
			transition: all linear 0.2s;
			transform: rotate(180deg);
			color: #4cb89d;
		}
		.title-active {
			color: #4cb89d;
		}
		.nav-line {
			width: 100%;
			height: 2rpx;
			background: rgba(#ccc, 0.5);
		}

		.line-active {
			background: #4cb89d;
			height: 2rpx;
		}
	}
}
// 下拉窗
.drop-down-box {
	position: absolute;
	z-index: 22;
	width: 750rpx;
	top: 110rpx;
	background-color: #ffff;
	box-shadow: 0px 15rpx 27rpx 0px rgba(203, 203, 203, 0.34);
	transform: scaleX(1);
	transition: all linear 0.1s;
	.drop-down-item {
		height: 80rpx;
		border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);
		padding: 0 60rpx;
		.item-title {
			font-size: 24rpx;
			color: #666;
		}
		.cuIcon-check {
			color: #4cb89d;
		}
		.title-active {
			color: #4cb89d;
		}
	}
}
.hide-drop-down {
	top: 0;
	width: 750rpx;
	transform: scaleY(0);
	opacity: 0;
	transform-origin: top;
	transition: all linear 0.1s;
}
// 销量
.sales-volume-box {
	background-color: #fff;
	.sales-volume {
		width: 338rpx;
		height: 72rpx;
		background: rgba(76, 184, 157, 0.06);
		border: 1rpx solid rgba(185, 227, 217, 1);
		border-radius: 10rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(76, 184, 157, 1);
	}
}
// 输码弹窗
.modal-box {
	background: #fff;
	width: 610rpx;
	margin: 0 auto;
	border-radius: 20rpx;
	.modal-head-img {
		width: 100%;
		height: 213rpx;
	}

	.modal-head-title {
		font-size: 35rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color:#343434;
		line-height: 42rpx;
	}

	.inp {
		width: 501rpx;
		height: 78rpx;
		border: 1rpx solid #E5E5E5;
		margin: 60rpx auto 40rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #6d5028;

		.pl-inp {
			color: #9A9A9A;
		}
	}
	.post-btn {
		width: 492rpx;
		height: 70rpx;
		background: linear-gradient(90deg, #2eae9c, #6cc29f);
		box-shadow: 0px 7rpx 6rpx 0px rgba(#6cc29f, 0.22);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		padding: 0;
		margin-bottom: 60rpx;
	}
}
// 订单列表
.order-list {
	background: #fff;
	margin: 20rpx 0;
	padding: 0 20rpx;
	.order-bottom {
		justify-content: flex-end;
		height: 80rpx;
		padding: 0 20rpx;
		.total-price-title {
			color: #999999;
			font-size: 24rpx;
		}
		.total-price {
			color: #333;
			font-size: 26rpx;
			&::before {
				content: '￥';
				font-size: 20rpx;
			}
		}
	}
	.order-head {
		padding: 0 25rpx;
		height: 77rpx;
		border-bottom: 1rpx solid #dfdfdf;

		.no {
			font-size: 26rpx;
			color: #999;
		}

		.state {
			font-size: 26rpx;
			color: #a8700d;
		}
	}
	.goods-order {
		border-bottom: 1px solid rgba(223, 223, 223, 0.5);
		padding: 20rpx;
		margin-bottom: 20rpx;
	}
}
</style>
