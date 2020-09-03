<template>
	<view class="content_box">
		<view class="x-f wrapper-box">
			<view class="scroll-box" style="background-color: #F6F6F6;">
				<scroll-view style="padding-bottom:180rpx" class="left" enable-back-to-top scroll-y :scroll-with-animation="isTap" :scroll-into-view="scroll_leftId">
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

			<view style="height: 100%;">
				<scroll-view style="padding-bottom:180rpx" scroll-y class="scroll-box" scroll-with-animation :scroll-into-view="scroll_rightId" @scroll="rightScroll">
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
											<button class="cu-btn item-btn add-cart" v-if="!mlist.is_sku">
												<text class="cuIcon-roundaddfill" v-if="!isCart(mlist.id)" @tap="addCart(mlist.sku_price[0])"></text>
												<view class="num-step" v-else>
													<uni-number-box
														@change="onChangeNum($event, mlist.sku_price[0])"
														:value="checkCart[mlist.id].num"
														:step="1"
														:min="1"
													></uni-number-box>
												</view>
											</button>
											<button class="cu-btn item-btn sel-sku" @tap="selSku(mlist)" v-else>选规格</button>
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
				<view class="cart-img-box" @tap="onShowCartList">
					<image class="cart-img" src="/static/imgs/cart2.png" mode=""></image>
					<view class="cu-tag badge" v-if="takeoutTotalCount.totalNum">{{ takeoutTotalCount.totalNum }}</view>
				</view>
				<view class="price-box x-f">
					<text class="price">{{ takeoutTotalCount.totalPrice.toFixed(2) }}</text>
				</view>
			</view>
			<button class="cu-btn pay-btn" @tap="onPay" :disabled="!isSel">去结算</button>
			<!-- 购物车商品列表 -->

			<view class="cart-list-box page_box" :class="takeoutTotalCount.totalNum && showCartList ? '' : 'hide-cart-list'">
				<view class="head_box x-bc cart-list__head px20">
					<label class="check-all x-f" @tap="onAllSel">
						<radio :checked="allSel" :class="{ checked: allSel }" class="check-all-radio orange"></radio>
						<text>全选</text>
					</label>
					<view class="delete-box" @tap="deleteAll">
						<text class="cuIcon-delete"></text>
						<text>清空购物车</text>
					</view>
				</view>
				<view class="block cart-list">
					<checkbox-group class="block" v-if="cartList.length">
						<view class="collect-list x-start" v-for="(g, index) in cartList" :key="index">
							<view class="x-c" style="height: 200rpx;" @tap="onSel(index, g.checked)">
								<checkbox :checked="g.checked" :class="{ checked: g.checked }" class="goods-radio round orange"></checkbox>
							</view>
							<shopro-mini-card :detail="g.goods" :sku="g.sku_price" :type="'sku'">
								<block slot="goodsBottom">
									<view class="x-bc price-box">
										<view class="price">￥{{ g.sku_price.price }}</view>
										<view class="num-step">
											<uni-number-box @change="onChangeNum($event, g, index)" v-model="g.goods_num" :step="1" :min="0"></uni-number-box>
										</view>
									</view>
								</block>
							</shopro-mini-card>
						</view>
					</checkbox-group>
				</view>
			</view>
		</view>
		<!-- 规格 -->
		<sh-takeout-sku v-if="goodsInfo.id" v-model="showSku" :goodsInfo="goodsInfo" :buyType="'cart'"></sh-takeout-sku>
		<!-- 遮罩 -->
		<view class="mask" @tap="hideCartList" v-if="takeoutTotalCount.totalNum && showCartList"></view>
	</view>
</template>

<script>
import shTakeoutSku from './sh-takeout-sku.vue';
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {
		shTakeoutSku
	},
	data() {
		return {
			currentTab: 0,
			scroll_leftId: 'left_0',
			scroll_rightId: 'right_0',
			isScroll: true,
			isTap: true,
			categoryData: {}, //商品分类数据
			showSku: true, //是否显示规格弹窗
			goodsInfo: {}, //点击商品详情
			showCartList: false
		};
	},
	computed: {
		...mapState({
			cartNum: state => state.cart.cartNum,
			cartList: state => state.cart.cartList,
			allSel: ({ cart }) => cart.allSelected
		}),
		...mapGetters(['totalCount', 'takeoutTotalCount', 'isSel']),
		// 购物车检测
		checkCart() {
			let obj = {};
			this.cartList.forEach(item => {
				obj[item.goods_id] = {
					num: item.goods_num,
					cartOrderId: item.id
				};
			});
			return obj;
		}
	},
	mounted() {
		this.getCategory();
		this.getCartList();
		// this.$store.commit('getAllSellectCartList', true); //列表全选
	},
	methods: {
		...mapActions(['getCartList', 'changeCartList', 'addCartGoods', 'getAllSellectCartList']),
		...mapMutations(['changeAllSellect']),
		// 显示购物车列表
		onShowCartList() {
			if (!this.takeoutTotalCount.totalNum) return;
			this.showCartList = !this.showCartList;
		},
		hideCartList() {
			this.showCartList = false;
		},
		// 全选
		onAllSel() {
			let that = this;
			that.$store.commit('changeAllSellect'); //按钮切换全选。
			that.$store.commit('getAllSellectCartList', that.allSel); //列表全选
		},
		// 单选
		onSel(index, flag) {
			let that = this;
			that.$store.commit('selectItem', { index, flag });
		},
		// 清空购物车
		deleteAll() {
			let that = this;
			let { cartList } = this;
			let selectedIdsArray = [];
			cartList.map(item => {
				if (item.checked) {
					selectedIdsArray.push(item.id);
				}
			});
			this.changeCartList({ ids: selectedIdsArray, art: 'delete' });
		},
		// 加入购物车
		addCart(goods) {
			let obj = {
				goods_id: goods.goods_id,
				goods_num: 1,
				sku_price_id: goods.id,
				goods_price: goods.price
			};
			let confirmGoodsList = {
				list: [obj],
				from: 'goods'
			};
			this.addCartGoods(confirmGoodsList).then(res => {
				if (res.code === 1) {
					this.$tools.toast(res.msg);
				}
			});
		},
		// 更改商品数
		onChangeNum(e, goods) {
			if (e != this.checkCart[goods.goods_id].num) {
				this.changeCartList({ ids: [this.checkCart[goods.goods_id].cartOrderId], goodsNum: e, art: 'change' });
				this.getCartList();
			}
		},
		// 检测是否为购物车商品
		isCart(id) {
			let goodsId = id + '';
			return Object.keys(this.checkCart).includes(goodsId);
		},
		// 结算
		onPay() {
			let that = this;
			let { cartList } = this;
			let confirmcartList = [];
			if (this.isSel) {
				this.cartList.forEach(item => {
					if (item.checked) {
						confirmcartList.push({
							goods_id: item.goods_id,
							goods_num: item.goods_num,
							sku_price_id: item.sku_price_id,
							goods_price: item.sku_price.price
						});
					}
				});
				that.jump('/pages/order/confirm', { goodsList: JSON.stringify(confirmcartList), from: 'cart' });
			}
		},
		// 添加购物车
		selSku(info) {
			this.showSku = true;
			this.getGoodsDetail(info.id);
		},
		// 商品详情
		getGoodsDetail(id) {
			let that = this;
			that.$api('goods.detail', {
				id: id
			}).then(res => {
				if (res.code === 1) {
					that.goodsInfo = res.data;
				}
			});
		},
		// 获取分类
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
// 购物车列表
.mask {
	position: fixed;
	background: rgba(#000, 0.3);
	width: 100%;
	height: 100%;
}
.hide-cart-list {
	transform: scaleY(0);
	transform-origin: center bottom;
	transition: all linear 0.1s;
}
.cart-list-box {
	position: absolute;
	width: 750rpx;
	bottom: 80rpx;
	background: #fff;
	height: 700rpx;
	z-index: 66;
	transform-origin: center bottom;
	transition: all linear 0.1s;
	border-radius: 20rpx 20rpx 0 0;
	.cart-list__head {
		height: 90rpx;
		border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);
		.check-all {
			font-size: 28rpx;
			.check-all-radio {
				transform: scale(0.7);
				color: #e9b564;
			}
		}
		.delete-box {
			font-size: 26rpx;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			.cuIcon-delete {
				font-size: 30rpx;
				margin-right: 10rpx;
			}
		}
	}
	// 购物车列表
	.block {
		flex: 1;
		overflow-y: auto;
	}
	.collect-list {
		padding: 30rpx 20rpx;
		background: #fff;
		margin-bottom: 20rpx;

		/deep/ .goods-title {
			width: 420rpx !important;
		}

		.tag-box {
			.tag1 {
				line-height: 36rpx;
				padding: 0 8rpx;
				font-size: 18rpx;
				color: rgba(#fff, 0.9);
				background: #f39800;
				display: inline-block;
				box-sizing: border-box;
			}

			.tag2 {
				line-height: 34rpx;
				padding: 0 8rpx;
				font-size: 18rpx;
				color: rgba(#f39800, 0.9);
				background: #fff;
				border-top: 1rpx solid #f39800;
				border-right: 1rpx solid #f39800;
				border-bottom: 1rpx solid #f39800;
				display: inline-block;
				box-sizing: border-box;
			}
		}

		.goods-radio {
			transform: scale(0.7);
			margin-right: 20rpx;
			// background:  #E9B564;
		}

		.price-box {
			width: 420rpx;

			.price {
				color: #e1212b;
			}
		}
	}
}
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
			z-index: 88;
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
					right: 0rpx;
					padding: 0;
					.cuIcon-roundaddfill {
						color: #e6b873;
						font-size: 40rpx;
					}
				}
				.sel-sku {
					width: 100rpx;
					height: 40rpx;
					background: rgba(230, 184, 115, 1);
					border-radius: 20rpx;
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(250, 253, 253, 1);
				}
				.num-step {
					/deep/.uni-numbox__value {
						width: 32rpx;
					}
				}
			}
		}
	}
}
</style>
