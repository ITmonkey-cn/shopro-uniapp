<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="content_box">
			<scroll-view scroll-y="true" class="scroll-box" enable-back-to-top scroll-with-animation>
				<view class="goods-box">
					<view class="goods-list" v-if="goods" v-for="goods in scoreList" :key="goods.id"><sh-score-goods :scoreData="goods"></sh-score-goods></view>
				</view>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
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
			scoreList: []
		};
	},
	onLoad() {
		this.getScoreShopsList();
	},
	computed: {},
	methods: {
		//积分商品列表
		getScoreShopsList() {
			let that = this;
			that.$api('score.list').then(res => {
				if (res.code == 1) {
					that.scoreList = res.data.data;
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
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
