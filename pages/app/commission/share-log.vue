<!-- 分享记录 -->
<template>
	<view class="page_box">
		<!-- 标题栏 -->
		<view class="head_box">
			<view class="nav-box">
				<cu-custom isBack>
					<block slot="backText"><text class="head-title">分享记录</text></block>
				</cu-custom>
			</view>
			<!-- 分类tab -->
			<view class="tab-box x-f">
				<view class="tab-item flex-sub " v-for="(tab, index) in tabsList" :key="tab.value" @tap="onTab(tab.value)">
					<text class="tab-title" :class="{ 'title-active': tabCurrent === tab.value }">{{ tab.name }}</text>
					<text class="underline" :class="{ 'underline-active': tabCurrent === tab.value }"></text>
				</view>
			</view>
		</view>

		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<!-- 分享记录列表 -->
				<view class="log-list x-f" v-for="item in shareLogList" :key="item.id">
					<view class="log-avatar-wrap"><image class="log-avatar" :src="item.user.avatar" mode=""></image></view>

					<view class="item-right">
						<view class="name">{{ item.user.nickname }}</view>
						<view class="content x-f" v-if="item.type_data">
							<view class="content-img-wrap"><image class="content-img" :src="item.type_data.image" mode=""></image></view>

							<view class="content-text">通过{{ typeObj[item.type] }}访问了商品“{{ item.type_data.title }}”, 进入商城</view>
						</view>
						<view class="item-bottom x-bc">
							<view class="time">{{ $u.timeFormat(item.createtime, 'yyyy年mm月dd日 hh:MM') }}</view>
							<view class="from-text">来自{{ typeObj[item.type] }}分享</view>
						</view>
					</view>
				</view>
				<!-- 更多 -->
				<view v-if="shareLogList.length" class="cu-load text-gray" :class="loadStatus"></view>
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
			loadStatus: '', //loading,over
			currentPage: 1,
			lastPage: 1
		};
	},
	computed: {},
	onLoad() {
		this.getShareLog();
	},
	methods: {
		// 切换分类
		onTab(type) {
			this.tabCurrent = type;
			this.currentPage = 1;
			this.lastPage = 1;
			this.shareLogList = [];
			this.getShareLog();
		},

		// 分享记录数据
		getShareLog() {
			let that = this;
			that.loadStatus = 'loading';
			that.$api('commission.share', {
				type: that.tabCurrent,
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.shareLogList = [...that.shareLogList, ...res.data.data];
					that.lastPage = res.data.last_page;
					if (that.currentPage < res.data.last_page) {
						that.loadStatus = '';
					} else {
						that.loadStatus = 'over';
					}
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
	height: 230rpx;
	background: url('http://shopro.7wpp.com/imgs/commission/share_head_bg.png') no-repeat;
	background-size: 100% auto;
	position: relative;

	.nav-box {
		color: #fff;
		font-size: 40rpx;

		/deep/ .cu-back {
			color: #fff;
			font-size: 40rpx;
		}
	}
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
