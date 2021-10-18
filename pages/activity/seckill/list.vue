<!-- 秒杀列表 -->
<template>
	<view class="page_box seckill-list-wrap">
		<!-- tab栏 -->
		<view class="tab-box u-flex">
			<view class="tab-item u-flex-col u-row-center u-col-center" @tap="onTab(tab.id)" v-for="tab in tabList" :key="tab.id">
				<text class="tab-title u-m-b-20" :class="{ 'tab-active': tabCurrent === tab.id }">{{ tab.title }}</text>
				<text v-show="tabCurrent === tab.id" class="tab-line"></text>
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="content_box">
			<scroll-view scroll-y="true" enable-back-to-top @scrolltolower="loadMore" class="scroll-box">
				<view class="goods-item u-m-b-16" v-for="item in goodsList" :key="item.id" @tap="toSeckillDetail(item.id)">
					<view class="big-goods  u-flex u-p-20 u-col-top ">
						<image class="goods-img"  lazy-load fade-show :src="item.image" mode="aspectFill"></image>
						<view class=" card-right u-m-l-20 u-flex-col u-row-between">
							<view class="">
								<view class="goods-title u-ellipsis-1 u-m-t-10 u-m-b-10">
									<view class="title-tag cu-tag bg-red sm radius u-m-r-10">秒杀</view>
									{{ item.title }}
								</view>
								<view v-show="item.subtitle" class="subtitle-text u-m-b-10 u-ellipsis-1">{{ item.subtitle }}</view>
							</view>

							<view class="u-flex u-m-y-20">
								<view class="cu-progress round sm" style="width:210rpx;"><view :style="[{ width: item.percent + '%',backgroundColor:'#ffbbbb' }]"></view></view>
								<view class="progress-text">已售出{{ item.sales }}件</view>
							</view>

							<view class=" u-flex u-row-between u-col-center">
								<view class="u-flex u-col-bottom font-OPPOSANS">
									<view class="price u-m-r-10">{{ item.price }}</view>
									<view class="origin-price">{{ item.original_price }}</view>
								</view>
								<button class="u-reset-button buy-btn">去抢购</button>
							</view>
						</view>
					</view>
				</view>
				<!-- 空白 -->
				<shopro-empty v-if="isEmpty" tipText="暂无秒杀商品，敬请期待~" :image="$IMG_URL + '/imgs/empty/empty_goods.png'"></shopro-empty>
				<!-- 加载更多 -->
				<u-loadmore v-if="!isEmpty" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			isEmpty: false, //无数据
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			lastPage: 1,
			currentPage: 1,
			tabCurrent: 'ing',
			goodsList: [],
			tabList: [
				{
					id: 'ing',
					title: '抢购进行中'
				},
				{
					id: 'nostart',
					title: '即将开始'
				}
			]
		};
	},
	computed: {},
	onLoad() {
		this.getGoodsList();
	},
	onPullDownRefresh() {
		this.lastPage = 1;
		this.currentPage = 1;
		this.goodsList = [];
		this.getGoodsList();
	},
	methods: {
		onTab(id) {
			if (this.tabCurrent !== id) {
				this.tabCurrent = id;
				this.goodsList = [];
				this.currentPage = 1;
				this.lastPage = 1;
				this.getGoodsList();
			}
		},
		toSeckillDetail(id) {
			this.$Router.push({ path: '/pages/goods/detail', query: { id: id } });
		},
		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getGoodsList();
			}
		},
		// 秒杀列表
		getGoodsList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http(
				'goods.seckillList',
				{
					type: that.tabCurrent,
					page: that.currentPage
				},
				'加载中...'
			).then(res => {
				uni.stopPullDownRefresh();
				if (res.code === 1) {
					that.goodsList = [...that.goodsList, ...res.data.data];
					that.goodsList.map(item => {
						item.percent = item.stock + item.sales > 0 ? ((item.sales / (item.sales + item.stock)) * 100).toFixed(2) : 0;
					});
					that.isEmpty = !that.goodsList.length;
					that.lastPage = res.data.last_page;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
				}
			});
		}
	}
};
</script>

<style lang="scss">
.seckill-list-wrap {
	background: url($IMG_URL+'/imgs/seckill/sekill_list_head_bg.png') no-repeat;
	background-size: 100% auto;
}
// tab
.tab-box {
	.tab-item {
		flex: 1;
		height: 140rpx;
		color: rgba(#fff, 0.4);
		font-size: 32rpx;
		font-weight: 600;
		.tab-line {
			width: 50rpx;
			height: 8rpx;
			background: #fff;
			border-radius: 4rpx;
		}
	}

	.tab-active {
		color: rgba(#fff, 1);
	}
}

.scroll-box {
	background: linear-gradient(#fff, #f5f5f5);
	width: 710rpx;
	border-radius: 20rpx;
	margin: 0 auto;
}
// 列表
.goods-item {
	// 大商品卡片
	.big-goods {
		width: 710rpx;
		height: 260rpx;
		background: #ffffff;
		box-shadow: 0px 7rpx 8rpx 1rpx rgba(254, 76, 29, 0.05);
		border-radius: 20rpx;
		.goods-img {
			width: 220rpx;
			height: 220rpx;
			border-radius: 6rpx;
		}
		.card-right {
			width: 430rpx;
			height: 220rpx;
		}
		.goods-title {
			font-size: 26rpx;
			font-weight: 600;
			width: 400rpx;
			color: #000000;
		}
		.subtitle-text {
			font-size: 22rpx;
			width: 400rpx;
			font-weight: 500;
			color: #666666;
		}
		.buy-btn {
			width: 120rpx;
			line-height: 50rpx;
			background: linear-gradient(90deg, #d01325, #ed3c30);
			border-radius: 25rpx;
			font-size: 24rpx;
			font-weight: 500;
			color: #ffffff;
		}
		.progress-text {
			color: #c4c4c4;
			font-size: 20rpx;
			margin-left: 25rpx;
		}
		// 价格
		.price {
			color: #ff0000;
			font-weight: 600;
			&::before {
				content: '￥';
				font-size: 20rpx;
			}
		}
		.origin-price {
			color: #c4c4c4;
			font-size: 24rpx;
			text-decoration: line-through;
			&::before {
				content: '￥';
				font-size: 20rpx;
			}
		}
	}

	.buy-btn {
		width: 120rpx;
		line-height: 50rpx;
		background: linear-gradient(90deg, #d01325, #ed3c30);
		border-radius: 25rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #ffffff;
	}
	.btn-end,
	.btn-nostart {
		background: rgba(238, 238, 238, 1);
		color: #999999;
	}
	.btn-ing {
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		color: rgba(255, 255, 255, 1);
	}
}
</style>
