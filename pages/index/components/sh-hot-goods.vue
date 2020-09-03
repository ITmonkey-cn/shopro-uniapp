<template>
	<!-- 为你推荐 -->
	<view class="hot-goods mx20 mb10" v-if="goodsList.length">
		<view class="goods-list x-f">
			<view class="goods-item" v-if="goods.id" v-for="goods in goodsList" :key="goods.id"><shopro-goods-card :detail="goods" :isTag="true"></shopro-goods-card></view>
		</view>
		<button v-if="total > perPage" class="cu-btn refresh-btn my20 x-f" @tap.stop="loadMore">
			<text class="cuIcon-refresh" :class="{ 'refresh-active': isRefresh }"></text>
			{{ listParams.page >= lastPage ? '收起' : '加载更多' }}
		</button>
	</view>
</template>

<script>
import shoproGoodsCard from '@/components/shopro-goods-card/shopro-goods-card.vue';
export default {
	components: {
		shoproGoodsCard
	},
	data() {
		return {
			listParams: {
				page: 1
			},
			lastPage: 1, //分页总数
			total: 0, //总商品数
			perPage: 0, //单页商品数
			goodsList: [],
			isRefresh: false
		};
	},
	props: {
		detail: {
			type: Object,
			default: null
		}
	},
	created() {
		if (this.detail.id) {
			this.listParams.category_id = this.detail.id;
			this.getGoodsList();
		}
		if (this.detail.ids) {
			this.listParams.goods_ids = this.detail.ids;
			this.getGoodsList();
		}
	},
	computed: {},
	methods: {
		// 商品列表
		getGoodsList() {
			let that = this;
			that.$api('goods.lists', this.listParams).then(res => {
				if (res.code === 1) {
					this.lastPage = res.data.last_page;
					this.total = res.data.total;
					this.perPage = res.data.per_page;
					this.isRefresh = false;
					that.goodsList = [...that.goodsList, ...res.data.data];
				}
			});
		},

		// 加载更多
		loadMore() {
			if (!this.isRefresh) {
				// 加载更多
				if (this.listParams.page < this.lastPage) {
					this.isRefresh = true;
					this.listParams.page += 1;
					this.getGoodsList();
				} else {
					// 重置为1页数据
					this.listParams.page = 1;
					this.lastPage = 1;
					this.goodsList = [];
					this.getGoodsList();
				}
			}
		}
	}
};
</script>

<style lang="scss">
// 为你推荐
.hot-goods {
	background: linear-gradient(#fff 200rpx, #f6f6f6 500rpx, #f6f6f6);
	border-radius: 20rpx;
	.goods-list {
		flex-wrap: wrap;
		width: 710rpx;
		.goods-item {
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			width: 345rpx;
			box-shadow: 0px 0px 10rpx 4rpx rgba(199, 199, 199, 0.22);
			border-radius: 20rpx;
			&:nth-child(2n) {
				margin-right: 0;
			}
		}
	}
	.refresh-btn {
		margin-left: 50%;
		transform: translateX(-50%);
		width: 156rpx;
		height: 50rpx;
		background: #ffffff;
		border-radius: 25rpx;
		font-size: 22rpx;
		font-weight: 500;
		color: #999999;
		white-space: nowrap;
		.cuIcon-refresh {
			color: #dbdbdb;
			margin-right: 12rpx;
			font-size: 32rpx;
		}
	}
	.refresh-active {
		transform: rotate(360deg);
		transition: all linear 0.5s;
	}
}
</style>
