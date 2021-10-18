<!-- 佣金明细 -->
<template>
	<view class="commission-log-wrap">
		<!-- 钱包卡片 -->
		<view class="wallet-wrap">
			<view class="wallet-card">
				<view class="head-box u-flex">
					<view class="head-title">总收益（元）</view>
					<button class="u-reset-button look-btn" @tap="showMoney = !showMoney">
						<view class="u-iconfont" :class="showMoney ? 'uicon-eye-fill' : 'uicon-eye-off'" style="color: #fff;font-size: 50rpx;"></view>
					</button>
				</view>
				<view class="card-num">{{ showMoney ? agentInfo.total_income || '0.00' : '***' }}</view>
				<view class="card-bottom u-flex u-row-left">
					<view class="card-item u-flex-1">
						<view class="item-title">待入账佣金</view>
						<view class="item-value">{{ showMoney ? agentInfo.delay_money || '0.00' : '***' }}</view>
					</view>
					<view class="card-item u-flex-1">
						<view class="item-title">可提现佣金</view>
						<view class="item-value">{{ showMoney ? userInfo.money || '0.00' : '***' }}</view>
					</view>
				</view>
				<button class="u-reset-button draw-btn" @tap="jump('/pages/user/wallet/withdraw')">提现</button>
			</view>
		</view>

		<!-- 筛选 -->
		<u-sticky offset-top="0" :enable="true">
			<view class="head_box u-flex u-row-between">
				<button class="u-reset-button date-btn u-flex u-col-center" @tap="showCalendar = true">
					{{ selDateText }}
					<text class="u-iconfont uicon-arrow-down-fill u-m-l-20" style="color:#e5e5e5 ; font-size: 34rpx;"></text>
				</button>
				<view class="">
					<view class="total-box">{{ stateMap[stateCurrent] }}￥{{ totalMoney || '0.00' }}</view>
				</view>
			</view>
			<!-- 状态分类 -->
			<view class="u-flex nav-box">
				<view class="state-item u-flex-1 " v-for="(state, index) in statusList" :key="state.value" @tap="onTab(state.value)">
					<text class="state-title" :class="{ 'title-active': stateCurrent === state.value }">{{ state.name }}</text>
					<text class="underline" :class="{ 'underline-active': stateCurrent === state.value }"></text>
				</view>
			</view>
		</u-sticky>

		<view class="item-box">
			<!-- 佣金明细列表 -->
			<view class="log-item u-flex u-row-between" v-for="item in rewardLog" :key="item.id">
				<view class="item-left u-flex">
					<image class="log-img" :src="item.buyer.avatar" mode=""></image>
					<view class="">
						<view class="log-name">{{ item.buyer.nickname }}</view>
						<view class="log-notice">{{ $u.timeFormat(item.createtime, 'yyyy.mm.dd') }}</view>
					</view>
				</view>
				<view class="item-right">
					<view class="log-num" :style="{ color: classType[item.status] }">{{ item.status < 0 ? '-' : '+' }} {{ item.commission }}</view>
					<view class="log-date"></view>
				</view>
			</view>
			<!-- 更多 -->
			<u-loadmore v-if="rewardLog.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			<!-- 缺省页 -->
			<shopro-empty v-if="isEmpty" marginTop="100rpx" :image="$IMG_URL + '/imgs/empty/no_data.png'" tipText="暂无数据"></shopro-empty>
		</view>
		<!-- 日期选择 -->
		<u-calendar
			v-model="showCalendar"
			safeAreaInsetBottom
			ref="uCalendar"
			mode="range"
			start-text="开始"
			end-text="结束"
			active-bg-color="#7063d2"
			active-color="#fff"
			range-bg-color="#e5e2ff"
			range-color="#7063d2"
			:customStyle="{ background: 'linear-gradient(90deg, #A36FFF, #5336FF)', boxShadow: '0 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34)' }"
			@change="selDate"
		></u-calendar>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {},
	data() {
		return {
			stateCurrent: 'all', //默认
			stateMap: {
				all: '全部收入',
				waiting: '待入账',
				accounted: '已入账',
				back: '已退回',
				cancel: '已取消'
			},
			classType: {
				'-1': '#EB2B3D',
				'0': '#05C3A1',
				'1': '#7063D2',
				'-2': '#EEEEEE'
			},
			statusList: [
				{
					name: '全部',
					value: 'all'
				},
				{
					name: '待入账',
					value: 'waiting'
				},
				{
					name: '已入账',
					value: 'accounted'
				},
				{
					name: '已退回',
					value: 'back'
				},
				{
					name: '已取消',
					value: 'cancel'
				}
			],
			showMoney: true, //是否显示金额
			//日期选择
			showCalendar: false,
			selDateText: '',
			rewardLog: [], //佣金记录
			propsDate: '', //日期参数
			totalMoney: '', //收入
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1,
			isEmpty: false
		};
	},
	computed: {
		...mapGetters(['userInfo', 'agentInfo'])
	},
	onLoad() {
		this.getToday();
		this.getCommissionLog();
	},
	onPullDownRefresh() {
		this.rewardLog = [];
		this.currentPage = 1;
		this.lastPage = 1;
		this.getCommissionLog();
	},
	onReachBottom() {
		if (this.currentPage < this.lastPage) {
			this.currentPage += 1;
			this.getCommissionLog();
		}
	},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 切换分类
		onTab(state) {
			if (this.stateCurrent !== state) {
				this.rewardLog = [];
				this.currentPage = 1;
				this.lastPage = 1;
				this.stateCurrent = state;
				this.getCommissionLog();
			}
		},

		//  今日
		getToday() {
			let now = new Date();
			this.selDateText = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
			let dateText = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
			this.propsDate = `${dateText}-${dateText}`;
		},

		// 选择日期
		selDate(e) {
			this.rewardLog = [];
			this.currentPage = 1;
			this.lastPage = 1;
			this.selDateText = `${e.startYear}.${e.startMonth}.${e.startDay}-${e.endYear}.${e.endMonth}.${e.endDay}`;
			let dateText = `${e.startYear}/${e.startMonth}/${e.startDay}-${e.endYear}/${e.endMonth}/${e.endDay}`;
			this.propsDate = dateText;
			this.getCommissionLog();
			this.$refs.uCalendar.init();
		},

		// 佣金明细
		getCommissionLog() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http(
				'commission.rewardLog',
				{
					date: that.propsDate,
					type: that.stateCurrent,
					page: that.currentPage
				},
				'加载中...'
			).then(res => {
				uni.stopPullDownRefresh();
				if (res.code === 1) {
					that.totalMoney = res.data.total_money;
					that.rewardLog = [...that.rewardLog, ...res.data.rewards.data];
					that.lastPage = res.data.rewards.last_page;
					that.isEmpty = !that.rewardLog.length;
					that.loadStatus = that.currentPage < res.data.rewards.last_page ? 'loadmore' : 'nomore';
				}
			});
		},

		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getCommissionLog();
			}
		}
	}
};
</script>

<style lang="scss">
// 分类
.state-item {
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #fff;
	border-bottom: 1rpx solid rgba(#999, 0.5);
	.state-title {
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
// 钱包卡片
.wallet-wrap {
	background-color: #fff;
	padding: 30rpx;
}
.wallet-card {
	width: 690rpx;
	height: 301rpx;
	background: url($IMG_URL+'/imgs/commission/commission_card_bg.png') no-repeat;
	background-size: 100% 100%;
	border-radius: 20rpx;
	padding: 30rpx;
	position: relative;
	box-shadow: 1rpx 5rpx 16rpx 0px rgba(94, 73, 195, 0.81);
	.head-box {
		margin-bottom: 20rpx;
		.head-title {
			font-size: 24rpx;
			font-weight: 400;
			color: #ffffff;
		}
		.look-btn {
			color: #fff;
			font-size: 30rpx;
			background: none;
			padding: 0;
			margin-left: 20rpx;
		}
	}
	.card-num {
		font-size: 40rpx;
		font-weight: 500;
		color: #fefefe;
		margin-bottom: 30rpx;
	}
	.card-bottom {
		.card-item {
			.item-title {
				font-size: 24rpx;
				font-weight: 400;
				color: #ffffff;
				margin-bottom: 10rpx;
			}
			.item-value {
				font-size: 30rpx;
				font-weight: 500;
				color: #fefefe;
			}
		}
	}
	.draw-btn {
		position: absolute;
		top: 35rpx;
		right: 35rpx;
		width: 121rpx;
		line-height: 58rpx;
		background: #ffffff;
		border-radius: 29rpx;
		padding: 0;
		font-size: 24rpx;
		font-weight: 500;
		color: #5848c4;
	}
}

// 表头
.head_box {
	height: 120rpx;
	padding: 0 30rpx;
	background-color: #f6f6f6;
	.date-btn {
		background-color: #fff;
		line-height: 54rpx;
		border-radius: 27rpx;
		padding: 0 20rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #666666;
	}
	.total-box {
		font-size: 24rpx;
		font-weight: 500;
		color: #666666;
	}
}
// 佣金明细列表
.item-box {
	margin: 20rpx 0;
}
.log-item {
	height: 142rpx;
	background-color: #fff;
	padding: 0 30rpx;
	border-bottom: 1rpx solid #eee;
	.item-left {
		.log-img {
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
			margin-right: 24rpx;
		}
		.log-name {
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 12rpx;
		}
		.log-notice {
			font-size: 22rpx;
			font-weight: 500;
			color: #c0c0c0;
		}
	}
	.item-right {
		.log-num {
			font-size: 28rpx;
			font-weight: 500;
			color: #05c3a1;
		}
		.log-date {
			font-size: 24rpx;
			font-weight: 400;
			color: #c0c0c0;
		}
	}
}
</style>
