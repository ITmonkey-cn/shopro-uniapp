<template>
	<block>
		<view class="load-box" v-if="!goodsInfo.price"><shopro-skeletons :type="'detail'"></shopro-skeletons></view>
		<view class="detail_box" v-else>
			<view class="detail-content">
				<!-- <scroll-view class="scroll-box" scroll-y="true" scroll-with-animation enable-back-to-top> -->
				<view class="goodes_detail_swiper-box">
					<swiper class="carousel" circular @change="swiperChange" :autoplay="true">
						<swiper-item @tap="tools.previewImage(goodsInfo.images, swiperCurrent)" v-for="(img, index) in goodsInfo.images" :key="index" class="carousel-item">
							<image class="swiper-image" :src="img" mode="aspectFill" lazy-load></image>
						</swiper-item>
					</swiper>
					<view v-if="goodsInfo.images" class="swiper-dots">{{ swiperCurrent + 1 }} / {{ goodsInfo.images.length }}</view>
				</view>
				<!-- 价格卡片组 -->
				<shopro-goods-activity v-if="goodsInfo" :detail="goodsInfo" @change="getActivityRules"></shopro-goods-activity>
				<view class="goods-title">{{ goodsInfo.title }}</view>
				<view class="sub-title">{{ goodsInfo.subtitle }}</view>
				<!-- 规格选择 -->
				<shopro-goods-sku
					v-model="showSku"
					v-if="activityRules.status !== 'waiting'"
					:goodsInfo="goodsInfo"
					:buyType="goodsInfo.activity_type == 'seckill' ? 'buy' : buyType"
					@changeType="changeType"
				></shopro-goods-sku>
				<!-- 服务 -->
				<shopro-goods-serve v-model="showServe" :serveList="goodsInfo.service"></shopro-goods-serve>
				<!-- 优惠券 -->
				<shopro-goods-coupon
					v-if="goodsInfo.coupons && goodsInfo.coupons.length && goodsInfo.activity_type !== 'seckill'"
					:couponList="goodsInfo.coupons"
				></shopro-goods-coupon>
				<!-- 拼团人 -->
				<shopro-goods-group v-if="goodsInfo.activity && goodsInfo.activity.type === 'groupon'"></shopro-goods-group>
				<!-- 选项卡 -->
				<view class="sticky-box">
					<view class="tab-box x-f">
						<view class="tab-item y-f x-c" @tap="onTab(tab.id)" v-for="tab in tabList" :key="tab.id">
							<view class="tab-title">{{ tab.title }}</view>
							<text class="tab-line" :class="{ 'line-active': tabCurrent === tab.id }"></text>
						</view>
					</view>
					<view class="tab-detail">
						<view class="rich-box" v-show="tabCurrent === 'tab0'">
							<shopro-parse :content="goodsInfo.content"></shopro-parse>
							<!-- <rich-text :nodes="goodsInfo.content"></rich-text> -->
						</view>
						<view class="goods-size" v-if="tabCurrent === 'tab1'">
							<view class="table-box" v-if="goodsInfo.params && goodsInfo.params.length">
								<view class="t-tr x-f" v-for="t in goodsInfo.params" :key="t.title">
									<view class="t-head x-f">{{ t.title }}</view>
									<view class="t-detail">{{ t.content }}</view>
								</view>
							</view>
						</view>
						<view class="goods-comment" v-if="tabCurrent === 'tab2'">
							<block v-for="comment in commentList" :key="comment.id"><shopro-comment :comment="comment"></shopro-comment></block>
							<view class="empty-box x-c" v-if="!commentList.length"><shopro-empty :emptyData="emptyData"></shopro-empty></view>
							<view class="more-box x-c" v-if="commentList.length">
								<button class="cu-btn more-btn x-f" @tap="jump('/pages/goods/comment-list', { goodsId: goodsInfo.id })">
									查看全部
									<text class="cuIcon-right"></text>
								</button>
							</view>
						</view>
					</view>
				</view>
				<!-- </scroll-view> -->
			</view>
			<view class="detail-foot_box  x-f" v-if="!showSku && !showServe">
				<view class="left x-f">
					<view class="tools-item y-f" @tap="goHome">
						<image class="tool-img" src="http://shopro.7wpp.com/imgs/tabbar/tab_home_sel.png" mode=""></image>
						<text class="tool-title">首页</text>
					</view>
					<view class="tools-item y-f" @tap="onFavorite(goodsInfo.id)">
						<image
							class="tool-img"
							:src="Boolean(goodsInfo.favorite) ? 'http://shopro.7wpp.com/imgs/favorite_end.png' : 'http://shopro.7wpp.com/imgs/favorite.png'"
							mode=""
						></image>
						<text class="tool-title">收藏</text>
					</view>
					<view class="tools-item y-f" @tap="onShare">
						<image class="tool-img" src="http://shopro.7wpp.com/imgs/share.png" mode=""></image>
						<text class="tool-title">分享</text>
					</view>
				</view>
				<view class="detail-right">
					<view class="detail-btn-box x-ac" v-if="goodsInfo.activity_type === null || goodsInfo.activity === null">
						<button class="cu-btn tool-btn add-btn" @tap="addCart">加入购物车</button>
						<button class="cu-btn tool-btn pay-btn" @tap="goPay">立即购买</button>
					</view>
					<view class="detail-btn-box x-ac" v-if="goodsInfo.activity && goodsInfo.activity.type === 'seckill'">
						<button class="cu-btn  seckill-btn" v-if="activityRules.status !== 'end'" @tap="goSeckill">立即秒杀</button>
						<button class="cu-btn  seckilled-btn" v-else>已结束</button>
					</view>
					<view class="detail-btn-box x-ac" v-if="goodsInfo.activity && goodsInfo.activity.type === 'groupon'">
						<button class="cu-btn tool-btn add-btn y-f">
							<text class="price">￥222</text>
							<text class="price-title">单独购买</text>
						</button>
						<button class="cu-btn tool-btn pay-btn y-f">
							<text class="price">￥111</text>
							<text class="price-title">发起拼团</text>
						</button>
					</view>
				</view>
			</view>
			<!-- 弹窗组件 -->
			<shopro-share v-model="showShare" :goodsId="goodsInfo.id" :shareInfo="shareInfo" :goodsInfo="goodsInfo"></shopro-share>
			<!-- 登录提示 -->
			<shopro-login-modal></shopro-login-modal>
		</view>
	</block>
</template>

<script>
import shoproGoodsActivity from '@/components/detail/shopro-goods-activity.vue';
import shoproGoodsSku from '@/components/detail/shopro-goods-sku.vue';
import shoproGoodsGroup from '@/components/detail/shopro-goods-group.vue';
import shoproGoodsServe from '@/components/detail/shopro-goods-serve.vue';
import shoproGoodsCoupon from '@/components/detail/shopro-goods-coupon.vue';
import shoproShare from '@/components/shopro-share.vue';
import shoproComment from '@/components/shopro-comment.vue';
import shoproParse from '@/components/parse/parse.vue';
import shoproSkeletons from '@/components/shopro-skeletons.vue';
import shoproEmpty from '@/components/shopro-empty.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {
		shoproGoodsSku,
		shoproGoodsGroup,
		shoproGoodsServe,
		shoproShare,
		shoproComment,
		shoproGoodsActivity,
		shoproParse,
		shoproGoodsCoupon,
		shoproSkeletons,
		shoproEmpty
	},
	data() {
		return {
			showShare: false,
			buyType: 'sku',
			showSku: false,
			showServe: false,
			tools: this.$tools,
			goodsInfo: {},
			commentList: [],
			favorite: false,
			activityRules: {},
			currentSkuList: [],
			confirmGoodsInfo: {},
			swiperCurrent: 0, //轮播下标
			tabCurrent: 'tab0',
			emptyData: {
				img: '/static/imgs/empty/comment_empty.png',
				tip: '暂无评价~'
			},
			tabList: [
				{
					id: 'tab0',
					title: '商品详情'
				},
				{
					id: 'tab1',
					title: '规格参数'
				},
				{
					id: 'tab2',
					title: '用户评价'
				}
			]
		};
	},
	computed: {},
	onLoad() {
		this.init();
	},
	onReady() {},
	methods: {
		init() {
			return Promise.all([this.getGoodsDetail()]);
		},
		getActivityRules(e) {
			if (e) {
				this.activityRules = JSON.parse(e);
			}
		},
		// 路由跳转
		jump(path, parmas) {
			this.showShare = false;
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 回到首页
		goHome() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		// 轮播图切换
		swiperChange(e) {
			const index = e.detail.current;
			this.swiperCurrent = index;
		},
		// 选项卡
		onTab(id) {
			this.tabCurrent = id;
		},
		// 商品详情
		getGoodsDetail() {
			let that = this;
			that.$api('goods.detail', {
				id: that.$Route.query.id
			}).then(res => {
				if (res.code === 1) {
					that.goodsInfo = res.data;
					that.getCommentList();
					that.setShareInfo({
						query: {
							url: 'goods-' + that.$Route.query.id
						},
						title: that.goodsInfo.title,
						image: that.goodsInfo.image
					});
				}
			});
		},
		// 商品评论
		getCommentList() {
			let that = this;
			that.$api('goods_comment.list', {
				goods_id: that.goodsInfo.id,
				per_page: 3,
				type: 'all'
			}).then(res => {
				if (res.code === 1) {
					that.commentList = res.data.data;
				}
			});
		},
		// 组件改type
		changeType(e) {
			this.buyType = e;
		},
		// 分享
		onShare() {
			this.showShare = true;
		},
		// 加入购物车
		addCart() {
			if (Boolean(uni.getStorageSync('token'))) {
				this.buyType = 'cart';
				this.showSku = true;
			} else {
				this.$store.commit('LOGIN_TIP', true);
			}
		},
		// 立即购买
		goPay() {
			if (Boolean(uni.getStorageSync('token'))) {
				this.buyType = 'buy';
				this.showSku = true;
			} else {
				this.$store.commit('LOGIN_TIP', true);
			}
		},
		goSeckill() {
			if (Boolean(uni.getStorageSync('token'))) {
				if (this.activityRules.status !== 'waiting') {
					this.buyType = 'buy';
					this.showSku = true;
					console.log(this.buyType);
				} else {
					this.$tools.toast('秒杀暂未开始');
				}
			} else {
				this.$store.commit('LOGIN_TIP', true);
			}
		},
		// 收藏
		onFavorite(goodsId) {
			let that = this;
			that.$api('goods.favorite', {
				goods_id: goodsId
			}).then(res => {
				if (res.code === 1) {
					that.goodsInfo.favorite = res.data;
					that.$tools.toast(res.msg);
				}
			});
		}
	}
};
</script>

<style lang="scss">
.detail-content {
	padding-bottom: 100rpx;
}
.sticky-box {
	.tab-box {
		position: -webkit-sticky;
		position: sticky;
		top: 0;
		z-index: 99;
	}
}
// 商品图片轮播

.goodes_detail_swiper-box {
	width: 750rpx;
	height: 750rpx;
	position: relative;

	.carousel {
		width: 750rpx;
		height: 100%;
	}

	.carousel-item {
		width: 750rpx;
		height: 100%;
	}

	.swiper-image {
		width: 750rpx;
		height: 100%;
		background: #ccc;
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
		line-height: 44rpx;
		border-radius: 22rpx;
		padding: 0 15rpx;
		background: rgba(#333, 0.3);
		font-size: 28rpx;
		color: rgba(#fff, 0.9);
	}
}

.goods-title {
	font-size: 28rpx;
	font-weight: 500;
	line-height: 42rpx;
	background-color: #fff;
	padding-bottom: 10rpx;
	padding: 10rpx 20rpx;
}

.sub-title {
	padding: 0 20rpx;
	color: #a8700d;
	font-size: 24rpx;
	font-weight: 500;
	line-height: 42rpx;
	background-color: #fff;
	padding-bottom: 10rpx;
}

// 选项卡
.tab-box {
	height: 102rpx;
	background: #fff;
	border-bottom: 1rpx solid rgba(#dfdfdf, 0.8);
	margin-top: 20rpx;
	.tab-item {
		flex: 1;
		height: 100%;
		position: relative;
		font-size: 30rpx;
		font-weight: bold;

		.tab-line {
			width: 123rpx;
			height: 4rpx;
			left: 50%;
			bottom: 20rpx;
			transform: translateX(-50%);
			background: transparent;
			position: absolute;
			z-index: 2;
		}

		.line-active {
			background: rgba(168, 112, 13, 1);
		}
	}
}

.tab-detail {
	min-height: 300rpx;
	background: #fff;
	padding-bottom: 30rpx;
	background: #fff;
	.rich-box {
		font-size: 0;
		image {
			margin-top: -1rpx; //富文本的图片之间的间隙，一般是空格造成，父级用size:0,可以解决，不行就hack一下
		}
	}

	.goods-size {
		padding-top: 30rpx;
		.table-box {
			width: 710rpx;
			margin: auto;
			background: rgba(255, 255, 255, 1);
			border: 1rpx solid rgba(223, 223, 223, 1);

			.t-tr {
				border-bottom: 1rpx solid rgba(223, 223, 223, 1);

				&:last-child {
					border-bottom: none;
				}

				.t-head {
					font-size: 26rpx;
					color: #999;
					flex: 1;
					padding: 15rpx 20rpx;
					height: 100%;
					border-right: 1rpx solid rgba(223, 223, 223, 1);
				}

				.t-detail {
					font-size: 26rpx;
					flex: 4;
					padding: 15rpx 20rpx;
					height: 100%;
				}
			}
		}
	}

	.goods-comment {
		padding-top: 30rpx;
		.more-box {
			height: 100rpx;
			background: #fff;

			.more-btn {
				width: 200rpx;
				height: 60rpx;
				border: 1rpx solid rgba(213, 166, 90, 1);
				border-radius: 30rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: rgba(168, 112, 13, 1);
				padding: 0;
				background: #fff;

				.cuIcon-right {
					font-size: 30rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
}

// 推荐商品
.guess-box {
	.guess-title {
		height: 90rpx;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		background: #fff;
		padding: 0 20rpx;
	}

	.goods-wrap {
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx;

		.goods-item {
			margin-right: 20rpx;
			margin-bottom: 20rpx;

			&:nth-child(2n) {
				margin-right: 0;
			}
		}
	}
}

// 底部工具栏
.detail-foot_box {
	height: 100rpx;
	background: rgba(255, 255, 255, 1);
	border-top: 1rpx solid rgba(238, 238, 238, 1);
	width: 100%;
	position: fixed;
	bottom: 0;
	z-index: 999;

	.left,
	.detail-right {
		flex: 1;
	}

	.tools-item {
		flex: 1;
		height: 100%;

		.tool-img {
			width: 46rpx;
			height: 46rpx;
		}

		.tool-title {
			font-size: 22rpx;
			line-height: 22rpx;
			padding-top: 8rpx;
		}
	}

	.detail-btn-box {
		flex: 1;

		.tool-btn {
			font-size: 28rpx;
			font-weight: 500;
			color: rgba(#fff, 0.9);
			width: 210rpx;
			height: 70rpx;
			border-radius: 35rpx;
			padding: 0;
			margin-right: 20rpx;

			.price {
				font-size: 24rpx;
				font-weight: bold;
				color: rgba(#fff, 0.9);
			}

			.price-title {
				font-size: 20rpx;
				font-weight: 500;
				color: rgba(#fff, 0.9);
				padding-top: 8rpx;
			}
		}

		.add-btn {
			box-shadow: 0px 2rpx 5rpx 0px rgba(102, 103, 104, 0.46);
			background: linear-gradient(90deg, rgba(103, 104, 105, 1), rgba(82, 82, 82, 1));
		}

		.pay-btn {
			box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		}

		.seckill-btn {
			width: 432rpx;
			height: 70rpx;
			background: linear-gradient(93deg, rgba(208, 19, 37, 1), rgba(237, 60, 48, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(#ed3c30, 0.22);
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			border-radius: 35rpx;
			padding: 0;
			margin-right: 20rpx;
		}
		.seckilled-btn {
			width: 432rpx;
			height: 70rpx;
			background: rgba(221, 221, 221, 1);
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #999999;
			border-radius: 35rpx;
			padding: 0;
			margin-right: 20rpx;
		}
	}
}
</style>
