<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="content_box">
			<view class="goods x-f">
				<image class="goods-img" :src="goodsDetail.goods_image" mode="widthFix"></image>
				<view class="y-start detail">
					<view class="state-text">
						物流状态：
						<text class="state">{{ goodsDetail.status_name }}</text>
					</view>
					<view class="code">物流单号：{{ goodsDetail.express_no }}</view>
					<view class="">物流公司：{{ goodsDetail.express_name }}</view>
				</view>
			</view>
		</view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			goodsDetail: {}
		};
	},
	onLoad() {
		this.getOrderItemDetail()
	},
	computed: {},
	methods: {
		getOrderItemDetail() {
			let that = this;
			that.$api('order.itemDetail', {
				id:that.$Route.query.orderId,
				order_item_id:that.$Route.query.ordrderItemId
			}).then(res => {
				if(res.code === 1){
					that.goodsDetail = res.data[0];
				}
			});
		}
	}
};
</script>

<style lang="scss">
.goods {
	margin-bottom: 20rpx;
	background: #fff;
	padding: 25rpx 40rpx;
	.goods-img {
		width: 140rpx;
		height: 140rpx;
		background: #ccc;
		margin-right: 20rpx;
	}
	.detail {
		height: 140rpx;
		font-size: 28rpx;
		justify-content: space-between;
		.state {
			color: #e9b664;
		}
	}
}
</style>
