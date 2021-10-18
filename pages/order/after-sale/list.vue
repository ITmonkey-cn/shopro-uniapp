<!-- 售后列表 -->
<template>
	<view class="page_box">
		<!-- tab -->
		<view class="head_box">
			<view class="order-nav u-flex">
				<view class="nav-item u-flex-col u-flex-1 u-col-center" v-for="nav in orderState" :key="nav.id" @tap="onNav(nav.type)">
					<view class="item-title">{{ nav.title }}</view>
					<text class="nav-line" :class="{ 'line-active': orderType === nav.type }"></text>
				</view>
			</view>
		</view>

		<view class="content_box">
			<scroll-view scroll-y="true" enable-back-to-top @scrolltolower="loadMore" class="scroll-box">
				<view class="order-list" v-for="(order, orderIndex) in orderList" :key="order.id" @tap="jump('/pages/order/after-sale/detail', { aftersaleId: order.id })">
					<view class="order-head u-flex u-row-between">
						<text class="no">服务单号：{{ order.aftersale_sn }}</text>
						<view class="order-status u-flex">
							<text class="status-text">{{ order.aftersale_status_text }}</text>
						</view>
					</view>
					<view class="order-content">
						<shopro-mini-card :title="order.goods_title" :image="order.goods_image">
							<template #describe>
								<view class="order-sku u-ellipsis-1">
									<text class="order-num">数量:{{ order.goods_num || 0 }};</text>
									{{ order.goods_sku_text ? order.goods_sku_text : '' }}
								</view>
							</template>
							<template #cardBottom>
								<view class="card-price-box u-flex">
									<text class="order-price font-OPPOSANS">￥{{ order.goods_price || 0 }}</text>
									<button class="u-reset-button status-btn">{{ order.type_text }}</button>
								</view>
							</template>
						</shopro-mini-card>
					</view>
					<view class="order-bottom">
						<view class="serve-status u-flex u-row-between" @tap.stop="jump('/pages/order/after-sale/log', { aftersaleId: order.id })">
							<view class="u-flex">
								<view class="serve-title">{{ order.aftersale_status_text }}</view>
								<view class="serve-content">{{ order.aftersale_status_desc }}</view>
							</view>
							<text class="u-iconfont uicon-arrow-right" style="color: #666"></text>
						</view>
						<view class="btn-box u-flex" v-for="orderBtn in order.btns" :key="orderBtn">
							<button v-if="orderBtn === 'cancel'" @tap.stop="onCancel(order.id, orderIndex)" class="u-reset-button obtn">取消</button>
							<button v-if="orderBtn === 'delete'" style="background:#FFEEEE;color:#E50808" @tap.stop="onDelete(order.id, orderIndex)" class="u-reset-button obtn">
								删除
							</button>
						</view>
					</view>
				</view>
				<!-- 缺省页 -->
				<shopro-empty v-if="isEmpty" :image="$IMG_URL + '/imgs/empty/empty_groupon.png'" tipText="暂无相关记录~"></shopro-empty>
				<!-- 更多 -->
				<u-loadmore v-if="orderList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			orderType: 'all', //分类id
			isEmpty: false,
			orderList: [], //售后列表
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1,
			orderState: [
				{
					id: 0,
					title: '全部',
					type: 'all'
				},
				{
					id: 1,
					title: '处理中',
					type: 'ing'
				},
				{
					id: 2,
					title: '已完成',
					type: 'finish'
				}
			]
		};
	},
	computed: {},
	onLoad() {},
	onShow() {
		this.orderList = [];
		this.currentPage = 1;
		this.lastPage = 1;
		this.getAftersaleList();
	},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 切换导航
		onNav(type) {
			if (this.orderType !== type) {
				this.orderType = type;
				this.currentPage = 1;
				this.lastPage = 1;
				this.orderList = [];
				this.getAftersaleList();
			}
		},
		// 售后列表
		getAftersaleList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http('order.aftersaleList', {
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

		//取消
		onCancel(aftersaleId, orderIndex) {
			let that = this;
			that.$http(
				'order.cancelAftersaleOrder',
				{
					id: aftersaleId
				},
				'取消中...'
			).then(res => {
				if (res.code === 1) {
					this.$u.toast(res.msg);
					this.orderList.splice(orderIndex, 1);
				}
			});
		},

		// 删除
		onDelete(aftersaleId, orderIndex) {
			let that = this;
			uni.showModal({
				title: '删除订单',
				content: '确定要删除这个订单么？',
				cancelText: '取消',
				confirmText: '删除',
				success: res => {
					if (res.confirm) {
						that.$http(
							'order.deleteAftersaleOrder',
							{
								id: aftersaleId
							},
							'删除中...'
						).then(res => {
							if (res.code === 1) {
								this.$u.toast(res.msg);
								this.orderList.splice(orderIndex, 1);
							}
						});
					}
				}
			});
		},

		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getAftersaleList();
			}
		}
	}
};
</script>

<style lang="scss">
// 导航切换
.order-nav {
	background: #fff;
	height: 80rpx;
	border-top: 1rpx solid #f5f5f5;
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

// 售后列表卡片
.order-list {
	background: #fff;
	margin: 20rpx 0;
	.order-bottom {
		padding-bottom: 20rpx;
		.serve-status {
			height: 94rpx;
			background: rgba(246, 246, 246, 1);
			border-radius: 4rpx;
			margin: 0 20rpx 20rpx;
			padding: 0 20rpx;
			.serve-title {
				font-size: 26rpx;

				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				margin-right: 30rpx;
			}
			.serve-content {
				font-size: 20rpx;

				font-weight: 400;
				color: rgba(102, 102, 102, 1);
			}
		}
		.btn-box {
			justify-content: flex-end;
		}
		.obtn {
			width: 160rpx;
			line-height: 60rpx;
			background: rgba(238, 238, 238, 1);
			border-radius: 30rpx;
			font-size: 26rpx;

			font-weight: 400;
			color: rgba(102, 102, 102, 1);
			margin-right: 20rpx;
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

		.order-status {
			.iconfont {
				color: #f83942;
				font-size: 30rpx;
				font-weight: 600;
			}
			.status-text {
				font-size: 26rpx;

				font-weight: 400;
				color: #f83942;
				margin-left: 10rpx;
			}
		}
	}
	.order-content {
		padding: 20rpx;
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
		.card-price-box {
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
	.goods-order {
		border-bottom: 1px solid rgba(223, 223, 223, 0.5);
		padding: 20rpx 20rpx 0;
		margin-bottom: 20rpx;
	}

	.goods-bottom {
		background: #fff;
		padding-bottom: 30rpx;
	}
}
</style>
