<template>
	<view class="content_box">
		<view class="x-f wrapper-box">
			<scroll-view class="left y-f" scroll-y>
				<view class="type-list x-c" :class="[{ 'list-active': listId == index }]" v-for="(item, index) in categoryData" :key="index" @tap="onType(index)">
					<view class="line" :class="[{ 'line-active': listId == index }]"></view>
					{{ item.name }}
				</view>
			</scroll-view>
			<view class="scroll-box">
				<image class="type-img" v-show="categoryData[listId].image" :src="categoryData[listId].image" mode=""></image>
				<scroll-view scroll-y class="scroll-box" enable-back-to-top scroll-with-animation :scroll-into-view="`goodsType${listId}`">
					<view class="right" v-if="categoryData.length">
						<view class="item-list" v-for="(item, index1) in categoryData" :key="index1" :id="`goodsType${index1}`">
							<view class="type-box x-bc">
								<text class="type-title">{{ item.name }}</text>
							</view>
							<view class="item-box">
								<view class="goods-item x-f mb30" v-for="(mlist, index2) in item.goods" :key="index2">
									<view class="item-img"><image class="item-img" lazy-load :src="mlist.image" mode="aspectFill"></image></view>

									<view class="goods-item--right">
										<view class="item-right--title one-t">黑胡椒牛肉煲仔饭+黄黑胡椒牛肉煲仔饭+黄桃…</view>
										<view class="item-right--sales">销量1230份</view>
										<view class="x-bc item-right--bottom">
											<view class="price-box x-f">
												<view class="current-price">
													<text class="current-price--unit">￥</text>
													25.6
												</view>
												<view class="origin-price">
													<text class="origin-price--unit">￥</text>
													28.6
												</view>
											</view>
											<button class="cu-btn item-btn add-cart" v-if="true"><text class="cuIcon-roundaddfill"></text></button>
											<button class="cu-btn item-btn sel-sku" v-else></button>
										</view>
									</view>
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
export default {
	components: {},
	data() {
		return {
			listId: 0,
			categoryData: {}
		};
	},
	computed: {},
	created() {
		this.getCategory();
	},
	methods: {
		getCategory() {
			this.$api('categoryGoods').then(res => {
				if (res.code === 1) {
					// this.categoryData = res.data;
					this.categoryData = res.data;
				}
			});
		},
		// 获取
		// 查询节点信息
		getRect(selector, all) {
			return new Promise(resolve => {
				let query = null;
				// 支付宝小程序不能加后面的.in(this)，是它自身的限制
				// #ifndef MP-ALIPAY
				query = uni.createSelectorQuery().in(this);
				// #endif
				// #ifdef MP-ALIPAY
				query = uni.createSelectorQuery();
				// #endif
				query[all ? 'selectAll' : 'select'](selector)
					.boundingClientRect(rect => {
						if (all && Array.isArray(rect) && rect.length) {
							resolve(rect);
						}
						if (!all && rect) {
							resolve(rect);
						}
					})
					.exec();
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
}

.wrapper-box {
	flex: 1;
	margin-top: 1upx;
	height: 100%;
}

.type-img {
	width: 505rpx;
	height: 150rpx;
	background: #ccc;
	margin-top: 30rpx;
}

.scroll-box {
	height: 100%;
	flex: 1;
	background: #fff;
}

.left {
	width: 200upx;
	height: 100%;

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
				.goods-item--right {
					@include flex($direction: column, $justify: around, $align: top);
					width: 100%;
					position: relative;
					height: 140rpx;
					margin-left: 20rpx;
				}
				.item-right--bottom {
					width: 100%;
				}
				.item-img {
					width: 140rpx;
					height: 140rpx;
					border-radius: 10rpx;
				}
				.item-right--title {
					width: 350rpx;
					font-weight: bold;
					font-size: 26rpx;
				}
				.item-right--sales {
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
				}
				.price-box {
					.current-price {
						color: #e1212b;
						font-size: 28rpx;
						.current-price--unit {
							font-size: 24rpx;
						}
					}
					.origin-price {
						color: #999;
						font-size: 18rpx;
						margin-left: 12rpx;
						.origin-price--unit {
							font-size: 14rpx;
						}
					}
				}

				.item-btn {
					background: none;
					position: absolute;
					bottom: 0;
					right: 30rpx;
					padding: 0;
					.cuIcon-roundaddfill {
						color: #e6b873;
						font-size: 40rpx;
					}
				}
			}
		}
	}
}
</style>
