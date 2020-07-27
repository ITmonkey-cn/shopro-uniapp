<template>
	<view class="page_box">
		<view class="head_box">
			<view class="add-address-box flex-sub x-f" v-if="!addressId" @tap="jump('/pages/user/address/list', { from: 'order' })">
				<image class="address-bg" src="http://shopro.7wpp.com/imgs/address_line.png" mode=""></image>
				<view class="box-bg x-bc flex-sub pad">
					<text class="select-notice">请选择默认地址</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="address-list" v-else @tap="jump('/pages/user/address/list', { from: 'order' })">
				<image class="address-bg" src="http://shopro.7wpp.com/imgs/address_line.png" mode=""></image>
				<view class="top x-f">
					<text class="name">{{ address.consignee }}</text>
					<text class="phone">{{ address.phone }}</text>
					<text class="tag" v-if="address.is_default == 1">默认</text>
				</view>
				<view class="detail x-bc">
					<view class="address">{{ address.province_name }}{{ address.city_name }}{{ address.area_name }}{{ address.address }}</view>
					<text class="cuIcon-right"></text>
				</view>
			</view>
		</view>
		<view class="content_box">
			<!-- 确认订单商品卡片 -->
			<view class="goods-list" v-for="g in orderPre.new_goods_list" :key="g.sku_price_id">
				<view class="goods-card">
					<shopro-mini-card :detail="g.detail" :sku="g.detail.current_sku_price" :type="'sku'">
						<block slot="goodsBottom">
							<view class="goods-price x-bc">
								<view class="">
									<text v-if="orderType === 'score'">{{ g.detail.current_sku_price.score }}积分+</text>
									<text>￥{{ g.detail.current_sku_price.price }}</text>
								</view>
								<text class="goods-num">x{{ g.goods_num }}</text>
							</view>
						</block>
					</shopro-mini-card>
				</view>

				<!-- 配送方式 -->
				<view class="logistic item-list x-bc">
					<view class="x-f"><view class="item-title">配送方式</view></view>
					<view class="x-f">
						<view class="detail">普通配送</view>
						<text class="cuIcon-right"></text>
					</view>
				</view>
				<!-- 备注 -->
				<view class="remark-box x-f item-list">
					<view class="item-title">备注</view>
					<input class="item-input" placeholder-class="input-pl" type="text" v-model="remark" placeholder="建议留言前先于卖家沟通确认" />
				</view>
			</view>

			<view class="coupon x-bc item-list" v-if="!orderPre.activity_type && orderType !== 'score'">
				<view class="item-title">优惠券</view>
				<view class="x-f" @tap="selCoupon">
					<text class="price" v-if="pickerData.couponList.length">{{ pickerData.title }}</text>
					<text class="sel-coupon" v-else>暂无优惠券</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="score item-list x-bc" v-if="orderType === 'score'">
				<view class="x-f"><text class="item-title">积分</text></view>
				<view class="price">-{{ orderPre.score_amount }}积分</view>
			</view>
			<view class=" x-bc item-list border-top">
				<view class="item-title">商品金额</view>
				<view class="x-f">
					<text class="price">￥{{ orderPre.goods_amount || '0.00' }}</text>
				</view>
			</view>
			<view class="price-box x-bc item-list">
				<view class="item-title">运费</view>
				<view class="x-f">
					<text class="price">￥{{ orderPre.dispatch_amount || '0.00' }}</text>
				</view>
			</view>
		</view>
		<view class="foot_box x-f">
			<text class="num">共1件</text>
			<view class="all-money">
				<text>合计：</text>
				<text class="price">￥{{ orderPre.total_fee || '0.00' }}</text>
			</view>
			<button class="cu-btn sub-btn" @tap="subOrder" :disabled="isSubOrder">
				<text v-if="isSubOrder" class="cuIcon-loading2 cuIconfont-spin"></text>
				提交订单
			</button>
		</view>
		<!-- pricker -->
		<sh-picker-modal v-if="pickerData.couponList" @changeCoupon="changeCoupon" v-model="showPicker" :pickerData="pickerData"></sh-picker-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
		<!-- 配送方式弹窗 -->
		<shopro-modal v-model="showExpressType" :modalType="'bottom-modal'">
			<block slot="modalContent">
				<!-- 配送方式 -->
				<view class="express-type">
					<view class="express-type__head">
						<view class="express-type__head-nav" v-for="(nav, index) in expressType" :key="nav.id" @tap="changeExpressType(index)">
							<text class="head-nav__title" :class="{ 'head-nav__title--active': expressTypeCur === index }">{{ nav.title }}</text>
							<view :class="expressClass" v-show="expressTypeCur === index"></view>
						</view>
					</view>
					<view class="express-type__content">
						<view class="empty-address" v-if="!addressId" @tap="jump('/pages/user/address/list', { from: 'order' })">
							请添加收货地址
							<text class="cuIcon-right"></text>
						</view>
						<!-- 快递 -->
						<view class="express-address" v-if="addressId && expressTypeCur == 0">
							<view class="express-top" @tap="jump('/pages/user/address/list', { from: 'order' })">
								<text class="tag" v-if="address.is_default == 1">默认</text>
								<text class="address">{{ address.province_name }}{{ address.city_name }}{{ address.area_name }}{{ address.address }}</text>
								<text class="cuIcon-right address-guide"></text>
								<view class="address-location">
									<image class="location-img" src="/static/imgs/order/e0.png" mode=""></image>
									<text class="location-text">物流快递</text>
								</view>
							</view>
							<view class="express-content">
								<view class="phone-box1">
									<text class="name">{{ address.consignee }}</text>
									<text class="phone">{{ address.phone }}</text>
								</view>
							</view>
							<view class="express-bottom"></view>
						</view>
						<!-- 自提 -->
						<view class="express-address" v-if="addressId && expressTypeCur == 1">
							<view class="express-top" @tap="jump('/pages/order/business-address', { from: 'order' })">
								<text class="tag1" v-if="address.is_default == 1">最近</text>
								<text class="address">{{ address.province_name }}{{ address.city_name }}{{ address.area_name }}{{ address.address }}</text>
								<text class="cuIcon-right address-guide"></text>
								<view class="address-location">
									<image class="location-img" src="/static/imgs/order/e1.png" mode=""></image>
									<text class="location-text">距您650m</text>
								</view>
							</view>
							<view class="express-content">
								<view class="time-box">
									<text class="box-title">配送时间</text>
									<view class="box-content" @tap="checkExpressTime('shop')">
										<text class="box-text">{{ checkTime['time'][checkTimeCur] }}</text>
										<text class="cuIcon-right box-icon"></text>
									</view>
								</view>
								<view class="box-line"></view>
								<view class="phone-box">
									<text class="box-title">预留电话</text>
									<view class="box-content x-f">
										<input class="edit-phone" type="number" v-model="selfPhone" />
										<text class="cuIcon-write box-icon"></text>
									</view>
								</view>
							</view>
							<view class="express-bottom">
								<label class="x-f" @tap="checkProtocol">
									<checkbox class="round protocol-checkbox orange" :class="{ checked: isProtocol }" :checked="true"></checkbox>
									<view class="protocol">
										同意并接受
										<text class="protocol-text" @tap="jump('/pages/public/richtext', { id: 3 })">《到店自提服务协议》</text>
									</view>
								</label>
							</view>
						</view>
						<!-- 商家 -->
						<view class="express-address" v-if="addressId && expressTypeCur == 2">
							<view class="express-top" @tap="jump('/pages/user/address/list', { from: 'order' })">
								<text class="tag" v-if="address.is_default == 1">默认</text>
								<text class="address">{{ address.province_name }}{{ address.city_name }}{{ address.area_name }}{{ address.address }}</text>
								<text class="cuIcon-right address-guide"></text>
								<view class="address-location">
									<image class="location-img" src="/static/imgs/order/e2.png" mode=""></image>
									<text class="location-text">商家配送</text>
								</view>
							</view>
							<view class="express-content">
								<view class="time-box">
									<text class="box-title">配送时间</text>
									<view class="box-content" @tap="checkExpressTime('shop')">
										<text class="box-text">{{ checkTime['time'][checkTimeCur] }}</text>
										<text class="cuIcon-right box-icon"></text>
									</view>
								</view>
								<view class="box-line"></view>
								<view class="phone-box">
									<text class="box-title">预留电话</text>
									<view class="box-content x-f">
										<input class="edit-phone" type="number" v-model="selfPhone" />
										<text class="cuIcon-write box-icon"></text>
									</view>
								</view>
							</view>
							<view class="express-bottom"></view>
						</view>
						<!-- 自动 -->
						<view class="express-address" v-if="addressId && expressTypeCur == 3">
							<view class="express-top">
								<text class="dispatch-notice">订单支付完成后，请在订单详情页查看发货信息</text>
								<view class="address-location">
									<image class="location-img" src="/static/imgs/order/e3.png" mode=""></image>
									<text class="location-text">自动发货</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</shopro-modal>
	</view>
</template>

<script>
import shoproMiniCard from '@/components/shopro-mini-card/shopro-mini-card.vue';
import shPickerModal from './children/sh-picker-modal.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {
		shoproMiniCard,
		shPickerModal
	},
	data() {
		return {
			showPicker: false,
			isSubOrder: false,
			pickerData: {
				title: '选择优惠券',
				couponList: []
			},
			address: {
				is_default: 0
			},
			addressId: 0,
			from: '',
			orderType: '',
			grouponBuyType: 'alone',
			grouponId: 0,
			goodsList: [],
			remark: '',
			orderPre: {},
			couponId: 0,
			couponPrice: '选择优惠券',
			showExpressType: true ,//配送方式弹窗
			expressTypeCur: 0,
			expressType: [
				//快递方式
				{
					id: 'e1',
					title: '物流快递'
				},
				{
					id: 'e2',
					title: '上门自提'
				},
				{
					id: 'e3',
					title: '商家配送'
				},
				{
					id: 'e4',
					title: '自动发货'
				}
			],
			isProtocol: true, //自提协议。
			selfPhone: 15625892568, //编辑手机号
			checkType: '自提',
			checkTime: {
				//选择配送时间数据
				day: ['今天（周五）', '明天（周六）'],
				time: ['15:30', '15:50', '16:10', '16:30', '16:50', ' 17:10']
			},
			checkTimeCur: 0, //默认选中。
			checkTimeId: 'c1',
			checkDayCur: 0
		};
	},
	computed: {
		expressClass() {
			let cl = 'head-nav--active';
			const { expressType, expressTypeCur } = this;
			if (expressTypeCur === 0) {
				cl = 'head-nav__left--active';
			}
			if (expressTypeCur === expressType.length - 1) {
				cl = 'head-nav__right--active';
			}
			return cl;
		}
	},
	watch: {
		address(val, oldVal) {
			if (this.address) {
				this.addressId = this.address.id;
				this.getPre();
			}
		}
	},
	async onLoad() {
		this.goodsList = JSON.parse(this.$Route.query.goodsList);
		this.from = this.$Route.query.from;
		this.orderType = this.$Route.query.orderType;
		this.grouponBuyType = this.$Route.query.grouponBuyType;
		this.grouponId = this.$Route.query.grouponId;
		await this.init();
	},
	onShow() {},
	methods: {
		...mapActions(['getCartList']),
		init() {
			return Promise.all([this.getDefaultAddress(), this.getPre(), this.getCoupons()]);
		},
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 订单信息
		getPre() {
			let that = this;
			that.$api('order.pre', {
				goods_list: that.goodsList,
				from: that.from,
				address_id: that.addressId,
				coupons_id: that.couponId,
				dispatch_type: 'express',
				order_type: that.orderType,
				buy_type: that.grouponBuyType,
				groupon_id: that.grouponId
			}).then(res => {
				if (res.code === 1) {
					that.orderPre = res.data;
				}
			});
		},
		// 提交订单
		subOrder() {
			let that = this;
			that.isSubOrder = true;
			that.$api('order.createOrder', {
				goods_list: that.goodsList,
				from: that.from,
				address_id: that.addressId,
				coupons_id: that.couponId,
				remark: that.remark,
				dispatch_type: 'express',
				order_type: that.orderType,
				buy_type: that.grouponBuyType,
				groupon_id: that.grouponId
			}).then(res => {
				if (res.code === 1) {
					let orderId = res.data.id;
					let orderSn = res.data.order_sn;
					that.getCartList();
					that.isSubOrder = false;
					//  #ifdef MP-WEIXIN
					res.data.activity_type == 'groupon' ? this.$store.dispatch('getMessageIds', 'grouponResult') : this.$store.dispatch('getMessageIds', 'result');
					//  #endif
					if (res.data.status > 0) {
						that.$Router.replace({
							path: '/pages/order/payment/result',
							query: {
								orderSn: orderSn,
								type: '',
								pay: 1
							}
						});
					} else {
						uni.redirectTo({
							url: `/pages/order/payment/method?orderId=${orderId}`
						});
					}
				} else {
					that.isSubOrder = false;
				}
			});
		},
		// 初始地址
		getDefaultAddress() {
			this.$api('address.defaults').then(res => {
				if (res.code === 1) {
					this.address = res.data;
				}
			});
		},
		// 可用优惠券
		getCoupons() {
			let that = this;
			that.$api('order.coupons', {
				goods_list: that.goodsList,
				from: that.from,
				address_id: that.addressId,
				coupons_id: that.couponId,
				dispatch_type: 'express',
				order_type: that.orderType
			}).then(res => {
				if (res.code === 1) {
					that.pickerData.couponList = res.data;
				}
			});
		},
		// 选择优惠券
		selCoupon() {
			if (this.pickerData.couponList.length) {
				this.showPicker = true;
			} else {
				this.$tools.toast('暂无优惠券');
			}
		},
		changeCoupon(index) {
			if (index >= 0) {
				this.couponId = this.pickerData.couponList[index].user_coupons_id;
				this.pickerData.title = '-￥' + this.pickerData.couponList[index].amount;
				this.getPre();
			} else {
				this.couponId = 0;
				this.pickerData.title = '选择优惠券';
				this.getPre();
			}
		}
	}
};
</script>

<style lang="scss">
.add-address-box {
	height: 100rpx;
	background: #fff;
	position: relative;
	.address-bg {
		position: absolute;
		bottom: 0;
		height: 8rpx;
		width: 100%;
	}
	.select-notice {
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 40rpx;
	}
}
.address-list {
	padding: 40rpx;
	background: #fff;

	position: relative;
	.address-bg {
		position: absolute;
		bottom: 0;
		height: 8rpx;
		width: 750rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.name,
	.phone {
		font-size: 30rpx;
		font-weight: 500;
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
		.address {
			margin-top: 25rpx;
			width: 543rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			line-height: 40rpx;
		}
	}
}
// 商品卡片
.goods-list {
	background: #fff;
	position: relative;
	margin-top: 20rpx;

	/deep/ .goods-title {
		width: 460rpx !important;
	}
	.goods-card {
		padding: 30rpx;
	}
	.remark-box {
		margin-bottom: 20rpx;
		background: #fff;
		padding: 25rpx;
		.item-input {
			flex: 1;
			text-align: end;
			font-size: 28rpx;
		}
		.input-pl {
			color: #c4c4c4;
		}
	}
	.goods-price {
		font-size: 30rpx;
		font-weight: 500;
		width: 480rpx;
		.goods-num {
			font-size: 28rpx;
			color: #c4c4c4;
		}
	}
}

.item-list {
	height: 100rpx;
	background: #fff;
	padding: 0 25rpx;

	.item-title {
		font-size: 28rpx;
		margin-right: 20rpx;
	}

	.detail {
		font-size: 28rpx;
		color: #c4c4c4;
	}

	.price {
		font-size: 26rpx;
		color: #e1212b;
		margin-right: 20rpx;
	}
	.sel-coupon {
		font-size: 26rpx;
		color: #c4c4c4;
		margin-right: 20rpx;
	}
}
.logistic,
.price-box,
.remark-box,
.score {
	border-top: 1rpx solid rgba(#dfdfdf, 0.5);
}
.border-top {
	border-top: 1rpx solid rgba(#dfdfdf, 0.5);
}

.foot_box {
	height: 100rpx;
	padding: 0 25rpx;
	justify-content: flex-end;
	background-color: #fff;

	.num {
		font-size: 26rpx;
		color: #999;
	}

	.all-money {
		margin: 0 60rpx 0 20rpx;

		.price {
			color: #e1212b;
		}
	}

	.sub-btn {
		width: 210rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		border-radius: 35rpx;
		font-size: 28rpx;
		color: #fff;
	}
}
// 弹窗之配送方式
// 配送方式
.express-type {
	width: 750rpx;
	background-color: #fff;
	border-radius: 20rpx 20rpx 0 0;
	min-height: 700rpx;
	.express-type__head {
		width: 100%;
		height: 62rpx;
		background: #faf0dc;
		@include flex($align: center);
		border-radius: 20rpx 20rpx 0 0;
		&-nav {
			flex: 1;
			@include flex($align: center, $justify: center);
			position: relative;
			height: 100%;
		}
		.head-nav--active {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 0;
			background: #fff;
			width: 100%;
			height: 74rpx;
			background-color: #fff;
			border-radius: 20rpx 20rpx 0px 0px;
			&::after {
				content: '';
				display: block;
				width: 40rpx;
				height: 74rpx;
				position: absolute;
				transform: skewX(20deg);
				background: #fff;
				border-top-right-radius: 20rpx;
				top: 0;
				right: -15rpx;
			}
			&::before {
				content: '';
				display: block;
				width: 40rpx;
				height: 74rpx;
				position: absolute;
				transform: skewX(-20deg);
				background: #fff;
				border-top-left-radius: 20rpx;
				top: 0;
				left: -15rpx;
			}
		}
		.head-nav__left--active {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 0;
			background: #fff;
			width: 100%;
			height: 74rpx;
			background-color: #fff;
			border-radius: 20rpx 20rpx 0px 0px;
			&::after {
				content: '';
				display: block;
				width: 40rpx;
				height: 74rpx;
				position: absolute;
				transform: skewX(20deg);
				background: #fff;
				border-top-right-radius: 20rpx;
				top: 0;
				right: -15rpx;
			}
		}
		.head-nav__right--active {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 0;
			background: #fff;
			width: 100%;
			height: 74rpx;
			background-color: #fff;
			border-radius: 20rpx 20rpx 0px 0px;
			&::before {
				content: '';
				display: block;
				width: 40rpx;
				height: 74rpx;
				position: absolute;
				transform: skewX(-20deg);
				background: #fff;
				border-top-left-radius: 20rpx;
				top: 0;
				left: -15rpx;
			}
		}
		.head-nav__title {
			font-size: 24rpx;
			font-weight: 500;
			color: #666;
			position: relative;
			z-index: 6;
		}
		.head-nav__title--active {
			color: #a8700d;
			font-size: 26rpx;
		}
	}
	.express-type__content {
		.empty-address {
			height: 120rpx;
			padding: 0 25rpx;
			@include flex($justify: null, $align: center, $direction: null, $warp: null, $warpAlign: null);
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
		}
		// 快递
		.express-address {
			position: relative;
			padding: 30rpx 25rpx;
			background: url('~@/static/imgs/order/address_bg.png') no-repeat;
			background-size: 430rpx 300rpx;
			background-position: top right;
			.express-top {
				padding-bottom: 20rpx;
				width: 450rpx;
				.address {
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					line-height: 40rpx;
				}
				.dispatch-notice {
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					line-height: 40rpx;
				}
				.address-location {
					@include flex($justify: center, $align: center, $direction: column, $warp: null, $warpAlign: null);
					position: absolute;
					right: 60rpx;
					top: 30rpx;
					.location-img {
						width: 80rpx;
						height: 90rpx;
					}
					.location-text {
						font-size: 18rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
					}
				}
				.tag {
					background: rgba(233, 191, 113, 0.2);
					border-radius: 6rpx;
					padding: 0 16rpx;
					line-height: 38rpx;
					color: #a8700d;
					font-size: 22rpx;
					margin-right: 20rpx;
				}
				.tag1 {
					background: rgba(53, 190, 105, 0.2);
					border-radius: 6rpx;
					padding: 0 16rpx;
					line-height: 38rpx;
					color: #1bbc50;
					font-size: 22rpx;
					margin-right: 20rpx;
				}
				.address-guide {
					position: absolute;
					right: 25rpx;
					top: 40rpx;
					color: #999999;
				}
			}

			.express-content {
				margin: 20rpx 0;
				@include flex($justify: null, $align: center, $direction: null, $warp: null, $warpAlign: null);
				.box-line {
					width: 1rpx;
					height: 61rpx;
					border-left: 1rpx solid rgba(238, 238, 238, 1);
					margin: 0 40rpx;
				}
				.phone-box1 {
					.name,
					.phone {
						font-size: 26rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: rgba(102, 102, 102, 1);
					}

					.phone {
						margin-left: 20rpx;
					}
				}
				.time-box,
				.phone-box {
					.box-title {
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #666;
						padding-bottom: 10rpx;
					}
					.box-text {
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #333;
					}
					.edit-phone {
						width: 160rpx;
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #333;
					}
					.box-icon {
						font-size: 28rpx;
						color: #999;
						display: inline-block;
						width: 40rpx;
						text-align: center;
						line-height: 40rpx;
					}
				}
			}
			.express-bottom {
				.protocol-checkbox {
					transform: scale(0.7);
				}
				.protocol {
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(102, 102, 102, 1);
					.protocol-text {
						color: #6487a4;
					}
				}
			}
		}
	}
}

</style>
