<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="content_box">
			<scroll-view scroll-y="true" class="scroll-box" @scrolltolower="loadMore" enable-back-to-top scroll-with-animation>
				<view class="goods-box">
					<view class="goods-list" v-if="goods" v-for="goods in scoreList" :key="goods.id"><sh-score-goods :scoreData="goods"></sh-score-goods></view>
				</view>
				<!-- 空白页 -->
				<shopro-empty v-if="!scoreList.length && !isLoading" :emptyData="emptyData"></shopro-empty>
				<!-- 加载更多 -->
				<view v-if="scoreList.length" class="cu-load text-gray" :class="loadStatus"></view>
				<!-- load -->
				<shopro-load v-model="isLoading"></shopro-load>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import shScoreGoods from './children/sh-score-goods.vue';
export default {
	components: {
		shScoreGoods
	},
	data() {
		return {
			scoreList: [],
			emptyData: {
				img: '/static/imgs/empty/empty_goods.png',
				tip: '暂无积分商品',
				path: '/pages/index/index',
				pathText: '去首页逛逛'
			},
			loadStatus: '', //loading,over
			currentPage: 1,
			lastPage: 1,
			isLoading: true
		};
	},
	onLoad() {
		this.getScoreShopsList();
	},
	computed: {},
	methods: {
		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.scoreList();
			}
		},
		//积分商品列表
		getScoreShopsList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$api('score.list', {
				page: that.currentPage
			}).then(res => {
				if (res.code == 1) {
					that.isLoading = false;
					that.scoreList = [...that.scoreList, ...res.data.data];
					that.lastPage = res.data.last_page;
					if (that.currentPage < res.data.last_page) {
						that.loadStatus = '';
					} else {
						that.loadStatus = 'over';
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.page_box {
	background: #fff;
}
.goods-box {
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx;
	background-color: #fff;
	.goods-list {
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0px 0px 20rpx 4rpx rgba(199, 199, 199, 0.22);
		border-radius: 20rpx;
		overflow: hidden;
		&:nth-child(2n) {
			margin-right: 0;
		}
	}
}
</style>
