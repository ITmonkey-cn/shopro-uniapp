<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="content_box">
			<view class="detail-head">
				<view class="state-box x-f">
					<image class="state-img" src="http://shopro.7wpp.com/imgs/order_state1.png" mode=""></image>
					<text>{{ orderDetail.status_name }}</text>
				</view>
			</view>
			<view class="detail-goods">
				<!-- 订单信息 -->
				<view class="order-list" v-for="order in orderDetail.item" :key="order.id">
					<shopro-mini-card :type="'order'" :detail="order"></shopro-mini-card>
					<view class="order-bottom  x-f">
						<view class="btn-box" v-for="(btn, index) in order.btns" :key="btn">
							<button
								@tap="jump('/pages/goods/detail/index', { id: order.goods_id })"
								class="cu-btn btn1"
								:class="{ btn2: index + 1 === order.btns.length }"
								v-if="btn === 'buy_again'"
							>
								再次购买
							</button>
							<button class="cu-btn btn1" :class="{ btn2: index + 1 === order.btns.length }" v-if="btn === 'express'" @tap="checkExpress(orderDetail.id, order.id)">
								查看物流
							</button>
							<button @tap.stop="onConfirm(orderDetail.id, order.id)" class="cu-btn btn1" :class="{ btn2: index + 1 === order.btns.length }" v-if="btn === 'get'">
								确认收货
							</button>
							<button
								@tap.stop="onAftersale(orderDetail.id, order.id)"
								class="cu-btn btn1"
								:class="{ btn2: index + 1 === order.btns.length }"
								v-if="btn === 'aftersale'"
							>
								申请售后
							</button>
							<button
								@tap.stop="onRefund(orderDetail.id, order.id)"
								class="cu-btn btn1"
								:class="{ btn2: index + 1 === order.btns.length }"
								v-if="btn === 'apply_refund'"
							>
								申请退款
							</button>
							<button @tap.stop="onComment(orderDetail.id, order.id)" class="cu-btn btn1" :class="{ btn2: index + 1 === order.btns.length }" v-if="btn === 'comment'">
								待评价
							</button>
							<button class="cu-btn btn1" :class="{ btn2: index + 1 === order.btns.length }" v-if="btn === 'after_detail'">售后详情</button>
						</view>
					</view>
				</view>
			</view>
			<!-- 拼团信息 -->
			<view class="y-bc group-box">
				<view class="tip-box x-f" v-if="false">
					<text class="cuIcon-roundcheckfill"></text>
					<text>恭喜您拼购成功！已有1人跟团购买</text>
				</view>
				<view class="title-box x-f">
					<view class="title-text">
						待成团，还差
						<text class="group-num">1</text>
						人拼团成功
					</view>
					<view class="count-down x-f">
						<text class="count-down-tip">还剩</text>
						<view class="time-box x-f">
							<view class="count-text">{{ time.h || '00' }}</view>
							:
							<view class="count-text">{{ time.m || '00' }}</view>
							:
							<view class="count-text">{{ time.s || '00' }}</view>
						</view>
					</view>
				</view>
				<view class="group-people x-f">
					<view class="img-box">
						<view class="tag">团长</view>
						<image class="avatar" src="/static/imgs/base_avatar.png" mode=""></image>
					</view>
				</view>
			</view>
			<!-- 收货信息 -->
			<view class="notice-box" v-if="true">
				<view class="notice-box__head">收货信息</view>
				<view class="notice-box__content">
					<view class="x-f notice-item">
						<text class="title">收货人：</text>
						<text class="detail">{{ orderDetail.consignee }} {{ orderDetail.phone }}</text>
					</view>
					<view class="x-f notice-item">
						<text class="title">收货地址：</text>
						<text class="detail">{{ orderDetail.province_name }}{{ orderDetail.city_name }}{{ orderDetail.area_name }}{{ orderDetail.address }}</text>
					</view>
				</view>
			</view>
			<!-- 自提信息 -->
			<view class="notice-box" v-if="false">
				<view class="notice-box__head">自提信息</view>
				<view class="notice-box__content">
					<view class="self-pickup-box x-c"><image class="self-pickup--img" src="/static/imgs/order/send_bg.png" mode="widthFix"></image></view>
					<view class="x-f notice-item--center">
						<text class="title">自提码：</text>
						<text class="detail">123456789</text>
						<button class="cu-btn copy-btn" @tap="onCopy(123456)">复制</button>
					</view>
					<view class="x-f notice-item--center">
						<text class="title">自提时间：</text>
						<text class="detail">2020年05月12日 18:30</text>
					</view>
					<view class="x-f notice-item">
						<text class="title">自提地址：</text>
						<text class="detail">{{ orderDetail.province_name }}{{ orderDetail.city_name }}{{ orderDetail.area_name }}{{ orderDetail.address }}</text>
					</view>
				</view>
			</view>
			<!-- 配送信息 -->
			<view class="notice-box" v-if="false">
				<view class="notice-box__head">配送信息</view>
				<view class="notice-box__content">
					<view class="x-f notice-item--center">
						<text class="title">配送时间：</text>
						<text class="detail">2020年05月12日 18:30</text>
					</view>
					<view class="x-f notice-item">
						<text class="title">配送地址：</text>
						<text class="detail">{{ orderDetail.province_name }}{{ orderDetail.city_name }}{{ orderDetail.area_name }}{{ orderDetail.address }}</text>
					</view>
					<view class="x-f notice-item--center">
						<text class="title">商家电话：</text>
						<text class="detail">13985269546</text>
						<button class="cu-btn copy-btn" @tap="$tools.callPhone(13985269546)">拨打</button>
					</view>
				</view>
			</view>
			<!-- 自动发货 -->
			<view class="notice-box" v-if="false">
				<view class="notice-box__head">发货信息</view>
				<view class="notice-box__content">
					<view class="x-f notice-item--center">
						<text class="title">百度网盘：</text>
						<text class="detail">https://pan.baidu.com/</text>
						<button class="cu-btn copy-btn" @tap="onCopy('https://pan.baidu.com/')">复制</button>
					</view>
					<view class="x-f notice-item--center">
						<text class="title">提取码：</text>
						<text class="detail">123456</text>
						<button class="cu-btn copy-btn" @tap="onCopy(123456)">复制</button>
					</view>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="notice-box">
				<view class="notice-box__head">订单信息</view>
				<view class="notice-box__content">
					<view class="notice-item--center x-f">
						<text class="title">订单编号：</text>
						<text class="detail">{{ orderDetail.order_sn }}</text>
						<button class="cu-btn copy-btn" @tap="onCopy(orderDetail.order_sn)">复制</button>
					</view>
					<view class="notice-item x-f">
						<text class="title">下单时间：</text>
						<text class="detail">{{ orderDetail.createtime }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="foot_box">
			<view class="money-box x-f justify-end">
				<text class="money-title">共{{ allNum }}件商品 合计:</text>
				<text class="all-price">￥{{ orderDetail.total_fee }}</text>
			</view>
			<view class="btn-box x-f" v-if="orderDetail.btns && orderDetail.btns.length">
				<button @tap.stop="onCancel(orderDetail.id)" class="cu-btn obtn1">取消订单</button>
				<button @tap.stop="onPay(orderDetail.order_sn)" class="cu-btn obtn2">付款</button>
			</view>
		</view>
	</view>
</template>

<script>
import shoproMiniCard from '@/components/goods/shopro-mini-card.vue';
export default {
	components: {
		shoproMiniCard
	},
	data() {
		return {
			time: 0,
			orderDetail: {},
			orderStatus: {
				'-2': '已关闭',
				'-1': '已取消',
				'0': '未付款',
				'1': '已付款',
				'2': '已完成'
			}
		};
	},
	onShow() {
		this.getOrderDetail();
	},
	onLoad() {
		this.countDown();
	},
	computed: {
		allNum() {
			if (this.orderDetail.item) {
				let items = this.orderDetail.item;
				let allPrice = 0;
				items.forEach(p => {
					allPrice += p.goods_num;
				});
				return allPrice;
			}
		}
	},
	methods: {
		// 倒计时
		countDown() {
			let _self = this;
			// let t = this.activityData.endtime * 1000 - new Date().getTime();
			let t = 10000;
			let timer = setInterval(() => {
				if (t > 0) {
					_self.time = _self.$tools.format(t);
					t--;
				} else {
					clearInterval(timer);
					_self.time = '倒计时结束';
				}
			}, 1000);
		},
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 订单详情
		getOrderDetail() {
			console.log('detial', this.$Route.query.id);
			let that = this;
			that.$api('order.detail', {
				order_sn: that.$Route.query.id
			}).then(res => {
				if (res.code === 1) {
					that.orderDetail = res.data;
					let date = new Date(res.data.createtime * 1000);
					that.orderDetail.createtime = that.$tools.dateFormat('YYYY-mm-dd HH:MM', date);
				}
			});
		},
		// 复制
		onCopy(code) {
			let that = this;
			uni.setClipboardData({
				data: code,
				success: function(data) {
					//#ifdef H5
					that.$tools.toast('已复制到剪切板');
					//#endif
				},
				fail: function(err) {},
				complete: function(res) {}
			});
		},
		// 确认收货
		onConfirm(id, itemId) {
			let that = this;
			that.$api('order.confirm', {
				id: id,
				order_item_id: itemId
			}).then(res => {
				if (res.code === 1) {
					that.getOrderDetail();
				}
			});
		},
		// 申请退款
		onRefund(id, itemId) {
			let that = this;
			that.$api('order.refund', {
				id: id,
				order_item_id: itemId
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast('申请退款成功');
					that.getOrderDetail();
				}
			});
		},
		// 申请售后
		onAftersale(id, itemId) {
			let that = this;
			that.$api('order.aftersale', {
				id: id,
				order_item_id: itemId
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast('申请售后成功');
					that.getOrderDetail();
				}
			});
		},
		// 取消订单
		onCancel(id) {
			let that = this;
			that.$api('order.cancel', {
				id: id
			}).then(res => {
				if (res.code === 1) {
					that.$Router.back();
				}
			});
		},
		// 立即购买
		onPay(id) {
			uni.navigateTo({
				url: `/pages/order/payment/method?id=${id}`
			});
		},
		// 待评价
		onComment(orderId, ordrderItemId) {
			this.jump('/pages/order/add-comment', { orderId: orderId, ordrderItemId: ordrderItemId });
		},
		// 查看物流,
		checkExpress(orderId, ordrderItemId) {
			this.jump('/pages/order/express', { orderId: orderId, ordrderItemId: ordrderItemId });
		}
	}
};
</script>

<style lang="scss">
.detail-head {
	background: linear-gradient(0deg, rgba(239, 196, 128, 1) 0%, rgba(248, 220, 165, 1) 100%) no-repeat;
	background-size: 100% 134rpx;

	.state-box {
		padding: 30rpx 40rpx;
		color: rgba(#fff, 0.9);

		.state-img {
			width: 60rpx;
			height: 60rpx;
			// background: #ccc;
			margin-right: 40rpx;
		}
	}
}

.detail-goods {
	padding: 20rpx;
	background: #fff;
	margin-bottom: 20rpx;

	.order-list {
		.order-bottom {
			background: #fff;
			padding-bottom: 20rpx;
			justify-content: flex-end;
			padding-top: 20rpx;
			.btn1 {
				width: 160rpx;
				height: 60rpx;
				border: 1rpx solid rgba(223, 223, 223, 1);
				border-radius: 30rpx;
				font-size: 26rpx;
				background: #fff;
				padding: 0;
				margin-right: 20rpx;
			}
			.btn2 {
				width: 160rpx;
				height: 60rpx;
				border: 1rpx solid rgba(213, 166, 90, 1) !important;
				border-radius: 30rpx;
				font-size: 26rpx;
				color: #d5a65a !important;
				padding: 0;
				background: #fff;
				margin-right: 20rpx;
			}
		}
	}
}
// 拼团项目
.group-box {
	background: #fff;
	padding: 40rpx 0;
	height: 250rpx;
	margin-bottom: 20rpx;
	.tip-box {
		font-size: 28rpx;

		.cuIcon-roundcheckfill {
			color: #ecbe60;
			font-size: 34rpx;
			margin-right: 20rpx;
		}
	}
	.title-box {
		font-size: 26rpx;
		font-weight: bold;
		color: #333;
		.group-num {
			color: #f8002c;
		}
		.count-down-tip {
			font-size: 24rpx;
			padding-left: 10rpx;
		}
		.time-box {
			font-size: 18rpx;
			.count-text {
				display: inline-block;
				background-color: #383a46;
				color: #fff;
				font-size: 18rpx;
				border-radius: 2rpx;
				padding: 0 5rpx;
				height: 28rpx;
				text-align: center;
				line-height: 28rpx;
				margin: 0 6rpx;
			}
		}
	}

	.group-people {
		.img-box {
			position: relative;
			margin-right: 20rpx;
			.tag {
				position: absolute;
				line-height: 36rpx;
				background: linear-gradient(132deg, rgba(243, 223, 177, 1), rgba(243, 223, 177, 1), rgba(236, 190, 96, 1));
				border-radius: 18rpx;
				padding: 0 10rpx;
				white-space: nowrap;
				font-size: 24rpx;
				color: #784f06;
				z-index: 2;
				top: -10rpx;
			}
			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				background: #ccc;
			}
		}
	}
}

// 收货信息、订单信息。
.notice-box {
	background: #fff;
	margin-bottom: 20rpx;
	.notice-box__head {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 80rpx;
		border-bottom: 1rpx solid #dfdfdf;
		padding: 0 25rpx;
	}
	.notice-box__content {
		padding: 25rpx;
		.self-pickup-box {
			width: 100%;
			.self-pickup--img {
				width: 200rpx;
				height: 200rpx;
				margin: 40rpx 0;
			}
		}
	}
	.notice-item--center {
		margin-bottom: 10rpx;
	}
	.notice-item,
	.notice-item--center {
		margin-bottom: 10rpx;
		align-items: flex-start;
		.title {
			font-size: 28rpx;
			color: #999;
			text-align: justify;
			text-align-last: justify;
			text-justify: distribute-all-lines;
			width: 140rpx;
		}

		.detail {
			font-size: 28rpx;
			color: #333;
			flex: 1;
		}
		.copy-btn {
			width: 120rpx;
			height: 50rpx;
			// border: 1rpx solid rgba(223, 223, 223, 1);
			// border-radius: 25rpx;
			padding: 0;
			background: #fff;
			color: #b38436;
			font-size: 26rpx;
			margin-left: 30rpx;
		}
	}
	.notice-item--center {
		align-items: center;
	}
}

.foot_box {
	width: 750rpx;
	min-height: 100rpx;
	background: rgba(255, 255, 255, 1);
	border: 1rpx solid rgba(238, 238, 238, 1);
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: center;
	.money-box {
		height: 60rpx;
		padding: 0 20rpx;
		.money-title {
			font-size: 26rpx;
			color: #999999;
		}
		.all-price {
			color: #333;
			font-size: 26rpx;
		}
	}
	.btn-box {
		justify-content: flex-end;
		margin-bottom: 20rpx;
		.obtn1 {
			width: 160rpx;
			height: 60rpx;
			background: rgba(238, 238, 238, 1);
			border-radius: 30rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			margin-right: 20rpx;
			padding: 0;
		}
		.obtn2 {
			width: 160rpx;
			height: 60rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
			border-radius: 30rpx;
			margin-right: 20rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(168, 112, 13, 0.9);
			padding: 0;
		}
	}
}
</style>
