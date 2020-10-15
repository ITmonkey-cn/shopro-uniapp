<template>
	<view class="box">
		<view class="load-box" v-if="!goodsInfo.price"><shopro-skeletons :type="'detail'"></shopro-skeletons></view>
		<view class="detail_box shopro-selector" v-else>
			<view class="detail-content">
				<view class="goodes_detail_swiper-box">
					<!-- 拼团滚动提示 -->
					<sh-groupon-tip v-if="false"></sh-groupon-tip>
					<!-- 详情轮播 -->
					<swiper class="carousel" circular @change="swiperChange" :autoplay="true">
						<swiper-item @tap="tools.previewImage(goodsInfo.images, swiperCurrent)" v-for="(img, index) in goodsInfo.images" :key="index" class="carousel-item">
							<image class="swiper-image shopro-selector-rect" :src="img" mode="aspectFill" lazy-load></image>
						</swiper-item>
					</swiper>
					<view v-if="goodsInfo.images" class="swiper-dots">{{ swiperCurrent + 1 }} / {{ goodsInfo.images.length }}</view>
				</view>

				<!-- 价格卡片组 -->
				<sh-price v-if="goodsInfo" :detail="goodsInfo" :type="detailType" @change="getActivityRules"></sh-price>
				<view class="goods-title more-t">{{ goodsInfo.title }}</view>
				<view class="sub-title more-t">{{ goodsInfo.subtitle }}</view>
				<!-- 规格选择 -->
				<view
					class="sku-box shopro-selector-rect"
					@tap="showSku = true"
					v-if="activityRules.status !== 'waiting' && checkActivity(goodsInfo.activity_type, 'groupon') && goodsInfo.is_sku"
				>
					<view class="x-bc">
						<view class="x-f">
							<text class="title">规格</text>
							<text class="tip">{{ currentSkuText || '请选择规格' }}</text>
						</view>
						<text class="cuIcon-right"></text>
					</view>
				</view>
				<shopro-sku
					v-model="showSku"
					:goodsInfo="goodsInfo"
					:buyType="goodsInfo.activity_type == 'seckill' || detailType === 'score' ? 'buy' : buyType"
					:grouponBuyType="grouponBuyType"
					:goodsType="detailType === 'score' ? 'score' : 'goods'"
					@changeType="changeType"
					@getSkuText="getSkuText"
				></shopro-sku>
				<!-- 服务 -->
				<sh-serve v-if="goodsInfo.service.length" v-model="showServe" :serveList="goodsInfo.service"></sh-serve>
				<!-- 优惠券 -->
				<sh-coupon
					v-if="goodsInfo.coupons && goodsInfo.coupons.length && goodsInfo.activity_type !== 'seckill' && goodsInfo.activity_type !== 'groupon' && detailType !== 'score'"
					:couponList="goodsInfo.coupons"
				></sh-coupon>
				<!-- 拼团人-->
				<sh-groupon
					v-if="goodsInfo.activity && goodsInfo.activity.type === 'groupon' && goodsInfo.activity.rules.team_card === '1' && detailType !== 'score'"
					:grouponData="goodsInfo"
				></sh-groupon>
				<!-- 拼团玩法 -->
				<view
					v-if="goodsInfo.activity && !!goodsInfo.activity.richtext_id && goodsInfo.activity_type !== 'seckill'"
					class="groupon-play x-bc px20"
					@tap="jump('/pages/public/richtext', { id: goodsInfo.activity.richtext_id })"
				>
					<view class="x-f">
						<text class="title">玩法</text>
						<view class="description one-t">{{ goodsInfo.activity.richtext_title || '开团/参团·邀请好友·人满发货（不满退款' }}</view>
					</view>
					<text class="cuIcon-right" style="color: #bfbfbf;"></text>
				</view>
				<!-- 选项卡 -->
				<view class="sticky-box">
					<view class="tab-box x-f">
						<view class="tab-item y-f x-c" @tap="onTab(tab.id)" v-for="tab in tabList" :key="tab.id">
							<view class="tab-title">
								{{ tab.title }}
								<text v-if="tab.id == 'tab2'" class="comment-num">({{ commentNum }})</text>
							</view>
							<text class="tab-line" :class="{ 'line-active': tabCurrent === tab.id }"></text>
						</view>
					</view>
					<view class="tab-detail pb20">
						<view class="rich-box" v-show="tabCurrent === 'tab0'"><uni-parser :html="goodsInfo.content"></uni-parser></view>
						<view class="goods-size" v-if="tabCurrent === 'tab1'">
							<view class="table-box" v-if="goodsInfo.params && goodsInfo.params.length">
								<view class="t-tr x-f" v-for="t in goodsInfo.params" :key="t.title">
									<view class="t-head x-f">{{ t.title }}</view>
									<view class="t-detail">{{ t.content }}</view>
								</view>
							</view>
						</view>
						<view class="goods-comment" v-if="tabCurrent === 'tab2'">
							<block v-for="comment in commentList" :key="comment.id"><sh-comment :comment="comment"></sh-comment></block>
							<view class="empty-box x-c" v-if="!commentList.length"><shopro-empty :isFixed="false" :emptyData="emptyData"></shopro-empty></view>
							<view class="more-box x-c" v-if="commentList.length">
								<button class="cu-btn more-btn x-f" @tap="jump('/pages/goods/comment-list', { goodsId: goodsInfo.id })">
									查看全部
									<text class="cuIcon-right"></text>
								</button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 积分商品foot -->
			<view class="score-foot-box x-f" v-if="!showSku && !showServe && detailType === 'score'">
				<view class="left x-f">
					<view class="tools-item y-f" @tap="goHome">
						<image class="tool-img" src="http://shopro.7wpp.com/imgs/tabbar/tab_home_sel.png" mode=""></image>
						<text class="tool-title">首页</text>
					</view>
				</view>
				<view class="right">
					<view class="btn-box x-ac"><button class="cu-btn  seckill-btn" @tap="goPay">立即兑换</button></view>
				</view>
			</view>
			<!-- 其他商品foot -->
			<view class="detail-foot_box  x-f" v-if="!showSku && !showServe && detailType !== 'score'">
				<view class="left x-f">
					<view class="tools-item y-f" @tap="goHome">
						<image class="tool-img shopro-selector-circular" src="http://shopro.7wpp.com/imgs/tabbar/tab_home_sel.png" mode=""></image>
						<text class="tool-title shopro-selector-rect">首页</text>
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
					<view class="detail-btn-box x-ac" v-if="!goodsInfo.activity">
						<button class="cu-btn tool-btn add-btn" @tap="addCart">加入购物车</button>
						<button class="cu-btn tool-btn pay-btn" @tap="goPay">立即购买</button>
					</view>
					<view class="detail-btn-box x-ac" v-if="goodsInfo.activity && goodsInfo.activity.type === 'seckill'">
						<button class="cu-btn  seckill-btn" v-if="activityRules.status === 'ing'" @tap="goSeckill">立即秒杀</button>
						<button class="cu-btn  seckilled-btn" v-if="activityRules.status == 'waiting'">暂未开始</button>
						<button class="cu-btn  seckilled-btn" v-if="activityRules.status == 'end'">已结束</button>
					</view>
					<!-- 拼团foot -->
					<view class="detail-btn-box x-ac" v-if="goodsInfo.activity && goodsInfo.activity.type === 'groupon'">
						<button class="cu-btn  seckilled-btn" v-if="activityRules.status == 'waiting'">暂未开始</button>
						<button class="cu-btn  seckilled-btn" v-if="activityRules.status == 'end'">已结束</button>
						<view class="x-f" v-if="activityRules.status == 'ing'">
							<button class="cu-btn tool-btn add-btn y-f" @tap="payGroupon" v-if="goodsInfo.activity.rules.is_alone === '1'">
								<text class="price">￥{{ goodsInfo.price }}</text>
								<text class="price-title">单独购买</text>
							</button>
							<button class="cu-btn tool-btn groupon-btn y-f" :style="goodsInfo.activity.rules.is_alone === '0' ? 'width:400rpx' : ''" @tap="payGroupon('groupon')">
								<text class="price">￥{{ goodsInfo.groupon_price }}</text>
								<text class="price-title">我要开团</text>
							</button>
						</view>
					</view>
				</view>
			</view>
			<!-- 分享组件 -->
			<shopro-share v-model="showShare" :goodsInfo="goodsInfo" :posterType="'goods'"></shopro-share>
			<!-- 登录提示 -->
			<shopro-login-modal></shopro-login-modal>
			<!-- 骨架屏 -->
			<shopro-skeleton :showSkeleton="false"></shopro-skeleton>
			<!-- 自定义底部导航 -->
			<shopro-tabbar></shopro-tabbar>
			<!-- 关注弹窗 -->
			<shopro-float-btn></shopro-float-btn>
			<!-- 连续弹窗提醒 -->
			<shopro-notice-modal></shopro-notice-modal>
		</view>
	</view>
</template>

<script>
import shPrice from './children/sh-price.vue';
import shServe from './children/sh-serve.vue';
import shGroupon from './children/sh-groupon.vue';
import shGrouponTip from './children/sh-groupon-tip.vue';
import shCoupon from './children/sh-coupon.vue';
import shComment from '../children/sh-comment.vue';
import shoproSku from '@/components/shopro-sku/shopro-sku.vue';
import shoproSkeletons from '@/components/shopro-skeletons/shopro-skeletons.vue';
import shoproEmpty from '@/components/shopro-empty/shopro-empty.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {
		shServe,
		shPrice,
		shGroupon,
		shCoupon,
		shGrouponTip,
		shoproSku,
		shComment,
		shoproSkeletons,
		shoproEmpty
	},
	data() {
		return {
			currentSkuText: '', //选中规格
			detailType: '',
			showShare: false,
			buyType: 'sku',
			grouponBuyType: 'alone', //拼团购买方式。
			showSku: false,
			showServe: false,
			tools: this.$tools,
			goodsInfo: {},
			commentList: [], //商品评价列表
			commentNum: 0, //商品评价总数
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
		const type = this.$Route.query.type;
		this.detailType = type;
		switch (type) {
			case 'score':
				this.getScoreDetail();
				break;
			default:
				this.getGoodsDetail();
		}
	},
	onReady() {},
	methods: {
		getActivityRules(e) {
			if (e) {
				this.activityRules = JSON.parse(e);
			}
		},
		// 检测
		checkActivity(data, type) {
			if (data) {
				return !data.includes(type);
			}
			return true;
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
			this.$tools.routerTo('/pages/index/index');
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
		// 积分详情
		getScoreDetail() {
			this.$api('score.detail', {
				id: this.$Route.query.id
			}).then(res => {
				if (res.code === 1) {
					this.goodsInfo = res.data;
				}
			});
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
				if (res.code == 0) {
					that.$tools.toast(res.msg);
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
					that.commentNum = res.data.total;
				}
			});
		},
		// 组件返回的type;
		changeType(e) {
			this.buyType = e;
		},
		// 组件返回的规格;
		getSkuText(e) {
			this.currentSkuText = e;
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
		// 拼团购买
		payGroupon(type) {
			if (Boolean(uni.getStorageSync('token'))) {
				if (type === 'groupon') {
					this.grouponBuyType = 'groupon';
				} else {
					this.grouponBuyType = 'alone';
				}
				this.buyType = 'buy';
				this.showSku = true;
			} else {
				this.$store.commit('LOGIN_TIP', true);
			}
		},
		// 立即秒杀。
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
.box {
	padding-bottom: 100rpx;
}

// 拼团玩法
.groupon-play {
	height: 94rpx;
	background: #fff;

	.title {
		font-size: 28rpx;
		color: #999;
	}

	.description {
		font-size: 28rpx;
		margin-left: 30rpx;
	}

	.cuIcon-right {
		margin-left: 20rpx;
	}
}

.load-box {
	/deep/.skeletons_box {
		z-index: 11;
	}
}

.detail-content {
	&::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
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

// 规格卡片
.sku-box {
	line-height: 82rpx;
	background: #fff;
	padding: 0 20rpx;
	margin: 20rpx 0;
	font-size: 28rpx;

	.title {
		color: #999;
		margin-right: 20rpx;
	}

	.cuIcon-right {
		color: #bfbfbf;
		font-size: 36rpx;
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
	background: #fff;

	.rich-box {
		/deep/ img {
			display: block;
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
		min-height: 300rpx;

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

// 积分底部栏
.score-foot-box {
	height: 110rpx;
	background: rgba(255, 255, 255, 1);
	border-top: 1rpx solid rgba(238, 238, 238, 1);
	width: 100%;
	position: fixed;
	bottom: 0;
	z-index: 999;

	.left,
	.right {
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

	.btn-box {
		flex: 1;

		.seckill-btn {
			width: 600rpx;
			height: 80rpx;
			background: linear-gradient(90deg, rgba(49, 133, 243, 1), rgba(80, 205, 242, 1));
			box-shadow: 0px 7px 6px 0px rgba(80, 205, 242, 0.2);
			border-radius: 40rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			margin-right: 20rpx;
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

		.groupon-btn {
			width: 210rpx;
			height: 70rpx;
			background: linear-gradient(90deg, rgba(254, 131, 42, 1), rgba(255, 102, 0, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(255, 104, 4, 0.22);
			border-radius: 35rpx;
		}
	}
}
</style>
