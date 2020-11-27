<!-- 佣金明细 -->
<template>
	<view class="commission-log-wrap">
		<!-- 钱包卡片 -->
		<view class="wallet-wrap">
			<view class="wallet-card">
				<view class="head-box x-f">
					<view class="head-title">总收益（元）</view>
					<button class="cu-btn look-btn" @tap="onEye">
						<text v-if="showMoney" class="cuIcon-attentionfill"></text>
						<text v-else class="cuIcon-attentionforbidfill"></text>
					</button>
				</view>
				<view class="card-num">{{ showMoney ? agentInfo.total_income || '0.00' : '***' }}</view>
				<view class="card-bottom x-bc">
					<view class="card-item y-start">
						<view class="item-title">待入账佣金</view>
						<view class="item-value">{{ showMoney ? agentInfo.delay_money || '0.00' : '***' }}</view>
					</view>
					<view class="card-item y-start">
						<view class="item-title">已提现佣金</view>
						<view class="item-value">{{ showMoney ? agentInfo.total_withdraw || '0.00' : '***' }}</view>
					</view>
					<view class="card-item y-start">
						<view class="item-title">可提现佣金</view>
						<view class="item-value">{{ showMoney ? userInfo.money || '0.00' : '***' }}</view>
					</view>
				</view>
				<button class="cu-btn draw-btn" @tap="jump('/pages/user/wallet/index')">提现</button>
			</view>
			<!-- 消费 -->
			<view class="x-bc">
				<view class="consumption-item x-f">
					<text class="cuIcon-goods item-icon"></text>
					<view class="y-start">
						<view class="item-title">我的消费</view>
						<view class="item-value">{{ agentInfo.order_money || '0.00' }}</view>
					</view>
				</view>
				<view class="consumption-item x-f">
					<text class="cuIcon-vip item-icon"></text>
					<view class="y-start">
						<view class="item-title">团队消费</view>
						<view class="item-value">{{ agentInfo.child_order_money_1 || '0.00' }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 筛选 -->
		<u-sticky offset-top="0" :enable="true">
			<view class="head_box x-bc">
				<button class="cu-btn date-btn" @tap="onFilterDate">
					{{ selDateText }}
					<text class="cuIcon-triangledownfill"></text>
				</button>
				<view class="total-box">收入￥{{ totalMoney || '0.00' }}</view>
			</view>
		</u-sticky>

		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<!-- 佣金明细列表 -->
				<view class="log-item x-bc" v-for="item in rewardLog" :key="item.id">
					<view class="item-left x-f">
						<image class="log-img" :src="item.buyer.avatar" mode=""></image>
						<view class="y-start">
							<view class="log-name">{{ item.buyer.nickname }}</view>
							<view class="log-notice">{{ $u.timeFormat(item.createtime, 'yyyy.mm.dd') }}</view>
						</view>
					</view>
					<view class="item-right y-end">
						<view class="log-num">+{{ item.commission }}</view>
						<view class="log-date"></view>
					</view>
				</view>
				<!-- 更多 -->
				<u-loadmore v-if="rewardLog.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
				<!-- 缺省页 -->
				<shopro-empty v-if="emptyData.show" :emptyData="emptyData" :isFixed="false"></shopro-empty>
			</scroll-view>
		</view>
		<!-- 日期选择 -->
		<u-calendar
			v-model="showCalendar"
			:mode="mode"
			:start-text="startText"
			:end-text="endText"
			:range-color="rangeColor"
			:range-bg-color="rangeBgColor"
			:active-bg-color="activeBgColor"
			btnType="success"
			@change="selDate"
		></u-calendar>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			agentInfo: uni.getStorageSync('agentInfo'),
			userInfo: uni.getStorageSync('userInfo'),
			showMoney: true, //是否显示金额
			//日期选择
			showCalendar: false,
			mode: 'range',
			result: '请选择日期',
			startText: '开始',
			endText: '结束',
			rangeColor: '#4CB89D',
			rangeBgColor: 'rgba(76,184,157,0.13)',
			activeBgColor: '#4CB89D',
			selDateText: '',
			rewardLog: [], //佣金记录
			propsDate: '', //日期参数
			totalMoney: '', //收入
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1,
			emptyData: {
				show: false,
				img: this.$IMG_URL + '/imgs/empty/no_data.png',
				tip: '暂无数据',
				path: '',
				pathText: ''
			}
		};
	},
	computed: {},
	onLoad() {
		this.getToday();
		this.getCommissionLog();
	},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 点击日期选择
		onFilterDate() {
			this.showCalendar = true;
		},

		// 是否显示金额
		onEye() {
			this.showMoney = !this.showMoney;
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
		},

		// 佣金明细
		getCommissionLog() {
			let that = this;
			that.loadStatus = 'loading';
			that.emptyData.show = false;
			that.$api('commission.rewardLog', {
				date: that.propsDate
			}).then(res => {
				if (res.code === 1) {
					that.totalMoney = res.data.total_money;
					that.rewardLog = [...that.rewardLog, ...res.data.rewards.data];
					that.lastPage = res.data.rewards.last_page;
					if (!that.rewardLog.length) {
						that.emptyData.show = true;
					}
					if (that.currentPage < res.data.rewards.last_page) {
						that.loadStatus = 'loadmore';
					} else {
						that.loadStatus = 'nomore';
					}
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
	margin-bottom: 40rpx;
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
			.cuIcon-attentionfill,
			.cuIcon-attentionforbidfill {
				line-height: 30rpx;
			}
			.cuIcon-attentionfill {
				line-height: 30rpx;
			}
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
		height: 58rpx;
		background: #ffffff;
		border-radius: 29rpx;
		padding: 0;
		font-size: 24rpx;
		font-weight: 500;
		color: #5848c4;
	}
}

// 消费
.consumption-item {
	flex: 1;
	.item-icon {
		color: #5e49c3;
		font-size: 50rpx;
		font-weight: bold;
		margin-right: 20rpx;
	}
	.item-title {
		font-size: 24rpx;
		font-weight: 500;
		color: #999999;
	}
	.item-value {
		font-size: 30rpx;
		font-weight: 500;
		color: #333333;
	}
}
// 表头
.head_box {
	height: 120rpx;
	padding: 0 30rpx;
	background-color: #f6f6f6;
	.date-btn {
		background-color: #fff;
		height: 54rpx;
		border-radius: 27rpx;
		padding: 0;
		padding-left: 20rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #666666;
		.cuIcon-triangledownfill {
			font-size: 60rpx;
			color: #e5e5e5;
		}
	}
	.total-box {
		font-size: 24rpx;
		font-weight: 500;
		color: #666666;
	}
}
// 佣金明细列表
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
