<template>
	<view class="content_box">
		<view class="u-flex u-col-center wrapper-box">
			<view class="scroll-box" style="background-color: #F6F6F6;">
				<scroll-view class="left u-flex-col u-col-center" enable-back-to-top scroll-y>
					<view class="type-list u-ellipsis-1" :class="[{ 'list-active': listId == index }]" v-for="(item, index) in categoryData" :key="index" @tap="onType(index)">
						<view class="line" :class="[{ 'line-active': listId == index }]"></view>
						{{ item.name }}
					</view>
					<view class="hack-tabbar"></view>
				</scroll-view>
			</view>
			<view style="height: 100%;width: 100%;">
				<scroll-view @scrolltolower="loadMore" scroll-y class="scroll-box" enable-back-to-top scroll-with-animation>
					<view class="right" v-if="categoryData.length">
						<image class="type-img" v-show="categoryData[listId].image" :src="categoryData[listId].image" mode="aspectFill"></image>
						<view class="item-list">
							<view class="item-box u-flex">
								<view
									class="u-flex-col u-col-center goods-item"
									@tap="jump('/pages/goods/detail', { id: goods.id })"
									v-for="(goods, index1) in goodsList"
									:key="goods.id"
								>
									<image class="item-img" lazy-load :src="goods.image" mode="aspectFill"></image>
									<text class="item-title u-ellipsis-1 ">{{ goods.title }}</text>
									<view class="item-price">{{ goods.price }}</view>
								</view>
							</view>
						</view>

						<!-- 缺省页 -->
						<shopro-empty
							v-if="isEmpty"
							marginTop="200rpx"
							:image="$IMG_URL + '/imgs/empty/empty_goods.png'"
							tipText="暂无该商品，还有更多好货等着你噢~"
						></shopro-empty>

						<!-- 加载更多 -->
						<u-loadmore v-if="!isEmpty" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
						<view class="hack-tabbar"></view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {},
	data() {
		return {
			listId: 0,
			categoryData: {},
			categoryID: 0, //分类id
			isEmpty: false,
			currentPage: 1,
			lastPage: 1,
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			goodsList: [] //商品数据
		};
	},
	props: {
		categoryStyleId: {
			//分类样式ID
			type: Number,
			default: 0
		}
	},
	computed: {},
	created() {
		console.log('%c当前分类:一级分类', 'color:green;background:yellow');
		this.getCategory();
	},

	methods: {
		// 获取分类
		getCategory() {
			this.$http('category.detail', {
				id: this.categoryStyleId
			}).then(res => {
				if (res.code === 1) {
					this.categoryData = res.data.children;
					this.categoryID = res.data.children[0].id;
					this.getGoodsList();
				}
			});
		},

		// 获取分类商品
		getGoodsList() {
			let that = this;
			that.$http('goods.lists', {
				category_id: that.categoryID,
				page: that.currentPage
			}, '加载中...').then(res => {
				if (res.code === 1) {
					that.goodsList = [...that.goodsList, ...res.data.data];
					that.isEmpty = !that.goodsList.length;
					that.lastPage = res.data.last_page;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
				}
			});
		},

		// 商品底部
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getGoodsList();
			}
		},

		onType(index) {
			this.listId = index;
			this.categoryID = this.categoryData[index].id;
			this.goodsList = [];
			this.currentPage = 1;
			this.getGoodsList();
		},
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		}
	}
};
</script>

<style lang="scss">
.hack-tabbar {
	height: calc(100rpx + env(safe-area-inset-bottom) / 2);
	width: 100%;
}
.content_box {
	margin-top: 1upx;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
}

.wrapper-box {
	flex: 1;
	margin-top: 1upx;
	height: 100%;
}

.scroll-box {
	height: 100%;
	flex: 1;
	background: #fff;
}

.left {
	width: 200upx;
	height: 100%;
	flex: 1;

	.list-active {
		background: #fff;
		color: #333333 !important;
		font-weight: bold !important;
	}

	.line-active {
		background: #e6b873;
	}

	.type-list {
		height: 84upx;
		position: relative;
		width: 200rpx;
		padding-left: 16rpx;
		line-height: 84rpx;
		font-size: 28upx;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);

		.line {
			width: 10upx;
			height: 100%;
			position: absolute;
			left: 0;
		}
	}
}

.right {
	padding: 0 30upx;
	flex: 1;
	height: 100%;

	.type-img {
		width: 505rpx;
		height: 150rpx;
		background: #ccc;
		margin: 20rpx 0;
		border-radius: 10rpx;
	}

	.item-list {
		.type-box {
			height: 84rpx;
			.type-title {
				font-size: 28rpx;
				font-weight: bold;
			}
			.more {
				font-size: 26rpx;
				color: #999;
			}
		}

		.item-box {
			flex-wrap: wrap;
			width: 504rpx;
			.goods-item {
				margin-right: 12rpx;
				margin-bottom: 12rpx;
				background: #ffffff;
				box-shadow: 0px 0px 20rpx 4rpx rgba(199, 199, 199, 0.22);
				border-radius: 10rpx;

				&:nth-child(2n) {
					margin-right: 0;
				}

				.item-img {
					width: 245rpx;
					height: 246rpx;
					border-radius: 10rpx 10rpx 0px 0px;
					// background: #ccc;
				}

				.item-title {
					font-size: 24rpx;
					line-height: 24rpx;
					margin-top: 10rpx;
					width: 200rpx;
					text-align: left;
					margin: 20rpx;
				}
				.item-price {
					font-size: 28rpx;
					font-weight: 500;
					color: #ff3000;
					text-align: left;
					width: 200rpx;
					margin: 0 20rpx 20rpx;
					&::before {
						content: '￥';
						font-size: 22rpx;
					}
				}
			}
		}
	}
}
</style>
