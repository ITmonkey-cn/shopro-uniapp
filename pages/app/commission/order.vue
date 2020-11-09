<!-- 分销订单 -->
<template>
	<view class="page_box commission-order-wrap">
		<!-- 状态分类 -->
		<view class="head_box x-f">
			<view class="state-item flex-sub " v-for="(state, index) in statusList" :key="state.value" @tap="onTab(state.value)">
				<text class="state-title" :class="{ 'title-active': stateCurrent === state.value }">{{ state.name }}</text>
				<text class="underline" :class="{ 'underline-active': stateCurrent === state.value }"></text>
			</view>
		</view>
		<view class="content_box">
			<!-- 订单列表 -->
			<view class="order-list" v-for="item in orderList" :key="item.id">
				<view class="order-head x-bc">
					<text class="order-code">订单编号：{{ item.order_sn }}</text>
					<text class="order-state">{{ item.status_name }}</text>
				</view>
				<view class="order-from x-bc">
					<view class="from-user x-f">
						<text>下单人：</text>
						<image class="user-avatar" :src="item.buyer.avatar" mode=""></image>
						<text class="user-name">{{ item.buyer.nickname }}</text>
					</view>
					<view class="order-time">{{ $u.timeFormat(item.createtime, ' yyyy.mm.dd hh:MM ') }}</view>
				</view>
				<view class="goods-card x-f" v-for="goods in item.item_slim" :key="goods.id">
					<view class="goods-img-box"><image class="goods-img" :src="goods.goods_image" mode=""></image></view>
					<view class="goods-info y-bc">
						<view class="goods-title more-t">{{ goods.goods_title }}</view>
						<view class="goods-sku">数量: {{ goods.goods_num }}；{{ goods.goods_sku_text }}</view>
						<view class="total-box x-bc">
							<view class="goods-price">
								{{ goods.goods_price }}
								<text class="goods-state">{{ goods.agent_reward.status_name }}</text>
							</view>
							<view class="x-f">
								<text class="name">佣金</text>
								<text class="commission-num">{{ goods.agent_reward.commission }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="total-box x-bc px20">
					<view class="num-price">共{{ item.item_slim.length }}件商品， 实付款:￥{{ item.pay_fee }}</view>
					<view class="x-f"></view>
				</view>
			</view>
			<!-- 缺省页 -->
			<shopro-empty v-if="emptyData.show" :emptyData="emptyData"></shopro-empty>
			<!-- 更多 -->
			<view v-if="orderList.length" class="cu-load text-gray" :class="loadStatus"></view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			stateCurrent: 'all', //默认
			statusList: [
				{
					name: '全部',
					value: 'all'
				},
				{
					name: '待入账',
					value: 'waiting'
				},
				{
					name: '已入账',
					value: 'entry'
				},
				{
					name: '已退款',
					value: 'back'
				}
			],
			orderList: [], //分销订单
			loadStatus: '', //loading,over
			currentPage: 1,
			lastPage: 1,
			emptyData: {
				show: false,
				img: 'http://shopro.7wpp.com/imgs/empty/no_order.png',
				tip: '暂无订单',
				path: '',
				pathText: ''
			}
		};
	},
	computed: {},
	onLoad() {
		this.getOrderList();
	},
	methods: {
		// 切换分类
		onTab(state) {
			this.orderList = [];
			this.currentPage = 1;
			this.lastPage = 1;
			this.stateCurrent = state;
			this.getOrderList();
		},

		// 分销订单
		getOrderList() {
			let that = this;
			that.loadStatus = 'loading';
			that.emptyData.show = false;
			that.$api('commission.order', {
				type: that.stateCurrent
			}).then(res => {
				if (res.code === 1) {
					that.orderList = [...that.orderList, ...res.data.data];
					that.lastPage = res.data.last_page;
					if (!that.orderList.length) {
						that.emptyData.show = true;
					}
					if (that.currentPage < res.data.last_page) {
						that.loadStatus = '';
					} else {
						that.loadStatus = 'over';
					}
				}
			});
		},

		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getOrderList();
			}
		}
	}
};
</script>

<style lang="scss">
// 状态分类
.head_box {
	width: 750rpx;
	height: 95rpx;
	background: #ffffff;
}
.state-item {
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.state-title {
		color: #666;
		font-weight: 500;
		font-size: 28rpx;
		line-height: 90rpx;
	}
	.title-active {
		color: #333;
	}
	.underline {
		display: block;
		width: 68rpx;
		height: 4rpx;
		background: #fff;
		border-radius: 2rpx;
	}
	.underline-active {
		background: #5e49c3;
		display: block;
		width: 68rpx;
		height: 4rpx;
		border-radius: 2rpx;
	}
}
// 订单列表
.order-list {
	background-color: #fff;
	margin-top: 20rpx;
	.order-head {
		padding: 20rpx;
		.order-code {
			font-size: 26rpx;
			font-weight: 400;
			color: #999999;
		}
		.order-state {
			font-size: 26rpx;
			font-weight: 500;
			color: #05c3a1;
		}
	}
	.order-from {
		background-color: #f9f9f9;
		padding: 20rpx;
		.from-user {
			font-size: 24rpx;
			font-weight: 400;
			color: #666666;
			.user-avatar {
				width: 26rpx;
				height: 26rpx;
				border-radius: 50%;
				margin-right: 8rpx;
			}
			.user-name {
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
			}
		}
		.order-time {
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
		}
	}
	.goods-card {
		padding: 30rpx 20rpx;
		border-bottom: 1rpx solid #dfdfdf;
		.goods-img-box {
			margin-right: 30rpx;
			.goods-img {
				width: 160rpx;
				height: 160rpx;
				background-color: #ccc;
			}
		}
		.goods-info {
			height: 160rpx;
			width: 600rpx;
			align-items: flex-start;
			.goods-title {
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
			}
			.goods-sku {
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
			}
			.goods-price {
				font-size: 30rpx;
				font-weight: 500;
				color: #333333;
				.goods-state {
					line-height: 30rpx;
					padding: 0 10rpx;
					background: #f1eeff;
					border: 1rpx solid #603fff;
					border-radius: 30rpx;
					margin-left: 20rpx;
					font-size: 20rpx;
					color: #5e49c3;
				}
				&::before {
					content: '￥';
					font-size: 20rpx;
				}
			}
		}
	}
	.total-box {
		height: 80rpx;
		width: 100%;
		.num-price {
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
		}
		.name {
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
		}
		.commission-num {
			font-size: 30rpx;
			font-weight: 400;
			color: #eb2b3d;
			&::before {
				content: '￥';
				font-size: 22rpx;
			}
		}
	}
}
</style>
