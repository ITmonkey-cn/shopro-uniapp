<template>
	<view class="page_box">
		<view class="head_box">
			<!-- 标题栏 -->
			<view class="title-bar">
				<cu-custom :isBack="true">
					<block slot="backText"><text class="title-bar__text">确认订单</text></block>
				</cu-custom>
			</view>
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
						<view class="express-top" @tap="jump('/pages/order/pickup', { from: 'order' })">
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
						<view class="express-top" @tap="jump('/pages/user/address/list', { from: 'order' })">
							<text class="dispatch-notice">订单支付完成后，请在订单详情页查看发货信息</text>
							<view class="address-location">
								<image class="location-img" src="/static/imgs/order/e3.png" mode=""></image>
								<text class="location-text">自动发货</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content_box">
			<view class="goods-list" v-for="g in orderPre.new_goods_list" :key="g.sku_price_id">
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
			<view class=" x-bc item-list">
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
			<view class="remark-box">
				<view class="item-title">
					备注:
					<text class="remark-notice">(100字以内)</text>
				</view>
				<textarea v-show="!showPicker" class="remark-inp" maxlength="100" v-model="remark" placeholder="请填写备注信息" />
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
		<shopro-picker-modal v-if="pickerData.couponList" @changeCoupon="changeCoupon" v-model="showPicker" :pickerData="pickerData"></shopro-picker-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
		<!-- 配送时间弹窗 -->
		<shopro-modal v-model="showCheckTime" :modalType="'bottom-modal'">
			<block slot="modalContent">
				<view class="checkTime-box page_box">
					<view class="checkTime-head">
						选择{{ checkType }}时间
						<text class="cuIcon-roundclosefill" @tap="showCheckTime = false"></text>
					</view>
					<view class="checkTime-content content_box">
						<view class="checkTime-content__left">
							<view
								class="left-item x-c"
								@tap="check('day', index)"
								:class="{ 'item--active': checkDayCur == index }"
								v-for="(day, index) in checkTime.day"
								:key="day"
							>
								{{ day }}
							</view>
						</view>
						<scroll-view class="checkTime-content__right scroll-box" :scroll-into-view="'c' + checkTimeId" scroll-y scroll-with-animation>
							<view
								class="right-item"
								:id="'c' + time.split(':')[0]"
								@tap="check('time', index)"
								:class="{ 'item--active': checkTimeCur == index }"
								v-for="(time, index) in checkTime.time"
								:key="time"
							>
								{{ time }}
							</view>
						</scroll-view>
					</view>
					<view class=" checkTime-foot x-c"><button class="cu-btn save-btn" @tap="showCheckTime = false">保存并使用</button></view>
				</view>
			</block>
		</shopro-modal>
	</view>
</template>

<script>
import shoproMiniCard from '@/components/goods/shopro-mini-card.vue';
import shoproPickerModal from './children/shopro-picker-modal.vue';
import shoproModal from '@/components/modal/shopro-modal.vue';
export default {
	components: {
		shoproMiniCard,
		shoproPickerModal,
		shoproModal
	},
	data() {
		return {
			showPicker: false,
			isSubOrder: false,
			showCheckTime: false, //配送时间弹窗。
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
			goodsList: [],
			remark: '',
			orderPre: {},
			couponId: 0,
			couponPrice: '选择优惠券',
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
		await this.init();
	},
	onShow() {},
	methods: {
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
				order_type: that.orderType
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
				order_type: that.orderType
			}).then(res => {
				if (res.code === 1) {
					let sn = res.data.order_sn;
					that.isSubOrder = false;
					if (res.data.status > 0) {
						that.$Router.replace({
							path: '/pages/pay/success',
							query: {
								orderSn: sn,
								type: '',
								pay: 1
							}
						});
					} else {
						uni.redirectTo({
							url: `/pages/pay/index?id=${sn}`
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
		},
		// 选择快递方式
		changeExpressType(cur) {
			this.expressTypeCur = cur;
		},
		// 是否同意协议
		checkProtocol() {
			this.isProtocol = !this.isProtocol;
		},
		// 选择配送时间
		checkExpressTime(type) {
			switch (type) {
				case 'shop':
					this.checkType = '配送';
					break;
				case 'oneself':
					this.checkType = '自提';
					break;
				default:
					this.checkType = '自提';
			}
			this.showCheckTime = !this.showCheckTime;
		},
		check(type, index) {
			if (type == 'time') {
				this.checkTimeCur = index;
				this.checkTimeId = this.checkTime['time'][index].split(':')[[0]];
			}
			if (type == 'day') {
				this.checkDayCur = index;
			}
		}
	}
};
</script>

<style lang="scss">
// 标题栏
.head_box {
	background: linear-gradient(180deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1), rgba(255, 254, 254, 1));
	border-bottom: 1rpx solid #f5f5f5;
	.title-bar {
		/deep/.cuIcon-back {
			color: #333;
			font-size: 36rpx;
			font-weight: 500;
		}
		.title-bar__text {
			color: #333;
			font-size: 36rpx;
			font-weight: 500;
		}
	}
}

// 配送方式
.express-type {
	width: 710rpx;
	margin: 20rpx 20rpx 0;
	background-color: #fff;
	border-radius: 20rpx 20rpx 0 0;
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

.goods-list {
	padding: 30rpx 20rpx;
	background: #fff;
	margin: 20rpx 0;
	position: relative;

	/deep/ .goods-title {
		width: 460rpx !important;
	}

	.tag-box {
		padding-top: 10rpx;
		.tag1 {
			line-height: 36rpx;
			padding: 0 8rpx;
			font-size: 18rpx;
			color: rgba(#fff, 0.9);
			background: #f39800;
			display: inline-block;
			box-sizing: border-box;
		}

		.tag2 {
			line-height: 34rpx;
			padding: 0 8rpx;
			font-size: 18rpx;
			color: rgba(#f39800, 0.9);
			background: #fff;
			border: 1rpx solid #f39800;
			display: inline-block;
			box-sizing: border-box;
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

	.goods-radio {
		transform: scale(0.7);
		margin-right: 20rpx;
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
.remark-box {
	margin-bottom: 20rpx;
	background: #fff;
	padding: 25rpx;
	.remark-notice {
		font-size: 24rpx;
		color: #c4c4c4;
		padding: 0 20rpx;
	}
	.remark-inp {
		width: 700rpx;
		font-size: 28rpx;
		padding: 20rpx;
		height: 200rpx;
		background: #f5f5f5;
		border-radius: 20rpx;
		margin-top: 25rpx;
	}
}
.price-box,
.score {
	border-top: 1rpx solid rgba(#dfdfdf, 0.5);
	margin-bottom: 20rpx;
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
// 选择配送给时间
.checkTime-box {
	background: rgba(255, 255, 255, 1);
	border-radius: 20rpx 20rpx 0px 0px;
	height: 720rpx;
	.checkTime-head {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 100rpx;
		position: relative;
		.cuIcon-roundclosefill {
			color: #e0e0e0;
			position: absolute;
			top: 30rpx;
			right: 30rpx;
			line-height: 30rpx;
			font-size: 40rpx;
		}
	}
	.checkTime-foot {
		height: 100rpx;
		.save-btn {
			width: 690rpx;
			height: 80rpx;
			background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
			border-radius: 40rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
		}
	}
	.checkTime-content {
		@include flex($justify: between, $align: center, $direction: null, $warp: null, $warpAlign: null);
		.checkTime-content__left {
			height: 100%;
			width: 190rpx;
			background: #f5f5f5;
			.left-item {
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				height: 100rpx;
				width: 100%;
			}
		}
		.checkTime-content__right {
			flex: 1;
			height: 100%;
			overflow-y: auto;
			.right-item {
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				width: 100%;
				text-align: left;
				border-bottom: 1rpx solid rgba(#dfdfdf, 0.6);
				margin: 0 30rpx;
				line-height: 100rpx;
			}
		}
		.item--active {
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(168, 112, 13, 1) !important;
			background-color: #fff;
		}
	}
}
</style>
