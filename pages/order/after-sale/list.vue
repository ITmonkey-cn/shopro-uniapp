<template>
	<view class="page_box">
		<view class="head_box">
			<view class="order-nav x-f">
				<view class="nav-item y-f" v-for="nav in orderState" :key="nav.id" @tap="onNav(nav.type)">
					<view class="item-title">{{ nav.title }}</view>
					<text class="nav-line" :class="{ 'line-active': orderType === nav.type }"></text>
				</view>
			</view>
		</view>
		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<view
					class="order-list"
					v-for="order in orderList"
					:key="order.id"
					@tap="jump('/pages/order/after-sale/detail', {aftersaleId: order.id })"
				>
					<view class="order-head x-bc">
						<text class="no">服务单号：{{ order.aftersale_sn }}</text>
						<view class="order-status x-f">
							<text class="iconfont" :class="itemStatus[order.type].icon"></text>
							<text class="status-text">{{ itemStatus[order.type].text }}</text>
						</view>
					</view>

					<view class="order-content"><shopro-mini-card :type="'order'" :detail="order"></shopro-mini-card></view>

					<view class="order-bottom">
						<view class="serve-status x-bc">
							<view class="x-f">
								<view class="serve-title">{{ order.aftersale_status_text }}</view>
								<view class="serve-content">{{ order.aftersale_status_desc }}</view>
							</view>

							<text class="cuIcon-right"></text>
						</view>
						<view class="btn-box x-f" v-for="orderBtn in order.btns" :key="orderBtn">
							<button v-if="orderBtn === 'cancel'" @tap.stop="onCancel(order.id)" class="cu-btn obtn">取消订单</button>
							<button v-if="orderBtn === 'pay'" @tap.stop="onPay(order.id)" class="cu-btn obtn">立即支付</button>
							<button v-if="orderBtn === 'groupon'" @tap.stop="jump('/pages/activity/groupon/detail', { id: order.ext_arr.groupon_id })" class="cu-btn obtn">
								拼团详情
							</button>
						</view>
					</view>
				</view>
				<!-- 缺省页 -->
				<shopro-empty v-if="!orderList.length" :emptyData="emptyData"></shopro-empty>
				<!-- 更多 -->
				<view v-if="orderList.length" class="cu-load text-gray" :class="loadStatus"></view>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
import shoproMiniCard from '@/components/shopro-mini-card/shopro-mini-card.vue';
export default {
	components: {},
	data() {
		return {
			orderType: 'all', //分类id
			orderList: [], //售后列表
			loadStatus: '', //loading,over分页
			currentPage: 1,
			lastPage: 0,
			emptyData: {
				img: '/static/imgs/empty/empty_groupon.png',
				tip: '暂无相关记录~'
			},
			itemStatus: {
				//售后状态。
				refund: {
					text: '退款',
					icon: 'icon-tuikuan'
				},
				return: {
					text: '退货',
					icon: 'icon-tuihuo'
				},
				other: {
					text: '其他'
				}
			},
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
	onLoad() {
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
			this.orderType = type;
			this.orderList = [];
			this.getAftersaleList();
		},
		// 售后列表
		getAftersaleList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$api('order.aftersaleList', {
				type: that.orderType,
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.orderList = [...that.orderList, ...res.data.data];
					that.lastPage = res.data.last_page;
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
			font-family: PingFang SC;
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
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				margin-right: 30rpx;
			}
			.serve-content {
				font-size: 20rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(102, 102, 102, 1);
			}
			.cuIcon-right {
				color: #999999;
				font-size: 20rpx;
			}
		}
		.btn-box {
			justify-content: flex-end;
		}
		.obtn {
			width: 160rpx;
			height: 60rpx;
			background: rgba(238, 238, 238, 1);
			border-radius: 30rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
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
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
				margin-left: 10rpx;
			}
		}
	}
	.order-content {
		padding: 20rpx;
		/deep/.status-btn {
			display: none;
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
