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
				<view class="card-num">{{ showMoney ? '2999999.99' : '***' }}</view>
				<view class="card-bottom x-bc">
					<view class="card-item y-start">
						<view class="item-title">待入账佣金</view>
						<view class="item-value">{{ showMoney ? '2999999.99' : '***' }}</view>
					</view>
					<view class="card-item y-start">
						<view class="item-title">已提现佣金</view>
						<view class="item-value">{{ showMoney ? '2999999.99' : '***' }}</view>
					</view>
					<view class="card-item y-start">
						<view class="item-title">可提现佣金</view>
						<view class="item-value">{{ showMoney ? '2999999.99' : '***' }}</view>
					</view>
				</view>
				<button class="cu-btn draw-btn" @tap="$Router.push({ path: '/pages/app/commission/draw-money' })">提现</button>
			</view>
			<!-- 消费 -->
			<view class="x-bc">
				<view class="consumption-item x-f">
					<text class="cuIcon-goods item-icon"></text>
					<view class="y-start">
						<view class="item-title">我的消费</view>
						<view class="item-value">22000.00</view>
					</view>
				</view>
				<view class="consumption-item x-f">
					<text class="cuIcon-vip item-icon"></text>
					<view class="y-start">
						<view class="item-title">团队消费</view>
						<view class="item-value">22000.00</view>
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
				<view class="total-box">收入￥2100 &emsp;支出￥2100</view>
			</view>
		</u-sticky>

		<view class="content_box">
			<!-- 佣金明细列表 -->
			<view class="log-item x-bc" v-for="item in 16" :key="item">
				<view class="item-left x-f">
					<image class="log-img" src="http://shopro.7wpp.com/imgs/app_icon/icon1.png" mode=""></image>
					<view class="y-start">
						<view class="log-name">这是昵称</view>
						<view class="log-notice">成功邀请好友“小铃铛”注册</view>
					</view>
				</view>
				<view class="item-right y-end">
					<view class="log-num">-50.00</view>
					<view class="log-date">2020.04.22</view>
				</view>
			</view>
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
			selDateText: ''
		};
	},
	computed: {},
	onLoad() {
		this.getToday();
		this.getCommissionLog();
	},
	methods: {
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
		},

		// 选择日期
		selDate(e) {
			this.selDateText = `${e.startYear}.${e.startMonth}.${e.startDay}-${e.endYear}.${e.endMonth}.${e.endDay}`;
		},

		// 佣金明细
		getCommissionLog() {
			that.$api('commission.rewardLog').then(res => {
				if (res.code === 1) {
				}
			});
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
	background: url('http://shopro.7wpp.com/imgs/commission/commission_card_bg.png') no-repeat;
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
