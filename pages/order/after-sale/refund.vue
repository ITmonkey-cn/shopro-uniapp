<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="content_box">
			<view class="goods-box">
				<shopro-mini-card :type="'order'" :detail="orderItemDetail"><block slot="goodsBottom"></block></shopro-mini-card>
			</view>
			<view class="refund-item">
				<view class="item-title">请选择售后类型</view>
				<view class="radio-box y-start">
					<label class="radio-label x-f" v-for="item in refundTypeList" :key="item.title" @tap="selRefundType(item.value)">
						<checkbox class="radio-check round orange" :checked="refundType == item.value" :class="{ checked: refundType == item.value }"></checkbox>
						<text class="radio-title">{{ item.title }}</text>
					</label>
				</view>
			</view>
			<view class="goods-item x-bc" @tap="onSelCause">
				<text class="item-title">选择申请原因</text>
				<view class="x-f refund-cause">
					<text style="margin-right: 20rpx;">{{ refundCause }}</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<!-- 联系方式 -->
			<view class="refund-item mb20">
				<view class="item-title">联系方式</view>
				<view class="input-box x-f"><input type="number" class="item-input" v-model="phone" placeholder="请输入您的联系电话" placeholder-class="input--pl" /></view>
			</view>
			<!-- 留言 -->
			<view class="refund-item" style="margin-bottom: 20rpx;" v-show="!showModal">
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
						<view class="img-box">
							<view class="preview-box" v-for="(item, index) in imgList" :key="index">
								<image class="preview-img" :src="imgList[index]" mode="aspectFill"></image>
								<text class="cuIcon-close" @tap="DelImg(index)"></text>
							</view>
							<view class="choose-img x-c" @tap="chooseImg" v-if="imgList.length < 10"><text class="cuIcon-cameraadd"></text></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="foot_box x-bc">
			<button class="cu-btn contcat-btn" v-if="addons.includes('kefu')" @tap="onService">联系客服</button>
			<button class="cu-btn sub-btn" @tap="postAftersale">提交</button>
		</view>
		<shopro-modal v-model="showModal" :modalType="'bottom-modal'">
			<block slot="modalContent">
				<view class="modal-box page_box">
					<view class="modal-head head_box x-c">{{ modalDetail.title }}</view>
					<view class="modal-content content_box">
						<view class="y-f">
							<label class="sel-item x-bc" @tap="onRefundCause(item.val)" v-for="item in modalDetail.list" :key="item.id">
								<text>{{ item.val }}</text>
								<checkbox class="orange radio round sel-radio" :class="{ checked: refundCause == item.val }" :checked="refundCause == item.val"></checkbox>
							</label>
						</view>
					</view>
					<view class="modal-foot foot_box x-c"><button class="cu-btn close-btn" @tap="onClose">确定</button></view>
				</view>
			</block>
		</shopro-modal>
	</view>
</template>

<script>
import shoproMiniCard from '@/components/shopro-mini-card/shopro-mini-card.vue';
import shoproModal from '@/components/shopro-modal/shopro-modal.vue';
export default {
	components: {
		shoproMiniCard,
		shoproModal
	},
	data() {
		return {
			addons:uni.getStorageSync('addons'),
			showModal: false,
			imgList: [], //本地地址
			orderId: 0, //订单ID
			orderItemDetail: {}, //订单信息
			modalDetail: {},
			refundType: '', //退款方式
			refundCause: '', //退款原因
			refundContent: '', //相关描述
			phone: '', //联系方式
			refundTypeList: [
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
			}
		};
	},
	computed: {},
	onLoad() {
		this.getOrderItemDetail();
	},
	methods: {
		// 跳转客服
		onService() {
			this.$Router.push('/pages/public/kefu/index');
		},
		chooseImg() {
			let that = this;
			that.$tools.chooseImage(1).then(res => {
				res.forEach(img => {
					that.$tools.uploadImage('index/upload', img).then(res => {
						that.imgList.push(res.full_url);
					});
				});
			});
		},
		// 选择售后类型
		selRefundType(value) {
			this.refundType = value;
		},
		// 选择售后原因
		onRefundCause(value) {
			this.refundCause = value;
		},
		// 订单item详情
		getOrderItemDetail() {
			let that = this;
			that.$api('order.itemDetail', {
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
			uni.showLoading();
			that.$api('order.aftersale', {
				type: that.refundType,
				order_id: that.$Route.query.orderId,
				order_item_id: that.$Route.query.orderItemId,
				reason: that.refundCause,
				content: that.refundContent,
				images: that.imgList,
				phone: that.phone
			}).then(res => {
				if (res.code === 1) {
					//  #ifdef MP-WEIXIN
					this.$store.dispatch('getMessageIds', 'aftersale');
					//  #endif
					uni.hideLoading();
					that.$Router.replace('/pages/order/after-sale/list');
				}
			});
		},
		DelImg(index) {
			uni.showModal({
				title: '删除照片',
				content: '确定要删除这张照片么？',
				cancelText: '取消',
				confirmText: '删除',
				success: res => {
					if (res.confirm) {
						this.imgList.splice(index, 1);
					}
				}
			});
		},
		// 选择申请原因
		onSelCause() {
			this.modalDetail = this.refundList;
			this.showModal = true;
		},
		// 关闭
		onClose() {
			this.showModal = false;
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
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		margin-bottom: 20rpx;
	}
	.radio-label {
		height: 80rpx;
		.radio-check {
			transform: scale(0.7);
			margin-right: 10rpx;
		}
		.radio-title {
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}
	}
	// 留言
	.describe-box {
		width: 690rpx;
		background: rgba(249, 250, 251, 1);
		border-radius: 20rpx;
		.describe-content {
			width: 690rpx;
			padding: 30rpx;
			height: 200rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(177, 179, 199, 1);
		}
	}
	.input--pl {
		font-size: 24rpx;
		font-family: PingFang SC;
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
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(177, 179, 199, 1);
		}
	}
}

.goods-box {
	background: #fff;
	padding: 30rpx 25rpx;
	margin-bottom: 20rpx;
}

.goods-item {
	height: 95rpx;
	background: #fff;
	padding: 0 25rpx;
	margin-bottom: 20rpx;
	border-top: 1rpx solid rgba(#dfdfdf, 0.5);

	// 售后原因
	.refund-cause {
		font-size: 26rpx;
		font-family: PingFang SC;
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

	.cuIcon-right {
		font-size: 32rpx;
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

		.cuIcon-cameraadd {
			font-size: 50rpx;
			color: #dfdfdf;
		}

		.preview-img {
			width: 100%;
			height: 100%;
		}

		.cuIcon-close {
			background: linear-gradient(90deg, rgba(216, 159, 100, 1), rgba(235, 193, 150, 1));
			border-radius: 50%;
			width: 40rpx;
			line-height: 40rpx;
			color: #fff;
			text-align: center;
			position: absolute;
			top: -10rpx;
			right: -10rpx;
		}
	}
}

.foot_box {
	height: 100rpx;
	background-color: #fff;
	padding: 0 30rpx;
	.sub-btn {
		flex: 1;
		height: 74rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border: 1rpx solid rgba(238, 238, 238, 1);
		border-radius: 38rpx;
		color: rgba(#fff, 0.9);
		font-size: 28rpx;
	}
	.contcat-btn {
		flex: 1;
		height: 74rpx;
		background: rgba(238, 238, 238, 1);
		border-radius: 38rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
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
			height: 80rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			border: 1rpx solid rgba(238, 238, 238, 1);
			border-radius: 40rpx;
			color: rgba(#fff, 0.9);
		}
	}
}
</style>
