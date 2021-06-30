<!-- 商品列表 -->
<template>
	<view class="list-box">
		<view class="head-box">
			<!-- 标题栏 -->
			<u-navbar :borderBottom="true" :background="nav.bg" :z-index="99" :is-fixed="false">
				<view class="u-flex-1 u-flex u-col-center">
					<u-search
						class="u-m-r-20"
						placeholder="请输入搜索关键字"
						@change="onSearch"
						@search="onSearch"
						@clear="clearSearch"
						v-model="searchVal"
						:showAction="false"
						height="60"
					></u-search>
				</view>
			</u-navbar>
			<!-- 筛选栏 -->
			<sh-filter @change="onFilter"></sh-filter>
		</view>
		<view class="goods-wrap u-p-10">
			<u-waterfall v-model="goodsList" ref="uWaterfall">
				<template v-slot:left="{ leftList }">
					<view class="goods-item u-m-b-20 u-flex u-row-center u-col-center" v-for="leftGoods in leftList" :key="leftGoods.id">
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
				</template>
				<template v-slot:right="{ rightList }">
					<view class="goods-item u-m-b-20 u-flex u-row-center u-col-center" v-for="rightGoods in rightList" :key="rightGoods.id">
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
				</template>
			</u-waterfall>

			<!-- 缺省页 -->
			<shopro-empty v-show="isEmpty" :image="$IMG_URL + '/imgs/empty/empty_goods.png'" tipText="暂无该商品，还有更多好货等着你噢~"></shopro-empty>

			<!-- 加载更多 -->
			<u-loadmore v-show="goodsList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		</view>
		<!-- 登录弹窗 -->
		<shopro-auth-modal></shopro-auth-modal>
	</view>
</template>

<script>
import shFilter from './components/sh-filter.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
let systemInfo = uni.getSystemInfoSync();
export default {
	components: {
		shFilter
	},
	data() {
		return {
			isEmpty: false,
			nav: {
				bg: {
					background: '#fff'
				}
			},
			goodsList: [],
			searchVal: '',
			listParams: {
				category_id: 0,
				keywords: '',
				page: 1
			},
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			lastPage: 1
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
		}
		if (this.$Route.query.keywords) {
			this.listParams.keywords = this.$Route.query.keywords
			this.searchVal = this.$Route.query.keywords;
		}
		this.getGoodsList();
	},
	methods: {
		onFilter(e) {
			this.listParams.order = e;
			this.$refs.uWaterfall.clear();
			this.goodsList = [];
			this.listParams.page = 1;
			this.lastPage = 1;
			this.$u.debounce(this.getGoodsList);
		},
		// 键盘搜索,输入搜索
		onSearch() {
			this.$refs.uWaterfall.clear();
			this.goodsList = [];
			this.listParams.page = 1;
			this.lastPage = 1;
			this.listParams.keywords = this.searchVal;
			this.$u.debounce(this.getGoodsList);
		},

		// 清除搜索框
		clearSearch() {
			this.searchVal = '';
		},
		// 商品列表
		getGoodsList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http('goods.lists', that.listParams, '加载中...').then(res => {
				if (res.code === 1) {
					that.goodsList = [...that.goodsList, ...res.data.data];
					that.isEmpty = !that.goodsList.length;
					that.lastPage = res.data.last_page;
					that.loadStatus = that.listParams.page < res.data.last_page ? 'loadmore' : 'nomore';
				}
			});
		}
	}
};
</script>

<style lang="scss">
.head-box {
	position: -webkit-sticky;
	position: sticky;
	top: 0;
	z-index: 998;
	background: #fff;
}
</style>
