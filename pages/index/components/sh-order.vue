<template>
	<!-- 订单卡片 -->
	<view class="sh-order-box x-f mb10">
		<view class="order-box x-f">
			<view class="order-item y-f" @tap="jump('/pages/order/list', { type: order.type })" v-for="order in orderNav" :key="order.id">
				<view class="y-f item-box">
					<image class="order-img" :src="order.img" mode=""></image>
					<text class="item-title">{{ order.title }}</text>
					<view class="cu-tag badge" v-if=" orderNum && orderNum[order.type]">{{ orderNum[order.type] }}</view>
				</view>
			</view>
			<view class="order-item y-f"  @tap="jump('/pages/order/after-sale/list')">
				<view class="y-f item-box">
					<image class="order-img" src="http://shopro.7wpp.com/imgs/user/tab55.png" mode=""></image>
					<text class="item-title">退换货</text>
					<!-- <view class="cu-tag badge"></view> -->
				</view>
			</view>
		</view>
		
		<view class="order-item y-f all-order" @tap="jump('/pages/order/list', { type: 'all' })">
			<image class="cut-off--line" src="/static/imgs/user/cut_off_line.png" mode=""></image>
			<view class="y-f item-box">
				<image class="order-img" src="/static/imgs/user/all_order.png" mode="aspectFill"></image>
				<text class="item-title">全部订单</text>
				<!-- <view class="cu-tag badge" v-if="orderNum[order.type]">{{ orderNum[order.type] }}</view> -->
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			orderNav: [
				{
					id: 1,
					title: '待付款',
					img: 'http://shopro.7wpp.com/imgs/user/tab11.png',
					type: 'nopay'
				},
				// {
				// 	id: 2,
				// 	title: '待发货',
				// 	img: 'http://shopro.7wpp.com/imgs/user/tab22.png',
				// 	type: 'nosend'
				// },
				{
					id: 3,
					title: '待收货',
					img: 'http://shopro.7wpp.com/imgs/user/tab33.png',
					type: 'noget'
				},
				{
					id: 4,
					title: '待评价',
					img: 'http://shopro.7wpp.com/imgs/user/tab44.png',
					type: 'nocomment'
				},
				// {
				// 	id: 5,
				// 	title: '退换货',
				// 	img: 'http://shopro.7wpp.com/imgs/user/tab55.png',
				// 	type: 'aftersale'
				// }
			]
		};
	},
	computed: {
		...mapState({
			orderNum: state => state.user.orderNum
		})
	},
	onLoad() {},
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
			// background: #ccc;
		}

		.item-title {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			line-height: 24rpx;
			padding-top: 10rpx;
		}
	}
}
</style>
