<template>
	<view class="page_box">
		<view class="content_box">
			<view class="card-wrap" :style="expressType !== 'selfetch' ? 'border-bottom-left-radius:0;border-bottom-right-radius:0;' : ''">
				<!-- 商品卡片 -->
				<view class="order-card-box"><shopro-mini-card :detail="itemDetail" :type="'order'"></shopro-mini-card></view>

				<!-- 到店自提 -->
				<view class="y-f mb20 pb20" v-if="expressType == 'selfetch' && itemDetail.status_code !== 'refund_finish' && qrcodeList.length">
					<image class="qr-code--img my20" :src="allqrcodepath" mode=""></image>
					<view class="all-qrcode-title mb20">总核销码</view>
					<view class="detail-item" style="align-items: flex-start;width: 100%;">
						<view class="item-title x-f">核销码</view>
						<view class="x-bc my20" v-for="code in qrcodeList" :key="code.code">
							<view>
								<text :style="code.status_code !== 'nouse' ? 'color:#999' : ''" class="item-content">{{ code.code }}</text>
								<text :style="code.status_code !== 'nouse' ? 'color:#999' : ''" class="item-status mx30">{{ code.status_name }}</text>
							</view>
							<button class="cu-btn check-code" v-if="code.status_code == 'nouse'" @tap="checkCode(code.code)">查看</button>
						</view>

						<view class="item-tip">为保障您的权益，未到店消费前请不要将提货码提供给商家</view>
					</view>
				</view>
			</view>
			<!-- 自提 -->
			<view class="detail-item pa20 " v-if="expressType == 'selfetch'">
				<view class="item-title">{{ storeInfo.name }}</view>
				<view class="x-bc">
					<view class="mr20" style="flex: 3;">
						<view class="item-content">{{ storeInfo.province_name || '' }}{{ storeInfo.city_name || '' }}{{ storeInfo.area_name || '' }}{{ storeInfo.address || '' }}</view>
						<view class="item-content">营业时间：{{ storeInfo.openhours || '' }}</view>
					</view>
					<view class="y-f location-box" style="flex: 1;" @tap="openStoreMap">
						<text class="iconfont icon-dingwei location-icon"></text>
						<text class="location-text">到这去</text>
					</view>
				</view>
			</view>
			<!-- 配送 -->
			<view
				class="detail-item pa20"
				:style="expressType !== 'selfetch' ? 'border-top-left-radius:0;border-top-right-radius:0;' : ''"
				v-if="expressType == 'store' && itemDetail.order"
			>
				<view class="item-title">配送信息</view>
				<view class="item-content">配送地址：{{ itemDetail.order.city_name || '' }}{{ itemDetail.order.area_name || '' }}{{ itemDetail.order.address || '' }}</view>
				<view class="item-content">配送时间：{{ itemDetail.ext_arr.dispatch_date || '' }}</view>
			</view>
			<!-- 自动 -->
			<view class="detail-item pa20" :style="expressType !== 'selfetch' ? 'border-top-left-radius:0;border-top-right-radius:0;' : ''" v-if="expressType == 'autosend'">
				<view class="item-title">发货信息</view>
				<view v-if="itemDetail.ext_arr && itemDetail.ext_arr.autosend_type == 'params'" v-for="item in autosendList" :key="item.value" class="item-content">
					{{ item.name }}：{{ item.value }}
				</view>
				<view v-if="itemDetail.ext_arr && itemDetail.ext_arr.autosend_type == 'text'" class="item-content">{{ itemDetail.ext_arr.autosend_content }}</view>
				<view v-if="!(itemDetail.ext_arr && itemDetail.ext_arr.autosend_type)" style="color: #999;" class="item-content">暂未发货~</view>
			</view>
		</view>
		<view class="foot_box x-c pb20" v-if="expressType == 'selfetch' || expressType == 'store'">
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
					<view class="qr-code-text">核销码：{{ qrcode }}</view>
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
			qrcode: '', //核销总码
			qrcodeList: [], //核销码列表
			storeInfo: {}, //自提点信息
			qrcodepath: '', //单核销码
			allqrcodepath: '', //总核销码
			autosendList: [], //自动发货列表。
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
	onPullDownRefresh() {
		this.getItemGoodsDetail();
	},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 自提打开地图
		openStoreMap() {
			uni.openLocation({
				latitude: +this.storeInfo.latitude,
				longitude: +this.storeInfo.longitude,
				success: function() {
					console.log('success');
				},
				fail: err => {
					console.log(err);
				}
			});
		},
		// 跳转客服
		onService() {
			this.$tools.callPhone(this.itemDetail.store.phone);
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
				uni.stopPullDownRefresh();
				if (res.code === 1) {
					that.itemDetail = res.data;
					that.qrcodeList = res.data.verify;
					that.storeInfo = res.data.store;
					if (res.data.ext_arr.autosend_content && res.data.ext_arr.autosend_type == 'params') {
						that.autosendList = JSON.parse(res.data.ext_arr.autosend_content);
					}
					if (this.expressType == 'selfetch') {
						let _arr = [];
						that.qrcodeList.forEach(code => {
							_arr.push(code.code);
						});
						that.qrcode = _arr.join(',');
						if (that.qrcodeList.length) {
							that.shareFc();
						}
					}
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
		border-radius: 25rpx;
		border: 1rpx solid rgba(179, 132, 54, 1);
		padding: 0;
		width: 100rpx;
		height: 50rpx;
		font-size: 28rpx;
		color: rgba(179, 132, 54, 1);
	}
	.location-box {
		height: 100%;
		justify-content: center;
		position: relative;
		&::before {
			content: '';
			width: 2rpx;
			height: 94rpx;
			background: #eeeeee;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 0;
		}
		.location-icon {
			color: #4fbbff;
			margin-bottom: 20rpx;
		}
		.location-text {
			color: #999;
			font-size: 26rpx;
		}
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
