<template>
	<view class="content_box">
		<view class="x-f wrapper-box" :style="paddingBottom">
			<view class="scroll-box" style="background-color: #F6F6F6;">
				<scroll-view class="left y-f" enable-back-to-top scroll-y>
					<view class="type-list x-c" :class="[{ 'list-active': listId == index }]" v-for="(item, index) in categoryData" :key="index" @tap="onType(index)">
						<view class="line" :class="[{ 'line-active': listId == index }]"></view>
						{{ item.name }}
					</view>
				</scroll-view>
			</view>
			<view style="height: 100%;width: 100%;">
				<scroll-view  @scrolltolower="loadMore" scroll-y class="scroll-box" enable-back-to-top scroll-with-animation>
					<view class="right" v-if="categoryData.length">
						<image class="type-img" v-show="categoryData[listId].image" :src="categoryData[listId].image" mode=""></image>
						<view class="item-list">
							<view class="item-box x-f">
								<view class="y-f goods-item" @tap="jump('/pages/goods/detail/index', { id: goods.id })" v-for="(goods, index1) in goodsList" :key="goods.id">
									<image class="item-img" lazy-load :src="goods.image" mode="aspectFill"></image>
									<text class="item-title one-t ">{{ goods.title }}</text>
									<view class="item-price">{{ goods.price }}</view>
								</view>
							</view>
						</view>
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
			isLoading: false,
			categoryData: {},
			listParams: {
				//获取商品数据
				category_id: 0,
				keywords: '',
				page: 1
			},
			lastPage: 1, //总分页
			goodsList: [] //商品数据
		};
	},
	props: {
		categoryId: {
			type: Number,
			default: 0
		}
	},
	computed: {
		...mapState({
			tabbarList: state => state.init.templateData.tabbar[0].content.list
		}),
		// 是否是底部导航页面
		isTabbar() {
			if (this.tabbarList.length) {
				let arr = [];
				let pages = getCurrentPages();
				let currentPath = pages[pages.length - 1].$page.fullPath;
				for (let item of this.tabbarList) {
					arr.push(item.path);
				}
				return arr.includes(currentPath);
			}
		},
		paddingBottom() {
			console.log(this.isTabbar);
			if (this.isTabbar) {
				return 'padding-bottom:100rpx';
			}
		}
	},
	created() {
		this.getCategory();
	},
	methods: {
		// 获取分类
		getCategory() {
			this.$api('category', {
				id: this.categoryId
			}).then(res => {
				if (res.code === 1) {
					this.categoryData = res.data.children;
					this.listParams.category_id = res.data.children[0].id;
					this.getGoodsList();
				}
			});
		},

		// 获取分类商品
		getGoodsList() {
			let that = this;
			that.isLoading = true;
			that.$api('goods.lists', that.listParams).then(res => {
				if (res.code === 1) {
					that.isLoading = false;
					that.goodsList = [...that.goodsList, ...res.data.data];
					that.lastPage = res.data.last_page;
				}
			});
		},

		// 商品底部
		loadMore() {
			if (this.listParams.page < this.lastPage) {
				this.listParams.page += 1;
				this.getGoodsList();
			}
		},

		onType(index) {
			this.listId = index;
			this.listParams.category_id = this.categoryData[index].id;
			this.goodsList = [];
			this.listParams.page = 1;
			!this.isLoading && this.getGoodsList();
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
		width: 200upx;
		font-size: 28upx;
		font-family: PingFang SC;
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
					color: #e1212b;
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
