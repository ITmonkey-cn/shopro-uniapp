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
				<scroll-view scroll-y class="scroll-box" enable-flex enable-back-to-top scroll-with-animation>
					<view class="right" v-if="categoryData.length">
						<image class="type-img" v-if="categoryData[listId].image" :src="categoryData[listId].image" mode="aspectFill"></image>

						<view class="item-list" v-for="(list, index1) in categoryData[listId].children" :key="index1">
							<view class="type-box u-flex u-row-between u-col-center">
								<text class="type-title">{{ list.name }}</text>
								<view class="more" @tap="jump('/pages/goods/list', { id: list.id })">
									<text>查看更多</text>
									<u-icon name="arrow-right" size="28" color="#999"></u-icon>
								</view>
							</view>
							<view class="item-box u-flex">
								<view class="u-flex-col goods-item" @tap="jump('/pages/goods/list', { id: mlist.id })" v-for="(mlist, index2) in list.children" :key="index2">
									<image class="item-img" lazy-load :src="mlist.image" mode="aspectFill"></image>
									<view class="item-title u-ellipsis-1 ">{{ mlist.name }}</view>
								</view>
							</view>
						</view>

						<!-- 缺省页 -->
						<shopro-empty
							v-show="!categoryData[listId].children.length"
							:image="$IMG_URL + '/imgs/empty/empty_goods.png'"
							tipText="暂无该商品，还有更多好货等着你噢~"
						></shopro-empty>
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
	async created() {
		console.log('%c当前分类：三级分类', 'color:green;background:yellow');
		await this.getCategory();
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
		border-radius: 10rpx;
		margin-top: 30rpx;
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

			.goods-item {
				margin-right: 20rpx;
				margin-bottom: 20rpx;

				&:nth-child(3n) {
					margin-right: 0;
				}

				.item-img {
					width: 150rpx;
					height: 150rpx;
					// background: #ccc;
					border-radius: 6rpx;
				}

				.item-title {
					font-size: 24rpx;
					line-height: 24rpx;
					margin-top: 10rpx;
					width: 150rpx;
					text-align: center;
				}
			}
		}
	}
}
</style>
