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
				<uni-waterfall v-model="liveList" ref="uWaterfall">
					<template v-slot:left="{ leftList }">
						<view v-for="live in leftList" :key="live.id"><shopro-live-card :detail="live"></shopro-live-card></view>
					</template>
					<template v-slot:right="{ rightList }">
						<view class="demo-warter" v-for="(item, index) in rightList" :key="index">
							<view v-for="live in rightList" :key="live.id"><shopro-live-card :detail="live"></shopro-live-card></view>
						</view>
					</template>
				</uni-waterfall>

				<view v-if="liveList.length" class="cu-load text-gray" :class="loadStatus"></view>
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
import shoproLiveCard from '@/components/shopro-live-card/shopro-live-card.vue';
import uniWaterfall from '@/components/uni-waterfall/uni-waterfall.vue';
export default {
	components: {
		shoproLiveCard,
		uniWaterfall
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
			this.tabCur = cur;
			this.liveList = [];
			this.currentPage = 1;
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
