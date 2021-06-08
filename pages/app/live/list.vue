<!-- 直播列表 -->
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
			<scroll-view enable-back-to-top scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<u-waterfall v-model="liveList" ref="uWaterfall" v-if="liveList.length">
					<template v-slot:left="{ leftList }">
						<view class="u-flex u-row-center u-col-center u-m-b-20" v-for="live in leftList" :key="live.id">
							<shopro-live-card :type="2" :detail="live"></shopro-live-card>
						</view>
					</template>
					<template v-slot:right="{ rightList }">
						<view class="u-flex u-row-center u-col-center u-m-b-20" v-for="live in rightList" :key="live.id">
							<shopro-live-card :type="2" :detail="live"></shopro-live-card>
						</view>
					</template>
				</u-waterfall>

				<!-- 更多 -->
				<u-loadmore v-if="liveList.length" height="80rpx" :status="loadStatus" color="#ccc" />
				<!-- 置空页 -->
				<u-empty :show="isEmpty" mode="list"></u-empty>
			</scroll-view>
		</view>
		<shopro-auth-modal></shopro-auth-modal>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			tabCur: 'all',
			isEmpty: false,
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
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1
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
			if (this.tabCur !== cur) {
				this.tabCur = cur;
				this.liveList = [];
				this.currentPage = 1;
				this.lastPage = 1;
				this.getLiveList();
			}
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
			that.loadStatus = 'loading';
			that.$http('common.live', {
				type: that.tabCur,
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.liveList = [...that.liveList, ...res.data.data];
					that.isEmpty = !that.liveList.length;
					that.lastPage = res.data.last_page;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
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
	display: flex;

	&__item {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}
	&__item-name {
		font-size: 28rpx;

		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
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
	margin: 20rpx auto;
	width: 730rpx;
}
</style>
