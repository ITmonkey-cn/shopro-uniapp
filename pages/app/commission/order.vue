<!-- 分销订单 -->
<template>
	<view class="page_box commission-order-wrap">
		<view class="head_box">
			<!-- 标题栏 -->
			<shopro-navbar back-icon-color="#fff" :background="{}" :backTextStyle="{ color: '#fff', fontSize: '40rpx', fontWeight: '500' }" backText="分销订单"></shopro-navbar>

			<!-- 团队数据总览 -->
			<view class="team-data-box u-flex u-row-between">
				<view class="data-card">
					<view class="total-item">
						<view class="item-title">团队订单数量（单）</view>
						<view class="total-num">{{ agentInfo.child_order_count || 0 }}</view>
					</view>
					<view class="category-item u-flex">
						<view class="u-flex-1">
							<view class="item-title">一级订单</view>
							<view class="category-num">{{ agentInfo.child_order_count_1 || 0 }}</view>
						</view>
						<view class="u-flex-1">
							<view class="item-title">二级订单</view>
							<view class="category-num">{{ agentInfo.child_order_count_2 || 0 }}</view>
						</view>
					</view>
				</view>
				<view class="data-card">
					<view class="total-item">
						<view class="item-title">团队订单金额（元）</view>
						<view class="total-num">{{ agentInfo.child_order_money || '0.00' }}</view>
					</view>
					<view class="category-item u-flex">
						<view class="u-flex-1">
							<view class="item-title">一级订单</view>
							<view class="category-num">{{ agentInfo.child_order_money_1 || '0.00' }}</view>
						</view>
						<view class="u-flex-1">
							<view class="item-title">二级订单</view>
							<view class="category-num">{{ agentInfo.child_order_money_2 || '0.00' }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 直推 -->
			<view class="direct-box u-flex u-row-between">
				<view class="direct-item">
					<view class="item-title">直推分销订单数量（单）</view>
					<view class="item-value">{{ agentInfo.order_count }}</view>
				</view>
				<view class="direct-item">
					<view class="item-title">直推分销订单金额（元）</view>
					<view class="item-value">{{ agentInfo.order_money }}</view>
				</view>
			</view>

			<!-- 筛选 -->
			<view class="">
				<!-- 日期筛选 -->
				<view class="filter-box u-flex u-row-between">
					<button class="u-reset-button date-btn u-flex u-col-center" @tap="showCalendar = true">
						{{ selDateText }}
						<text class="u-iconfont uicon-arrow-down-fill u-m-l-20" style="color:#e5e5e5 ; font-size: 34rpx;"></text>
					</button>
					<view class="">
						<view class="total-box">{{ stateMap[stateCurrent] }}￥{{ amount || '0.00' }}</view>
					</view>
				</view>
				<!-- 状态分类 -->
				<view class="u-flex nav-box">
					<view class="state-item u-flex-1" v-for="(state, index) in statusList" :key="state.value" @tap="onTab(state.value)">
						<text class="state-title" :class="{ 'title-active': stateCurrent === state.value }">{{ state.name }}</text>
						<text class="underline" :class="{ 'underline-active': stateCurrent === state.value }"></text>
					</view>
				</view>
			</view>
		</view>

		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<!-- 订单列表 -->
				<view class="order-list" v-for="item in orderList" :key="item.id">
					<view class="order-head u-flex u-row-between">
						<text class="order-code">订单编号：{{ item.order.order_sn }}</text>
						<text class="order-state">{{ item.order.status_name }}</text>
					</view>
					<view class="order-from u-flex u-row-between">
						<view class="from-user u-flex">
							<text>下单人：</text>
							<image class="user-avatar" :src="item.buyer.avatar" mode=""></image>
							<text class="user-name">{{ item.buyer.nickname }}</text>
						</view>
						<view class="order-time">{{ $u.timeFormat(item.order.createtime, ' yyyy.mm.dd hh:MM ') }}</view>
					</view>
					<view class="goods-card u-flex" v-for="corder in item.commission_order" :key="corder.id">
						<view class="goods-img-box"><image class="goods-img" :src="corder.order_item.goods_image" mode=""></image></view>
						<view class="goods-info u-flex-col u-row-between">
							<view class="goods-title more-t">{{ corder.order_item.goods_title }}</view>
							<view class="goods-sku">数量: {{ corder.order_item.goods_num }}；{{ corder.order_item.goods_sku_text || '' }}</view>
							<view class="total-box u-flex u-flex-1 u-row-between">
								<view class="goods-price">
									{{ corder.amount }}
									<text class="goods-state">{{ corder.commission_order_status_text }}</text>
								</view>
								<view class="u-flex" v-if="corder.reward">
									<text class="name">佣金</text>
									<text class="commission-num">{{ corder.reward.commission }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 缺省页 -->
				<shopro-empty marginTop="100rpx" v-if="isEmpty" :image="$IMG_URL + '/imgs/empty/no_order.png'" tipText="暂无订单"></shopro-empty>
				<!-- 更多 -->
				<u-loadmore v-if="orderList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
		<!-- 日期选择 -->
		<u-calendar
			v-model="showCalendar"
			safeAreaInsetBottom
			ref="uCalendar"
			mode="range"
			start-text="开始"
			end-text="结束"
			active-bg-color="#7063d2"
			active-color="#fff"
			range-bg-color="#e5e2ff"
			range-color="#7063d2"
			:customStyle="{ background: 'linear-gradient(90deg, #A36FFF, #5336FF)', boxShadow: '0 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34)' }"
			@change="selDate"
		></u-calendar>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {},
	data() {
		return {
			backTextStyle: {
				color: '#fff',
				fontSize: '40rpx',
				fontWeight: '500'
			},
			stateCurrent: 'all', //默认
			stateMap: {
				all: '全部',
				// no: '不计入',
				yes: '已计入',
				back: '已退回',
				cancel: '已取消'
			},
			statusList: [
				{
					name: '全部',
					value: 'all'
				},
				// {
				// 	name: '不计入',
				// 	value: 'no'
				// },
				{
					name: '已计入',
					value: 'yes'
				},
				{
					name: '已退回',
					value: 'back'
				},
				{
					name: '已取消',
					value: 'cancel'
				}
			],
			orderList: [], //分销订单
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1,
			isEmpty: false,
			//日期选择
			showCalendar: false,
			selDateText: '',
			propsDate: '', //日期参数
			amount: '' //收入
		};
	},
	computed: {
		...mapGetters(['userInfo', 'agentInfo'])
	},
	onLoad() {
		this.getToday();
		this.getOrderList();
	},
	onPullDownRefresh() {
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
		//  今日
		getToday() {
			let now = new Date();
			this.selDateText = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
			let dateText = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
			this.propsDate = `${dateText}-${dateText}`;
		},
		// 选择日期
		selDate(e) {
			this.orderList = [];
			this.currentPage = 1;
			this.lastPage = 1;
			this.selDateText = `${e.startYear}.${e.startMonth}.${e.startDay}-${e.endYear}.${e.endMonth}.${e.endDay}`;
			let dateText = `${e.startYear}/${e.startMonth}/${e.startDay}-${e.endYear}/${e.endMonth}/${e.endDay}`;
			this.propsDate = dateText;
			this.getOrderList();
			this.$refs.uCalendar.init();
		},
		// 切换分类
		onTab(state) {
			if (this.stateCurrent !== state) {
				this.orderList = [];
				this.currentPage = 1;
				this.lastPage = 1;
				this.stateCurrent = state;
				this.getOrderList();
			}
		},

		// 分销订单
		getOrderList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http('commission.orderLog', {
				date: that.propsDate,
				type: that.stateCurrent,
				page: that.currentPage
			}).then(res => {
				uni.stopPullDownRefresh();
				if (res.code === 1) {
					that.orderList = [...that.orderList, ...res.data.orders.data];
					that.amount = res.data.amount;
					that.lastPage = res.data.orders.last_page;
					that.isEmpty = !that.orderList.length;
					that.loadStatus = that.currentPage < res.data.orders.last_page ? 'loadmore' : 'nomore';
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
// 直推
.direct-box {
	margin: 20rpx;
	.direct-item {
		width: 341rpx;
		height: 117rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 20rpx;
		.item-title {
			font-size: 22rpx;
			font-weight: 500;
			color: #999999;
			margin-bottom: 6rpx;
		}
		.item-value {
			font-size: 38rpx;
			font-weight: 600;
			color: #333333;
		}
	}
}
// 团队信息总览
.team-data-box {
	margin: 20rpx;
	.data-card {
		width: 340rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 20rpx;

		.item-title {
			font-size: 22rpx;
			font-weight: 500;
			color: #999999;
			line-height: 30rpx;
			margin-bottom: 10rpx;
		}

		.total-item {
			margin-bottom: 20rpx;
		}

		.total-num {
			font-size: 38rpx;
			font-weight: 600;
			color: #333333;
		}

		.category-num {
			font-size: 26rpx;
			font-weight: 600;
			color: #333333;
		}
	}
}

// 状态分类
.head_box {
	width: 750rpx;
	background: url($IMG_URL+'/imgs/commission/card_bg.png') no-repeat;
}
// 表头
.filter-box {
	height: 120rpx;
	padding: 0 30rpx;
	background-color: #f6f6f6;
	.date-btn {
		background-color: #fff;
		line-height: 54rpx;
		border-radius: 27rpx;
		padding: 0 20rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #666666;
	}
	.total-box {
		font-size: 24rpx;
		font-weight: 500;
		color: #666666;
	}
}
.nav-box {
	background-color: #fff;
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
		// border-bottom: 1rpx solid #dfdfdf;
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
	}
}
</style>
