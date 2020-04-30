<template>
	<view class="page_box">
		<view class="head_box">
			<view class="live-tab">
				<view class="live-tab__item" v-for="tab in liveTab" :key="tab.title" @tap="selTab(tab.title)">
					<view class="live-tab__item-name">{{ tab.name }}</view>
					<text class="live-tab__item--link" :class="{ 'live-tab__item--active': tabCur === tab.title }"></text>
				</view>
			</view>
		</view>
		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<view class="list-box">
					<block v-for="live in liveList" :key="live.id"><shopro-live-card :detail="live"></shopro-live-card></block>
				</view>
				<view v-if="liveList.length" class="cu-load text-gray" :class="loadStatus"></view>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
import shoproLiveCard from '@/components/live/shopro-live-card.vue';
export default {
	components: {
		shoproLiveCard
	},
	data() {
		return {
			tabCur: 'all',
			liveTab: [
				{
					title: 'all',
					name: '全部'
				},
				{
					title: 'notice',
					name: '预告'
				},
				{
					title: 'living',
					name: '直播中'
				},
				{
					title: 'lived',
					name: '已结束'
				}
			],
			liveList: [],
			loadStatus: '', //loading,over
			currentPage: 1,
			lastPage: 0
		};
	},
	computed: {},
	onLoad() {
		this.getLiveList();
	},
	onHide() {},
	methods: {
		// 切换tab
		selTab(cur) {
			this.tabCur = cur;
			this.liveList = [];
			this.getLiveList();
		},
		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getLiveList();
			}
		},
		// 直播列表
		getLiveList() {
			let that = this;
			that.$api('live', {
				type: that.tabCur,
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.liveList = [...that.liveList, ...res.data.data];
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
// tab
.live-tab {
	width: 100%;
	height: 96rpx;
	background: #fff;
	@include flex($align: center);
	&__item {
		flex: 1;
		height: 100%;
		@include flex($direction: column, $justify: between, $align: center);
	}
	&__item-name {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		flex: 1;
		@include flex($justify: center, $align: center);
	}
	&__item--link {
		width: 68rpx;
		height: 4rpx;
		background: transparent;
		border-radius: 2rpx;
	}
	&__item--active {
		width: 68rpx;
		height: 4rpx;
		background: rgba(213, 166, 90, 1);
		border-radius: 2rpx;
	}
}
// 瀑布流 list
.scroll-box {
	.list-box {
		width: 100%;
		-moz-column-count: 2;
		-webkit-column-count: 2;
		column-count: 2;
		padding: 25rpx;
	}
}
</style>
