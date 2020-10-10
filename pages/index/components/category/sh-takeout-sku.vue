<template>
	<view class="">
		<!-- 规格 -->
		<view class="cu-modal sku-modal" style="z-index: 999;" :class="{ show: showModal }" @tap="hideModal" v-if="goodsInfo.sku_price">
			<view class="cu-dialog" @tap.stop style="background: none;">
				<view class="shop-modal page_box" :style="goodsInfo.is_sku == 0 ? 'height:500rpx' : ''">
					<view @tap="hideModal" class="close-btn x-c"><text class="cuIcon-close"></text></view>

					<!-- 商品信息 -->
					<view class="top y-start modal-head__box">
						<view class="shop-img-box"><image class="shop-img" :src="currentSkuPrice.image ? currentSkuPrice.image : goodsInfo.image" mode="aspectFill"></image></view>
					</view>
					<!-- 选择规格 -->
					<view class="content_box flex-sub px20">
						<view class="y-bc goods-box">
							<view class="goods-title more-t">{{ goodsInfo.title }}</view>
							<view class="sub-title" v-if="goodsInfo.subtitle">{{ goodsInfo.subtitle }}</view>
							<view class="stock">销量{{ currentSkuPrice.sales || goodsInfo.sales }}份</view>
						</view>
						<view class="select-box y-start" v-for="(s, x) in skuList" :key="s.id">
							<view class="type-title">{{ s.name }}</view>
							<view class="tag-box x-f">
								<button
									class="tag cu-btn"
									v-for="(sc, y) in s.content"
									:key="sc.id"
									:class="{ 'tag-active': currentSkuArray[sc.pid] == sc.id, 'tag-disabled': sc.disabled == true }"
									:disabled="sc.disabled == true"
									@tap="chooseSku(sc.pid, sc.id)"
								>
									{{ sc.name }}
								</button>
							</view>
						</view>
					</view>
					<view class="btn-box foot_box pa20">
						<view class="buy-num-box x-bc">
							<view class="price-box">
								<text class="price">{{ currentSkuPrice.price || goodsInfo.price }}</text>
								<text class="origin-price">￥{{ goodsInfo.original_price }}</text>
							</view>
							<view class="num-step">
								<uni-number-box
									@change="changeNum"
									:step="1"
									:min="0"
									:currentSkuPrice.sync="currentSkuPrice"
									:goodsInfo="goodsInfo"
									:value="goodsNum"
								></uni-number-box>
							</view>
						</view>
						<button class="cu-btn  seckill-btn" @tap="confirm">加入购物车</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	name: 'shoproSku',
	components: {
		uniNumberBox
	},
	data() {
		return {
			skuList: [],
			currentSkuPrice: {},
			currentSkuArray: [],
			goodsNum: 1,
			confirmGoodsInfo: {},
			type: 'cart'
		};
	},
	props: {
		goodsInfo: {},
		value: {},
		buyType: {
			type: String,
			default: 'cart'
		},
		goodsType: {
			type: String,
			default: 'goods'
		},
		grouponBuyType: {
			type: String,
			default: 'alone'
		},
		grouponId: {
			//参加拼团的时候，传入当前团id;
			type: Number,
			default: 0
		}
	},
	created() {
		this.skuList = this.goodsInfo.sku;
		this.changeDisabled(false);
	},
	mounted() {
		// 单规格选项
		if (!this.goodsInfo.is_sku) {
			this.currentSkuPrice = this.skuPrice[0];
		}
	},
	watch: {
		type(nweVal, oldVal) {
			return newVal;
		}
	},
	computed: {
		skuPrice() {
			return this.goodsInfo.sku_price;
		},
		showModal: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			}
		},
		currentSkuText() {
			let that = this;
			let str = '';
			let currentSkuArray = this.currentSkuArray;
			currentSkuArray.forEach(v => {
				that.skuList.forEach(s => {
					s.content.forEach(u => {
						if (u.id === v) {
							str += ' ' + u.name;
						}
					});
				});
			});
			that.$emit('getSkuText', str);
			return str;
		}
	},

	methods: {
		...mapActions(['addCartGoods', 'getCartList']),
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 选择规格
		chooseSku(pid, skuId) {
			let that = this;
			let isChecked = true; // 选中 or 取消选中

			if (that.currentSkuArray[pid] != undefined && that.currentSkuArray[pid] == skuId) {
				// 点击已被选中的，删除并填充 ''
				isChecked = false;
				that.currentSkuArray.splice(pid, 1, '');
			} else {
				// 选中
				that.$set(that.currentSkuArray, pid, skuId);
			}

			let chooseSkuId = []; // 选中的规格大类
			that.currentSkuArray.forEach(sku => {
				if (sku != '') {
					// sku 为空是反选 填充的
					chooseSkuId.push(sku);
				}
			});

			// 当前所选规格下，所有可以选择的 skuPric
			let newPrice = this.getCanUseSkuPrice();

			// 判断所有规格大类是否选择完成
			if (chooseSkuId.length == that.skuList.length && newPrice.length) {
				that.currentSkuPrice = newPrice[0];
			} else {
				that.currentSkuPrice = {};
			}

			// 改变规格项禁用状态
			this.changeDisabled(isChecked, pid, skuId);
		},
		// 改变禁用状态
		changeDisabled(isChecked = false, pid = 0, skuId = 0) {
			let newPrice = []; // 所有可以选择的 skuPrice

			if (isChecked) {
				// 选中规格

				// 当前点击选中规格下的 所有可用 skuPrice
				for (let price of this.skuPrice) {
					if (price.stock <= 0) {
						// this.goodsNum 不判断是否大于当前选择数量，在 uni-number-box 判断，并且 取 stock 和 goods_num 的小值
						continue;
					}
					if (price.goods_sku_id_arr.indexOf(skuId.toString()) >= 0) {
						newPrice.push(price);
					}
				}
			} else {
				// 取消选择规格

				// 当前所选规格下，所有可以选择的 skuPric
				newPrice = this.getCanUseSkuPrice();
			}

			// 所有存在并且有库存未选择的规格项 的 子项 id
			let noChooseSkuIds = [];
			for (let price of newPrice) {
				noChooseSkuIds = noChooseSkuIds.concat(price.goods_sku_id_arr);
			}

			// 去重
			noChooseSkuIds = Array.from(new Set(noChooseSkuIds));

			if (isChecked) {
				// 去除当前选中的规格项
				let index = noChooseSkuIds.indexOf(skuId.toString());
				noChooseSkuIds.splice(index, 1);
			} else {
				// 循环去除当前已选择的规格项
				this.currentSkuArray.forEach(sku => {
					if (sku.toString() != '') {
						// sku 为空是反选 填充的
						let index = noChooseSkuIds.indexOf(sku.toString());
						if (index >= 0) {
							// sku 存在于 noChooseSkuIds
							noChooseSkuIds.splice(index, 1);
						}
					}
				});
			}

			// 当前已选择的规格大类
			let chooseSkuKey = [];
			if (!isChecked) {
				// 当前已选择的规格大类
				this.currentSkuArray.forEach((sku, key) => {
					if (sku != '') {
						// sku 为空是反选 填充的
						chooseSkuKey.push(key);
					}
				});
			} else {
				// 当前点击选择的规格大类
				chooseSkuKey = [pid];
			}

			for (let i in this.skuList) {
				// 当前点击的规格，或者取消选择时候 已选中的规格 不进行处理
				if (chooseSkuKey.indexOf(this.skuList[i]['id']) >= 0) {
					continue;
				}

				for (let j in this.skuList[i]['content']) {
					// 如果当前规格项 id 不存在于有库存的规格项中，则禁用
					if (noChooseSkuIds.indexOf(this.skuList[i]['content'][j]['id'].toString()) >= 0) {
						this.skuList[i]['content'][j]['disabled'] = false;
					} else {
						this.skuList[i]['content'][j]['disabled'] = true;
					}
				}
			}
		},
		// 当前所选规格下，获取所有有库存的 skuPrice
		getCanUseSkuPrice() {
			let newPrice = [];

			for (let price of this.skuPrice) {
				if (price.stock <= 0) {
					// || price.stock < this.goodsNum		不判断是否大于当前选择数量，在 uni-number-box 判断，并且 取 stock 和 goods_num 的小值
					continue;
				}
				var isOk = true;

				this.currentSkuArray.forEach(sku => {
					// sku 不为空，并且，这个 条 skuPrice 没有被选中,则排除
					if (sku.toString() != '' && price.goods_sku_id_arr.indexOf(sku.toString()) < 0) {
						isOk = false;
					}
				});

				if (isOk) {
					newPrice.push(price);
				}
			}

			return newPrice;
		},
		// 数量
		changeNum(e) {
			let that = this;
			this.goodsNum = +e;
			this.changeDisabled(false);
		},
		// 弹窗显示隐藏
		showSkuModal() {
			this.$emit('changeType', 'sku');
			this.showModal = true;
		},
		hideModal() {
			this.showModal = false;
		},
		// 加入购物车确定
		confirmCart() {
			let that = this;
			if (this.confirmSku()) {
				let confirmGoodsList = {
					list: [that.confirmGoodsInfo],
					from: 'goods'
				};
				that.addCartGoods(confirmGoodsList).then(res => {
					if (res.code === 1) {
						that.$tools.toast(res.msg);
					}
				});
			}
		},
		// 立即购买
		confirmBuy() {
			let that = this;
			if (this.confirmSku()) {
				let confirmGoodsList = [];
				confirmGoodsList.push(that.confirmGoodsInfo);
				that.jump('/pages/order/confirm', {
					goodsList: JSON.stringify(confirmGoodsList),
					from: 'goods',
					orderType: that.goodsType,
					grouponBuyType: that.grouponBuyType,
					grouponId: that.grouponId
				});
			}
		},
		// 确定
		confirm() {
			this.confirmSku();
			switch (this.buyType) {
				case 'cart':
					this.confirmCart();
					this.$store.commit('getAllSellectCartList',true); //列表全选
					break;
				case 'buy':
					this.confirmBuy();
					break;
				default:
			}
		},
		// 确定规格
		confirmSku() {
			let that = this;
			if (that.currentSkuPrice.stock < that.goodsNum) {
				that.$tools.toast('库存不足');
				return false;
			} else {
				that.currentSkuPrice.goods_num = that.goodsNum;
				that.confirmGoodsInfo = {
					goods_id: that.currentSkuPrice.goods_id,
					goods_num: that.currentSkuPrice.goods_num,
					sku_price_id: that.currentSkuPrice.id,
					goods_price: that.currentSkuPrice.price
				};
				if (!that.confirmGoodsInfo.sku_price_id) {
					that.$tools.toast('请选择规格');
					return false;
				} else {
					that.showModal = false;
					return true;
				}
			}
		}
	}
};
</script>

<style lang="scss">
.size-box {
	line-height: 82rpx;
	background: #fff;
	padding: 0 20rpx;
	margin: 20rpx 0;
	font-size: 28rpx;

	.title {
		color: #999;
		margin-right: 20rpx;
	}

	.cuIcon-right {
		color: #bfbfbf;
		font-size: 36rpx;
	}
}

// 规格
.shop-modal {
	height: 1080rpx;
	background: rgba(255, 255, 255, 1);
	border-radius: 10rpx;
	overflow: hidden;
	.close-btn {
		width: 48rpx;
		height: 48rpx;
		background: rgba(#000, 0.3);
		border-radius: 50%;
		border: 2rpx solid #fff;
		position: absolute;
		z-index: 11;
		top: 40rpx;
		right: 40rpx;
		opacity: 0.8;
		.cuIcon-close {
			font-size: 28rpx;
			color: #fff;
			line-height: 28rpx;
		}
	}

	.top {
		padding: 20rpx 0;
		.shop-img-box {
			width: 640rpx;
			height: 540rpx;
			border-radius: 10upx;
			overflow: hidden;
			margin: 0 auto;
			.shop-img {
				width: 640rpx;
				height: 540rpx;
				border-radius: 10upx;
				background: #ccc;
			}
		}
	}
	.goods-box {
		width: 640rpx;
		align-items: flex-start;

		.goods-title {
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 600;
			color: rgba(51, 51, 51, 1);
			line-height: 42rpx;
			text-align: left;
		}
		.sub-title {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(168, 112, 13, 1);
			line-height: 60rpx;
		}
		.goods-bottom {
			width: 100%;
		}

		.stock {
			font-size: 26rpx;
			color: #999;
			margin-bottom: 20rpx;
		}
	}

	.select-box {
		margin-bottom: 25upx;

		.type-title {
			font-size: 26upx;
			font-family: PingFang SC;
			font-weight: 600;
			margin-bottom: 20upx;
		}
		.tag-box {
			flex-wrap: wrap;
		}
		.tag {
			line-height: 62rpx;
			background: rgba(#ddd, 0.8);
			border-radius: 31rpx;
			font-size: 28upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #999;
			padding: 0 30upx;
			margin-bottom: 20rpx;
			margin-right: 10rpx;
		}

		.tag-active {
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			color: rgba(#fff, 0.9);
		}

		.tag-disabled {
			background: #f5f5f5;
		}
	}
}

// 价格数量
.buy-num-box {
	padding-bottom: 10rpx;
	.price-box {
		.price {
			font-size: 34rpx;
			font-family: OPPOSans;
			font-weight: 500;
			color: rgba(225, 33, 43, 1);
			&::before {
				content: '￥';
				font-size: 22rpx;
			}
		}
		.origin-price {
			font-size: 18rpx;
			font-family: OPPOSans;
			font-weight: 400;
			text-decoration: line-through;
			color: rgba(153, 153, 153, 1);
			margin-left: 10rpx;
		}
	}
}
.btn-box {
	min-height: 178rpx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px -4rpx 7rpx 0px rgba(175, 175, 175, 0.16);
	border-radius: 0px 0px 10rpx 10rpx;

	.cu-btn {
		width: 340rpx;
		height: 70rpx;
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.9);
		padding: 0;
	}

	.cart-btn {
		background: linear-gradient(90deg, rgba(103, 104, 105, 1), rgba(82, 82, 82, 1));
		box-shadow: 0px 2rpx 5rpx 0px rgba(102, 103, 104, 0.46);
	}

	.buy-btn {
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
	}
	.seckill-btn {
		width: 600rpx;
		height: 60rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		border-radius: 35rpx;
		padding: 0;
	}
}
</style>
