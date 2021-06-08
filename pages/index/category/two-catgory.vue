<template>
	<view class="content_box">
		<view class="u-flex u-col-center wrapper-box">
			<view class="scroll-box" style="background-color: #F6F6F6;">
				<scroll-view class="left u-flex-col u-col-center" enable-back-to-top scroll-y>
					<view
						class="type-list u-flex u-col-center"
						:class="[{ 'list-active': listId == index }]"
						v-for="(item, index) in categoryData"
						:key="index"
						@tap="onType(index)"
					>
						<view class="u-ellipsis-1  list-item" :class="[{ 'line-active': listId == index }]">{{ item.name }}</view>
					</view>
					<view class="hack-tabbar"></view>
				</scroll-view>
			</view>
			<view style="height: 100%;width: 100%;">
				<scroll-view scroll-y class="scroll-box" enable-back-to-top scroll-with-animation>
					<view class="right" v-if="categoryData.length">
						<image class="type-img" v-show="categoryData[listId].image" :src="categoryData[listId].image" lazy-load mode="aspectFill"></image>
						<view class="type-box u-flex u-col-center u-row-center">
							<u-icon class="" name="minus" size="26" color="#d3d3d3"></u-icon>
							<text class="type-title">{{ categoryData[listId].name }}</text>
							<u-icon class="" name="minus" size="26" color="#d3d3d3"></u-icon>
						</view>
						<view class="item-list">
							<view class="item-box u-flex">
								<view
									class="u-flex-col u-col-center goods-item"
									@tap="jump('/pages/goods/list', { id: list.id })"
									v-for="(list, index1) in categoryData[listId].children"
									:key="index1"
								>
									<image class="item-img" lazy-load :src="list.image" mode="aspectFill"></image>
									<view class="item-title u-ellipsis-1 ">{{ list.name }}</view>
								</view>
							</view>

							<!-- 缺省页 -->
							<shopro-empty
								v-show="!categoryData[listId].children.length"
								:image="$IMG_URL + '/imgs/empty/empty_goods.png'"
								marginTop="200rpx"
								tipText="暂无该商品，还有更多好货等着你噢~"
							></shopro-empty>
							<view class="hack-tabbar"></view>
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
			categoryData: {}
		};
	},
	computed: {},
	props: {
		categoryStyleId: {
			type: Number,
			default: 0
		}
	},
	created() {
		console.log('%c当前分类：二级分类', 'color:green;background:yellow');
		this.getCategory();
	},
	methods: {
		getCategory() {
			this.$http('category.detail', {
				id: this.categoryStyleId
			}).then(res => {
				if (res.code === 1) {
					this.categoryData = res.data.children;
				}
			});
		},
		onType(id) {
			this.listId = id;
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
		color: #ffff !important;
	}
	.list-item {
		width: 180rpx;
		height: 64rpx;
		line-height: 64rpx;
		padding-left: 14rpx;
	}
	.line-active {
		width: 180rpx;
		height: 64rpx;
		background: #e6b873;
		border-radius: 0rpx 32rpx 32rpx 0rpx;
		color: #fff;
	}

	.type-list {
		height: 100rpx;
		position: relative;
		width: 200rpx;
		font-size: 28upx;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
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
		margin-top: 30rpx;
		border-radius: 10rpx;
	}
	.type-box {
		height: 84rpx;

		.type-title {
			font-size: 28rpx;
			font-weight: bold;
			padding: 0 16rpx;
		}
		.cuIcon-move {
			color: #d3d3d3;
		}

		.more {
			font-size: 26rpx;
			color: #999;
		}
	}

	.item-list {
		.item-box {
			flex-wrap: wrap;

			.goods-item {
				margin-right: 20rpx;
				margin-bottom: 20rpx;

				&:nth-child(3n) {
					margin-right: 0;
				}

				.item-img {
					width: 150rpx;
					height: 150rpx;
					border-radius: 6rpx;
					// background: #ccc;
				}

				.item-title {
					font-size: 24rpx;
					margin-top: 10rpx;
					width: 150rpx;
					text-align: center;
				}
			}
		}
	}
}
</style>
