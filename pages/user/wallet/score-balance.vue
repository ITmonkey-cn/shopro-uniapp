<!-- 积分余额 -->
<template>
	<view class="page_box">
		<view class="head_box">
			<shopro-navbar :background="{ background: 'none' }" backText="积分余额" backIconColor="#333"></shopro-navbar>
			<view class="all-box u-flex-col u-row-center u-col-center">
				<text class="all-num">{{ userInfo.score || 0 }}</text>
				<text class="all-title u-m-b-30">当前积分</text>
				<image class="score-card-bg" :src="$IMG_URL + '/imgs/score/score_wallet_bg.png'" mode=""></image>
			</view>
			<view class="tab-box u-flex">
				<view class="tab-item u-flex u-row-center " @tap="onTab('all')"><view class="tab-name" :class="{ 'tab-active': tabCur === 'all' }">全部</view></view>
				<view class="tab-item u-flex u-row-center" @tap="onTab('add')"><view class="tab-name" :class="{ 'tab-active': tabCur === 'add' }">收入</view></view>
				<view class="tab-item u-flex u-row-center" @tap="onTab('reduce')"><view class="tab-name" :class="{ 'tab-active': tabCur === 'reduce' }">支出</view></view>
			</view>
		</view>
		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<view class="item-box u-flex u-row-between" v-for="log in scoreLog" :key="log.id">
					<view class="u-flex-col">
						<view class="name">{{ log.type_name }}</view>
						<view class="time">{{ $u.timeFormat(log.createtime) }}</view>
					</view>
					<view class="num font-OPPOSANS" v-if="log.wallet >= 0">{{ log.wallet }}</view>
					<view class="num font-OPPOSANS" v-else>{{ log.wallet }}</view>
				</view>
				<!-- 空置页 -->
				<shopro-empty v-if="isEmpty" marginTop="200rpx" :image="$IMG_URL + '/imgs/empty/comment_empty.png'" tipText="暂无数据~"></shopro-empty>
				<!-- 更多 -->
				<u-loadmore v-if="scoreLog.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {},
	data() {
		return {
			isEmpty: false,
			tabCur: 'all',
			scoreLog: [],
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1
		};
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	onLoad() {
		this.getScoreLog();
	},
	methods: {
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getScoreLog();
			}
		},
		onTab(type) {
			if (this.tabCur !== type) {
				this.tabCur = type;
				this.scoreLog = [];
				this.currentPage = 1;
				this.getScoreLog();
			}
		},
		// 积分明细
		getScoreLog(type) {
			let that = this;
			that.loadStatus = 'loading';
			that.$http('money.walletLog', {
				wallet_type: 'score',
				status: that.tabCur,
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.scoreLog = [...that.scoreLog, ...res.data.wallet_logs.data];
					that.lastPage = res.data.wallet_logs.last_page;
					that.isEmpty = !that.scoreLog.length;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
				}
			});
		}
	}
};
</script>

<style lang="scss">
.page_box {
	background: #fff;
	.head_box {
		width: 750rpx;
		height: 480rpx;
		background: linear-gradient(180deg, rgba(239, 196, 128, 1) 0%, rgba(248, 220, 165, 1) 40%, rgba(255, 255, 255, 1) 100%) no-repeat;
		position: relative;
		.all-box {
			height: 360rpx;
			padding-bottom: var(--status-bar-height);
			.all-num {
				font-size: 50rpx;
				font-weight: 500;
				color: #a8700d;
				margin-bottom: 20rpx;
			}
			.all-title {
				font-size: 24rpx;
				font-weight: 500;
				color: rgba(168, 112, 13, 1);
			}
			.score-card-bg {
				width: 100%;
				height: 90rpx;
			}
		}
		.tab-box {
			position: absolute;
			left: 50%;
			bottom: 0;
			transform: translateX(-50%);
			width: 710rpx;
			height: 90rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 30rpx 30rpx 0px 0px;
			border-bottom: 1rpx solid #dfdfdf;
			padding: 0 30rpx;
			.tab-item {
				flex: 1;
				.tab-name {
					display: inline-block;
					font-size: 30rpx;
					font-family: Noto Sans S Chinese;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
					border-bottom: 4rpx solid transparent;
					line-height: 86rpx;
				}
				.tab-active {
					border-bottom: 4rpx solid rgba(213, 166, 90, 1);
				}
			}
		}
	}
}
.item-box {
	background: #fff;
	min-height: 150rpx;
	border-bottom: 1rpx solid #dfdfdf;
	padding: 30rpx;
	.name {
		font-size: 28rpx;

		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 28rpx;
		margin-bottom: 20rpx;
	}
	.time {
		font-size: 24rpx;

		font-weight: 500;
		color: rgba(196, 196, 196, 1);
		line-height: 24px;
	}
	.num {
		font-size: 30rpx;

		font-weight: 500;
		color: #e6b873;
	}
}
</style>
