<template>
	<view class="list-box">
		<view class="head_box">
			<view class="" style="position:relative;z-index: 10; background: #fff;">
				<cu-custom :isBack="true">
					<block slot="backText">
						<view class="search-box flex align-center" @tap.stop>
							<input @confirm="onSearch" @input="onInput" confirm-type="搜索" class="search flex-sub" type="text" v-model="searchVal" placeholder="商品搜索" />
							<text v-show="searchVal" @tap="clearSearch" class="cuIcon-roundclosefill"></text>
						</view>
					</block>
				</cu-custom>
			</view>
			<view class="filter-item"><shopro-filter @change="onFilter"></shopro-filter></view>
		</view>
		<view class="content-box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<view class="goods-list x-f">
					<view class="goods-item" v-for="goods in goodsList" :key="goods.id"><shopro-goods :detail="goods"></shopro-goods></view>
				</view>
				<view class="empty-box x-c" v-if="!goodsList.length && !isLoading"><shopro-empty :emptyData="emptyData"></shopro-empty></view>
				<!-- 加载更多 -->
				<view v-if="goodsList.length" class="cu-load text-gray" :class="loadStatus"></view>
				<!-- load -->
				<shoproLoad v-model="isLoading"></shoproLoad>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
import shoproFilter from '@/components/filter/shopro-filter.vue';
import shoproGoods from '@/components/goods/shopro-goods.vue';
import shoproSearch from '@/components/search/shopro-search.vue';
import shoproEmpty from '@/components/shopro-empty.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
let timer = null;
export default {
	components: {
		shoproFilter,
		shoproGoods,
		shoproSearch,
		shoproEmpty
	},
	data() {
		return {
			emptyData: {
				img: '/static/imgs/empty/empty_goods.jpg',
				tip: '暂无该商品，还有更多好货等着你噢~'
			},
			goodsList: [],
			searchVal: '',
			listParams: {
				category_id: 0,
				keywords: '',
				page: 1
			},
			isLoading: false,
			loadStatus: '', //loading,over
			lastPage: 0
		};
	},
	computed: {},
	onLoad() {
		if (this.$Route.query.id) {
			this.listParams.category_id = this.$Route.query.id;
		}
		if (this.$Route.query.keywords) {
			this.listParams.keywords = this.$Route.query.keywords;
			this.searchVal = this.$Route.query.keywords;
		}
		this.getGoodsList();
	},
	methods: {
		onFilter(e) {
			this.listParams.order = e;
			this.goodsList = [];
			this.getGoodsList();
		},
		// 键盘搜索
		onSearch() {
			let that = this;
			that.listParams.keywords = that.searchVal;
			that.goodsList = [];
			that.getGoodsList();
		},
		// 输入防抖搜索
		onInput() {
			let that = this;
			that.listParams.category_id = 0;
			// 输入不及时
			setTimeout(() => {
				that.listParams.keywords = that.searchVal;
			}, 0);
			// 防抖
			if (timer !== null) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				that.goodsList = [];
				that.getGoodsList();
			}, 1000);
		},
		// 清除搜索框
		clearSearch() {
			this.searchVal = '';
		},
		// 加载更多
		loadMore() {
			if (this.listParams.page < this.lastPage) {
				this.listParams.page += 1;
				this.getGoodsList();
			}
		},
		// 商品列表
		getGoodsList() {
			let that = this;
			that.isLoading = true;
			that.loadStatus = 'loading';
			that.$api('goods.lists', that.listParams).then(res => {
				if (res.code === 1) {
					that.isLoading = false;
					that.goodsList = [...that.goodsList, ...res.data.data];
					that.lastPage = res.data.last_page;
					if (that.listParams.page < res.data.last_page) {
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
.head_box {
	position: -webkit-sticky;
	position: sticky;
	top: 0;
	z-index: 998;
	background: #fff;
}

.search-box {
	width: 661rpx;
	height: 60rpx;
	background: rgba(245, 245, 245, 1);
	border-radius: 30rpx;
	padding: 0 30rpx;
	// #ifdef MP
	width: 450rpx;

	// #endif
	.search {
		text-align: center;
		font-size: 28rpx;
	}

	.cuIcon-roundclosefill {
		color: #d5a65a;
		padding: 0 10rpx;
	}
}

.content-box {
	padding: 20rpx;
}

.goods-list {
	flex-wrap: wrap;

	.goods-item {
		margin-right: 20rpx;
		margin-bottom: 20rpx;

		&:nth-child(2n) {
			margin-right: 0;
		}
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
