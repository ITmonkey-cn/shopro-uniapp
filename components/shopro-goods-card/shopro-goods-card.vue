<template>
	<!-- m -->
	<view class="goods-box" @tap="click">
		<view class="img-box"><u-image ref="uImage" :width="345" :height="345" :src="image" mode="aspectFill"></u-image></view>
		<view class="goods-bottom u-p-14" :style="type ? 'background-image: url(' + $IMG_URL + typeMap[type].goodsBg + ')' : ''">
			<view class="title u-ellipsis-2 u-m-b-10">
				<u-tag
					class="title-tag u-m-r-10"
					v-if="type"
					:text="typeMap[type].text"
					size="mini"
					:bg-color="typeMap[type].tagBg"
					:border-color="typeMap[type].tagBg"
					color="#fff"
				/>
				{{ title }}
			</view>
			<view class="sub-title u-ellipsis-1 u-m-b-10" v-show="subtitle">{{ subtitle }}</view>
			<view class="u-m-b-20">
				<u-tag
					class="u-m-t-10  u-m-r-10"
					v-for="(item, index) in tagTextList"
					:key="index"
					:text="item"
					size="mini"
					bg-color="#fff"
					border-color="#FF0000"
					color="#FF0000"
				/>
			</view>

			<slot name="cardBottom">
				<view class="u-flex u-col-center u-row-between">
					<view class="price-box font-OPPOSANS">
						<view class="price u-m-b-10">{{ price }}</view>
						<view class="origin-price">￥{{ originPrice }}</view>
					</view>
					<!-- 加入购物车 -->
					<view class="cart-box">
						<!-- 单规格 -->
						<view class="" v-if="!detail.is_sku">
							<button class="u-reset-button cart-btn u-flex u-col-center u-row-center" v-if="!isCart(detail.id)" @tap.stop="addCart(detail.sku_price[0])">
								<u-icon name="shopping-cart-fill" size="32" color="#fff"></u-icon>
							</button>
							<view class="num-step" v-else>
								<u-number-box
									:value="checkCart[detail.id].num"
									:min="0"
									:step="1"
									:max="detail.sku_price[0].stock"
									disabled-input
									@min="onMin"
									@plus="plus($event, detail.sku_price[0])"
									@change="onChangeNum($event, detail.sku_price[0])"
								></u-number-box>
							</view>
						</view>
						<!-- 多规格 -->
						<button class="u-reset-button item-btn cart-btn  u-flex u-col-center u-row-center" @tap.stop="selSku(detail)" v-else>
							<u-icon name="shopping-cart-fill" size="32" color="#fff"></u-icon>
						</button>
					</view>
				</view>
			</slot>
		</view>
		<!-- 规格弹窗 -->
		<shopro-sku v-if="showSku && goodsInfo.id" v-model="showSku" :goodsInfo="goodsInfo" buyType="cart"></shopro-sku>
	</view>
</template>

<script>
/**
 *shoproGoodsCard - 商品列表卡片
 * @property {Object} detail - 商品详情
 * @property {String} type - 商品类型
 * @property {String} image - 商品图片
 * @property {String} title - 商品标题
 * @property {String} subtitle - 商品副标题
 * @property {String | Number} price - 商品价格
 * @property {String | Number} originPrice - 商品原价
 * @property {String | Number} sales - 商品销量
 * @property {Array} tagTextList - 活动标签
 * @event {Function} click 商品被点击
 */
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			maxStep: 999999,
			showSku: false,
			goodsInfo: {}, //商品详情
			typeMap: {
				seckill: {
					text: '秒杀',
					tagBg: '#FF5854',
					goodsBg: '/imgs/tag/seckill_y_bg.png'
				},
				groupon: {
					text: '拼团',
					tagBg: '#FE832A',
					goodsBg: '/imgs/tag/groupon_y_bg.png'
				}
			}
		};
	},
	computed: {
		...mapState({
			cartList: ({ cart }) => cart.cartList,
			checkCart: ({ cart }) => cart.checkCart
		})
	},
	props: {
		detail: {
			type: Object,
			default: () => {
				return {};
			}
		},
		type: {
			type: String,
			default: ''
		},
		image: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
		subtitle: {
			type: String,
			default: ''
		},
		price: {
			type: [String, Number],
			default: ''
		},
		originPrice: {
			type: [String, Number],
			default: ''
		},
		sales: {
			type: [String, Number],
			default: ''
		},
		tagTextList: {
			type: Array,
			default: () => []
		}
	},
	methods: {
		...mapActions(['getCartList', 'changeCartList', 'addCartGoods']),
		//点击商品
		click() {
			this.$emit('click');
		},

		// 检测是否为购物车商品
		isCart(id) {
			return Object.keys(this.checkCart).includes(id + '');
		},

		// 检测商品在购物车中的下标
		checkGoodsIndex(id) {
			let cIndex = 0;
			this.cartList.forEach((item, index) => {
				if (id == item.goods_id) {
					cIndex = index;
				}
			});
			return cIndex;
		},

		// 更改商品数
		async onChangeNum(e, sku) {
			this.maxStep = sku.stock;
			let gIndex = this.checkGoodsIndex(sku.goods_id);
			if (e.value != this.checkCart[sku.goods_id].num) {
				uni.showLoading({
					mask: true
				});
				this.$set(this.cartList[gIndex], 'goods_num', +e.value);
				await this.changeCartList({
					ids: [this.checkCart[sku.goods_id].cartOrderId],
					goodsNum: +e.value,
					art: 'change'
				});

				await uni.hideLoading();
			}
		},

		// 到达最小值
		onMin() {
			const that = this;
			let cartGoodId = 0;
			cartGoodId = this.cartList.filter(item => item.goods_id === that.detail.id)[0].id;
			uni.showModal({
				title: '删除提示',
				confirmColor: '#f0c785',
				content: `是否确认从购物车中删除此商品?`,
				success: res => {
					res.confirm && this.changeCartList({ ids: [cartGoodId], art: 'delete' });
				}
			});
		},

		// 增加
		plus(e, sku) {
			if (e.value >= sku.stock) {
				this.$u.toast('库存不足');
				return;
			}
			if (this.detail.activity_type === 'seckill' || this.detail.activity_type === 'groupon') {
				let rules = this.detail.activity.rules;
				if (rules.limit_buy != 0 && e.value >= rules.limit_buy) {
					this.$u.toast('本次活动最多购买' + rules.limit_buy + '件');
					return;
				}
			}
		},

		// 添加购物车,多规格
		async selSku(info) {
			if (this.detail.activity_type) {
				this.$Router.push({ path: '/pages/goods/detail', query: { id: this.detail.id } });
				return;
			}
			this.goodsInfo = {};
			this.getGoodsDetail(info.id);
			this.showSku = true;
		},

		// 商品详情
		getGoodsDetail(id) {
			let that = this;
			that.$http('goods.detail', {
				id: id
			}).then(res => {
				if (res.code === 1) {
					that.goodsInfo = res.data;
				}
			});
		},

		// 加入购物车
		addCart(sku) {
			if (sku.stock <= 0) {
				this.$u.toast('库存不足');
				return;
			}
			if (this.detail.activity_type) {
				this.$Router.push({ path: '/pages/goods/detail', query: { id: this.detail.id } });
				return;
			}
			let confirmGoodsList = {
				list: [
					{
						goods_id: sku.goods_id,
						goods_num: 1,
						sku_price_id: sku.id,
						goods_price: sku.price
					}
				],
				from: 'goods'
			};
			this.addCartGoods(confirmGoodsList).then(res => {
				if (res.code === 1) {
					this.$u.toast(res.msg);
				}
			});
		}
	}
};
</script>

<style lang="scss">
.goods-bottom {
	background-size: 100% 100%;
	background-position: bottom center;
	background-repeat: no-repeat;
}
.goods-box {
	width: 345rpx;
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;

	.img-box {
		width: 345rpx;
		height: 345rpx;
		overflow: hidden;
		position: relative;
		background-color: #fff;
		.img {
			width: 345rpx;
			height: 345rpx;
			background-color: #ccc;
		}
	}

	.title {
		width: 330rpx;
		vertical-align: center;
		font-size: 28rpx;
		font-weight: bold;
		line-height: 40rpx;
		color: #333333;
		padding-top: 6rpx;

		.title-tag {
			transform: scale(0.9);
			position: relative;
			top: -6rpx;
		}
	}

	.sub-title {
		font-size: 24rpx;
		font-weight: 400;
		width: 330rpx;
		color: #999999;
	}
	.price-box {
		.price {
			font-size: 30rpx;
			color: #ff3000;
			font-weight: 600;
			&::before {
				content: '￥';
				font-size: 24rpx;
			}
		}
		.origin-price {
			font-size: 26rpx;
			font-weight: 400;
			text-decoration: line-through;
			color: #c4c4c4;
		}
		.sales-box {
			font-size: 18rpx;

			font-weight: 400;
			color: #c4c4c4;
			line-height: 20rpx;
		}
	}
	// 购物车
	.cart-box {
		.cart-btn {
			width: 54rpx;
			height: 54rpx;
			border-radius: 50%;
			padding: 0;
			background: linear-gradient(90deg, #e9b461, #eecc89);
		}
	}
}
</style>
