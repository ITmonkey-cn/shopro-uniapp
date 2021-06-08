<template>
	<view class="page_box">
		<!-- 搜索框 -->
		<view class="head_box">
			<u-search v-model="searchVal" margin="30rpx" placeholder="搜索商品" height="64" @search="onSearch" @custom="onSearch" @clear="clearSearch"></u-search>
		</view>

		<view class="content_box">
			<!-- 搜索历史 -->
			<view class="search-history" v-if="historyTag.length">
				<view class="title-box u-flex u-row-between u-m-b-40">
					<view class="title">搜索历史</view>
					<button class="u-reset-button clear-history-btn" @tap="showModal = true">清除搜索历史</button>
				</view>
				<view class="content u-flex u-col-center u-row-left u-flex-wrap">
					<button class="item u-reset-button u-m-b-20 u-m-r-20  u-ellipsis-1" @tap="onSearch(item)" v-for="(item, index) in historyTag" :key="index">{{ item }}</button>
				</view>
			</view>
		</view>

		<!-- modal -->
		<u-modal
			ref="uModal"
			v-model="showModal"
			:show-cancel-button="true"
			confirm-color="#e9b461"
			cancel-color="#666666"
			@confirm="clearSearchHistory"
			confirm-text="清除"
			cancel-text="取消"
			content="是否清除历史搜索记录？"
			title="提示"
		></u-modal>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			searchVal: '',
			historyTag: [],
			showModal: false
		};
	},
	computed: {},
	onLoad() {
		this.historyTag = uni.getStorageSync('searchHistoryArr') ? JSON.parse(uni.getStorageSync('searchHistoryArr')) : [];
	},
	methods: {
		// 搜索
		onSearch(e) {
			if (e && !this.historyTag.includes(e)) {
				let searchHistoryArr = JSON.stringify(this.getArr(this.historyTag, e));
				uni.setStorageSync('searchHistoryArr', searchHistoryArr);
			}
			this.$Router.replace(`/pages/goods/list?keywords=${e}`);
			this.searchVal = '';
		},
		// 清除输入框
		clearSearch() {
			this.searchVal = '';
		},
		// 队列
		getArr(list, item) {
			let arr = list;
			let length = 10; //队列长度
			arr.length < length ? arr.unshift(item) : arr.pop();
			return arr;
		},
		// 清除历史记录
		clearSearchHistory() {
			this.historyTag = [];
			uni.removeStorageSync('searchHistoryArr');
		}
	}
};
</script>

<style lang="scss">
.page_box {
	background-color: #fff;
}
.search-history {
	padding: 30rpx;
	.title-box {
		.title {
			font-size: 30rpx;
			font-weight: bold;
			color: #333333;
		}
		.clear-history-btn {
			font-size: 28rpx;
			font-weight: 500;
			color: #999999;
		}
	}
	.content {
		width: 100%;
		.item {
			padding: 0 20rpx;
			line-height: 60rpx;
			background: #f5f6f8;
			border-radius: 30rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
			max-width: 690rpx;
		}
	}
}
</style>
