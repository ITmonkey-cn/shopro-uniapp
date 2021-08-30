<template>
	<!-- 活动商品 -->
	<view class="activity-wrap u-p-x-20 u-p-b-20  u-m-b-10 groupon-card" v-if="showActivity">
		<!-- 标题栏 -->
		<view class="title-box u-flex u-row-between u-p-y-20 groupon-title">
			<view class="u-flex u-col-center">
				<view class="title-text u-m-r-20 u-ellipsis-1">{{ detail.title }}</view>
			</view>
			<view class="more-box u-flex" @tap="$Router.push('/pages/activity/groupon/list')">
				<text class="more-text u-m-r-10">更多拼团</text>
				<text class="iconfont icon-youjiantou-tianchong more-icon"></text>
			</view>
		</view>
		<!-- 活动商品 -->
		<!-- m -->
		<scroll-view v-if="grouponType === 1" class="scroll-box" scroll-x scroll-anchoring>
			<view class="goods-box u-flex">
				<view class="min-goods u-m-r-14" v-for="mgoods in goodsList" :key="mgoods.id" @tap="jump('/pages/goods/detail', { id: mgoods.id })">
					<view class="img-box"><image class="img" :src="mgoods.image" mode=""></image></view>
					<view class="mgoods-card-bottom u-p-20">
						<view class="goods-title u-m-b-10 u-ellipsis-1">{{ mgoods.title }}</view>
						<view class="price u-m-b-10">{{ mgoods.groupon_price }}</view>
						<view class="groupon-num-box u-flex u-col-center" v-if="mgoods.buyers.length">
							<view class="avatar-box"><image class="avatar-img u-m-r-10" :src="mgoods.buyers[0].avatar" mode=""></image></view>
							<view class="groupon-num-text">{{ mgoods.sales }}人正在拼</view>
						</view>
						<view class="original-price" v-else>￥{{ mgoods.original_price }}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!--b-->
		<view
			v-if="grouponType === 2"
			class="big-goods  u-flex u-p-20 u-col-top u-m-b-16"
			v-for="item in goodsList"
			:key="item.id"
			@tap="jump('/pages/goods/detail', { id: item.id })"
		>
			<image class="goods-img" :src="item.image" mode="aspectFill"></image>
			<view class=" card-right u-m-l-20 u-flex-col u-row-between">
				<view class="">
					<view class="goods-title u-ellipsis-1  u-m-t-10 u-m-b-10">
						<view class=" sm cu-tag radius title-tag u-m-r-10" style="{ backgroundColor: #FF6600, color: '#fff' }">拼团</view>
						{{ item.title }}
					</view>
					<view v-show="item.subtitle" class="subtitle-text u-m-b-10 u-ellipsis-1">{{ item.subtitle }}</view>
				</view>

				<view class="u-flex u-m-y-20">
					<view class="sell-box">
						<text class=" hot-icon iconfont icon-icon-test"></text>
						<text class="sell-num">已拼{{ item.sales }}件</text>
					</view>
					<text class="group-num">{{ item.activity.rules.team_num || 0 }}人团</text>
				</view>

				<view class=" u-flex u-row-between u-col-center">
					<view class="u-flex u-col-bottom font-OPPOSANS">
						<view class="price u-m-r-10">{{ item.groupon_price }}</view>
						<view class="origin-price">{{ item.original_price }}</view>
					</view>
					<button class="u-reset-button buy-btn" @tap.stop="$Router.push({ path: '/pages/goods/detail', query: { id: item.id } })">马上拼</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 自定义之拼团样式组件
 * @property {Object} detail - 秒杀商品信息
 */
export default {
	components: {},
	data() {
		return {
			timestamp: 0, //倒计时
			goodsList: [],
			showActivity: true, //是否显示活动。
			grouponType: this.detail.style
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

		// 获取拼团商品
		getActivityGoodsList() {
			let that = this;
			that.$http('goods.activity', {
				activity_id: that.detail.id,
				need_buyer: 1
			}).then(res => {
				if (res.code === 1) {
					that.goodsList = res.data.goods.data;
					that.showActivity = that.goodsList.length;
				} else {
					that.showActivity = false;
					console.log(`%cerr:拼团活动已结束`, 'color:green;background:yellow');
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.groupon-card {
	background: linear-gradient(#faecca 20%, #ffffff 30%, #ffffff 100%);
}

.groupon-title {
	background: url($IMG_URL+'/imgs/tag/groupon_title_bg.png') no-repeat;
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
	background: #fffaef;
	box-shadow: 0px 7rpx 8rpx 1rpx rgba(162, 117, 27, 0.24);
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
		background: url($IMG_URL+'/imgs/tag/groupon_goods_bg.png') no-repeat;
		background-position: bottom center;
		background-size: 100% 100%;
	}
	.goods-title {
		font-size: 26rpx;
		font-weight: 500;
		color: #000000;
		width: 180rpx;
		line-height: 26rpx;
	}

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
	.groupon-num-box {
		.avatar-box {
			direction: rtl;
			unicode-bidi: bidi-override;
			height: 30rpx;
			.avatar-img {
				width: 30rpx;
				height: 30rpx;
				border-radius: 50%;
				background-color: #f5f5f5;
			}
		}
		.groupon-num-text {
			font-size: 18rpx;
			font-weight: 500;
			color: #e9b461;
		}
	}
}

// 大商品卡片
.big-goods {
	width: 710rpx;
	min-height: 260rpx;
	background: #ffffff;
	box-shadow: 0px 7rpx 8rpx 1rpx #fffaef;
	border-radius: 20rpx;
	.goods-img {
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
		vertical-align: middle;
		.title-tag {
			transform: scale(0.9);
		}
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
		background: linear-gradient(90deg, #ff6600 0%, #fe832a 100%);
		border-radius: 25rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #ffffff;
	}
	// 拼团
	.sell-box {
		background: rgba(#f9efd6, 0.3);
		border-radius: 16rpx;
		line-height: 32rpx;
		.sell-num {
			font-size: 20rpx;

			font-weight: 400;
			color: #ff6904;
		}

		.hot-icon {
			font-size: 26rpx;
			color: #ff6904;
			margin-right: 8rpx;
		}
	}
	.group-num {
		font-size: 20rpx;

		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		margin-left: 20rpx;
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
