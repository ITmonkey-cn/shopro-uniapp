<template>
	<view class="map-box">
		<view class="express-wrap">
			<view class="oilStation">
				<view class="oilStation-top">
					<view class="x-bc express-card__head">
						<view class="x-f">
							<view class="img-box">
								<image class="goods-image" :src="firstGoods.goods_image" mode="aspectFill"></image>
								<view class="shop-tag">{{ goodsList.length }}件商品</view>
							</view>
							<text class="express-status">{{ firstGoods.status_name }}</text>
						</view>
						<view class="express-phone__box y-f">
							<!-- 	<text class="cuIcon-phone"></text>
							<text class="express-phone__text">物流电话</text> -->
						</view>
					</view>
					<view class="express-sn x-f">
						<text>{{ expressDetail.express_name }} {{ expressDetail.express_no }}</text>
						<text class="cuIcon-copy" @tap="copyCode(expressDetail.express_no)"></text>
					</view>
				</view>
				<view class="oilStation-bottom">
					<view class="py30">
						<view v-if="exrpessLog.length" class="express-item x-f" v-for="(log, index) in exrpessLog" :key="log.id">
							<view class="item-left y-end">
								<text class="day">{{ log.changedate.split(' ')[0] }}</text>
								<text class="time">{{ log.changedate.split(' ')[1] }}</text>
							</view>
							<view class="item-right">
								<image
									class="express-tag"
									:src="`/static/imgs/order/express${index == 0 ? log.status + '' + log.status : log.status}.png`"
									mode="aspectFill"
								></image>
								<view class="express-title">{{ log.status_name }}</view>
								<view class="express-detail">{{ log.content }}</view>
							</view>
						</view>
						<view v-if="!exrpessLog.length" class="no-log x-c">暂无物流信息~</view>
					</view>
				</view>
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
					//#ifdef H5
					that.$tools.toast('已复制到剪切板');
					//#endif
				}
			});
		},
		// 获取物流信息
		getExpressDetail() {
			let that = this;
			that.$api('order.expressDetail', {
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
.cuIcon-back {
	position: fixed;
	top: 50rpx;
	left: 30rpx;
	width: 70rpx;
	line-height: 70rpx;
	font-size: 40rpx;
	text-align: center;
	background: rgba(0, 0, 0, 0.2);
	z-index: 10;
	border-radius: 50%;
}
/* 浮层 */
.dragLayer {
	width: 750rpx;
	/* height: auto; */
	position: fixed;
	// background-color: #fff;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
	bottom: 0;
	// box-shadow: 0px 1rpx 18rpx 0px rgba(83, 83, 83, 0.35);
	display: flex;
	height: 100%;
}
.dragLayer-bottom {
	height: 450rpx !important;
	transition: all ease-in-out 0.2s;
}
.dragLayer-top {
	height: 800rpx !important;
	transition: all ease-in-out 0.2s;
}
.oilStation {
	width: 750rpx;
	display: flex;
	flex-direction: column;
	flex: 1;
	height: 100%;
	// background: linear-gradient(to bottom, rgba(#fff, 0), rgba(#fff, 1));
}
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
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
		text-align: center;
		bottom: 0;
		z-index: 5;
	}
	.express-status {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		margin-left: 20rpx;
	}
	.express-phone__box {
		.cuIcon-phone {
			color: #fa8391;
			font-size: 60rpx;
		}
		.express-phone__text {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			line-height: 36rpx;
		}
	}
	.express-sn {
		width: 100%;
		height: 65rpx;
		background: rgba(250, 251, 255, 1);
		border-radius: 0 0 20rpx 20rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		padding: 0 30rpx;
		.cuIcon-copy {
			margin-left: 20rpx;
		}
	}
}
.oilStation-bottom {
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	// min-height: 200rpx;
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
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			margin-bottom: 10rpx;
		}
		.express-detail {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}
	}
}
</style>
