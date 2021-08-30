<template>
	<!-- 订单卡片 -->
	<view class="sh-order-box u-flex u-m-b-10 u-p-r-20">
		<view class="order-box u-flex">
			<view class="order-item u-flex-col " @tap="jump('/pages/order/list', { type: order.type })" v-for="order in orderNav" :key="order.id">
				<view class="u-flex-col item-box u-col-center">
					<image class="order-img" :src="$IMG_URL + order.img" mode=""></image>
					<text class="item-title">{{ order.title }}</text>
					<view class="badge" v-if="orderNum && orderNum[order.type]">{{ orderNum[order.type] }}</view>
				</view>
			</view>
			<view class="order-item u-flex-col " @tap="jump('/pages/order/after-sale/list')">
				<view class="u-flex-col item-box u-col-center">
					<image class="order-img" :src="$IMG_URL + '/imgs/user/tab55.png'" mode=""></image>
					<text class="item-title">退换货</text>
				</view>
			</view>
		</view>

		<view class="order-item u-flex-col all-order " @tap="jump('/pages/order/list', { type: 'all' })">
			<image class="cut-off--line" :src="$IMG_URL + '/imgs/user/cut_off_line.png'" mode=""></image>
			<view class="u-flex-col item-box u-col-center">
				<image class="order-img" :src="$IMG_URL + '/imgs/user/all_order.png'" mode="aspectFill"></image>
				<text class="item-title">全部订单</text>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 订单中心卡片
 *
 */
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {},
	data() {
		return {
			orderNav: [
				{
					id: 1,
					title: '待付款',
					img: '/imgs/user/tab11.png',
					type: 'nopay'
				},
				// {
				// 	id: 2,
				// 	title: '待发货',
				// 	img: this.$IMG_URL + '/imgs/user/tab22.png',
				// 	type: 'nosend'
				// },
				{
					id: 3,
					title: '待收货',
					img: '/imgs/user/tab33.png',
					type: 'noget'
				},
				{
					id: 4,
					title: '待评价',
					img: '/imgs/user/tab44.png',
					type: 'nocomment'
				}
				// {
				// 	id: 5,
				// 	title: '退换货',
				// 	img: this.$IMG_URL + '/imgs/user/tab55.png',
				// 	type: 'aftersale'
				// }
			]
		};
	},
	computed: {
		...mapGetters(['isLogin', 'userOtherData']),
		orderNum() {
			return this.userOtherData.order_num || 0;
		}
	},
	methods: {
		jump(path, query) {
			this.$Router.push({
				path: path,
				query: query
			});
		}
	}
};
</script>

<style lang="scss">
.badge {
	position: absolute;
	/* #ifndef APP-NVUE */
	display: inline-flex;
	/* #endif */
	justify-content: center;
	align-items: center;
	line-height: 24rpx;
	padding: 4rpx 10rpx;
	border-radius: 100rpx;
	color: #fff;
	font-size: 24rpx;
	z-index: 9;
	background-color: $u-type-error;
	transform: scale(0.8);
	transform-origin: center center;
	left: 100rpx;
	top: -6rpx;
	white-space: nowrap;
}
// 订单卡片
.sh-order-box {
	height: 180rpx;
	background: #fff;
	.order-box {
		flex: 4;
	}
	.all-order {
		position: relative;
		.cut-off--line {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: (750rpx/5) - 15rpx;
			width: 30rpx;
			height: 136rpx;
		}
	}

	.order-item {
		flex: 1;
		.item-box {
			position: relative;
		}
		.order-img {
			width: 46rpx;
			height: 46rpx;
		}

		.item-title {
			font-size: 26rpx;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			line-height: 24rpx;
			margin-top: 20rpx;
		}
	}
}
</style>
