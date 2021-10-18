<template>
	<!-- 活动商品 -->
	<view class="activity-wrap u-p-x-20 u-p-b-20  u-m-b-10 seckill-card" v-if="showActivity">
		<!-- 标题栏 -->
		<view class="title-box u-flex u-row-between u-p-y-20  seckill-title">
			<view class="u-flex u-col-center">
				<view class="title-text u-m-r-20 u-ellipsis-1">{{ detail.name }}</view>
				<u-count-down
					class="count-down-demo"
					:timestamp="timestamp"
					separator-color="#ffbbbb "
					bg-color="#ffbbbb "
					ref="uCountDown"
					color="#fff"
					@end="seckillEnd"
					autoplay
				></u-count-down>
			</view>
			<view class="more-box u-flex" @tap="$Router.push('/pages/activity/seckill/list')">
				<text class="more-text u-m-r-10">更多抢购</text>
				<text class="iconfont icon-youjiantou-tianchong more-icon"></text>
			</view>
		</view>
		<!-- 活动商品 -->
		<!-- m -->
		<scroll-view v-if="seckillType === 1" class="scroll-box" scroll-x scroll-anchoring>
			<view class="goods-box u-flex">
				<view class="min-goods u-m-r-14" v-for="mgoods in goodsList" :key="mgoods.id" @tap="jump('/pages/goods/detail', { id: mgoods.id })">
					<view class="img-box"><image class="img" :src="mgoods.image" mode=""></image></view>
					<view class="mgoods-card-bottom u-p-20">
						<view class="goods-title  u-m-b-10 u-ellipsis-1">{{ mgoods.title }}</view>
						<view class="price-box font-OPPOSANS">
							<view class="price u-m-b-10">{{ mgoods.price }}</view>
							<view class="original-price">￥{{ mgoods.original_price }}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!--b-->
		<view
			v-if="seckillType === 2"
			class="big-goods  u-flex u-p-20 u-col-top u-m-b-16"
			v-for="item in goodsList"
			:key="item.id"
			@tap="jump('/pages/goods/detail', { id: item.id })"
		>
			<image class="goods-img" :src="item.image" mode="aspectFill"></u-image>
			<view class=" card-right u-m-l-20 u-flex-col u-row-between">
				<view class="">
					<view class="goods-title u-ellipsis-1 u-m-t-10 u-m-b-10">
						<view class=" sm cu-tag bg-red radius title-tag u-m-r-10" >秒杀</view>
						{{ item.title }}
					</view>
					<view v-show="item.subtitle" class="subtitle-text u-m-b-10 u-ellipsis-1">{{ item.subtitle }}</view>
				</view>

				<view class="u-flex u-m-y-20">
					<u-line-progress
						style="width:210rpx;"
						height="18"
						:show-percent="false"
						:percent="Number(item.percent)"
						inactive-color=" #e7e7e7"
						active-color="#ffbbbb "
					></u-line-progress>

					<view class="progress-text">已售出{{ item.sales }}件</view>
				</view>

				<view class=" u-flex u-row-between u-col-center">
					<view class="u-flex u-col-bottom">
						<view class="price u-m-r-10">{{ item.price }}</view>
						<view class="origin-price">{{ item.original_price }}</view>
					</view>
					<button class="u-reset-button buy-btn">去抢购</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 自定义之秒杀样式组件
 * @property {Object} detail - 秒杀商品信息
 */
export default {
	components: {},
	data() {
		return {
			timestamp: 0, //倒计时
			goodsList: [],
			showActivity: true, //是否显示活动。
			seckillType: this.detail.style
		};
	},
	props: {
		detail: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	watch: {},
	computed: {},
	created() {
		this.getActivityGoodsList();
	},
	methods: {
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},

		// 秒杀计时结束
		seckillEnd() {
			this.showActivity = false;
		},

		// 获取秒杀商品
		getActivityGoodsList() {
			let that = this;
			that.$http('goods.activity', {
				activity_id: that.detail.id
			}).then(res => {
				if (res.code === 1) {
					that.goodsList = res.data.goods.data;
					that.goodsList.map(item => {
						item.percent = item.stock + item.sales > 0 ? ((item.sales / (item.sales + item.stock)) * 100).toFixed(2) : 0;
					});
					let nowTime = new Date().getTime();
					let endTime = res.data.endtime * 1000;
					that.timestamp = (endTime - nowTime) / 1000;
					that.timestamp > 0 ? that.$refs.uCountDown.start() : (that.showActivity = false);
				} else {
					that.showActivity = false;
					console.log(`%cerr:秒杀活动已结束`, 'color:green;background:yellow');
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.seckill-card {
	background: linear-gradient(#ffebec 20%, #fff 30%, #fff 100%);
}

.seckill-title {
	background: url($IMG_URL+'/imgs/tag/seckill_title_bg.png') no-repeat;
	background-position: center top;
	background-size: 100% auto;
}
.activity-wrap {
	background-color: #fff;
	min-height: 300rpx;
	.title-box {
		.title-text {
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
		}
		.more-box {
			.more-text {
				font-size: 22rpx;
				font-weight: 500;
				color: #333333;
			}
			.more-icon {
				font-size: 24rpx;
				color: #333333;
			}
		}
	}

	.scroll-box,
	.goods-box {
		height: 380rpx;
		width: 100%;
	}
}

// 小商品卡片
.min-goods {
	width: 220rpx;
	height: 380rpx;
	background: #fff7f7;
	box-shadow: 0px 7rpx 7rpx 0px rgba(255, 80, 94, 0.32);
	border-radius: 10rpx;
	.img-box {
		width: 220rpx;
		height: 220rpx;
		overflow: hidden;
		position: relative;
		border-radius: 10rpx 10rpx 0 0;
		.img {
			width: 220rpx;
			height: 220rpx;
			background-color: #ccc;
		}
	}
	.mgoods-card-bottom {
		height: 160rpx;
		background: url($IMG_URL+'/imgs/tag/seckill_goods_bg.png') no-repeat;
		background-position: bottom center;
		background-size: 100% 100%;
	}
	.goods-title {
		font-size: 26rpx;
		font-weight: 500;
		color: #000000;
		line-height: 26rpx;
	}
	.price-box {
		.price {
			font-size: 30rpx;
			font-weight: 500;
			color: #ff0000;
			&::before {
				content: '￥';
				font-size: 24rpx;
			}
		}
		.original-price {
			font-size: 20rpx;
			font-weight: 500;
			text-decoration: line-through;
			color: #c4c4c4;
		}
	}
}

// 大商品卡片
.big-goods {
	width: 710rpx;
	min-height: 260rpx;
	background: #ffffff;
	box-shadow: 0px 7rpx 8rpx 1rpx rgba(254, 76, 29, 0.05);
	border-radius: 20rpx;
	.goods-img{
		width: 220rpx;
		height: 220rpx;
		border-radius: 6rpx;
	}
	.card-right {
		width: 430rpx;
		height: 100%;
	}
	.goods-title {
		font-size: 26rpx;
		font-weight: 600;
		width: 400rpx;
		color: #000000;
	}
	.subtitle-text {
		font-size: 22rpx;
		width: 400rpx;
		font-weight: 500;
		color: #666666;
	}
	.buy-btn {
		width: 120rpx;
		line-height: 50rpx;
		background: linear-gradient(90deg, #d01325, #ed3c30);
		border-radius: 25rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #ffffff;
	}
	.progress-text {
		color: #c4c4c4;
		font-size: 20rpx;
		margin-left: 25rpx;
	}
	// 价格
	.price {
		color: #ff0000;
		font-weight: 600;
		&::before {
			content: '￥';
			font-size: 20rpx;
		}
	}
	.origin-price {
		color: #c4c4c4;
		font-size: 24rpx;
		text-decoration: line-through;
		&::before {
			content: '￥';
			font-size: 20rpx;
		}
	}
}
</style>
