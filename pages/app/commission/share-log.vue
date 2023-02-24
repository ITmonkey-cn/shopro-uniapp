<!-- 分享记录 -->
<template>
	<view class="page_box">
		<!-- 标题栏 -->
		<view class="head_box">
			<view class="nav-box">
				<!-- 标题栏 -->
				<shopro-navbar back-icon-color="#fff" :background="{}" :backTextStyle="{ color: '#fff', fontSize: '40rpx', fontWeight: '500' }" backText="分享记录"></shopro-navbar>
			</view>
			<!-- 分类tab -->
			<view class="tab-box u-flex">
				<view class="tab-item u-flex-1 " v-for="(tab, index) in tabsList" :key="tab.value" @tap="onTab(tab.value)">
					<text class="tab-title" :class="{ 'title-active': tabCurrent === tab.value }">{{ tab.name }}</text>
					<text class="underline" :class="{ 'underline-active': tabCurrent === tab.value }"></text>
				</view>
			</view>
		</view>

		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<!-- 分享记录列表 -->
				<view class="log-list u-flex" v-for="item in shareLogList" :key="item.id">
					<view class="log-avatar-wrap"><image class="log-avatar" :src="item.user.avatar" mode=""></image></view>

					<view class="item-right">
						<view class="name">{{ item.user.nickname }}</view>
						<view class="content u-flex">
							<view class="content-img-wrap" v-if="item.type_data"><image class="content-img" :src="item.type_data.image" mode=""></image></view>

							<view class="content-text">{{ item.msg }}</view>
						</view>
						<view class="item-bottom u-flex u-row-between">
							<view class="time">{{ $u.timeFormat(item.createtime, 'yyyy年mm月dd日 hh:MM') }}</view>
							<view class="from-text">来自{{ typeObj[item.type] }}分享</view>
						</view>
					</view>
				</view>
				<!-- 缺省页 -->
				<shopro-empty v-if="isEmpty" :image="$IMG_URL + '/imgs/empty/no_data.png'" tipText="暂无数据"></shopro-empty>
				<!-- 更多 -->
				<u-loadmore v-if="shareLogList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			shareLogList: [], //分享记录
			tabCurrent: 'all', //默认
			tabsList: [
				{
					name: '全部',
					value: 'all'
				},
				{
					name: '名片',
					value: 'index'
				},
				{
					name: '商品',
					value: 'goods'
				},
				{
					name: '拼团',
					value: 'groupon'
				}
			],
			typeObj: {
				index: '名片',
				goods: '商品',
				groupon: '拼团'
			},
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1,
			isEmpty: false
		};
	},
	computed: {},
	onLoad() {
		this.getShareLog();
	},
	onPullDownRefresh() {
		this.currentPage = 1;
		this.lastPage = 1;
		this.shareLogList = [];
		this.getShareLog();
	},
	methods: {
		// 切换分类
		onTab(type) {
			if (this.tabCurrent !== type) {
				this.tabCurrent = type;
				this.currentPage = 1;
				this.lastPage = 1;
				this.shareLogList = [];
				this.getShareLog();
			}
		},

		// 分享记录数据
		getShareLog() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http('commission.share', {
				type: that.tabCurrent,
				page: that.currentPage
			}).then(res => {
				uni.stopPullDownRefresh();
				if (res.code === 1) {
					that.shareLogList = [...that.shareLogList, ...res.data.data];
					that.lastPage = res.data.last_page;
					that.isEmpty = !that.shareLogList.length;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
				}
			});
		},

		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getShareLog();
			}
		}
	}
};
</script>

<style lang="scss">
// nav
.head_box {
	height: 280rpx;
	background: url($IMG_URL+'/imgs/commission/share_head_bg.png') no-repeat;
	background-size: 100% auto;
	position: relative;
}

// 分类
.tab-box {
	background-color: #fff;
	border-radius: 20rpx 20rpx 0px 0px;
	position: absolute;
	width: 100%;
	bottom: 0;

	.tab-item {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.tab-title {
			color: #666;
			font-weight: 500;
			font-size: 28rpx;
			line-height: 90rpx;
		}

		.title-active {
			color: #333;
		}

		.underline {
			display: block;
			width: 68rpx;
			height: 4rpx;
			background: #fff;
			border-radius: 2rpx;
		}

		.underline-active {
			background: #5e49c3;
			display: block;
			width: 68rpx;
			height: 4rpx;
			border-radius: 2rpx;
		}
	}
}

// 分享记录列表
.log-list {
	background-color: #fff;
	padding: 30rpx;
	margin: 10rpx 0;
	align-items: flex-start;

	.log-avatar-wrap {
		margin-right: 14rpx;

		.log-avatar {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
		}
	}

	.item-right {
		flex: 1;
		.name {
			font-size: 26rpx;
			font-weight: 500;
			color: #7f7aa5;
			margin-bottom: 30rpx;
		}

		.content {
			background: rgba(241, 241, 241, 0.46);
			border-radius: 2rpx;
			padding: 10rpx;
			margin-bottom: 20rpx;

			.content-img-wrap {
				margin-right: 16rpx;
				width: 80rpx;
				height: 80rpx;

				.content-img {
					width: 80rpx;
					height: 80rpx;
					border-radius: 6rpx;
				}
			}

			.content-text {
				font-size: 24rpx;
				font-weight: 500;
				color: #333333;
			}
		}

		.item-bottom {
			width: 100%;
			.time {
				font-size: 22rpx;
				font-weight: 500;
				color: #c8c8c8;
			}

			.from-text {
				font-size: 22rpx;
				font-weight: 500;
				color: #c8c8c8;
			}
		}
	}
}
</style>
