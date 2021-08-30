<template>
	<!-- 规格 -->
	<view class="cu-modal bottom-modal" @touchmove.stop.prevent="" :class="{ show: showModal }" @tap.stop="showModal = false" v-if="goodsInfo.sku_price">
		<view class="cu-dialog" @tap.stop style="border-radius: 30rpx 30rpx 0 0;">
			<view class="shop-modal page_box" :style="goodsInfo.is_sku == 0 ? 'height:700rpx' : ''">
				<text class="u-iconfont uicon-close-circle-fill close-icon" @tap.stop="showModal = false"></text>
				<!-- 商品卡片-->
				<view class="top u-flex modal-head__box">
					<image class="shop-img" :src="currentSkuPrice.image ? currentSkuPrice.image : goodsInfo.image" mode="aspectFill"></image>
					<view class=" goods-box u-flex-col u-row-between">
						<view class="goods-title u-ellipsis-2">{{ goodsInfo.title }}</view>
						<view class="u-flex u-row-between goods-bottom">
							<view class="price-box u-flex">
								<view v-if="goodsType === 'score'">{{ currentSkuPrice.price_text || goodsInfo.price }}</view>
								<view v-else-if="grouponBuyType === 'groupon'">
									￥{{ currentSkuPrice.groupon_price || (goodsInfo.activity_type === 'groupon' ? goodsInfo.groupon_price : goodsInfo.price) }}
								</view>
								<view v-else>￥{{ currentSkuPrice.price || goodsInfo.price }}</view>
							</view>
							<text class="stock">库存{{ currentSkuPrice.stock || goodsInfo.stock }}件</text>
						</view>
					</view>
				</view>

				<!-- 规格选项 -->
				<scroll-view scroll-y class="content_box">
					<view class="select-box u-flex-col u-row-left" v-for="(s, x) in skuList" :key="s.id">
						<view class="type-title u-flex">{{ s.name }}</view>
						<view class="tag-box u-flex u-flex-wrap">
							<button
								class="tag u-reset-button"
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

					<!-- 计步器 -->
					<view class="buy-num-box u-flex u-row-between">
						<view class="num-title">购买数量</view>
						<u-number-box v-model="goodsNum" :min="1" :step="1" :max="maxStep" disabled-input @plus="plus" @change="changeNum"></u-number-box>
					</view>
				</scroll-view>

				<!-- 功能按钮 -->
				<view class="btn-box foot_box u-flex u-row-between" v-if="buyType === 'cart' || buyType === 'buy'">
					<button class="u-reset-button cu-btn save-btn" v-if="(activityRules && activityRules.status === 'ing') || !goodsInfo.activity_type" @tap="confirm">确认</button>
					<button class="u-reset-button cu-btn cancel-btn" v-if="activityRules && activityRules.status !== 'ing' && goodsInfo.activity_type" @tap="confirm">确定</button>
				</view>
				<view class="btn-box foot_box u-flex u-row-between" v-else>
					<button class="u-reset-button cu-btn  cart-btn" @tap="confirmCart">加入购物车</button>
					<button class="u-reset-button cu-btn  buy-btn" @tap="confirmBuy">立即购买</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 多规格组件
 * @property {Object} goodsInfo - 商品数据
 * @property {Boolean} value = showModal - 显隐
 * @property {String} buyType  - 购买方式
 * @property {String} goodsType - 商品类别
 * @property {String} grouponBuyType -拼团商品购买方式
 * @property {Number} grouponId - 拼团ID,分享进入
 * @property {Object} activityRules - 活动状态。
 */
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			maxStep: 999999,
			skuList: [],
			currentSkuPrice: {},
			currentSkuArray: [],
			goodsNum: 1,
			confirmGoodsInfo: {},
			type: this.buyType
		};
	},
	props: {
		goodsInfo: {},
		activityRules: {},
		value: {},
		buyType: {
			type: String,
			default: 'sku'
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
			this.maxStep = this.skuPrice[0].stock;
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
				val ? uni.hideTabBar() : uni.showTabBar();
				this.$emit('input', val);
				return val;
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
			this.goodsNum = 1; //选择规格时，数量重置为1.
			this.maxStep = 999999; //选择其他规格时，取消上个规格库存限制

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
			this.changeDisabled(false);
		},
		// 增加
		plus(e) {
			if (e.value >= this.currentSkuPrice.stock) {
				this.maxStep = this.currentSkuPrice.stock;
				this.$u.toast('库存不足');
				return;
			}
			if (this.goodsInfo.activity_type === 'seckill' || this.goodsInfo.activity_type === 'groupon') {
				let rules = this.goodsInfo.activity.rules;
				if (rules.limit_buy != 0 && e.value >= rules.limit_buy) {
					this.maxStep = rules.limit_buy;
					this.$u.toast('本次活动最多购买' + rules.limit_buy + '件');
					return;
				}
			}
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
						that.showModal = false;
						that.$u.toast(res.msg);
					}
				});
			}
		},
		// 立即购买
		confirmBuy() {
			let that = this;
			that.showModal = false;
			if (this.confirmSku()) {
				let confirmGoodsList = [];
				confirmGoodsList.push(that.confirmGoodsInfo);
				that.jump('/pages/order/confirm', {
					goodsList: confirmGoodsList,
					from: 'goods',
					orderType: that.goodsType,
					grouponBuyType: that.grouponBuyType,
					grouponId: that.grouponId
				});
			}
		},
		// 确定
		confirm() {
			if (this.confirmSku()) {
				switch (this.buyType) {
					case 'cart':
						this.confirmCart();
						break;
					case 'buy':
						this.confirmBuy();
						break;
					default:
				}
			}
		},
		// 确定规格
		confirmSku() {
			let that = this;
			if (that.currentSkuPrice.stock == 0 || that.currentSkuPrice.stock < that.goodsNum) {
				that.$u.toast('库存不足');
				that.showModal = false;
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
					that.$u.toast('请选择规格');
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

<style lang="scss" scoped>
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
}

// 规格
.shop-modal {
	width: 750rpx;
	height: 950rpx;
	background: rgba(255, 255, 255, 1);
	padding: 20rpx 20rpx 30rpx;
	position: relative;
	.close-icon {
		font-size: 34rpx;
		color: #e0e0e0;
		position: absolute;
		top: 20rpx;
		right: 20rpx;
	}
	// 商品卡片
	.top {
		margin: 30rpx 0;
		border-radius: 20rpx;
		padding: 20rpx;

		.shop-img {
			width: 160upx;
			height: 160upx;
			border-radius: 6upx;
			margin-right: 30upx;
			background: #ccc;
		}

		.goods-box {
			height: 160upx;
			width: 490rpx;
			align-items: flex-start;

			.goods-title {
				font-size: 28rpx;

				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				line-height: 42rpx;
				text-align: left;
			}

			.goods-bottom {
				width: 100%;
			}

			.price-box {
				font-size: 36upx;

				font-weight: bold;
				color: #e1212b;

				.unit {
					font-size: 24upx;

					font-weight: bold;
					color: #e1212b;
				}
			}

			.stock {
				font-size: 26rpx;
				color: #999;
			}
		}
	}

	// 规格选项
	.select-box {
		margin-bottom: 30rpx;
		.type-title {
			font-size: 26upx;
			font-weight: 400;
			margin-bottom: 20upx;
		}
		.tag-box {
			flex-wrap: wrap;
		}
		.tag {
			line-height: 62rpx;
			background: #f4f4f4;
			border-radius: 31rpx;
			font-size: 28upx;
			font-weight: 400;
			color: #666666;
			padding: 0 30upx;
			margin-bottom: 20rpx;
			margin-right: 10rpx;
		}

		.tag-active {
			background: linear-gradient(90deg, #e9b461, #eecc89);
			font-size: 28rpx;
			font-weight: 400;
			color: #ffffff;
		}

		.tag-disabled {
			background: #f8f8f8;
			color: #cacaca;
		}
	}

	.buy-num-box {
		.num-title {
			font-size: 26upx;

			font-weight: 400;
			margin-bottom: 20upx;
		}
	}
}

.btn-box {
	height: 100rpx;

	.cu-btn {
		width: 340rpx;
		line-height: 70rpx;
		border-radius: 35rpx;
		font-size: 28rpx;

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
	}
	.save-btn {
		width: 710rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		font-size: 28rpx;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		border-radius: 35rpx;
		padding: 0;
	}
	.cancel-btn {
		width: 710rpx;
		height: 70rpx;
		background: rgba(221, 221, 221, 1);
		font-size: 28rpx;
		font-weight: 500;
		color: #999999;
		border-radius: 35rpx;
		padding: 0;
	}
}
</style>
