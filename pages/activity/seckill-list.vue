<template>
	<view class="page_box">
		<view class="head_box">
			<view class="tab-box x-f">
				<view class="tab-item" @tap="onTab(tab.id)" :class="{ 'tab-active': tabCurrent === tab.id }" v-for="tab in tabList" :key="tab.id">
					<text class="tab-title">{{ tab.title }}</text>
					<text v-show="tabCurrent === tab.id" class="tab-triangle"></text>
				</view>
			</view>
		</view>
		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<view class="goods-item" v-for="item in goodsList" :key="item.id">
					<shopro-activity-card 
					:id="item.id"
					:title="item.title" 
					:subtitle="item.subtitle" 
					:img="item.image" 
					:price="item.price" 
					:originalPirce="item.original_price"
					>
						<block slot="sell">
							<view class="x-f">
								<view class="cu-progress round sm">
									<view class="progress--color" :style="[{ width: loading ? getProgress(item.sales, item.stock) : '' }]"></view>
								</view>
								<view class="progress-text">已抢{{ getProgress(item.sales, item.stock) }}</view>
							</view>
						</block>
						<block slot="btn">
							<button class="cu-btn buy-btn" :class="btnType[tabCurrent].color">{{ btnType[tabCurrent].name }}</button>
						</block>
					</shopro-activity-card>
				</view>
				<!-- 空白 -->
				<view class="empty-box x-c" v-if="!goodsList.length && !isLoading"><shopro-empty :emptyData="emptyData"></shopro-empty></view>
				<!-- 加载更多 -->
				<view v-if="goodsList.length" class="cu-load text-gray" :class="loadStatus"></view>
				<!-- loading -->
				<shoproLoad v-model="isLoading"></shoproLoad>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
import shoproActivityCard from '@/components/goods/shopro-activity-card.vue';
import shoproEmpty from '@/components/shopro-empty.vue';
export default {
	components: {
		shoproActivityCard,
		shoproEmpty
	},
	data() {
		return {
			emptyData: {
				img: '/static/imgs/empty/empty_goods.jpg',
				tip: '暂无秒杀商品，敬请期待~'
			},
			isLoading: false,
			loadStatus: '', //loading,over
			lastPage: 0,
			currentPage: 1,
			tabCurrent: 'ing',
			goodsList: [],
			loading: false,
			btnType: {
				ended: {
					name: '已结束',
					color: 'btn-end'
				},
				ing: {
					name: '立即抢购',
					color: 'btn-ing'
				},
				nostart: {
					name: '立即抢购',
					color: 'btn-nostart'
				}
			},
			tabList: [
				{
					id: 'ended',
					title: '已结束'
				},
				{
					id: 'ing',
					title: '进行中'
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
		setTimeout(() => {
			this.loading = true;
		}, 500);
		this.getGoodsList();
	},
	methods: {
		onTab(id) {
			this.tabCurrent = id;
			this.goodsList = [];
			this.getGoodsList();
		},
		// 百分比
		getProgress(sales, stock) {
			let unit = '';
			if (stock + sales > 0) {
				unit = (sales / (sales + stock)).toFixed(1) * 100 + '%';
			} else {
				unit = '0%';
			}
			return unit;
		},
		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getbrowseList();
			}
		},
		// 秒杀列表
		getGoodsList() {
			let that = this;
			that.isLoading = true;
			that.loadStatus = 'loading';
			that.$api('goods.seckillList', {
				type: that.tabCurrent
			}).then(res => {
				if (res.code === 1) {
					that.isLoading = false;
					that.goodsList = [...that.goodsList, ...res.data.data];
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
.tab-box {
	.tab-item {
		flex: 1;
		line-height: 84rpx;
		text-align: center;
		background: #636363;
		color: #fff;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		position: relative;
		border-right: 1rpx solid #fff;
		.tab-triangle {
			position: absolute;
			z-index: 2;
			bottom: -14rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 28rpx;
			height: 28rpx;
			background: #e6b873;
			transform: rotate(45deg);
			transform-origin: center;
		}
	}

	.tab-active {
		background: #e6b873;
	}
}
.goods-item {
	.cu-progress {
		width: 225rpx;
		height: 16rpx;
		.progress--color {
			background: #e6b873;
		}
	}
	.progress-text {
		color: #999999;
		font-size: 20rpx;
		margin-left: 25rpx;
	}
	.buy-btn {
		position: absolute;
		right: 0;
		bottom: -20rpx;
		width: 140rpx;
		height: 60rpx;
		border-radius: 30rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;

		padding: 0;
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
// 空白页
.empty-box {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
</style>
