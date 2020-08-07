<template>
	<view class="page_box">
		<view class="content_box">
			<view class="card-wrap">
				<!-- 商品卡片 -->
				<view class="order-card-box"><shopro-mini-card :detail="itemDetail" :type="'order'"></shopro-mini-card></view>

				<!-- 到店自提 -->
				<view class="y-f mb20 pb20">
					<image class="qr-code--img my20" :src="allqrcodepath" mode=""></image>
					<view class="detail-item">
						<view class="item-title">核销码</view>
						<view class="x-bc my20">
							<view class="">
								<text class="item-content">5368 4946 54</text>
								<text class="item-status mx30">待使用</text>
							</view>
							<button class="cu-btn check-code" @tap="checkCode('123123123')">查看</button>
						</view>
						<view class="x-bc my20">
							<view class="">
								<text class="item-content">5368 4946 54</text>
								<text class="item-status  mx30">待使用</text>
							</view>
							<button class="cu-btn check-code" @tap="checkCode('asfasfasfasfd')">查看</button>
						</view>
						<view class="item-tip">为保障您的权益，未到店消费前请不要将提货码提供给商家</view>
					</view>
				</view>
			</view>
			<view class="detail-item pa20" v-if="expressType == 'selfetch'">
				<view class="item-title">龙与国际店</view>
				<view class="item-content">郑州市郑东新区运动场东路龙宇国际A座紫月星辰小店</view>
				<view class="item-content">到店时间：2020-05-11 16:43</view>
			</view>
			<view class="detail-item pa20" v-if="expressType == 'store'">
				<view class="item-title">配送信息</view>
				<view class="item-content">郑州市郑东新区运动场东路龙宇国际A座紫月星辰小店</view>
				<view class="item-content">到店时间：2020-05-11 16:43</view>
			</view>
			<view class="detail-item pa20" v-if="expressType == 'autosend'">
				<view class="item-title">发货信息</view>
				<view class="item-content">百度网盘：https://pan.baidu.com/</view>
				<view class="item-content">提 取 码 ：123456</view>
			</view>
		</view>
		<view class="foot_box x-c pb20">
			<button class="service-btn cu-btn" @tap="onService">
				<text class="cuIcon-dianhua"></text>
				联系商家
			</button>
		</view>
		<!-- 二维码弹窗 -->
		<shopro-modal v-model="showQrcode">
			<block slot="modalContent">
				<view class="qr-code-modal">
					<image class="qr-code-img" :src="qrcodepath" mode=""></image>
					<view class="qr-code-text">核销码：122466565656</view>
					<button class="cu-btn hide-qrcode" @tap="hideModal">关闭</button>
				</view>
			</block>
		</shopro-modal>
		<!-- 二维码绘制 -->
		<view class="hideCanvasView">
			<canvas class="hideCanvas" canvas-id="qrcode_img" :style="{ width: (poster.width || 1) + 'px', height: (poster.height || 1) + 'px' }"></canvas>
		</view>
	</view>
</template>

<script>
import _app from '@/common/utils/QS-SharePoster/app.js';
import { getSharePoster } from '@/common/utils/QS-SharePoster/QS-SharePoster.js';
export default {
	components: {},
	data() {
		return {
			poster: {},
			canvasId: 'qrcode_img',
			qrcode: 'klaskdfkakfak',
			qrcodepath: '',
			allqrcodepath: '',
			itemDetail: {}, //订单商品详情
			expressType: 'express',
			barTitle: {
				express: '物流快递',
				selfetch: '到店/自提',
				store: '商家配送',
				autosend: '自动发货'
			},
			showQrcode: false //二维码弹窗
		};
	},
	computed: {},
	onLoad() {
		this.expressType = this.$Route.query.expressType;
		uni.setNavigationBarTitle({
			title: this.barTitle[this.expressType]
		});
		this.getItemGoodsDetail();
	},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 跳转客服
		onService() {
			this.$Router.push('/pages/public/kefu/index');
		},
		// 查看核销码
		checkCode(code) {
			this.qrcode = code;
			this.shareFc('qrcode').then(res => {
				this.showQrcode = true;
			});
		},
		hideModal() {
			this.showQrcode = false;
		},
		// 订单详情
		getItemGoodsDetail() {
			let that = this;
			that.$api('order.itemDetail', {
				id: that.$Route.query.orderId,
				order_item_id: that.$Route.query.orderItemId,
				type: 'dispatch'
			}).then(res => {
				if (res.code === 1) {
					that.itemDetail = res.data;
					that.qrcode = res.data.express_no;
					that.shareFc();
				}
			});
		},
		// 绘制二维码
		async shareFc(type) {
			let that = this;
			try {
				console.log('准备生成:' + new Date());
				const d = await getSharePoster({
					_this: this, //若在组件中使用 必传
					posterCanvasId: this.canvasId, //canvasId
					delayTimeScale: 20, //延时系数
					drawDelayTime: 500, //draw延时时间
					background: {
						width: 100,
						height: 100,
						backgroundColor: '#fff'
					},
					drawArray: ({ bgObj, type, bgScale }) => {
						return new Promise((rs, rj) => {
							rs([
								{
									type: 'qrcode',
									text: this.qrcode,
									size: bgObj.width,
									dx: 0,
									dy: 0,
									correctLevel: 1
								}
							]);
						});
					},
					setCanvasWH: ({ bgObj, type, bgScale }) => {
						// 为动态设置画布宽高的方法，
						this.poster = bgObj;
					}
				});
				if (type == 'qrcode') {
					this.qrcodepath = d.poster.tempFilePath;
				} else {
					this.allqrcodepath = d.poster.tempFilePath;
				}
			} catch (e) {
				_app.hideLoading();
				_app.showToast(JSON.stringify(e));
			}
		}
	}
};
</script>

<style lang="scss">
// 二维码
.hideCanvasView {
	position: relative;
	.hideCanvas {
		position: fixed;
		top: -99999upx;
		left: -99999upx;
		z-index: -99999;
	}
}
// 二维码弹窗
.qr-code-modal {
	width: 610rpx;
	border-radius: 20rpx;
	background-color: #fff;
	margin: 0 auto;
	.qr-code-img {
		margin: 100rpx;
		width: 400rpx;
		height: 400rpx;
	}
	.qr-code-text {
		color: #999;
		font-size: 28rpx;
	}
	.hide-qrcode {
		width: 492rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		margin: 30rpx;
	}
}

.content_box {
	padding: 20rpx;
}
.no-radius {
	border-radius: 0 !important;
}
.card-wrap {
	background-color: #fff;
	padding: 20rpx 20rpx 0;
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
	.check-code {
		background: none;
		border-radius: 20rpx;
		border: 1rpx solid rgba(179, 132, 54, 1);
		padding: 0;
		width: 100rpx;
		height: 50rpx;
		font-size: 28rpx;
		color: rgba(179, 132, 54, 1);
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
