<!-- 横版大图，商品卡片 -->
<template>
	<view class="big-goods u-flex u-p-20 u-col-top u-m-b-16" @tap="click" :style="type ? 'background-image: url(' + $IMG_URL + typeMap[type].goodsBg + ')' : ''">
		<image class="goods-img" lazy-load fade-show :src="image" mode="aspectFill"></image>
		<view class=" card-right u-m-l-20 u-flex-col u-row-between">
			<view class="">
				<view class="goods-title u-ellipsis-1 u-m-t-10 u-m-b-10">
					<view v-if="type" class=" sm cu-tag radius title-tag u-m-r-10" :style="{ backgroundColor: typeMap[type].tagBg, color: '#fff' }">{{ typeMap[type].text }}</view>
					{{ title }}
				</view>
				<view v-show="subtitle" class="subtitle-text u-m-b-10 u-ellipsis-1">{{ subtitle }}</view>
			</view>

			<view class="u-m-b-20" v-if="tagTextList.length">
				<view class="tag-box u-m-r-10" v-for="(item, index) in tagTextList" :key="index">{{ item }}</view>
			</view>

			<view class=" u-flex u-row-between u-col-center">
				<view class="font-OPPOSANS">
					<view class="price">{{ price }}</view>
					<view class="origin-price">{{ originPrice }}</view>
				</view>

				<!-- 加入购物车 -->
				<view class="cart-box">
					<!-- 单规格 -->
					<view class="" v-if="!detail.is_sku">
						<button
							v-if="!isCart(detail.id)"
							@tap.stop="addCart(detail.sku_price[0])"
							class="u-reset-button buy-btn u-flex u-row-center u-col-center"
							:style="type ? typeMap[type].btnBg : ''"
						>
							{{ type ? typeMap[type].btnText : '去购买' }}
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
					<button class="u-reset-button item-btn buy-btn" :style="type ? typeMap[type].btnBg : ''" @tap.stop="selSku(detail)" v-else>
						{{ type ? typeMap[type].btnText : '去购买' }}
					</button>
				</view>
			</view>
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
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {},
	data() {
		return {
			showSku: false,
			goodsInfo: {}, //商品详情
			typeMap: {
				seckill: {
					text: '秒杀',
					tagBg: '#FF5854',
					goodsBg: '/imgs/tag/seckill_x_bg.png',
					btnText: '去抢购',
					btnBg: 'background: linear-gradient(90deg, #D01325, #ED3C30);'
				},
				groupon: {
					text: '拼团',
					tagBg: '#FE832A',
					goodsBg: '/imgs/tag/groupon_x_bg.png',
					btnText: '马上拼',
					btnBg: 'background: linear-gradient(90deg, #FF6600 0%, #FE832A 100%);'
				}
			}
		};
	},
	computed: {
		...mapGetters(['cartList', 'checkCart'])
	},
	props: {
		detail: {
			type: Object,
			default: () => {
				return {};
			}
		},
		type: {
			type: [String,null],
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
	mounted() {},
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
// 大商品卡片
.big-goods {
	width: 710rpx;
	min-height: 260rpx;
	background: #ffffff;
	border-radius: 20rpx;
	background-repeat: no-repeat;
	background-size: 100% 100%;
	.goods-img {
		width: 260rpx;
		height: 260rpx;
		background-color: #f5f5f5;
		border-radius: 6rpx;
	}
	.card-right {
		width: 430rpx;
		height: 220rpx;
	}
	.goods-title {
		font-size: 26rpx;
		font-weight: 600;
		width: 400rpx;
		color: #000000;
		padding-top: 6rpx;

		.title-tag {
			transform: scale(0.9);
			position: relative;
			top: -6rpx;
		}
	}
	.subtitle-text {
		font-size: 22rpx;
		width: 400rpx;
		font-weight: 500;
		color: #666666;
	}
	.tag-box {
		border: 1rpx solid #ff0000;
		display: inline-block;
		font-size: 20rpx;
		line-height: 30rpx;
		padding: 0 10rpx;
		color: #ff0000;
		border-radius: 8rpx;
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
		.buy-btn {
			width: 120rpx;
			line-height: 50rpx;
			background: linear-gradient(90deg, #e9b461, #eecc89);
			border-radius: 25rpx;
			font-size: 24rpx;
			font-weight: 500;
			color: #ffffff;
		}
	}

	// 价格
	.price {
		color: #ff0000;
		font-weight: 600;
		&::before {
			content: '￥';
			font-size: 20rpx;
		}
	}
	.origin-price {
		color: #c4c4c4;
		font-size: 24rpx;
		text-decoration: line-through;
		&::before {
			content: '￥';
			font-size: 20rpx;
		}
	}
}
</style>
