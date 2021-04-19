<<<<<<< HEAD
<!-- 分销订单 -->
<template>
	<view class="page_box commission-order-wrap">
		<view class="head_box">
			<!-- 标题 -->
			<cu-custom isBack>
				<block slot="backText"><text class="head-title">分销订单</text></block>
			</cu-custom>

			<!-- 团队数据总览 -->
			<view class="team-data-box x-bc">
				<view class="data-card">
					<view class="total-item">
						<view class="item-title">团队订单数量（单）</view>
						<view class="total-num">{{ agentInfo.child_order_count || 0 }}</view>
					</view>
					<view class="category-item x-f">
						<view class="y-start flex-sub">
							<view class="item-title">一级订单</view>
							<view class="category-num">{{ agentInfo.child_order_count_1 || 0 }}</view>
						</view>
						<view class="y-start flex-sub">
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
					<view class="category-item x-f">
						<view class="y-start flex-sub">
							<view class="item-title">一级订单</view>
							<view class="category-num">{{ agentInfo.child_order_money_1 || '0.00' }}</view>
						</view>
						<view class="y-start ">
							<view class="item-title">二级订单</view>
							<view class="category-num">{{ agentInfo.child_order_money_2 || '0.00' }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 直推 -->
			<view class="direct-box x-bc">
				<view class="direct-item ">
					<view class="item-title">直推分销订单数量（单）</view>
					<view class="item-value">{{ agentInfo.order_count }}</view>
				</view>
				<view class="direct-item">
					<view class="item-title">直推分销订单金额（元）</view>
					<view class="item-value">{{ agentInfo.order_money }}</view>
				</view>
			</view>

			<!-- 状态分类 -->
			<view class="x-f nav-box">
				<view class="state-item flex-sub " v-for="(state, index) in statusList" :key="state.value" @tap="onTab(state.value)">
					<text class="state-title" :class="{ 'title-active': stateCurrent === state.value }">{{ state.name }}</text>
					<text class="underline" :class="{ 'underline-active': stateCurrent === state.value }"></text>
				</view>
			</view>
		</view>
		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
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
							<view class="goods-sku">数量: {{ goods.goods_num }}；{{ goods.goods_sku_text || '' }}</view>
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
				</view>
				<!-- 缺省页 -->
				<shopro-empty style="margin-top: 100rpx;" v-if="emptyData.show" :isFixed="false" :emptyData="emptyData"></shopro-empty>
				<!-- 更多 -->
				<u-loadmore v-if="orderList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			stateCurrent: 'all', //默认
			agentInfo: uni.getStorageSync('agentInfo'),
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
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1,
			emptyData: {
				show: false,
				img: this.$IMG_URL + '/imgs/empty/no_order.png',
				tip: '暂无订单',
				path: '',
				pathText: ''
			}
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},
	onLoad() {
		this.getOrderList();
	},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 切换分类
		onTab(state) {
			this.orderList = [];
			this.currentPage = 1;
			this.lastPage = 1;
			this.stateCurrent = state;
			this.$u.debounce(this.getOrderList);
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
						that.loadStatus = 'loadmore';
					} else {
						that.loadStatus = 'nomore';
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
	/deep/ .cu-back {
		color: #fff;
		font-size: 40rpx;
	}

	.head-title {
		font-size: 38rpx;
		color: #fff;
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
=======
<!-- 分销订单 -->
<template>
	<view class="page_box commission-order-wrap">
		<view class="head_box">
			<!-- 标题 -->
			<cu-custom isBack>
				<block slot="backText"><text class="head-title">分销订单</text></block>
			</cu-custom>

			<!-- 团队数据总览 -->
			<view class="team-data-box x-bc">
				<view class="data-card">
					<view class="total-item">
						<view class="item-title">团队订单数量（单）</view>
						<view class="total-num">{{ agentInfo.child_order_count || 0 }}</view>
					</view>
					<view class="category-item x-f">
						<view class="y-start flex-sub">
							<view class="item-title">一级订单</view>
							<view class="category-num">{{ agentInfo.child_order_count_1 || 0 }}</view>
						</view>
						<view class="y-start flex-sub">
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
					<view class="category-item x-f">
						<view class="y-start flex-sub">
							<view class="item-title">一级订单</view>
							<view class="category-num">{{ agentInfo.child_order_money_1 || '0.00' }}</view>
						</view>
						<view class="y-start ">
							<view class="item-title">二级订单</view>
							<view class="category-num">{{ agentInfo.child_order_money_2 || '0.00' }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 直推 -->
			<view class="direct-box x-bc">
				<view class="direct-item ">
					<view class="item-title">直推分销订单数量（单）</view>
					<view class="item-value">{{ agentInfo.order_count }}</view>
				</view>
				<view class="direct-item">
					<view class="item-title">直推分销订单金额（元）</view>
					<view class="item-value">{{ agentInfo.order_money }}</view>
				</view>
			</view>

			<!-- 状态分类 -->
			<view class="x-f nav-box">
				<view class="state-item flex-sub " v-for="(state, index) in statusList" :key="state.value" @tap="onTab(state.value)">
					<text class="state-title" :class="{ 'title-active': stateCurrent === state.value }">{{ state.name }}</text>
					<text class="underline" :class="{ 'underline-active': stateCurrent === state.value }"></text>
				</view>
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
						<view class="goods-sku">数量: {{ goods.goods_num }}；{{ goods.goods_sku_text || '' }}</view>
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
				<!-- <view class="total-box x-bc px20">
					<view class="num-price">共{{ item.item_slim.length }}件商品， 实付款:￥{{ item.pay_fee }}</view>
					<view class="x-f"></view>
				</view> -->
			</view>
			<!-- 缺省页 -->
			<shopro-empty style="margin-top: 100rpx;" v-if="emptyData.show" :isFixed="false" :emptyData="emptyData"></shopro-empty>
			<!-- 更多 -->
			<u-loadmore v-if="orderList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			stateCurrent: 'all', //默认
			agentInfo: uni.getStorageSync('agentInfo'),
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
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1,
			emptyData: {
				show: false,
				img: this.$IMG_URL + '/imgs/empty/no_order.png',
				tip: '暂无订单',
				path: '',
				pathText: ''
			}
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},
	onLoad() {
		this.getOrderList();
	},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 切换分类
		onTab(state) {
			this.orderList = [];
			this.currentPage = 1;
			this.lastPage = 1;
			this.stateCurrent = state;
			this.$u.debounce(this.getOrderList);
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
						that.loadStatus = 'loadmore';
					} else {
						that.loadStatus = 'nomore';
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
	/deep/ .cu-back {
		color: #fff;
		font-size: 40rpx;
	}

	.head-title {
		font-size: 38rpx;
		color: #fff;
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
>>>>>>> 249bc3588ce88ed9a3079aee7eeff9b82ac50fe7
</style>
