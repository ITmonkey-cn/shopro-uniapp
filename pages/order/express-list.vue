<template>
	<view class="express-list-wrap">
		<view class="tip-box x-f px20">3个包裹已发出</view>
		<view class="express-list mb20">
			<view class="x-bc list-head px20">
				<text class="list-status">派送中</text>
				<view class="express-name">天天快递：25689456336</view>
			</view>
			<view class="list-content pa20">
				<view class="express-detail mb20">郑州市凤台综合揽投部安排投递，投递局：郑州市凤台综合揽投部</view>
				<view class="goods-box x-f">
					<view class="goods-img-box"><image class="goods-img" src="/static/imgs/group/group_detail_bg.png" mode="aspectFill"></image></view>
				</view>
				<view class="all-goods">共1件商品</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
	},
	computed: {},
	onLoad() {},
	methods: {}
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
	.list-content{
		.express-detail{
			font-size:28rpx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(51,51,51,1);
		}
		.goods-box{
			flex-wrap: wrap;
			.goods-img-box{
				width:160rpx;
				height:160rpx;
				overflow: hidden;
				margin-right: 22rpx;
				margin-bottom: 22rpx;
				&:nth-child(4n){
					margin-right: 0;
				}
				.goods-img{
					width: 100%;
					height: 100%;
				}
			}
		}
		
	}
}
</style>
