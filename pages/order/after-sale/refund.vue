<!-- 申请售后 -->
<template>
	<view class="refund-wrap">
		<!-- 售后商品 -->
		<view class="goods-box">
			<shopro-mini-card :title="orderItemDetail.goods_title" :image="orderItemDetail.goods_image">
				<template #describe>
					<view class="order-sku u-ellipsis-1">
						<text class="order-num">数量:{{ orderItemDetail.goods_num || 0 }};</text>
						{{ orderItemDetail.goods_sku_text ? orderItemDetail.goods_sku_text : '' }}
					</view>
				</template>
				<template #cardBottom>
					<view class="card-price-box u-flex">
						<text class="order-price font-OPPOSANS">￥{{ orderItemDetail.goods_price || 0 }}</text>
						<button class="u-reset-button status-btn" v-if="orderItemDetail.status_name">{{ orderItemDetail.status_name }}</button>
					</view>
				</template>
			</shopro-mini-card>
		</view>

		<!-- 售后类型 -->
		<view class="refund-item">
			<view class="item-title">请选择售后类型</view>
			<u-radio-group v-model="refundType" active-color="#d89f64" width="100%">
				<u-radio shape="circle" v-for="(item, index) in refundTypeList" :key="index" :name="item.value">{{ item.title }}</u-radio>
			</u-radio-group>
		</view>

		<!-- 申请原因 -->
		<view class="goods-item u-flex u-row-between" @tap="showModal = true">
			<text class="item-title">选择申请原因</text>
			<view class="u-flex refund-cause">
				<text class="u-m-r-20" style="color: #333;" v-if="refundCause">{{ refundCause }}</text>
				<text class="u-m-r-20" v-else>请选择申请原因~</text>
				<text class="u-iconfont uicon-arrow-right" style="color: #666"></text>
			</view>
		</view>

		<!-- 联系方式 -->
		<view class="refund-item u-m-b-20">
			<view class="item-title">联系方式</view>
			<view class="input-box u-flex"><input type="number" class="item-input" v-model="phone" placeholder="请输入您的联系电话" placeholder-class="input--pl" /></view>
		</view>

		<!-- 留言 -->
		<view class="refund-item u-m-b-20">
			<view class="item-title">相关描述</view>
			<view class="describe-box">
				<textarea
					class="describe-content"
					v-model="refundContent"
					maxlength="120"
					placeholder="客官~请描述您遇到的问题，建议上传照片"
					placeholder-class="input--pl"
					fixed
				></textarea>
				<view class="upload-img">
					<u-upload
						:showProgress="false"
						@on-uploaded="uploadSuccess"
						@on-remove="uploadRemove"
						:action="`${$BASE_URL}/api/common/upload`"
						:header="{token: token}"
						width="140"
						height="140"
						maxCount="9"
					></u-upload>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="foot-wrap safe-area-inset-bottom">
			<view class="foot_box u-flex u-row-between safe-area-inset-bottom">
				<button class="u-reset-button contcat-btn" @tap="onService">联系客服</button>
				<button class="u-reset-button sub-btn" @tap="postAftersale">提交</button>
			</view>
		</view>

		<!-- 申请原因弹窗 -->
		<u-popup v-model="showModal" safe-area-inset-bottom @close="showModal = false" mode="bottom" :closeable="true" close-icon-pos="top-left">
			<view class="modal-box page_box">
				<view class="modal-head head_box u-flex u-row-center u-col-center">{{ refundList.title }}</view>
				<view class="modal-content content_box">
					<view class="u-flex-col u-p-20">
						<u-radio-group v-model="refundCause" active-color="#d89f64" width="100%">
							<u-radio class="u-m-y-10" shape="circle" v-for="item in refundList.list" :key="item.id" :name="item.val">
								<text class="u-p-l-20">{{ item.val }}</text>
							</u-radio>
						</u-radio-group>
					</view>
				</view>
				<view class="modal-foot foot_box u-flex u-row-center u-col-center"><button class="u-reset-button close-btn" @tap="showModal = false">确定</button></view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			showModal: false,
			imgList: [], //图片地址
			orderId: 0, //订单ID
			orderItemDetail: {}, //订单信息
			refundType: '', //售后类型
			refundCause: '', //退款原因
			refundContent: '', //相关描述
			phone: '', //联系方式
			refundTypeList: [
				//售后类型
				{
					title: '退款',
					value: 'refund'
				},
				{
					title: '退货',
					value: 'return'
				},
				{
					title: '其他',
					value: 'other'
				}
			],
			refundList: {
				//申请原因
				title: '申请原因',
				list: [
					{
						id: 1,
						val: '卖家发错货了'
					},
					{
						id: 2,
						val: '退运费'
					},
					{
						id: 3,
						val: '大小/重量于商品描述不符'
					},
					{
						id: 4,
						val: '生产日期、保质期与商品不符'
					},
					{
						id: 5,
						val: '质量问题'
					}
				]
			},
			token: uni.getStorageSync('token')
		};
	},
	computed: {},
	onLoad() {
		this.getOrderItemDetail();
	},
	methods: {
		// 跳转客服
		onService() {
			this.$Router.push('/pages/public/chat/index');
		},

		// 上传图片成功
		uploadSuccess(e) {
			this.imgList = [];
			e.forEach(item => {
				this.imgList.push(item.response.data.url);
			});
		},

		// 移除图片
		uploadRemove(index) {
			this.imgList.splice(index, 1);
		},

		// 订单item详情
		getOrderItemDetail() {
			let that = this;
			that.$http('order.itemDetail', {
				id: that.$Route.query.orderId,
				order_item_id: that.$Route.query.orderItemId
			}).then(res => {
				if (res.code === 1) {
					that.orderItemDetail = res.data;
				}
			});
		},

		// 提交售后
		postAftersale() {
			let that = this;
			that.$http('order.aftersale', {
				type: that.refundType,
				order_id: that.$Route.query.orderId,
				order_item_id: that.$Route.query.orderItemId,
				reason: that.refundCause,
				content: that.refundContent,
				images: that.imgList,
				phone: that.phone
			}, '申请中...').then(res => {
				if (res.code === 1) {
					//  #ifdef MP-WEIXIN
					that.$store.commit('subscribeMessage', 'aftersale');
					//  #endif
					that.$Router.back();
				}
			});
		}
	}
};
</script>

<style lang="scss">
// 售后项目
.refund-item {
	background-color: #fff;
	border-bottom: 1rpx solid #f5f5f5;
	padding: 30rpx;
	.item-title {
		font-size: 30rpx;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		margin-bottom: 20rpx;
	}

	// 留言
	.describe-box {
		width: 690rpx;
		background: rgba(249, 250, 251, 1);
		border-radius: 20rpx;
		.describe-content {
			width: 660rpx;
			padding: 30rpx;
			height: 200rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #333;
		}
	}
	.input--pl {
		font-size: 24rpx;
		font-weight: 400;
		color: rgba(177, 179, 199, 1);
	}
	// 联系方式
	.input-box {
		height: 84rpx;
		background: rgba(249, 250, 251, 1);
		border-radius: 20rpx;
		.item-input {
			padding: 0 30rpx;
			flex: 1;
			font-size: 28rpx;
			font-weight: 400;
			color: #333;
		}
	}
}

.goods-box {
	background: #fff;
	padding: 20rpx;
	margin-bottom: 20rpx;
	.order-sku {
		font-size: 24rpx;

		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		width: 450rpx;
		margin-bottom: 20rpx;
		.order-num {
			margin-right: 10rpx;
		}
	}
	.card-price-box {
		.status-btn {
			height: 32rpx;
			border: 1rpx solid rgba(207, 169, 114, 1);
			border-radius: 15rpx;
			font-size: 20rpx;
			font-weight: 400;
			color: rgba(168, 112, 13, 1);
			padding: 0 10rpx;
			margin-left: 20rpx;
			background: rgba(233, 183, 102, 0.16);
		}
		.order-price {
			font-size: 26rpx;

			font-weight: 600;
			color: rgba(51, 51, 51, 1);
		}
	}
}

.goods-item {
	height: 95rpx;
	background: #fff;
	padding: 0 25rpx;
	margin-bottom: 20rpx;

	// 售后原因
	.refund-cause {
		font-size: 26rpx;
		font-weight: 400;
		color: rgba(177, 179, 199, 1);
	}

	&:nth-of-type(2n) {
		margin-bottom: 0;
		border-top: 0;
	}

	.item-title {
		font-size: 28rpx;
	}

	.price {
		font-size: 28rpx;
		color: #a8700d;
	}
}

.upload-img {
	padding: 25rpx;

	.upload-title {
		font-size: 28rpx;
	}
}

.img-box {
	display: flex;
	align-items: center;
	flex-wrap: wrap;

	.choose-img,
	.preview-box {
		width: 110rpx;
		height: 110rpx;
		background: rgba(249, 250, 251, 1);
		border: 1rpx solid rgba(223, 223, 223, 1);
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		position: relative;

		&:nth-child(5n) {
			margin-right: 0;
		}
		.preview-img {
			width: 100%;
			height: 100%;
		}
	}
}

.foot-wrap {
	height: 100rpx;
	width: 100%;
}
.foot_box {
	height: 100rpx;
	background-color: #fff;
	padding: 0 30rpx;
	position: fixed;
	width: 100%;
	bottom: 0;
	left: 0;
	border-top: 1rpx solid #f5f5f5;
	.sub-btn {
		width: 340rpx;
		line-height: 74rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border: 1rpx solid rgba(238, 238, 238, 1);
		border-radius: 38rpx;
		color: rgba(#fff, 0.9);
		font-size: 28rpx;
	}
	.contcat-btn {
		width: 340rpx;
		line-height: 74rpx;
		background: rgba(238, 238, 238, 1);
		border-radius: 38rpx;
		font-size: 28rpx;

		font-weight: 400;
		color: rgba(51, 51, 51, 1);
	}
}

.modal-box {
	width: 750rpx;
	height: 680rpx;
	border-radius: 30rpx 30rpx 0 0;
	background: #fff;

	.modal-head {
		height: 100rpx;
		font-size: 30rpx;
	}

	.modal-content {
		font-size: 28rpx;

		.sel-item {
			height: 100rpx;
			width: 100%;
			padding: 0 20rpx;
			border-bottom: 1rpx solid rgba(223, 223, 223, 0.5);

			.sel-radio {
				transform: scale(0.7);
			}
		}
	}

	.modal-foot {
		.close-btn {
			width: 710rpx;
			line-height: 80rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			border: 1rpx solid rgba(238, 238, 238, 1);
			border-radius: 40rpx;
			color: rgba(#fff, 0.9);
		}
	}
}
</style>
