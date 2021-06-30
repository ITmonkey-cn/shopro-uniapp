<!-- 拼购列表 -->
<template>
	<view class="groupon-wrap">
		<view class="group-head u-flex u-row-between">
			<text class="group-head__title">爆款推荐</text>
			<text class="group-head__notice">省钱省心限时拼</text>
		</view>
		<view class="group-box">
			<view class="goods-item u-m-b-16" v-for="(item, index) in grouponList" :key="item.id" @tap="$Router.push({ path: '/pages/goods/detail', query: { id: item.id } })">
				<view class="big-goods u-p-20 u-flex u-col-top">
					<image v-if="index < 3" class="top-tag" :src="tagMap[index]" mode=""></image>
					<u-image ref="uImage" :width="220" :height="220" border-radius="10" :src="item.image" mode="aspectFill"></u-image>
					<view class=" card-right u-m-l-20 u-flex-col u-row-between">
						<view class="">
							<view class="goods-title u-ellipsis-1  u-m-t-10 u-m-b-10">
								<u-tag class="title-tag u-m-r-10" text="拼团" size="mini" bg-color="#FF6600" border-color="#FF6600" color="#fff" />
								{{ item.title }}
							</view>
							<view v-show="item.subtitle" class="subtitle-text u-m-b-10 u-ellipsis-1">{{ item.subtitle }}</view>
						</view>

						<view class="u-flex u-m-y-20">
							<view class="sell-box">
								<text class=" hot-icon iconfont iconicon-test"></text>
								<text class="sell-num">已拼{{ item.sales }}件</text>
							</view>
							<text class="group-num">{{ item.activity.rules.team_num || 0 }}人团</text>
						</view>

						<view class=" u-flex u-row-between u-col-center">
							<view class="u-flex u-col-bottom font-OPPOSANS">
								<view class="price u-m-r-10">{{ item.groupon_price }}</view>
								<view class="origin-price">{{ item.original_price }}</view>
							</view>
							<button class="u-reset-button buy-btn">马上拼</button>
						</view>
					</view>
				</view>
			</view>
			<!-- 空白 -->
			<shopro-empty
				style="padding-top: 200rpx;"
				marginTop="0"
				v-if="!grouponList.length && !isLoading"
				:image="$IMG_URL + '/imgs/empty/empty_goods.png'"
				@click="$Router.pushTab('/pages/index/index')"
				btnText="去首页逛逛"
				tipText="还没有拼团商品噢，去首页看看吧~"
			></shopro-empty>
			<!-- 加载更多 -->
		</view>

		<u-loadmore v-if="grouponList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		<!-- 登录提示 -->
		<shopro-auth-modal></shopro-auth-modal>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			tagMap: {
				0: this.$IMG_URL + '/imgs/group/groupon_top1.png',
				1: this.$IMG_URL + '/imgs/group/groupon_top2.png',
				2: this.$IMG_URL + '/imgs/group/groupon_top3.png'
			},
			isLoading: true,
			loadStatus: 'loadmore', //loadmore:加载前的状态，loading:加载中的状态，nomore:没有更多的状态
			lastPage: 1,
			currentPage: 1,
			grouponList: []
		};
	},
	onLoad() {
		this.getGrouponList();
	},
	onReachBottom() {
		this.loadMore();
	},
	onPullDownRefresh() {
		this.currentPage = 1;
		this.lastPage = 1;
		this.grouponList = [];
		this.getGrouponList();
	},
	computed: {},
	methods: {
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getGrouponList();
			}
		},
		// 拼团列表
		getGrouponList() {
			let that = this;
			that.isLoading = true;
			that.loadStatus = 'loading';
			that.$http('goods.grouponList', {
				page: that.currentPage
			}).then(res => {
				that.isLoading = false;
				uni.stopPullDownRefresh();
				if (res.code === 1) {
					that.grouponList = [...that.grouponList, ...res.data.data];
					that.lastPage = res.data.last_page;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
				}
			});
		}
	}
};
</script>

<style lang="scss">
// 背景
.groupon-wrap {
	background: url($IMG_URL+'/imgs/group/group_list_bg.png') no-repeat;
	background-size: 100% 374rpx;
}
.group-head {
	padding: 0 25rpx;
	height: 100rpx;
	.group-head__title {
		font-size: 32rpx;

		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
	.group-head__notice {
		font-size: 26rpx;

		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
}

.group-box {
	width: 710rpx;
	background: linear-gradient(#fff, #f5f5f5);
	border-radius: 20rpx;
	margin: 0 auto;
	min-height: 800rpx;
	.goods-item {
		border-radius: 20rpx;
		background-color: #fff;
		// 大商品卡片
		.big-goods {
			width: 710rpx;
			height: 260rpx;
			background: #ffffff;
			box-shadow: 0px 7rpx 8rpx 1rpx rgba(254, 76, 29, 0.05);
			border-radius: 20rpx;
			position: relative;
			.top-tag {
				position: absolute;
				z-index: 3;
				top: 20rpx;
				left: 20rpx;
				width: 84rpx;
				height: 36rpx;
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
				vertical-align: middle;
				.title-tag {
					transform: scale(0.9);
				}
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
				background: linear-gradient(90deg, #ff6600 0%, #fe832a 100%);
				border-radius: 25rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: #ffffff;
			}
			// 拼团
			.sell-box {
				background: rgba(#f9efd6, 0.3);
				border-radius: 16rpx;
				line-height: 32rpx;
				.sell-num {
					font-size: 20rpx;

					font-weight: 400;
					color: #ff6904;
				}

				.hot-icon {
					font-size: 26rpx;
					color: #ff6904;
					margin-right: 8rpx;
				}
			}
			.group-num {
				font-size: 20rpx;

				font-weight: 500;
				color: rgba(153, 153, 153, 1);
				margin-left: 20rpx;
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
	}
}
</style>
