<template>
	<!-- 为你推荐 -->
	<view class="hot-goods u-m-b-10 u-p-x-16">
		<!-- s -->
		<u-waterfall v-model="goodsList" ref="uWaterfall" v-if="detail.style === 1">
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
						:sales="leftGoods.sales"
						:tagTextList="leftGoods.activity_discounts_tags"
						@click="$Router.push({ path: '/pages/goods/detail', query: { id: leftGoods.id } })"
					></shopro-goods-card>
				</view>
			</template>
			<template v-slot:right="{ rightList }">
				<view class="goods-item  u-m-b-16 u-flex u-row-center u-col-center" v-for="rightGoods in rightList" :key="rightGoods.id">
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
		<!-- m -->
		<view class="big-card-wrap u-p-10" v-if="detail.style === 2">
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
		<button v-show="total > perPage" class="u-reset-button refresh-btn u-m-y-20 u-flex u-col-center u-row-center" @tap.stop="loadMore">
			<u-icon class="u-m-r-6" name="reload" size="28" color="#999" :class="{ 'refresh-active': isRefresh }"></u-icon>
			{{ listParams.page >= lastPage ? '收起' : '加载更多' }}
		</button>
	</view>
</template>

<script>
/**
 * 自定义之为你推荐
 * @property {Object} detail - 推荐商品信息
 */
import shGoodsCard from './sh-goods-card.vue';
export default {
	components: {
		shGoodsCard
	},
	data() {
		return {
			listParams: {
				page: 1
			}, //当前分页
			lastPage: 1, //总分页
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
			that.$http('goods.lists', this.listParams).then(res => {
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
					this.$refs.uWaterfall.clear();
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
	background: none;
	.refresh-btn {
		margin-left: 50%;
		transform: translateX(-50%);
		width: 156rpx;
		line-height: 50rpx;
		background: #ffffff;
		border-radius: 25rpx;
		font-size: 22rpx;
		font-weight: 500;
		color: #999999;
		white-space: nowrap;
	}
	.refresh-active {
		transform: rotate(360deg);
		transition: all linear 0.5s;
	}
}
</style>
