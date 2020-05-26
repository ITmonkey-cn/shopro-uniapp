<template>
	<block>
		<view class="load-box" v-if="!goodsInfo.price"><shopro-skeletons :type="'detail'"></shopro-skeletons></view>
		<view class="page_box" v-else>
			<view class="score-content">
				<!-- <scroll-view class="scroll-box" scroll-y="true" scroll-with-animation enable-back-to-top> -->
				<view class="swiper-box">
					<swiper class="carousel" circular @change="swiperChange" :autoplay="true">
						<swiper-item @tap="tools.previewImage(goodsInfo.images, swiperCurrent)" v-for="(img, index) in goodsInfo.images" :key="index" class="carousel-item">
							<image class="swiper-image" :src="img" mode="aspectFill" lazy-load></image>
						</swiper-item>
					</swiper>
					<view v-if="goodsInfo.images" class="swiper-dots">{{ swiperCurrent + 1 }} / {{ goodsInfo.images.length }}</view>
				</view>
				<!-- 价格 -->
				<view class="price-card">
					<view class="x-f">
						<image class="score-img" src="http://shopro.7wpp.com/imgs/score.png" mode=""></image>
						<text class="price">{{ goodsInfo.price }}</text>
					</view>
					<view class="x-bc price-bottom-box">
						<view class="x-f">
							<view class="original-price">价值：￥{{ goodsInfo.original_price }}</view>
							<text class="line"></text>
							<view class="sold">已兑换：{{ goodsInfo.sales }}件</view>
						</view>
					</view>
				</view>
				<view class="goods-title">{{ goodsInfo.title }}</view>
				<view class="sub-title">{{ goodsInfo.subtitle }}</view>
				<!-- 规格选择 -->
				<shopro-goods-sku v-model="showSku" :goodsType="'score'" :goodsInfo="goodsInfo" :buyType="'buy'"></shopro-goods-sku>
				<!-- 服务 -->
				<shopro-goods-serve v-model="showServe" :serveList="goodsInfo.service"></shopro-goods-serve>
				<!-- 选项卡 -->
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
						<view class="table-box">
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
				<!-- </scroll-view> -->
			</view>
			<view class="foot_box x-f" v-if="!showSku && !showServe">
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
			<!-- 弹窗组件 -->
			<shopro-share v-model="showShare" :goodsInfo="goodsInfo"></shopro-share>
			<shopro-login-modal></shopro-login-modal>
		</view>
	</block>
</template>

<script>
import shoproGoodsActivity from '@/components/detail/shopro-goods-activity.vue';
import shoproGoodsSku from '@/components/detail/shopro-goods-sku.vue';
import shoproGoodsServe from '@/components/detail/shopro-goods-serve.vue';
import shoproShare from '@/components/shopro-share.vue';
import shoproComment from '@/components/shopro-comment.vue';
import shoproParse from '@/components/parse/parse.vue';
import shoproSkeletons from '@/components/shopro-skeletons.vue';
import shoproEmpty from '@/components/shopro-empty.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {
		shoproGoodsSku,
		shoproGoodsServe,
		shoproShare,
		shoproComment,
		shoproGoodsActivity,
		shoproParse,
		shoproSkeletons,
		shoproEmpty
	},
	data() {
		return {
			showShare: false,
			showSku: false,
			showServe: false,
			tools: this.$tools,
			goodsInfo: {},
			favorite: false,
			activityRules: {},
			currentSkuList: [],
			commentList: [],
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
	computed: {
		...mapState({
			hotGoodsList: state => state.init.initData.template[3].content.list.data //推荐商品
		})
	},
	onLoad() {
		this.init();
	},
	onReady() {},
	methods: {
		...mapActions(['addCartGoods', 'getCartList']),
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
		// 商品详情
		getGoodsDetail() {
			this.$api('score.detail', {
				id: this.$Route.query.scoreId
			}).then(res => {
				if (res.code === 1) {
					this.goodsInfo = res.data;
				}
			});
		},
		goPay() {
			this.showSku = true;
		}
	}
};
</script>

<style lang="scss">
.score-content {
	padding-bottom: 100rpx;
}
// 价格卡片
.price-card {
	padding: 20rpx;
	background: url('http://shopro.7wpp.com/imgs/detail/671e3bc4581f0b35791f382e4b5c2a8.png') no-repeat;
	background-size: 100% 100%;
	.notice {
		font-size: 24rpx;
		color: #fff;
	}
	.score-img {
		width: 36rpx;
		height: 36rpx;
	}
	.price {
		font-size: 36rpx;
		color: #fff;
		font-weight: bold;
		margin: 0 10rpx;
	}

	.price-bottom-box {
		font-size: 24rpx;
		color: #fff;
		font-weight: 500;
		padding-top: 10rpx;
		.original-price {
			text-decoration: line-through;
		}
		.line {
			margin: 0 20rpx;
			display: inline-block;
			width: 3rpx;
			height: 24rpx;
			background-color: #fff;
		}
	}
}

// 商品图片轮播

.swiper-box {
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
	margin-top: 20rpx;
	border-bottom: 1rpx solid rgba(#dfdfdf,0.8);
	position: -webkit-sticky;
	position: sticky;
	top: 0;
	z-index: 99;
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
	min-height: 400rpx;
	background: #fff;
	padding: 30rpx 0 ;

	.rich-box {
		font-size: 0;

		image {
			margin-top: -1rpx; //富文本的图片之间的间隙，一般是空格造成，父级用size:0,可以解决，不行就hack一下
		}
	}

	.goods-size {
		.table-box {
			width: 710rpx;
			margin: 20rpx auto;
			background: rgba(255, 255, 255, 1);
			border: 1rpx solid rgba(223, 223, 223, 1);

			.t-tr {
				height: 68rpx;
				border-bottom: 1rpx solid rgba(223, 223, 223, 1);

				&:last-child {
					border-bottom: none;
				}

				.t-head {
					font-size: 26rpx;
					color: #999;
					flex: 1;
					padding-left: 30rpx;
					height: 100%;
					border-right: 1rpx solid rgba(223, 223, 223, 1);
				}

				.t-detail {
					font-size: 26rpx;
					flex: 4;
					padding-left: 30rpx;
				}
			}
		}
	}

	.goods-comment {
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
.foot_box {
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
</style>
