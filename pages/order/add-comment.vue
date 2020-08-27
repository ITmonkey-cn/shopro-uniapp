<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="content_box">
			<view class="goods-card"><shopro-mini-card :detail="goodsDetail" :type="'order'"></shopro-mini-card></view>
			<view class="form-item">
				<view class="star-box x-f">
					<view class="star-title">{{ starTip }}</view>
					<view class=""><sh-star @changeStar="changeStar" :defaultStar="5" :maxStar="5"></sh-star></view>
				</view>
				<view class="area-box">
					<textarea class="inp-area" v-model="message" placeholder="宝贝满足你的期待吗？说说你的使用心得，分享给想买的他们吧~" placeholder-class="pl-style" />
					<view class="img-box">
						<view class="preview-box" v-for="(item, index) in imgList" :key="index">
							<image class="preview-img" :src="item" mode="aspectFill"></image>
							<text class="cuIcon-close" @tap="DelImg(index)"></text>
						</view>
						<view class="choose-img x-c" @tap="onChooseImg" v-if="imgList.length < 10"><text class="cuIcon-cameraadd"></text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="foot_box x-c"><button class="cu-btn post-btn" @tap="subComment">发布</button></view>
	</view>
</template>

<script>
import shoproMiniCard from '@/components/shopro-mini-card/shopro-mini-card.vue';
import shStar from './children/sh-star.vue';
export default {
	components: {
		shoproMiniCard,
		shStar
	},
	data() {
		return {
			imgList: [],
			uploadImgList: [],
			star: 5,
			message: '',
			goodsDetail: {}
		};
	},
	computed: {
		starTip() {
			let text = '';
			if (this.star <= 1) {
				text = '差评';
			}
			if (this.star > 1 && this.star <= 3) {
				text = '中评';
			}
			if (this.star >= 4) {
				text = '好评';
			}
			return text;
		}
	},
	onLoad() {
		this.getOrderItemDetail();
	},
	methods: {
		// 订单详情
		getOrderItemDetail() {
			let that = this;
			that.$api('order.itemDetail', {
				id: that.$Route.query.orderId,
				order_item_id: that.$Route.query.orderItemId
			}).then(res => {
				if (res.code === 1) {
					that.goodsDetail = res.data;
				}
			});
		},
		// 评星
		changeStar(e) {
			this.star = e.curStar;
		},
		onChooseImg() {
			let that = this;
			that.$tools.chooseImage(1).then(res => {
				res.forEach(img => {
					that.$tools.uploadImage('index/upload', img).then(res => {
						that.imgList.push(res.full_url);
						that.uploadImgList.push(res.url);
					});
				});
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
		subComment() {
			let that = this;
			that.$api('order.comment', {
				id: that.$Route.query.orderId,
				order_item_id: that.goodsDetail.id,
				level: that.star,
				content: that.message,
				images: that.uploadImgList
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast('评论发表成功');
					setTimeout(() => {
						that.$Router.back();
					}, 1000);
				}
			});
		}
	}
};
</script>

<style lang="scss">
// 评价商品
.goods-card {
	margin: 10rpx 0;
	padding: 20rpx;
	background: #fff;
	.price-box {
		font-size: 26rpx;
		width: 510rpx;
		color: #999;

		.goods-price {
			color: #333;
		}
	}
}
// 评论，选择图片
.form-item {
	background: #ffff;
	padding-bottom: 30rpx;
	.star-box {
		height: 100rpx;
		padding: 0 25rpx;
	}
}
.area-box {
	width: 690rpx;
	min-height: 306rpx;
	background: rgba(249, 250, 251, 1);
	border-radius: 20rpx;
	padding: 28rpx;
	margin: auto;
	.pl-style {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 42rpx;
	}
	.inp-area {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333;
		line-height: 50rpx;
		width: 100%;
	}
	.img-box {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 20rpx;
		.choose-img,
		.preview-box {
			width: 108rpx;
			height: 108rpx;
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
}
.post-btn {
	width: 690rpx;
	height: 80rpx;
	background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
	border-radius: 40rpx;
	color: rgba(#fff, 0.9);
	margin-bottom: 30rpx;
}
</style>
