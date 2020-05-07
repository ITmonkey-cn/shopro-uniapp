<template>
	<view class="page_box">
		<view class="head_box" v-if="cartList.length">
			<view class="safety-box x-f" v-if="false">
				<text class="cuIcon-safe"></text>
				<text>无忧退换，让你的购物体验简单省心</text>
			</view>
			<view class="tip-box x-f" v-if="false">
				<text class="tag">全场满额减</text>
				再购154.10元立享每满400元减20元 >
			</view>
			<view class="tool-box x-bc">
				<view class="count-box">
					共
					<text class="all-num">{{ cartList.length }}</text>
					件商品
				</view>
				<button class="cu-btn set-btn" @tap="onSet">{{ isTool ? '完成' : '编辑' }}</button>
			</view>
		</view>
		<view class="content_box">
			<checkbox-group class="block" v-if="cartList.length" @change="onSel">
				<view class="collect-list x-start" v-for="(g, index) in cartList" :key="index">
					<view class="x-c" style="height: 200rpx;">
						<checkbox :value="index.toString()" :checked="g.checked" :class="{ checked: g.checked }" class="goods-radio round orange"></checkbox>
					</view>
					<shopro-mini-card :detail="g.goods" :sku="g.sku_price" :type="'sku'">
						<block slot="goodsBottom">
							<view class="x-bc price-box">
								<view class="price">￥{{ g.sku_price.price }}</view>
								<view class="num-step"><uni-number-box @change="onChangeNum($event, g, index)" :value="g.goods_num" :step="1" :min="1"></uni-number-box></view>
							</view>
						</block>
					</shopro-mini-card>
				</view>
			</checkbox-group>
			<view class="empty-box x-c" v-else><shopro-empty :emptyData="emptyData"></shopro-empty></view>
		</view>
		<view class="foot_box " v-if="cartList.length">
			<view class="tools-box x-bc">
				<label class="check-all x-f" @tap="onAllSel">
					<radio :checked="allSel" :class="{ checked: allSel }" class="check-all-radio orange"></radio>
					<text>全选</text>
					<text>（{{ selList.length }}）</text>
				</label>
				<view class="x-f">
					<view class="price" v-if="!isTool && allMoney">￥{{ allMoney }}</view>
					<button class="cu-btn pay-btn" :disabled="!Boolean(selList.length)" v-show="!isTool" @tap="onPay">结算</button>
					<button class="cu-btn del-btn" v-show="isTool" @tap="goodsDelete">删除</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import shoproMiniCard from '@/components/goods/shopro-mini-card.vue';
import uniNumberBox from '@/components/uni-number-box.vue';
import shoproEmpty from '@/components/shopro-empty.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
let timer = null;
export default {
	components: {
		shoproMiniCard,
		uniNumberBox,
		shoproEmpty
	},
	data() {
		return {
			isTool: false,
			allSel: false,
			selList: [],
			emptyData: {
				img: '/static/imgs/empty/emptyCart.png',
				tip: '购物车空空如也,快去逛逛吧~'
			}
		};
	},
	computed: {
		cartList: {
			get() {
				return this.$store.state.cart.cartList;
			},
			set(newVal) {
				return newVal;
			}
		},
		allMoney() {
			let price = 0;
			this.cartList.forEach(p => {
				if (p.checked) {
					price += +p.sku_price.price * p.goods_num;
				}
			});
			return price.toFixed(2);
		}
	},
	onLoad() {
		this.init();
	},
	onShow() {},
	onHide() {
		this.allSel = false;
		this.isTool = false;
		this.getCartList();
	},
	methods: {
		...mapActions(['addCartGoods', 'getCartList']),
		// INIT
		init() {
			return Promise.all([this.getCartList()]);
		},
		onChangeNum(e, g, index) {
			if (g.goods_num !== e) {
				this.asyncCart([g.id], e, 'change');
				this.$set(this.cartList[index], 'goods_num', +e);
			}
		},
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		onSel(e) {
			let { cartList } = this;
			let values = e.detail.value;
			cartList.forEach((i, index) => {
				if (values.includes(index.toString())) {
					this.$set(i, 'checked', true);
				} else {
					this.$set(i, 'checked', false);
				}
			});
			this.selList = values;
			if (this.selList.length < cartList.length) {
				this.allSel = false;
			} else {
				this.allSel = true;
			}
		},
		onSet() {
			this.isTool = !this.isTool;
		},
		onAllSel() {
			this.allSel = !this.allSel;
			this.selList = [];
			this.cartList.forEach((i, index) => {
				if (this.allSel) {
					this.$set(i, 'checked', true);
					this.selList.push(index);
				} else {
					this.$set(i, 'checked', false);
					this.selList = [];
				}
			});
		},
		// 结算
		onPay() {
			let that = this;
			if (this.selList.length !== 0) {
				let confirmcartList = [];
				this.selList.forEach(c => {
					confirmcartList.push({
						goods_id: this.cartList[c].goods_id,
						goods_num: this.cartList[c].goods_num,
						sku_price_id: this.cartList[c].sku_price_id,
						goods_price: this.cartList[c].sku_price.price
					});
				});
				that.jump('/pages/order/confirm', { goodsList: JSON.stringify(confirmcartList), from: 'cart' });
			}
		},
		asyncCart(cartIdsArray, value, act = 'change') {
			this.$api('cart.edit', {
				cart_list: cartIdsArray,
				value: value || null,
				act: act
			}).then(res => {
				if (act === 'delete' && res.code === 1) {
					if (this.allSel) {
						this.$store.commit('CART_LIST', []);
					} else {
						this.selList.forEach(index => {
							this.cartList.splice(index, 1);
						});
					}
					this.getCartList();
				}
			});
		},
		// 删除
		goodsDelete() {
			let that = this;
			let selectedIdsArray = [];
			this.selList.forEach(index => {
				selectedIdsArray.push(that.cartList[index].id);
			});
			this.asyncCart(selectedIdsArray, null, 'delete');
		}
	}
};
</script>

<style lang="scss">
.head_box {
	.safety-box {
		height: 80rpx;
		font-size: 24rpx;
		padding: 0 30rpx;
		background: #f7f5f6;

		.cuIcon-safe {
			font-size: 32rpx;
			margin-right: 16rpx;
		}
	}

	.tip-box {
		font-size: 26rpx;
		color: #999;
		height: 90rpx;
		padding: 0 30rpx;
		background: #fff;

		.tag {
			border: 1rpx solid rgba(168, 112, 13, 1);
			border-radius: 2rpx;
			padding: 0 10rpx;
			line-height: 40rpx;
			font-size: 26rpx;
			color: #a8700d;
			margin-right: 20rpx;
		}
	}

	.tool-box {
		height: 90rpx;
		padding: 0 30rpx;
		background: #f7f5f6;

		.count-box {
			font-size: 26rpx;
			color: #999;

			.all-num {
				color: #a8700d;
			}
		}

		.set-btn {
			background: none;
			font-size: 26rpx;
			color: #a8700d;
		}
	}
}

// 空白页
.empty-box {
	flex: 1;
	width: 100%;
	height: 100%;
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

.tools-box {
	height: 100rpx;
	width: 750rpx;
	padding: 0 20rpx;
	background: #fff;

	.check-all {
		font-size: 26rpx;

		.check-all-radio {
			transform: scale(0.7);
			color: #e9b564;
		}
	}

	.price {
		color: #e1212b;
		font-size: 500;
		margin-right: 30rpx;
	}

	.pay-btn {
		width: 200rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		border-radius: 35rpx;
		padding: 0;
		color: rgba(#fff, 0.9);
	}

	.del-btn {
		width: 200rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(244, 71, 57, 1) 0%, rgba(255, 102, 0, 1) 100%);
		border-radius: 35rpx;
		padding: 0;
		color: rgba(#fff, 0.9);
	}
}
</style>
