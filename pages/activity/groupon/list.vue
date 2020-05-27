<template>
	<view class="page_box">
		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box" enable-back-to-top scroll-with-animation>
				<view class="group-wrap">
					<view class="group-head x-bc">
						<text class="group-head__title">爆款推荐</text>
						<text class="group-head__notice">省钱省心限时拼</text>
					</view>
					<view class="group-box">
						<view class="goods-item" v-for="groupon in grouponList" :key="groupon.id">
							<shopro-activity-card
								:id="groupon.id"
								:title="groupon.title"
								:subtitle="groupon.subtitle"
								:img="groupon.image"
								:price="groupon.price"
								:originalPrice="groupon.original_price"
							>
								<block slot="sell">
									<view class="x-f">
										<view class="sell-box">
											<text class="cuIcon-hotfill"></text>
											<text class="sell-num">已拼{{groupon.sales}}件</text>
										</view>
										<text class="group-num">{{groupon.activity.rules.team_num || 0}}人团</text>
									</view>
								</block>
								<block slot="btn"><button class="cu-btn buy-btn">马上拼</button></block>
							</shopro-activity-card>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import shoproActivityCard from '@/components/goods/shopro-activity-card.vue';
export default {
	components: {
		shoproActivityCard
	},
	data() {
		return {
			isLoading: false,
			loadStatus: '', //loading,over
			lastPage: 0,
			currentPage: 1,
			grouponList: []
		};
	},
	onLoad() {
		this.getGrouponList();
	},
	computed: {},
	methods: {
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
			that.$api('goods.grouponList').then(res => {
				if (res.code === 1) {
					that.isLoading = false;
					that.grouponList = [...that.grouponList, ...res.data.data];
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
	background: url('~@/static/imgs/group/group_list_bg.png') no-repeat;
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
	background: rgba(255, 255, 255, 1);
	border-radius: 20rpx;
	margin: 0 auto;
	.goods-item {
		border-radius: 20rpx;
		overflow: hidden;
		position: relative;
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
