<template>
	<view class="page_box">
		<view class="content_box">
			<scroll-view class="scroll-box" scroll-y enable-back-to-top scroll-with-animation @scrolltolower="loadMore">
				<view class="group-wrap">
					<view class="group-head x-bc">
						<text class="group-head__title">爆款推荐</text>
						<text class="group-head__notice">省钱省心限时拼</text>
					</view>
					<view class="group-box">
						<view class="goods-item" v-for="(groupon, index) in grouponList" :key="groupon.id">
							<sh-activity-card
								:cardId="groupon.id"
								:title="groupon.title"
								:subtitle="groupon.subtitle"
								:img="groupon.image"
								:price="groupon.groupon_price"
								:originalPrice="groupon.original_price"
							>
								<block slot="tag">
									<view class="tag" v-if="index < 3">TOP{{ index + 1 }}</view>
								</block>
								<block slot="sell">
									<view class="x-f">
										<view class="sell-box">
											<text class="cuIcon-hotfill"></text>
											<text class="sell-num">已拼{{ groupon.sales }}件</text>
										</view>
										<text class="group-num">{{ groupon.activity.rules.team_num || 0 }}人团</text>
									</view>
								</block>
								<block slot="btn"><button class="cu-btn buy-btn" @tap.stop="jump('/pages/goods/detail/index', { id: groupon.id })">马上拼</button></block>
							</sh-activity-card>
						</view>
					</view>
				</view>
				<!-- 空白 -->
				<shopro-empty v-if="!grouponList.length && !isLoading" :emptyData="emptyData"></shopro-empty>
				<!-- 加载更多 -->
				<view v-if="grouponList.length" class="cu-load text-gray" :class="loadStatus"></view>
				<!-- loading -->
				<shopro-load v-model="isLoading"></shopro-load>
			</scroll-view>
		</view>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import shActivityCard from '../children/sh-activity-card.vue';
export default {
	components: {
		shActivityCard
	},
	data() {
		return {
			emptyData: {
				img: '/static/imgs/empty/empty_goods.png',
				tip: '还没有拼团商品噢，去首页看看吧~',
				path: '/pages/index/index',
				pathText: '去首页逛逛'
			},
			isLoading: true,
			loadStatus: '', //loading,over
			lastPage: 1,
			currentPage: 1,
			grouponList: []
		};
	},
	onLoad() {
		this.getGrouponList();
	},
	onPullDownRefresh() {},
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
			that.$api('goods.grouponList', {
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.isLoading = false;
					that.grouponList = [...that.grouponList, ...res.data.data];
					// that.grouponList=[];
					that.lastPage = res.data.last_page;
					if (that.currentPage < res.data.last_page) {
						that.loadStatus = '';
					} else {
						that.loadStatus = 'over';
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.group-wrap {
	background: url('http://shopro.7wpp.com/imgs/group_list_bg.png') no-repeat;
	background-size: 100% 374rpx;
}
.group-head {
	padding: 0 25rpx;
	height: 100rpx;
	.group-head__title {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
	.group-head__notice {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
}

.group-box {
	width: 710rpx;
	background: linear-gradient(#fff, #f5f5f5);
	border-radius: 20rpx;
	margin: 0 auto;
	min-height: 1000rpx;
	.goods-item {
		border-radius: 20rpx;
		overflow: hidden;
		position: relative;
		margin-bottom: 20rpx;
		.tag {
			position: absolute;
			left: 0;
			top: 10rpx;
			z-index: 2;
			line-height: 35rpx;
			background: linear-gradient(132deg, rgba(255, 153, 93, 1), rgba(255, 99, 97, 1));
			border-radius: 0px 18rpx 18rpx 0px;
			padding: 0 10rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(255, 255, 255, 0.8);
		}
		/deep/.goods-right {
			width: 460rpx;
			.title {
				width: 460rpx;
			}
			.tip {
				width: 460rpx;
			}
		}
		.buy-btn {
			position: absolute;
			right: 0;
			bottom: -10rpx;
			width: 160rpx;
			height: 60rpx;
			background: linear-gradient(90deg, rgba(254, 131, 42, 1), rgba(255, 102, 0, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(255, 104, 4, 0.22);
			border-radius: 30rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #fff;
			padding: 0;
		}
		.group-num {
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			margin-left: 20rpx;
		}
		.sell-box {
			background: rgba(255, 224, 226, 0.3);
			border-radius: 16rpx;
			line-height: 32rpx;
			padding: 0 10rpx;
			.sell-num {
				font-size: 20rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(247, 151, 156, 1);
			}

			.cuIcon-hotfill {
				font-size: 26rpx;
				color: #e1212b;
				margin-right: 8rpx;
			}
		}
	}
}
</style>
