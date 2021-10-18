<template>
	<view class="goods-box u-flex u-col-top" @tap="click">
		<view class="goods__tag" v-show="tag"><image class="tag-img" :src="tag" mode="widthFix"></image></view>
		<image class="goods_img"  lazy-load fade-show :src="image" mode="aspectFill"></u-image>
		<view class="u-m-l-20">
			<view class="goods-title u-ellipsis-2 u-m-b-10">{{ title }}</view>
			<view v-if="subtitle" class="describe-text u-m-b-10 u-ellipsis-1">{{ subtitle }}</view>
			<slot name="describe"></slot>
			<slot name="cardBottom">
				<view class="u-flex u-col-bottom font-OPPOSANS">
					<view class="price u-m-r-10">{{ price }}</view>
					<view class="origin-price">{{ originPrice }}</view>
				</view>
			</slot>
		</view>
	</view>
</template>

<script>
/**
 * 商品小卡片
 * @property {String} title - 标题
 * @property {String} subtitle - 副标题
 * @property {String} image - 图片地址
 * @property {String} describe - 描述信息
 * @property {String | Number} price - 价格
 * @property {String | Number} originPrice - 原价
 * @property {String} tag - 商品标签
 * @property {Number} number - 商品数量
 * @event {Function} click - 点击卡片
 */
export default {
	components: {},
	data() {
		return {};
	},
	props: {
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
		describe: {
			type: String,
			default: ''
		},
		price: {
			type: [Number, String],
			default: ''
		},
		originPrice: {
			type: [Number, String],
			default: ''
		},
		tag: {
			type: String,
			default: ''
		},
		number: {
			type: Number,
			default: 0
		}
	},
	computed: {},
	created() {},
	methods: {
		click() {
			this.$emit('click');
		}
	}
};
</script>

<style lang="scss">
.goods-box {
	position: relative;
	.goods__tag {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 5;
		.tag-img {
			width: 60rpx;
		}
	}
	.goods_img{
		width: 180rpx;
		height: 180rpx;
		border-radius: 6rpx;
	}
	.goods-title {
		font-size: 28rpx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		width: 450rpx;
		line-height: 40rpx;
	}

	.describe-text {
		font-size: 24rpx;
		width: 450rpx;
		color: #a8700d;
	}

	.price {
		color: $u-type-error;
		font-weight: 600;
		&::before {
			content: '￥';
			font-size: 20rpx;
		}
	}
	.origin-price {
		color: $u-type-info-disabled;
		font-size: 24rpx;
		text-decoration: line-through;
		&::before {
			content: '￥';
			font-size: 20rpx;
		}
	}
}
</style>
