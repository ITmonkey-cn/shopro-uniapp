<template>
	<view class="page_box">
		<view class="content_box">
			<view class="card-wrap mb20">
				<!-- 商品卡片 -->
				<view class="order-card-box"></view>
				<!-- 到店自提 -->
				<view class="y-f">
					<image class="qr-code--img" src="/static/imgs/app_icon/icon.png" mode=""></image>
					<view class="detail-item">
						<view class="item-title">核销码</view>
						<view class="x-bc">
							<text class="item-content">5368 4946 54</text>
							<text class="item-status">待使用</text>
						</view>
						<view class="x-bc">
							<text class="item-content">5368 4946 54</text>
							<text class="item-status">待使用</text>
						</view>
						<view class="item-tip">为保障您的权益，未到店消费前请不要将提货码提供给商家</view>
					</view>
				</view>
			</view>
			<view class="detail-item pa20">
				<view class="item-title">龙与国际店</view>
				<view class="item-content">郑州市郑东新区运动场东路龙宇国际A座紫月星辰小店</view>
				<view class="item-content">到店时间：2020-05-11 16:43</view>
			</view>
			<view class="detail-item pa20">
				<view class="item-title">配送信息</view>
				<view class="item-content">郑州市郑东新区运动场东路龙宇国际A座紫月星辰小店</view>
				<view class="item-content">到店时间：2020-05-11 16:43</view>
			</view>
			<view class="detail-item pa20">
				<view class="item-title">发货信息</view>
				<view class="item-content">百度网盘：https://pan.baidu.com/</view>
				<view class="item-content">提 取 码 ：123456</view>
			</view>
		</view>
		<view class="foot_box x-c pb20">
			<button class="service-btn cu-btn">
				<text class="cuIcon-dianhua"></text>
				联系商家
			</button>
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
	onLoad() {
		uni.setNavigationBarTitle({
			title: '配送详情'
		});
	},
	methods: {}
};
</script>

<style lang="scss">
.content_box {
	padding: 20rpx;
}
.card-wrap {
	background-color: #fff;
	padding: 20rpx;
	border-radius: 20rpx;
}
.order-card-box {
	height: 200rpx;
	border-bottom: 2rpx solid rgba(238, 238, 238, 0.6);
}
.qr-code--img {
	width: 200rpx;
	height: 200rpx;
}
.detail-item {
	background: rgba(255, 255, 255, 1);
	border-radius: 20rpx;
	.item-title {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		height: 60rpx;
	}
	.item-content {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 50rpx;
	}
	.item-status {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(179, 132, 54, 1);
	}
	.item-tip {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(196, 196, 196, 1);
	}
}
.service-btn {
	padding: 0;
	width: 710rpx;
	height: 80rpx;
	background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
	box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
	border-radius: 40rpx;
	font-size: 30rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(255, 255, 255, 1);
	.cuIcon-dianhua {
		color: #fff;
		font-size: 40rpx;
		margin-right: 10rpx;
	}
}
</style>
