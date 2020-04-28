<template>
	<view class="page_box">
		<view class="head_box">
			<view class="add-address-box flex-sub x-f" v-if="!address" @tap="jump('/pages/user/address/list', { from: 'order' })">
				<image class="address-bg" src="/static/imgs/address_line.png" mode=""></image>
				<view class="box-bg x-bc flex-sub pad">
					<text class="select-notice">请选择默认地址</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="address-list" v-else @tap="jump('/pages/user/address/list', { from: 'order' })">
				<image class="address-bg" src="/static/imgs/address_line.png" mode=""></image>
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
			<view class="logistic item-list x-bc">
				<view class="x-f">
					<view class="item-title">配送方式</view>
					<view class="detail">普通配送</view>
				</view>
				<view class="x-f">
					<view class="item-title">快递运输</view>
					<text class="cuIcon-right"></text>
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
			<view class=" x-bc item-list">
				<view class="item-title">商品金额</view>
				<view class="x-f">
					<text class="price">￥{{ orderPre.goods_amount }}</text>
				</view>
			</view>
			<view class="price-box x-bc item-list">
				<view class="item-title">运费</view>
				<view class="x-f">
					<text class="price">￥{{ orderPre.dispatch_amount }}</text>
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
				<text class="price">￥{{ orderPre.total_fee }}</text>
			</view>
			<button class="cu-btn sub-btn" @tap="subOrder" :disabled="isSubOrder">
				<text v-if="isSubOrder" class="cuIcon-loading2 cuIconfont-spin"></text>
				提交订单
			</button>
		</view>
		<!-- pricker -->
		<shopro-picker-modal v-if="pickerData.couponList" @changeCoupon="changeCoupon" v-model="showPicker" :pickerData="pickerData"></shopro-picker-modal>
	</view>
</template>

<script>
import shoproMiniCard from '@/components/goods/shopro-mini-card.vue';
import shoproPickerModal from '@/components/modal/shopro-picker-modal.vue';
export default {
	components: {
		shoproMiniCard,
		shoproPickerModal
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
			goodsList: [],
			remark: '',
			orderPre: {},
			couponId: 0,
			couponPrice: '选择优惠券'
		};
	},
	computed: {},
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
				}else{
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
.logistic,
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
</style>
