<template>
	<view class="score-wrap">
		<view class="goods-wrap u-p-20">
			<view class="goods-list u-flex">
				<u-waterfall v-model="scoreList" ref="uWaterfall">
					<template v-slot:left="{ leftList }">
						<view class="goods-item u-m-b-20" v-for="leftGoods in leftList" :key="leftGoods.id">
							<shopro-goods-card
								:image="leftGoods.image"
								:title="leftGoods.title"
								@click="$Router.push({ path: '/pages/goods/detail', query: { id: leftGoods.id, type: 'score' } })"
							>
								<template #cardBottom>
									<view class="price-box u-flex u-row-between u-flex-wrap">
										<view class="beans-box u-flex u-m-10 font-OPPOSANS">
											<image class="bean-img" :src="$IMG_URL + '/imgs/score/score.png'" mode=""></image>
											{{ leftGoods.price }}
										</view>
										<view class="sales-box u-m-10">已兑换{{ leftGoods.sales }}件</view>
									</view>
								</template>
							</shopro-goods-card>
						</view>
					</template>
					<template v-slot:right="{ rightList }">
						<view class="goods-item u-m-b-20" v-for="rightGoods in rightList" :key="rightGoods.id">
							<shopro-goods-card
								:image="rightGoods.image"
								:title="rightGoods.title"
								@click="$Router.push({ path: '/pages/goods/detail', query: { id: rightGoods.id, type: 'score' } })"
							>
								<template #cardBottom>
									<view class="price-box u-flex u-row-between u-flex-wrap">
										<view class="beans-box u-flex u-m-10 font-OPPOSANS">
											<image class="bean-img" :src="$IMG_URL + '/imgs/score/score.png'" mode=""></image>
											{{ rightGoods.price }}
										</view>
										<view class="sales-box u-m-10">已兑换{{ rightGoods.sales }}件</view>
									</view>
								</template>
							</shopro-goods-card>
						</view>
					</template>
				</u-waterfall>
			</view>
			<!-- 缺省页 -->
			<shopro-empty
				v-show="isEmpty"
				@click="$Router.pushTab('/pages/index/index')"
				:image="$IMG_URL + '/imgs/empty/empty_goods.png'"
				tipText="暂无积分商品"
				btnText="去首页逛逛"
			></shopro-empty>
			<!-- 加载更多 -->
			<u-loadmore v-if="!isEmpty" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		</view>
		<shopro-auth-modal ></shopro-auth-modal>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			scoreList: [],
			isEmpty: false, //无数据
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1
		};
	},
	onLoad() {
		this.getScoreShopsList();
		// 触底监听
		uni.$on('uOnReachBottom', () => {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getScoreShopsList();
			}
		});
	},
	computed: {},
	methods: {
		//积分商品列表
		getScoreShopsList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http('goods.scoreList', {
				page: that.currentPage
			}).then(res => {
				if (res.code == 1) {
					that.scoreList = [...that.scoreList, ...res.data.data];
					that.isEmpty = !that.scoreList.length;
					that.lastPage = res.data.last_page;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
				}
			});
		}
	}
};
</script>

<style lang="scss">
.goods-list {
	flex-wrap: wrap;
	.goods-item {
		margin-right: 20rpx;
		margin-bottom: 20rpx;

		&:nth-child(2n) {
			margin-right: 0;
		}
		.price-box {
			.beans-box {
				font-size: 32upx;
				font-weight: bold;
				color: rgba(228, 141, 4, 1);

				.bean-img {
					width: 36upx;
					height: 36upx;
				}
			}
			.sales-box {
				font-size: 22rpx;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
			}
		}
	}
}
</style>
