<!-- 商家中心 -->
<template>
	<view class="merchant-wrap">
		<view class="shopinfo-box">
			<!-- 标题栏 -->
			<shopro-navbar
				back-icon-color="#fff"
				:background="{ background: `url(${$IMG_URL}/imgs/user/shop_headbg.png) no-repeat top center / 100% auto`}"
				:backTextStyle="{ color: '#fff', fontSize: '36rpx', fontWeight: '500' }"
				backText="商家中心"
			></shopro-navbar>
			<!-- 商家信息 -->
			<view class="user-head u-flex u-row-between">
				<view class="shop-info">
					<view class="u-flex u-m-b-10" @tap="goStoreList">
						<text class="shop-title u-m-r-20">{{ storeDetail.name }}</text>
						<text class="iconfont icon-xiala"></text>
					</view>
					<view class="shop-address u-ellipsis-2" @tap="jump('/pages/app/merchant/info')">
						{{ storeDetail.province_name || '' }}{{ storeDetail.city_name || '' }}{{ storeDetail.area_name || '' }}{{ storeDetail.address || '' }}
					</view>
				</view>
				<button @tap="$Router.pushTab('/pages/index/user')" class="u-reset-button merchant-btn">切换个人版</button>
			</view>
		</view>

		<!-- 核销卡片 -->
		<view class="info-card-box u-flex u-row-between">
			<view class="info-card">
				<image class="card-bg" :src="$IMG_URL + '/imgs/user/shop_info.png'" mode="aspectFill"></image>
				<view class="card-content u-flex-col">
					<view class="card-title">输码核销</view>
					<view class="u-flex card-detail-box" @tap="showInputModal = true">
						<text class="iconfont icon-21shuru icon-color1"></text>
						<text class="icon-color1 u-m-l-20">输码</text>
					</view>
				</view>
			</view>
			<view class="info-card" @tap="scanCode">
				<image class="card-bg" :src="$IMG_URL + '/imgs/user/shop_qrcode.png'" mode="aspectFill"></image>
				<view class="card-content u-flex-col">
					<view class="card-title">扫码核销</view>
					<view class="u-flex card-detail-box">
						<text class="iconfont icon-icon-test1  icon-color2"></text>
						<text class="icon-color2 u-m-l-20">扫码</text>
					</view>
				</view>
			</view>
		</view>

		<view class="cancel-shop-box">
			<!-- 筛选框 -->
			<view class="cancel-nav u-flex">
				<u-dropdown ref="uDropdown" activeColor="#4cb89d" :borderBottom="false">
					<u-dropdown-item v-model="filter1Value" @change="changeFilter1" :title="filter1Label" :options="filterList1"></u-dropdown-item>
					<u-dropdown-item v-model="filter2Value" @change="changeFilter2" :title="filter2Label" :options="filterList2"></u-dropdown-item>
				</u-dropdown>
			</view>
			<!-- 销量 -->
			<view class="sales-volume-box u-flex u-row-between u-p-30">
				<view class="sales-volume u-flex u-row-center u-col-center">订单量(单)：{{ orderInfo.total_num || 0 }}</view>
				<view class="sales-volume u-flex u-row-center u-col-center">交易额(元)：{{ orderInfo.total_money || 0 }}</view>
			</view>
		</view>

		<!-- 订单列表 -->
		<view class="order-list" v-for="order in storeOrderList" :key="order.order_sn" @tap="jump('/pages/app/merchant/detail', { orderId: order.id })">
			<view class="order-head u-flex u-row-between">
				<text class="no">订单编号：{{ order.order_sn }}</text>
				<text class="state">{{ order.status_name }}</text>
			</view>
			<view class="goods-order" v-for="item in order.item" :key="item.id">
				<shopro-mini-card :title="item.goods_title" :image="item.goods_image">
					<template #describe>
						<view class="order-sku u-ellipsis-1">
							<text class="order-num">数量:{{ item.goods_num || 0 }};</text>
							{{ item.goods_sku_text ? item.goods_sku_text : '' }}
						</view>
					</template>
					<template #cardBottom>
						<view class="order-price-box u-flex ">
							<text class="order-price font-OPPOSANS">￥{{ item.goods_price || 0 }}</text>
							<button class="u-reset-button status-btn" v-if="item.status_name">{{ item.status_name }}</button>
						</view>
					</template>
				</shopro-mini-card>
			</view>
			<view class="order-bottom u-flex">
				<view class="u-flex u-m-r-30" v-if="reduceAdd(order.item, 'discount_fee')">
					<text class="total-price-title">优惠：</text>
					<text class="total-price">{{ reduceAdd(order.item, 'discount_fee') }}</text>
				</view>
				<view class="u-flex">
					<text class="total-price-title">实付款：</text>
					<text class="total-price">{{ reduceAdd(order.item, 'pay_price') }}</text>
				</view>
			</view>
		</view>

		<!-- 置空页 -->
		<u-empty :show="isEmpty" margin-top="160" mode="list"></u-empty>

		<!-- 更多 -->
		<u-loadmore v-if="storeOrderList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		<!-- 日期选择 -->
		<u-calendar
			v-model="showCalendar"
			safeAreaInsetBottom
			mode="range"
			start-text="开始"
			end-text="结束"
			range-color="#4CB89D"
			range-bg-color="rgba(76,184,157,0.13)"
			active-bg-color="#4CB89D"
			:customStyle="{ background: 'linear-gradient(90deg, #4cb89d, #4CB89D)', boxShadow: '0 7rpx 11rpx 2rpx rgba(4cb89d, 0.34)' }"
			btnType="success"
			@change="selDate"
		></u-calendar>

		<!-- 输码弹窗 -->
		<u-popup v-model="showInputModal" mode="center" :closeable="true" close-icon-pos="top-left" border-radius="20">
			<view class="modal-box u-flex-col u-col-center">
				<view class="modal-head u-flex-col u-col-center">
					<image class="modal-head-img" :src="$IMG_URL + '/imgs/modal/store_check.png'" mode=""></image>
					<text class="modal-head-title">输码核销</text>
				</view>
				<input class="inp" type="number" v-model="qrcode" placeholder="在此输入核销码" placeholder-class="pl-inp" />
				<button class="u-reset-button post-btn" @tap="onConfirm">核销</button>
			</view>
		</u-popup>
		<!-- 禁用弹窗 -->
		<u-modal
			ref="uModal"
			v-model="showModal"
			:show-cancel-button="false"
			confirm-color="#999"
			confirm-text="返回"
			content="当前门店已被禁用,是否返回重新选择？"
			title="提示"
			@confirm="$Router.back()"
		></u-modal>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import Auth from '@/shopro/permission/index.js';
export default {
	components: {},
	data() {
		return {
			isEmpty: false,
			showModal: false,
			// 筛选
			filter1: 'today',
			filter1Value: 0,
			filter1Label: '今日',
			filterList1: [
				{ label: '今日', value: 0, parmas: 'today' },
				{ label: '昨日', value: 1, parmas: 'yesterday' },
				{ label: '本周', value: 2, parmas: 'week' },
				{ label: '本月', value: 3, parmas: 'month' },
				{ label: '自定义', value: 4, parmas: 'custom' }
			],
			filter2: 'all',
			filter2Value: 0,
			filter2Label: '全部',
			filterList2: [
				{ label: '全部', value: 0, parmas: 'all' },
				{ label: '待发货', value: 1, parmas: 'nosend' },
				{ label: '待完成', value: 2, parmas: 'noget' },
				{ label: '已完成', value: 3, parmas: 'finish' }
			],
			custom: [], //自定义日期

			storeOrderList: [], //订单商品列表
			orderInfo: {}, //订单统计信息
			storeDetail: {}, //门店信息
			cancelType: '', //核销分类
			scanCodes: '', //扫码内容。
			showInputModal: false, //输码核销
			qrcode: '', //输码
			showCalendar: false, //日期选择

			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1
		};
	},
	computed: {},
	onLoad(options) {
		options && options.storeId && uni.setStorageSync('storeId', options.storeId);
		this.getStoreDetail();
	},
	onShow() {
		this.currentPage = 1;
		this.lastPage = 1;
		this.storeOrderList = [];
		this.getStoreOrder();
	},
	onPullDownRefresh() {
		this.currentPage = 1;
		this.lastPage = 1;
		this.storeOrderList = [];
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

		/**
		 * 累加某字段值
		 * @param {Array} list  - 源数据
		 * @param {String} key - 键名
		 */
		reduceAdd(list, key) {
			return list.reduce((pre, cur) => (pre += Number(cur[key])), 0);
		},

		// 筛选
		changeFilter1(e) {
			if (e === 4) {
				this.showCalendar = true;
			} else {
				this.filter1 = this.filterList1[e].parmas;
				this.filter1Label = this.filterList1[e].label;
				this.onFilter();
			}
		},
		changeFilter2(e) {
			this.filter2 = this.filterList2[e].parmas;
			this.filter2Label = this.filterList2[e].label;
			this.onFilter();
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
			that.$http('store.info', {
				store_id: uni.getStorageSync('storeId')
			}).then(res => {
				if (res.code === 1) {
					that.storeDetail = res.data;
				} else {
					uni.removeStorageSync('storeId');
					that.showModal = true;
				}
			});
		},

		// 扫码
		async scanCode() {
			let platform = this.$platform.get();
			let authState = await new Auth('camera').check();
			// #ifdef H5
			if (platform === 'H5') {
				this.$u.toast('普通浏览器不支持扫码功能，请使用小程序或微信内浏览器');
			} else {
				this.$wxsdk.scanQRCode(res => {
					this.scanCodes = res.resultStr;
					this.postOrderConfirm();
				});
			}
			// #endif

			// #ifndef H5
			authState &&
				uni.scanCode({
					success: res => {
						this.scanCodes = res.result;
						this.postOrderConfirm();
					},
					fail: err => {
						console.log(err);
					}
				});
			// #endif
		},

		// 输码
		onConfirm() {
			this.showInputModal = false;
			this.scanCodes = this.qrcode;
			this.postOrderConfirm();
		},
		// 核销
		postOrderConfirm() {
			let that = this;
			that.$http(
				'store.orderConfirm',
				{
					codes: that.scanCodes,
					store_id: uni.getStorageSync('storeId')
				},
				'核销中...'
			).then(res => {
				uni.vibrateLong({
					success: () => {
						that.$u.toast(res.msg);
					}
				});
				if (res.code === 1) {
					that.$u.toast(res.msg);
					that.scanCodes = '';
					that.storeOrderList = [];
					that.qrcode = '';
					that.getStoreOrder();
				}
			});
		},

		// 门店订单列表
		getStoreOrder() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http(
				'store.order',
				{
					date_type: that.filter1,
					date: that.custom,
					type: that.filter2,
					page: that.currentPage,
					store_id: uni.getStorageSync('storeId')
				},
				'加载中...'
			).then(res => {
				uni.stopPullDownRefresh();
				if (res.code == 1) {
					that.storeOrderList = [...that.storeOrderList, ...res.data.result.data];
					that.isEmpty = !that.storeOrderList.length;
					that.orderInfo = res.data;
					that.lastPage = res.data.result.last_page;
					that.loadStatus = that.currentPage < res.data.result.last_page ? 'loadmore' : 'nomore';
				}
			});
		},

		// 选择日期
		selDate(e) {
			this.custom = [];
			this.custom.push(e.startDate);
			this.custom.push(e.endDate);
			this.isShowDropDown = false;
			this.filter1Label = `${e.startDate.replace(/-/g, ':')}-${e.endDate.replace(/-/g, ':')}`;
			this.onFilter();
		},

		// 选择筛选
		onFilter(val, title) {
			this.storeOrderList = [];
			this.currentPage = 1;
			this.getStoreOrder();
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
	background: url($IMG_URL+'/imgs/user/shop_headbg.png') no-repeat;
	background-size: 100% 100%;
	height: 320rpx;
	.user-head {
		padding-top: 10rpx;
		.shop-info {
			padding-left: 30rpx;
			.shop-title {
				font-size: 34rpx;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
			}
			.icon-xiala {
				font-size: 34rpx;
				color: rgba(255, 255, 255, 1);
			}
			.shop-address {
				font-size: 28rpx;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				width: 540rpx;
			}
		}
		.merchant-btn {
			padding: 0;
			width: 136rpx;
			line-height: 46rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 23rpx 0px 0px 23rpx;
			font-size: 20rpx;

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
		width: 350rpx;
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

					font-weight: 500;
				}
				.icon-color1 {
					color: #00b6ce;
					font-size: 24rpx;
				}
				.icon-color2 {
					color: #0f98f9;
					font-size: 24rpx;
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
	padding: 0 20rpx;
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
	.modal-head {
		width: 100%;
		.modal-head-img {
			width: 100%;
			height: 213rpx;
		}
		.modal-head-title {
			font-size: 35rpx;

			font-weight: bold;
			color: #343434;
			line-height: 42rpx;
		}
	}
	.inp {
		width: 501rpx;
		height: 78rpx;
		border: 1rpx solid #e5e5e5;
		margin: 60rpx auto 40rpx;
		font-size: 28rpx;

		font-weight: 400;
		color: #6d5028;
		padding-left: 20rpx;
		.pl-inp {
			color: #9a9a9a;
		}
	}
	.post-btn {
		width: 492rpx;
		line-height: 70rpx;
		background: linear-gradient(90deg, #2eae9c, #6cc29f);
		box-shadow: 0px 7rpx 6rpx 0px rgba(#6cc29f, 0.22);
		border-radius: 35rpx;
		font-size: 28rpx;

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
		.order-sku {
			font-size: 24rpx;

			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			width: 450rpx;
			margin-bottom: 20rpx;
			.order-num {
				margin-right: 10rpx;
			}
		}
		.order-price-box {
			.status-btn {
				height: 32rpx;
				border: 1rpx solid rgba(207, 169, 114, 1);
				border-radius: 15rpx;
				font-size: 20rpx;
				font-weight: 400;
				color: rgba(168, 112, 13, 1);
				padding: 0 10rpx;
				margin-left: 20rpx;
				background: rgba(233, 183, 102, 0.16);
			}
			.order-price {
				font-size: 26rpx;

				font-weight: 600;
				color: rgba(51, 51, 51, 1);
			}
		}
	}
}
</style>
