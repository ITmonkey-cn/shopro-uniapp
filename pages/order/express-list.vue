<template>
	<view class="express-list-wrap">
		<view class="tip-box x-f px20">{{expressList.length}}个包裹已发出</view>
		<view class="express-list mb20" v-for="express in expressList" :key="express.id" @tap="toExpressDetail(express.id)">
			<view class="x-bc list-head px20">
				<text class="list-status">{{express.log[0].status_name}}</text>
				<view class="express-name">{{express.express_name}}：{{express.express_no}}</view>
			</view>
			<view class="list-content pa20">
				<view class="express-detail mb20">{{express.log[0].content}}</view>
				<view class="goods-box x-f">
					<view class="goods-img-box" v-for="img in express.item" :key="img.id"><image class="goods-img" :src="img.goods_image" mode="aspectFill"></image></view>
				</view>
				<view class="all-goods">共{{express.item.length}}件商品</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			expressList: []
		};
	},
	computed: {},
	onLoad() {
		this.getExpressList();
	},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 物流详情
		toExpressDetail(id){
			this.jump('/pages/order/express',{orderId:this.$Route.query.orderId,expressId:id})
		},
		// 包裹列表
		getExpressList() {
			let that = this;
			that.$api('order.expressList', {
				order_id: that.$Route.query.orderId
			}).then(res => {
				if (res.code === 1) {
					that.expressList = res.data;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.tip-box {
	width: 750rpx;
	height: 84rpx;
	font-size: 30rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(168, 112, 13, 1);
	background: rgba(255, 226, 182, 1);
}
// 物流包裹
.express-list {
	background-color: #fff;
	.list-head {
		height: 76rpx;
		border-bottom: 1rpx solid rgba(223, 223, 223, 0.5);
		.list-status {
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(168, 112, 13, 1);
		}
		.express-name {
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
		}
	}
	.list-content {
		.express-detail {
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}
		.goods-box {
			flex-wrap: wrap;
			.goods-img-box {
				width: 160rpx;
				height: 160rpx;
				overflow: hidden;
				margin-right: 22rpx;
				margin-bottom: 22rpx;
				&:nth-child(4n) {
					margin-right: 0;
				}
				.goods-img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}
</style>
