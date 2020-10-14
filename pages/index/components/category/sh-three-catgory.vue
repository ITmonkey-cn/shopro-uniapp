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
				<scroll-view scroll-y class="scroll-box" enable-back-to-top scroll-with-animation>
					<view class="right" v-if="categoryData.length">
						<image class="type-img" v-show="categoryData[listId].image" :src="categoryData[listId].image" mode=""></image>
						<view class="item-list" v-for="(list, index1) in categoryData[listId].children" :key="index1">
							<view class="type-box x-bc">
								<text class="type-title">{{ list.name }}</text>
								<view class="more" @tap="jump('/pages/goods/list', { id: list.id })">
									<text>查看更多</text>
									<text class="cuIcon-right"></text>
								</view>
							</view>
							<view class="item-box x-f">
								<view class="y-f goods-item" @tap="jump('/pages/goods/list', { id: mlist.id })" v-for="(mlist, index2) in list.children" :key="index2">
									<image class="item-img" lazy-load :src="mlist.image" mode="aspectFill"></image>
									<text class="item-title one-t ">{{ mlist.name }}</text>
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
	async created() {
		await this.getCategory();
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
