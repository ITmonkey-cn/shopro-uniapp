<template>
	<block>
		<view class="load-box" v-if="!goodsInfo.price"><shopro-skeletons :type="'detail'"></shopro-skeletons></view>
		<view class="page_box" v-else>
			<view class="head_box"></view>
			<view class="content_box">
				<scroll-view class="scroll-box" scroll-y="true" scroll-with-animation enable-back-to-top>
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
				</scroll-view>
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
// 价格卡片
.price-card {
	padding: 20rpx;
	background: url(data:image/png;base64,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)
		no-repeat;
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
	margin-bottom: 1rpx;
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
			bottom: 0;
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
	margin-bottom: 20rpx;
	background: #fff;
	padding: 30rpx 0;

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
