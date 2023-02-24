<template>
	<view class="page_box">
		<view class="head_box">
			<!-- tab -->
			<view class="order-nav u-flex">
				<view class="nav-item u-flex-col u-flex-1 u-col-center" v-for="nav in orderState" :key="nav.id"
					@tap="onNav(nav.type)">
					<view class="item-title">{{ nav.title }}</view>
					<text class="nav-line" :class="{ 'line-active': orderType === nav.type }"></text>
				</view>
			</view>
		</view>

		<view class="content_box">
			<scroll-view scroll-y="true" enable-back-to-top @scrolltolower="loadMore" class="scroll-box">
				<!-- 订单列表 -->
				<view class="order-list" v-for="(order, orderIndex) in orderList" :key="order.id"
					@tap.stop="jump('/pages/order/detail', { id: order.id })">
					<view class="order-head u-flex u-row-between">
						<text class="no">订单编号：{{ order.order_sn }}</text>
						<text class="state">{{ order.status_name }}</text>
					</view>
					<view class="goods-order" v-for="goods in order.item" :key="goods.id">
						<view class="order-content">
							<shopro-mini-card :title="goods.goods_title" :image="goods.goods_image">
								<template #describe>
									<view class="order-sku u-ellipsis-1">
										<text class="order-num">数量:{{ goods.goods_num || 0 }};</text>
										{{ goods.goods_sku_text ? goods.goods_sku_text : '' }}
									</view>
								</template>
								<template #cardBottom>
									<view class="order-price-box u-flex ">
										<text class="order-price font-OPPOSANS">￥{{ goods.goods_price || 0 }}</text>
										<button class="u-reset-button status-btn"
											v-if="goods.status_name">{{ goods.status_name }}</button>
									</view>
								</template>
							</shopro-mini-card>
						</view>
					</view>
					<view class="order-bottom">
						<view class="all-msg u-flex font-OPPOSANS">
							优惠：
							<text class="all-unit">￥</text>
							{{ order.discount_fee }} ，运费：
							<text class="all-unit">￥</text>
							{{ order.dispatch_amount }} ，{{ order.status <= 0 ? '需付款' : '实付款' }}：
							<view class="all-money font-OPPOSANS">{{ order.total_fee }}</view>
						</view>

						<!-- 按钮 -->
						<view class="btn-box u-flex" v-if="order.btns.length">
							<block v-for="orderBtn in order.btns" :key="orderBtn">
								<button v-if="orderBtn === 'cancel'" @tap.stop="onCancel(order.id, orderIndex)"
									class="u-reset-button obtn1">取消订单</button>
								<button v-if="orderBtn === 'pay'" @tap.stop="onPay(order.id)"
									class="u-reset-button obtn2">立即支付</button>
								<button v-if="orderBtn === 'groupon'"
									@tap.stop="jump('/pages/activity/groupon/detail', { id: order.ext_arr.groupon_id })"
									class="u-reset-button obtn2">
									拼团详情
								</button>
								<button v-if="orderBtn === 'delete'" @tap.stop="onDelete(order.id, orderIndex)"
									class="u-reset-button obtn3">删除</button>
								<button v-if="orderBtn === 'express'" @tap.stop="onExpress(order.id, orderIndex)"
									class="u-reset-button obtn1">查看物流</button>
							</block>
						</view>
					</view>
				</view>

				<!-- 空白页 -->
				<shopro-empty v-if="isEmpty" :image="$IMG_URL + '/imgs/empty/empty_groupon.png'"
					tipText="暂无商品，还有更多好货等着你噢~"></shopro-empty>
				<!-- 更多 -->
				<u-loadmore v-show="orderList.length" height="80rpx" :status="loadStatus" icon-type="flower"
					color="#ccc" />
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				isEmpty: false,
				loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
				currentPage: 1,
				lastPage: 1,
				orderType: 'all',
				orderList: [],
				orderState: [{
						id: 0,
						title: '全部',
						type: 'all'
					},
					{
						id: 1,
						title: '待付款',
						type: 'nopay'
					},
					{
						id: 2,
						title: '待发货',
						type: 'nosend'
					},
					{
						id: 3,
						title: '待收货',
						type: 'noget'
					},
					{
						id: 4,
						title: '待评价',
						type: 'nocomment'
					}
				]
			};
		},
		onShow() {
			if (this.$Route.query.type) {
				this.orderType = this.$Route.query.type;
			}
			this.orderList = [];
			this.currentPage = 1;
			this.lastPage = 1;
			this.getOrderList();
		},
		methods: {
			jump(path, parmas) {
				this.$Router.push({
					path: path,
					query: parmas
				});
			},

			// tab切换
			onNav(id) {
				if (this.orderType !== id) {
					this.orderType = id;
					this.orderList = [];
					this.currentPage = 1;
					this.lastPage = 1;
					this.getOrderList();
				}
			},

			// 订单列表
			getOrderList() {
				let that = this;
				that.loadStatus = 'loading';
				that.$http('order.index', {
					type: that.orderType,
					page: that.currentPage
				}, '加载中...').then(res => {
					if (res.code === 1) {
						that.orderList = [...that.orderList, ...res.data.data];
						that.isEmpty = !that.orderList.length;
						that.lastPage = res.data.last_page;
						that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
					}
				});
			},

			// 加载更多
			loadMore() {
				if (this.currentPage < this.lastPage) {
					this.currentPage += 1;
					this.getOrderList();
				}
			},

			// 删除订单
			onDelete(orderId, orderIndex) {
				let that = this;
				uni.showModal({
					title: '删除订单',
					content: '确定要删除这个订单么？',
					cancelText: '取消',
					confirmText: '删除',
					success: res => {
						if (res.confirm) {
							that.$http('order.deleteOrder', {
									id: orderId
								},
								'删除中...'
							).then(res => {
								if (res.code === 1) {
									that.$u.toast(res.msg);
									that.orderList.splice(orderIndex, 1);
								}
							});
						}
					}
				});
			},

			// 取消订单
			onCancel(id, orderIndex) {
				let that = this;
				that.$http('order.cancel', {
						id: id
					},
					'取消中...'
				).then(res => {
					if (res.code === 1) {
						that.$u.toast(res.msg);
						this.orderList.splice(orderIndex, 1);
					}
				});
			},

			// 立即购买
			onPay(id) {
				uni.navigateTo({
					url: `/pages/order/payment/method?orderId=${id}&orderType=goods`
				});
			},

			// 查看物流
			onExpress(orderId) {
				let that = this;
				that.$http('order.expressList', {
					order_id: orderId
				}).then(res => {
					if (res.code === 1) {
						if (res.data.length == 1) {
							this.jump('/pages/order/express/express-detail', { orderId: orderId, expressId: res
									.data[0].id });
						} else if (res.data.length > 1) {
							this.jump('/pages/order/express/express-list', { orderId: orderId });
						} else {
							that.$u.toast('暂无包裹~');
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.order-nav {
		background: #fff;
		height: 80rpx;

		.nav-item {
			flex: 1;

			.item-title {
				font-size: 30rpx;

				font-weight: 400;
				color: rgba(51, 51, 51, 1);
				line-height: 76rpx;
			}

			.nav-line {
				width: 100rpx;
				height: 4rpx;
				background: #fff;
			}

			.line-active {
				background: rgba(230, 184, 115, 1);
			}
		}
	}

	.order-list {
		background: #fff;
		margin: 20rpx 0;

		.order-bottom {
			padding-bottom: 20rpx;

			.btn-box {
				justify-content: flex-end;
			}

			.all-msg {
				font-size: 24rpx;
				color: #999;
				justify-content: flex-end;
				margin-bottom: 10rpx;
				padding: 0 30rpx;

				.all-unit {
					font-size: 20rpx;
				}

				.all-money {
					font-size: 26rpx;
					color: #333;
					font-weight: 500;

					&::before {
						content: '￥';
						font-size: 20rpx;
					}
				}
			}

			.obtn1 {
				width: 160rpx;
				line-height: 60rpx;
				background: rgba(238, 238, 238, 1);
				border-radius: 30rpx;
				font-size: 26rpx;

				font-weight: 400;
				color: rgba(51, 51, 51, 1);
				margin-right: 20rpx;
				padding: 0;
			}

			.obtn2 {
				width: 160rpx;
				line-height: 60rpx;
				background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
				box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
				border-radius: 30rpx;
				margin-right: 20rpx;
				font-size: 26rpx;

				font-weight: 400;
				color: #fff;
				padding: 0;
			}

			.obtn3 {
				background: #ffeeee;
				color: #e50808;
				width: 160rpx;
				line-height: 60rpx;
				border-radius: 30rpx;
				margin-right: 20rpx;
				font-size: 26rpx;
				font-weight: 400;
				padding: 0;
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
			padding: 20rpx 20rpx 0;
			margin-bottom: 20rpx;

			.order-content {
				padding-bottom: 20rpx;

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
	}
</style>
