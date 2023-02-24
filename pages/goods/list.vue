<!-- 商品列表 -->
<template>
	<view class="list-box">
		<view class="head-box">
			<!-- 标题栏 -->
			<shopro-navbar>
				<view class="u-flex-1 u-flex u-col-center u-m-x-20" slot="content">
					<u-search placeholder="请输入关键字" @change="onSearch" @search="onSearch" @clear="clearSearch" v-model="searchVal" :showAction="false" height="60"></u-search>
				</view>
			</shopro-navbar>
			<!-- 筛选栏 -->
			<sh-filter @change="onFilter"></sh-filter>
		</view>

		<view class="u-waterfall u-p-16" v-if="!isEmpty">
			<view id="u-left-column" class="u-column">
				<view class="goods-item u-m-b-16 u-flex u-row-center u-col-center" v-for="leftGoods in leftList" :key="leftGoods.id">
					<shopro-goods-card
						:detail="leftGoods"
						:type="leftGoods.activity_type"
						:image="leftGoods.image"
						:title="leftGoods.title"
						:subtitle="leftGoods.subtitle"
						:price="leftGoods.price"
						:originPrice="leftGoods.original_price"
						:sales="leftGoods.sales"
						:tagTextList="leftGoods.activity_discounts_tags"
						@click="$Router.push({ path: '/pages/goods/detail', query: { id: leftGoods.id } })"
					></shopro-goods-card>
				</view>
			</view>
			<view id="u-right-column" class="u-column">
				<view class="goods-item u-m-b-16 u-flex u-row-center u-col-center" v-for="rightGoods in rightList" :key="rightGoods.id">
					<shopro-goods-card
						:detail="rightGoods"
						:type="rightGoods.activity_type"
						:image="rightGoods.image"
						:title="rightGoods.title"
						:subtitle="rightGoods.subtitle"
						:price="rightGoods.price"
						:originPrice="rightGoods.original_price"
						:sales="rightGoods.sales"
						:tagTextList="rightGoods.activity_discounts_tags"
						@click="$Router.push({ path: '/pages/goods/detail', query: { id: rightGoods.id } })"
					></shopro-goods-card>
				</view>
			</view>
		</view>

		<!-- 缺省页 -->
		<shopro-empty v-if="isEmpty" :image="$IMG_URL + '/imgs/empty/empty_goods.png'" tipText="暂无该商品，还有更多好货等着你噢~"></shopro-empty>
		<!-- 加载更多 -->
		<u-loadmore v-show="!isEmpty" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		<!-- 登录弹窗 -->
		<shopro-auth-modal></shopro-auth-modal>
	</view>
</template>

<script>
import shFilter from './components/sh-filter.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
let systemInfo = uni.getSystemInfoSync();
let historyTag = uni.getStorageSync('searchHistoryArr') ? JSON.parse(uni.getStorageSync('searchHistoryArr')) : [];
export default {
	components: {
		shFilter
	},
	data() {
		return {
			isEmpty: false,
			goodsList: [],
			searchVal: '',
			listParams: {
				category_id: 0,
				keywords: '',
				page: 1
			},
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			lastPage: 1,

			// 瀑布流 350-330
			addTime: 100, //排序间隙时间
			leftHeight: 0,
			rightHeight: 0,
			leftList: [],
			rightList: [],
			tempList: []
		};
	},
	// 触底加载更多
	onReachBottom() {
		if (this.listParams.page < this.lastPage) {
			this.listParams.page += 1;
			this.getGoodsList();
		}
	},
	onLoad() {
		if (this.$Route.query.id) {
			this.listParams.category_id = this.$Route.query.id;
			this.getGoodsList();
		} else if (this.$Route.query.hasOwnProperty('keywords')) {
			this.listParams.keywords = this.$Route.query.keywords;
			this.searchVal = this.$Route.query.keywords;
			!this.$Route.query.keywords && this.getGoodsList();
		} else {
			this.getGoodsList();
		}
	},
	methods: {
		// 瀑布流相关
		async splitData() {
			if (!this.tempList.length) return;
			let item = this.tempList[0];
			if (!item) return;

			// 分左右
			if (this.leftHeight < this.rightHeight) {
				this.leftHeight += item.activity_discounts_tags.length ? 350 : 330;
				this.leftList.push(item);
			} else if (this.leftHeight > this.rightHeight) {
				this.rightHeight += item.activity_discounts_tags.length ? 350 : 330;
				this.rightList.push(item);
			} else {
				this.leftHeight += item.activity_discounts_tags.length ? 350 : 330;
				this.leftList.push(item);
			}

			// 移除临时列表的第一项，如果临时数组还有数据，继续循环
			this.tempList.splice(0, 1);
			if (this.tempList.length) {
				setTimeout(() => {
					this.splitData();
				}, this.addTime);
			}
		},
		clear() {
			this.leftList = [];
			this.rightList = [];
			this.leftHeight = 0;
			this.rightHeight = 0;
			this.tempList = [];
		},

		onFilter(e) {
			this.listParams.order = e;
			this.goodsList = [];
			this.listParams.page = 1;
			this.lastPage = 1;
			this.clear();
			this.$u.debounce(this.getGoodsList);
		},
		// 键盘搜索,输入搜索
		onSearch() {
			this.goodsList = [];
			this.listParams.page = 1;
			this.lastPage = 1;
			this.listParams.keywords = this.searchVal;
			this.clear();
			this.$u.debounce(this.getGoodsList);
		},

		// 队列
		getArr(list, item) {
			let arr = list;
			let length = 10; //队列长度
			arr.length < length ? arr.unshift(item) : arr.pop();
			return arr;
		},

		// 清除搜索框
		clearSearch() {
			this.searchVal = '';
			this.clear();
		},
		// 商品列表
		getGoodsList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http('goods.lists', that.listParams, '加载中...').then(res => {
				if (this.searchVal && !historyTag.includes(this.searchVal)) {
					let searchHistoryArr = JSON.stringify(this.getArr(historyTag, this.searchVal));
					uni.setStorageSync('searchHistoryArr', searchHistoryArr);
				}
				if (res.code === 1) {
					that.goodsList = [...that.goodsList, ...res.data.data];
					that.isEmpty = !that.goodsList.length;
					that.lastPage = res.data.last_page;
					that.loadStatus = that.listParams.page < res.data.last_page ? 'loadmore' : 'nomore';
					that.tempList = res.data.data;
					that.splitData();
				}
			});
		}
	}
};
</script>

<style lang="scss">
@mixin vue-flex($direction: row) {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: $direction;
	/* #endif */
}
.u-waterfall {
	@include vue-flex;
	flex-direction: row;
	align-items: flex-start;
}

.u-column {
	@include vue-flex;
	flex: 1;
	flex-direction: column;
	height: auto;
}
.head-box {
	position: -webkit-sticky;
	position: sticky;
	top: 0;
	z-index: 998;
	background: #fff;
}
</style>
