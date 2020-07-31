<template>
	<view class="content_box">
		<view class="x-f wrapper-box">
			<view class="scroll-box">
				<scroll-view class="left" scroll-y :scroll-with-animation="isTap" :scroll-into-view="scroll_leftId">
					<view
						class="type-list x-c"
						:id="`left_${index}`"
						:class="[{ 'list-active': currentTab == index }]"
						v-for="(item, index) in categoryData"
						:key="index"
						@tap="onType(index)"
					>
						<view class="line" :class="[{ 'line-active': currentTab == index }]"></view>
						{{ item.name }}
					</view>
				</scroll-view>
			</view>

			<view class="scroll-box" style="padding-bottom: 150rpx;">
				<image class="type-img" v-if="categoryData[currentTab] && categoryData[currentTab].image" :src="categoryData[currentTab].image" mode=""></image>
				<scroll-view scroll-y class="scroll-box" scroll-with-animation :scroll-into-view="scroll_rightId" @scroll="rightScroll">
					<view class="right" v-if="categoryData.length">
						<view class="item-list" v-for="(item, index1) in categoryData" :key="index1" :id="`right_${index1}`">
							<view class="type-box x-bc">
								<text class="type-title">{{ item.name }}</text>
							</view>
							<view class="item-box">
								<view class="goods-item x-f mb30" v-for="(mlist, index2) in item.goods" :key="index2">
									<view class="item-img"><image class="item-img" lazy-load :src="mlist.image" mode="aspectFill"></image></view>

									<view class="goods-item--right">
										<view class="item-right--title one-t">{{ mlist.title }}</view>
										<view class="item-right--sales">销量{{ mlist.sales }}份</view>
										<view class="x-bc item-right--bottom">
											<view class="price-box x-f">
												<view class="current-price">
													<text class="current-price--unit">￥</text>
													{{ mlist.price }}
												</view>
												<view class="origin-price">
													<text class="origin-price--unit">￥</text>
													{{ mlist.original_price }}
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
		<!-- 购物车 -->
		<view class="cart-box x-f">
			<view class="cart-left flex-sub x-f">
				<view class="cart-img-box">
					<image class="cart-img" src="/static/imgs/cart2.png" mode=""></image>
					<view class="cu-tag badge">99</view>
				</view>
				<view class="price-box x-f">
					<text class="price">25.6</text>
					<text class="original-price">￥39</text>
				</view>
			</view>
			<button class="cu-btn pay-btn">去结算</button>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			currentTab: 0,
			scroll_leftId: 'left_0',
			scroll_rightId: 'right_0',
			isScroll: true,
			isTap: true,
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
					this.categoryData = res.data;
				}
			});
		},
		onType(index) {
			if (this.currentTab == index) {
				return false;
			} else {
				this.currentTab = index;
				this.checkCor();
			}
		},
		// 检测
		checkCor(isScroll) {
			if (!isScroll) {
				this.isScroll = false;
				this.isTap = true;
				if (this.currentTab > 6) {
					this.scroll_leftId = `left_${this.currentTab - 2}`;
				} else {
					this.scroll_leftId = 'left_0';
				}
				this.scroll_rightId = `right_${this.currentTab}`;
			} else {
				this.scroll_leftId = `left_${this.currentTab}`;
			}
		},
		// 右侧滑动
		rightScroll(e) {
			// console.log(e);
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
// 购物车
.cart-box {
	position: absolute;
	bottom: 100rpx;
	z-index: 77;
	height: 80rpx;
	width: 750rpx;
	.cart-left {
		background: linear-gradient(rgba(103, 104, 105, 1), rgba(82, 82, 82, 1));
		height: 80rpx;
		position: relative;
		.cart-img-box {
			position: absolute;
			left: 50rpx;
			width: 96rpx;
			height: 96rpx;
			top: -20rpx;
			.cart-img {
				width: 96rpx;
				height: 96rpx;
			}
		}
		.price-box {
			padding-left: 180rpx;
			.original-price {
				font-size: 22rpx;
				font-family: OPPOSans;
				font-weight: 400;
				text-decoration: line-through;
				color: rgba(153, 153, 153, 1);
				margin-left: 10rpx;
			}
			.price {
				font-size: 32rpx;
				font-family: OPPOSans;
				font-weight: 500;
				color: rgba(250, 253, 253, 1);
				&::before {
					content: '￥';
					font-size: 22rpx;
				}
			}
		}
	}
	.pay-btn {
		width: 205rpx;
		height: 80rpx;
		border-radius: 0;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
}
.content_box {
	margin-top: 1upx;
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: hidden;
	height: 100%;
	margin-bottom: 40px;
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
	margin: 10rpx 30rpx;
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
