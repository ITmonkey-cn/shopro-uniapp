<!-- 推广商品 -->
<template>
	<view class="promotion-goods-wrap">
		<view class="goods-list u-flex" v-for="(item, index) in goodsList" :key="item.goods_id" @tap="jump('/pages/goods/detail', { id: item.id })">
			<view class="img-box"><image class="goods-img" :src="item.image" mode=""></image></view>
			<view class="goods-info u-flex-col u-row-between">
				<view class="goods-title u-ellipsis-1">{{ item.title }}</view>
				<view class="goods-des u-ellipsis-1">{{ item.subtitle }}</view>
				<view class="goods-price u-flex font-OPPOSANS">
					<view class="price">￥{{ item.price }}</view>
					<view class="origin-price">￥{{ item.original_price }}</view>
				</view>
				<view class="commission-num">预计佣金：￥{{ item.commission_money }}</view>
			</view>
			<button class="share-btn u-reset-button" @tap.stop="toShare(index)">分享赚</button>
		</view>

		<!-- 	分享组件 -->
		<shopro-share v-model="showShare" :posterInfo="posterInfo" :posterType="'goods'"></shopro-share>
		<!-- 缺省页 -->
		<shopro-empty v-if="isEmpty" :image="$IMG_URL + '/imgs/empty/no_data.png'" tipText="暂无数据"></shopro-empty>
		<!-- 更多 -->
		<u-loadmore v-if="goodsList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
	</view>
</template>

<script>
import share from '@/shopro/share';
export default {
	components: {},
	data() {
		return {
			showShare: false, //是否分享
			posterInfo: {}, //分享信息
			goodsList: [], //分销商品
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1,
			isEmpty: false
		};
	},
	computed: {},
	onLoad() {
		this.getGoodList();
	},
	onUnload() {
		share.setShareInfo();
	},
	onReachBottom() {
		if (this.currentPage < this.lastPage) {
			this.currentPage += 1;
			this.getGoodList();
		}
	},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 去分享
		toShare(index) {
			const that = this;
			let goodsInfo = this.goodsList[index];
			this.posterInfo = goodsInfo;
			share.setShareInfo({
				title: goodsInfo.title,
				desc: goodsInfo.subtitle,
				image: goodsInfo.image,
				params: {
					page: 2,
					pageId: goodsInfo.id
				}
			});
			this.showShare = true;
		},
		getGoodList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http('commission.goods', {
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.goodsList = [...that.goodsList, ...res.data.data];
					that.lastPage = res.data.last_page;
					that.isEmpty = !that.goodsList.length;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #fff;
}
// 推广商品列表
.goods-list {
	padding: 30rpx;
	border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);
	position: relative;
	.share-btn {
		position: absolute;
		bottom: 30rpx;
		right: 30rpx;
		width: 160rpx;
		line-height: 60rpx;
		background: linear-gradient(90deg, #a36fff, #5336ff);
		box-shadow: 0px 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
		border-radius: 30rpx;
		font-size: 28rpx;
		color: #fff;
		font-weight: 500;
	}
	.img-box {
		border: 1rpx solid rgba(223, 223, 223, 0.43);
		margin-right: 30rpx;
		.goods-img {
			width: 200rpx;
			height: 200rpx;
		}
	}
	.goods-info {
		align-items: flex-start;
		height: 200rpx;

		.goods-title {
			width: 400rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 10rpx;
		}
		.goods-des {
			width: 400rpx;
			font-size: 22rpx;
			font-weight: 500;
			color: #a8700d;
			margin-bottom: 10rpx;
		}
		.goods-price {
			margin-bottom: 10rpx;
			.price {
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				margin-right: 16rpx;
			}
			.origin-price {
				font-size: 24rpx;

				font-weight: 400;
				text-decoration: line-through;
				color: #999999;
			}
		}
		.commission-num {
			font-size: 24rpx;
			font-weight: 500;
			color: #5e4ddf;
		}
	}
}
</style>
