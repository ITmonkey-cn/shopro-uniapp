<template>
	<!-- 分类选项卡 -->
	<view class="category-tabs-wrap">
		<u-sticky ref="uSticky" :h5NavHeight="0" @fixed="stickyTabs" @unfixed="unStickyTabs" :bgColor="isSticky ? '#fff' : '#f6f6f6'" :enable="enable" :isPxNum="stickyTop">
			<view class="tabs-wrap u-p-y-20" :style="isSticky ? 'border-bottom:1px solid #eee;background-color:#fff' : ''">
				<scroll-view scroll-x class="tabs-content" enable-flex scroll-with-animation :scroll-left="scrollLeft">
					<view class="u-flex u-row-cetner u-flex-1 u-col-center">
						<view class="tab-item u-flex-col u-col-center u-row-center" v-for="(item, index) in tabsList" :key="index" @tap="tabChange(index)">
							<view class="tab-title u-m-y-6" :class="{ 'title-active': tabCur == index }">{{ item.name }}</view>
							<view class="tab-des" :class="{ 'des-active': tabCur == index }">{{ item.description }}</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-sticky>
		<view class="goods-wrap u-p-16" v-if="styleType == 1">
			<u-waterfall v-model="goodsList" ref="uWaterfall">
				<template v-slot:left="{ leftList }">
					<view class="goods-item u-m-b-16 u-flex u-row-center u-col-center" v-for="leftGoods in leftList" :key="leftGoods.id">
						<shopro-goods-card
							:detail="leftGoods"
							:type="leftGoods.activity_type"
							:image="leftGoods.image"
							:title="leftGoods.title"
							:subtitle="leftGoods.subtitle"
							:price="leftGoods.price"
							:originPrice="leftGoods.original_price"
							:tagTextList="leftGoods.activity_discounts_tags"
							@click="$Router.push({ path: '/pages/goods/detail', query: { id: leftGoods.id } })"
						></shopro-goods-card>
					</view>
				</template>
				<template v-slot:right="{ rightList }">
					<view class="goods-item u-m-b-16 u-flex u-row-center u-col-center" v-for="rightGoods in rightList" :key="rightGoods.id">
						<shopro-goods-card
							:detail="rightGoods"
							:type="rightGoods.activity_type"
							:image="rightGoods.image"
							:title="rightGoods.title"
							:subtitle="rightGoods.subtitle"
							:price="rightGoods.price"
							:originPrice="rightGoods.original_price"
							:tagTextList="rightGoods.activity_discounts_tags"
							@click="$Router.push({ path: '/pages/goods/detail', query: { id: rightGoods.id } })"
						></shopro-goods-card>
					</view>
				</template>
			</u-waterfall>
		</view>

		<!-- m -->
		<view class="big-card-wrap u-p-10" v-if="styleType == 2">
			<block v-for="item in goodsList" :key="item.id">
				<sh-goods-card
					:detail="item"
					:type="item.activity_type"
					:image="item.image"
					:title="item.title"
					:subtitle="item.subtitle"
					:price="item.price"
					:originPrice="item.original_price"
					:sales="item.sales"
					:tagTextList="item.activity_discounts_tags"
					@click="$Router.push({ path: '/pages/goods/detail', query: { id: item.id } })"
				></sh-goods-card>
			</block>
		</view>

		<view class="x-c" style="width: 100%;">
			<!-- 缺省页 -->
			<shopro-empty v-show="isEmpty" marginTop="200rpx" :image="$IMG_URL + '/imgs/empty/empty_goods.png'" tipText="暂无该商品，还有更多好货等着你噢~"></shopro-empty>

			<!-- 更多 -->
			<u-loadmore v-show="!isEmpty" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		</view>
	</view>
</template>

<script>
/**
 * category-tabs
 * @description 一个可以吸顶的分类列表
 * @property {Boolean} enable = false - 是否吸顶,tabbar项中，组件不会自动销毁，需要自行开关
 * @property {Array} tabsList  - 分类列表
 * @property {Array | Number} styleType  - 卡片类型
 */
let systemInfo = uni.getSystemInfoSync();
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
import shGoodsCard from '../components/sh-goods-card.vue';
export default {
	components: {
		shGoodsCard
	},
	data() {
		return {
			tabCur: 0,
			scrollLeft: 0,
			isEmpty: true,
			isSticky: false, //是否吸顶
			categoryId: 0,
			goodsList: [],
			tabCurrent: 0,
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1
		};
	},
	watch: {},
	props: {
		tabsList: {
			type: Array,
			default: () => []
		},
		styleType: {
			type: [Array, Number],
			default: 1
		},
		enable: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		stickyTop() {
			// #ifdef APP-PLUS || H5
			return systemInfo.statusBarHeight + 44;
			// #endif
			// #ifdef MP
			let height = systemInfo.platform == 'ios' ? 44 : 48;
			let top = systemInfo.statusBarHeight + height;
			return top;
			// #endif
		}
	},
	created() {
		this.categoryId = this.tabsList[0]?.id;
		this.getGoodsList();
		// 触底监听
		uni.$on('uOnReachBottom', data => {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getGoodsList();
			}
		});
	},
	methods: {
		// 商品列表
		getGoodsList() {
			let that = this;
			that.$http('goods.lists', {
				category_id: that.categoryId,
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.goodsList = [...that.goodsList, ...res.data.data];
					that.isEmpty = !that.goodsList.length;
					that.lastPage = res.data.last_page;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
				}
			});
		},

		// tabs
		tabChange(index) {
			this.tabCur = index;
			this.scrollLeft = (index - 1) * 60;
			this.categoryId = this.tabsList[index].id;
			this.styleType === 1 && this.$refs.uWaterfall.clear();
			this.goodsList = [];
			this.currentPage = 1;
			this.lastPage = 1;
			this.loadStatus = 'loadmore';
			this.getGoodsList();
		},
		stickyTabs() {
			this.isSticky = true;
			this.$refs.uSticky.initObserver();
		},
		unStickyTabs() {
			this.isSticky = false;
			this.$refs.uSticky.initObserver();
		}
	}
};
</script>

<style lang="scss" scoped>
.category-tabs-wrap {
	min-height: 1000rpx;
}
// 滑动分类
.tabs-content {
	white-space: nowrap;
	.tab-item {
		min-height: 90rpx;
		display: inline-block;
		margin: 0 10rpx;
		padding: 0 20rpx;
		.tab-title {
			font-size: 28rpx;
			font-weight: 600;
			color: #333333;
		}
		.title-active {
			color: #a8700d;
		}
		.tab-des {
			font-size: 22rpx;
			font-weight: 400;
			color: #999999;
			text-align: center;
		}
		.des-active {
			background: linear-gradient(90deg, #e9b461, #eecc89);
			border-radius: 15rpx;
			padding: 2rpx 10rpx;
			color: #ffffff;
		}
	}
}
</style>
