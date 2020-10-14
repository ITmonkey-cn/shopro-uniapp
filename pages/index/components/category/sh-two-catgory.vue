<template>
	<view class="content_box">
		<view class="x-f wrapper-box" :style="paddingBottom">
			<view class="scroll-box" style="background-color: #F6F6F6;">
				<scroll-view class="left y-f" enable-back-to-top scroll-y>
					<view class="type-list x-f" :class="[{ 'list-active': listId == index }]" v-for="(item, index) in categoryData" :key="index" @tap="onType(index)">
						<view class="x-c list-item" :class="[{ 'line-active': listId == index }]">{{ item.name }}</view>
					</view>
				</scroll-view>
			</view>
			<view style="height: 100%;width: 100%;">
				<scroll-view scroll-y class="scroll-box" enable-back-to-top scroll-with-animation>
					<view class="right" v-if="categoryData.length">
						<image class="type-img" v-show="categoryData[listId].image" :src="categoryData[listId].image" lazy-load></image>
						<view class="type-box x-c">
							<text class="cuIcon-move"></text>
							<text class="type-title">{{ categoryData[listId].name }}</text>
							<text class="cuIcon-move"></text>
						</view>
						<view class="item-list">
							<view class="item-box x-f">
								<view
									class="y-f goods-item"
									@tap="jump('/pages/goods/list', { id: list.id })"
									v-for="(list, index1) in categoryData[listId].children"
									:key="index1"
								>
									<image class="item-img" lazy-load :src="list.image" mode="aspectFill"></image>
									<text class="item-title one-t ">{{ list.name }}</text>
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
			categoryData: {}
		};
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
	props: {
		categoryId: {
			type: Number,
			default: 0
		}
	},
	created() {
		this.getCategory();
	},
	methods: {
		getCategory() {
			this.$api('category', {
				id: this.categoryId
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
	}
	.line-active {
		width: 180rpx;
		height: 64rpx;
		background: #e6b873;
		border-radius: 0rpx 32rpx 32rpx 0rpx;
	}

	.type-list {
		height: 100rpx;
		position: relative;
		justify-content: flex-start;
		width: 200upx;
		font-size: 28upx;
		font-family: PingFang SC;
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
					// background: #ccc;
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
