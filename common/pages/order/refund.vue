<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="content_box">
			<view class="goods-box">
				<shopro-mini-card><block slot="goodsBottom"></block></shopro-mini-card>
			</view>
			<view class="goods-item x-bc" @tap="onSel(1)">
				<text class="item-title">货物状态</text>
				<text class="cuIcon-right"></text>
			</view>
			<view class="goods-item x-bc" @tap="onSel(2)">
				<text class="item-title">退款原因</text>
				<text class="cuIcon-right"></text>
			</view>
			<view class="goods-item x-f">
				<text class="item-title">退款金额：</text>
				<text class="price">￥16.00</text>
			</view>
			<view class="explain goods-item x-f">
				<text class="item-title">说明：</text>
				<input class="flex-sub" value="" placeholder="选填" />
			</view>

			<view class="upload-img">
				<text class="upload-title">上传凭证</text>
				<view class="img-box">
					<view class="preview-box" v-for="(item, index) in imgList" :key="index">
						<image class="preview-img" :src="imgList[index]" mode="aspectFill"></image>
						<text class="cuIcon-close" @tap="DelImg(index)"></text>
					</view>
					<view class="choose-img x-c" @tap="chooseImg" v-if="imgList.length < 10"><text class="cuIcon-cameraadd"></text></view>
				</view>
			</view>
		</view>
		<view class="foot_box x-c"><button class="cu-btn sub-btn">提交</button></view>
		<shopro-modal v-model="showModal" :modalType="'bottom-modal'">
			<block slot="modalContent">
				<view class="modal-box page_box">
					<view class="modal-head head_box x-c">{{ modalDetail.title }}</view>
					<view class="modal-content content_box">
						<radio-group @tap="onRadio" class="y-f">
							<label class="sel-item x-bc" v-for="item in modalDetail.list" :key="item.id">
								<text>{{ item.val }}</text>
								<radio class="brown sel-radio" :value="item.val"></radio>
							</label>
						</radio-group>
					</view>
					<view class="modal-foot foot_box x-c"><button class="cu-btn close-btn" @tap="onClose">关闭</button></view>
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
			showModal: false,
			imgList: [],
			modalDetail: {},
			goodsState: {
				title: '货物状态',
				list: [
					{
						id: 1,
						val: '已收到货'
					},
					{
						id: 2,
						val: '未收到货'
					}
				]
			},
			refundList: {
				title: '退款原因',
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
	methods: {
		chooseImg() {
			let that = this;
			that.$tools.chooseImage(1).then(res => {
				that.imgList.push(res);
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
		onSel(state) {
			switch (state) {
				case 1:
					this.modalDetail = this.goodsState;
					break;
				case 2:
					this.modalDetail = this.refundList;
					break;
				default:
					break;
			}
			this.showModal = true;
		}
	}
};
</script>

<style lang="scss">
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
	background: #fff;
	padding: 30rpx 25rpx;

	.upload-title {
		font-size: 28rpx;
	}
}

.img-box {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	margin-top: 20rpx;

	.choose-img,
	.preview-box {
		width: 120rpx;
		height: 120rpx;
		background: rgba(249, 250, 251, 1);
		border: 1rpx solid rgba(223, 223, 223, 1);
		margin-right: 25rpx;
		margin-bottom: 25rpx;
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
	.sub-btn {
		width: 710rpx;
		height: 80rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border: 1rpx solid rgba(238, 238, 238, 1);
		border-radius: 40rpx;
		color: rgba(#fff, 0.9);
		margin-bottom: 30rpx;
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
