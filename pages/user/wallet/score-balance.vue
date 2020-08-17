<template>
	<view class="page_box">
		<view class="head_box">
			<cu-custom :isBack="true">
				<block slot="backText">积分余额</block>
				<block slot="content"></block>
			</cu-custom>
			<image class="bg" src="http://shopro.7wpp.com/imgs/user/integral_bg.png" mode=""></image>
			<view class="all-box x-c">
				<text class="all-num">{{ score }}</text>
				<text class="all-title">当前积分</text>
			</view>
			<view class="tab-box x-f">
				<view class="tab-item y-f " @tap="onTab('all')"><text class="tab-name" :class="{ 'tab-active': tabDot === 'all' }">全部</text></view>
				<view class="tab-item y-f " @tap="onTab('add')"><text class="tab-name" :class="{ 'tab-active': tabDot === 'add' }">收入</text></view>
				<view class="tab-item y-f " @tap="onTab('reduce')"><text class="tab-name" :class="{ 'tab-active': tabDot === 'reduce' }">支出</text></view>
			</view>
		</view>
		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<view class="item-box x-bc" v-for="log in scoreLog" :key="log.id">
					<view class="y-start">
						<view class="name">{{ log.type_name }}</view>
						<view class="time">{{ timestamp(log.createtime) }}</view>
					</view>
					<view class="num" v-if="log.wallet >= 0">{{ log.wallet }}</view>
					<view class="num" v-else>{{ log.wallet }}</view>
				</view>
				<view v-if="scoreLog.length" class="cu-load text-gray" :class="loadStatus"></view>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			tabDot: 'all',
			scoreLog: [],
			timestamp: this.$tools.timestamp,
			loadStatus: '', //loading,over
			currentPage: 1,
			lastPage: 1
		};
	},
	computed: {
		...mapState({
			score: state => state.user.userInfo.score
		})
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
			this.tabDot = type;
			this.scoreLog = [];
			this.currentPage = 1;
			this.getScoreLog();
		},
		// 积分明细
		getScoreLog(type) {
			let that = this;
			that.loadStatus = 'loading';
			that.$api('user_wallet_log', {
				wallet_type: 'score ',
				status: that.tabDot,
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.scoreLog = [...that.scoreLog, ...res.data.data];
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
.scroll-box {
	flex: 1;
	height: 100%;
	padding: 0 30rpx;
}
.page_box {
	background: #fff;
	.head_box {
		width: 750rpx;
		height: 480rpx;
		background: linear-gradient(180deg, rgba(239, 196, 128, 1) 0%, rgba(248, 220, 165, 1) 56.99999999999999%, rgba(255, 255, 255, 1) 100%);
		position: relative;
		.bg {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 310rpx;
			height: 310rpx;
		}
		.all-box {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 180rpx;
			height: 180rpx;
			.all-num {
				font-size: 50rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #a8700d;
				margin-bottom: 20rpx;
			}
			.all-title {
				position: absolute;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(168, 112, 13, 1);
				line-height: 54rpx;
				text-align: center;
				width: 154rpx;
				height: 53rpx;
				background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
				border-radius: 27rpx;
				bottom: -16rpx;
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
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 28rpx;
		margin-bottom: 20rpx;
	}
	.time {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(196, 196, 196, 1);
		line-height: 24px;
	}
	.num {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #e6b873;
	}
}
</style>
