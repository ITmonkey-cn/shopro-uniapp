<!-- 物流信息 -->
<template>
	<view class="map-box">
		<!-- 商品卡片 -->
		<view class="oilStation-top">
			<view class="u-flex u-row-between express-card__head">
				<view class="u-flex">
					<view class="img-box">
						<image class="goods-image" :src="firstGoods.goods_image" mode="aspectFill"></image>
						<view class="shop-tag">{{ goodsList.length || 0 }}件商品</view>
					</view>
					<text class="express-status">{{ firstGoods.status_name || '' }}</text>
				</view>
			</view>
			<view class="express-sn u-flex u-col-center ">
				<text class="u-m-r-30">{{ expressDetail.express_name || '' }} {{ expressDetail.express_no || '' }}</text>
				<text class="u-iconfont uicon-file-text" style="color: #666;font-size: 32rpx;" @tap="copyCode(expressDetail.express_no)"></text>
			</view>
		</view>

		<!-- 物流时间轴 -->
		<view class="oilStation-bottom">
			<view class="u-p-y-30">
				<view v-if="exrpessLog.length" class="express-item u-flex u-col-center" v-for="(log, index) in exrpessLog" :key="log.id">
					<view class="item-left">
						<text class="day">{{ log.changedate.split(' ')[0] }}</text>
						<text class="time">{{ log.changedate.split(' ')[1] }}</text>
					</view>
					<view class="item-right">
						<image class="express-tag" :src="$IMG_URL + `/imgs/order/express${index == 0 ? log.status + '' + log.status : log.status}.png`" mode="aspectFill"></image>
						<view class="express-title">{{ log.status_name }}</view>
						<view class="express-detail">{{ log.content }}</view>
					</view>
				</view>
				<view v-if="!exrpessLog.length" class="no-log u-flex u-row-center u-col-center">暂无物流信息~</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			expressDetail: {}, //物流信息
			exrpessLog: [], //包裹轨迹
			firstGoods: {}, //商品列表
			goodsList: []
		};
	},
	computed: {},
	onLoad() {
		this.getExpressDetail();
	},
	methods: {
		// 复制物流码
		copyCode(code) {
			let that = this;
			uni.setClipboardData({
				data: code,
				success: () => {
					that.$u.toast('已复制到剪切板');
				}
			});
		},
		// 获取物流信息
		getExpressDetail() {
			let that = this;
			that.$http('order.expressDetail', {
				id: that.$Route.query.expressId,
				order_id: that.$Route.query.orderId
			}).then(res => {
				if (res.code === 1) {
					that.expressDetail = res.data;
					that.goodsList = res.data.item;
					that.exrpessLog = res.data.log;
					that.firstGoods = res.data.item[0];
				}
			});
		}
	}
};
</script>

<style lang="scss">
/* 物流卡片 */
.oilStation-top {
	justify-content: center;
	align-items: center;
	flex-direction: column;
	background: #fff;
	margin: 20rpx;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0 1rpx 18rpx 0 rgba(184, 184, 184, 0.55);
	border-radius: 20rpx;
	.express-card__head {
		padding: 20rpx;
	}
	.img-box {
		position: relative;
		width: 129rpx;
		height: 129rpx;
		border-radius: 20rpx;
		overflow: hidden;
		background: #ccc;
		.goods-image {
			width: 129rpx;
			height: 129rpx;
		}
	}
	.shop-tag {
		position: absolute;
		width: 129rpx;
		height: 30rpx;
		background: rgba(0, 0, 0, 0.6);
		font-size: 18rpx;

		font-weight: 400;
		color: rgba(255, 255, 255, 1);
		text-align: center;
		bottom: 0;
		z-index: 5;
	}
	.express-status {
		font-size: 30rpx;

		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		margin-left: 20rpx;
	}
	.express-sn {
		width: 100%;
		height: 65rpx;
		background: rgba(250, 251, 255, 1);
		border-radius: 0 0 20rpx 20rpx;
		font-size: 24rpx;

		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		padding: 0 30rpx;
	}
}
.oilStation-bottom {
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	background: #fff;
	width: 710rpx;
	margin: 0 20rpx 20rpx;
	border-radius: 20rpx;
	box-shadow: 0 1rpx 18rpx 0 rgba(184, 184, 184, 0.55);
	padding: 0 30rpx;
}
// 物流步骤条
.no-log {
	width: 100%;
	height: 100rpx;
	color: #999;
}
.express-item {
	align-items: flex-start;
	.item-left {
		.day {
			font-size: 26rpx;
			white-space: nowrap;
		}
		.time {
			font-size: 20rpx;
			white-space: nowrap;
		}
	}
	.item-right {
		position: relative;
		padding-left: 54rpx;
		margin-left: 54rpx;
		border-left: 1rpx solid #e7e7e7;
		padding-bottom: 40rpx;
		.express-tag {
			width: 54rpx;
			height: 54rpx;
			position: absolute;
			left: -27rpx;
			top: 0;
		}
		.express-title {
			font-size: 28rpx;

			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			margin-bottom: 10rpx;
		}
		.express-detail {
			width: 400rpx;
			font-size: 24rpx;

			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}
	}
}
</style>
