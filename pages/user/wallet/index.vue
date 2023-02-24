<!-- 我的钱包 -->
<template>
	<view class="wallet-wrap">
		<!-- 钱包卡片 -->
		<view class="head_box u-flex u-row-center u-col-center">
			<view class="card-box">
				<view class="card-head u-flex u-col-center">
					<view class="card-title u-m-r-10">可提现金额（元）</view>
					<view @tap="showMoney = !showMoney" class="u-iconfont"
						:class="showMoney ? 'uicon-eye' : 'uicon-eye-off'" style="color: #fff;font-size: 46rpx;"></view>
				</view>
				<view class="money-num u-p-t-50">{{ showMoney ? userInfo.money || '0.00' : '*****' }}</view>
				<button v-if="initRecharge.enable ==='1'" class="u-reset-button topup-btn"
					@tap="$Router.push('/pages/user/wallet/top-up')">充值</button>
				<button class="u-reset-button withdraw-btn"
					@tap="$Router.push('/pages/user/wallet/withdraw')">提现</button>
			</view>
		</view>
		<!-- 筛选 -->
		<u-sticky offset-top="0" :enable="true">
			<view class="filter-box u-flex u-row-between">
				<button class="u-reset-button date-btn u-flex" @tap="showCalendar = true">
					{{ selDateText }}
					<text class="u-iconfont uicon-arrow-down-fill u-m-l-20" style="color: #e5e5e5"></text>
				</button>
				<view class="total-box">收入￥{{ incomeMoney || '0.00' }} 支出￥{{ expendMoney || '0.00' }}</view>
			</view>
			<!-- 状态分类 -->
			<view class="u-flex nav-box">
				<view class="state-item u-flex-1 " v-for="(state, index) in statusList" :key="state.value"
					@tap="onTab(state.value)">
					<text class="state-title"
						:class="{ 'title-active': stateCurrent === state.value }">{{ state.name }}</text>
					<text class="underline" :class="{ 'underline-active': stateCurrent === state.value }"></text>
				</view>
			</view>
		</u-sticky>

		<!-- 钱包记录 -->
		<view class="wallet-list u-flex" v-for="item in walletLog" :key="item.id">
			<image class="head-img u-m-r-20" :src="item.avatar" mode=""></image>
			<view class="list-content">
				<view class="title-box u-flex u-row-between">
					<text class="title u-ellipsis-1">{{ item.type_name }}{{ item.title ? '-' + item.title : '' }}</text>
					<view class="money">
						<text v-if="item.wallet >= 0" class="add font-OPPOSANS">+{{ item.wallet }}</text>
						<text v-else class="minus font-OPPOSANS">{{ item.wallet }}</text>
					</view>
				</view>
				<text class="time">{{ $u.timeFormat(item.createtime, 'yyyy-mm-dd hh:MM') }}</text>
			</view>
		</view>
		<!-- 空置页 -->
		<shopro-empty v-if="isEmpty" marginTop="200rpx" :image="$IMG_URL + '/imgs/empty/no_data.png'" tipText="暂无数据~">
		</shopro-empty>
		<!-- 更多 -->
		<u-loadmore v-if="!isEmpty" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		<!-- 日期选择 -->
		<u-calendar v-model="showCalendar" ref="uCalendar" safeAreaInsetBottom mode="range" start-text="开始"
			end-text="结束" active-bg-color="#7063d2" active-color="#fff" range-bg-color="#e5e2ff" range-color="#7063d2"
			:customStyle="{ background: 'linear-gradient(90deg, #A36FFF, #5336FF)', boxShadow: '0 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34)' }"
			@change="selDate"></u-calendar>
	</view>
</template>

<script>
	import { mapState, mapActions, mapGetters } from 'vuex';
	export default {
		components: {},
		data() {
			return {
				isEmpty: false,
				stateCurrent: 'all', //默认
				statusList: [{
						name: '全部',
						value: 'all'
					},
					{
						name: '收入',
						value: 'add'
					},
					{
						name: '支出',
						value: 'reduce'
					}
				],
				showMoney: true,
				//日期选择
				showCalendar: false,
				selDateText: '',
				walletLog: [], //钱包记录
				propsDate: '', //日期参数
				incomeMoney: '', //收入
				expendMoney: '', //支出
				loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
				currentPage: 1,
				lastPage: 1
			};
		},
		computed: {
			...mapGetters(['isLogin', 'userInfo', 'initRecharge'])
		},
		onShow() {
			this.isLogin && this.getUserInfo();
			this.getToday();
			this.currentPage = 1;
			this.lastPage = 1;
			this.walletLog = [];
			this.getWalletLog();
		},
		// 触底加载更多
		onReachBottom() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getWalletLog();
			}
		},
		methods: {
			...mapActions(['getUserInfo']),
			//  今日
			getToday() {
				let now = new Date();
				let dateText = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
				this.selDateText = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
				this.propsDate = `${dateText}-${dateText}`;
			},
			// tab切换
			onTab(state) {
				if (this.stateCurrent !== state) {
					this.stateCurrent = state;
					this.currentPage = 1;
					this.lastPage = 1;
					this.walletLog = [];
					this.getWalletLog();
				}
			},
			// 日期选择
			selDate(e) {
				this.walletLog = [];
				this.currentPage = 1;
				this.lastPage = 1;
				this.selDateText = `${e.startYear}.${e.startMonth}.${e.startDay}-${e.endYear}.${e.endMonth}.${e.endDay}`;
				let dateText = `${e.startYear}/${e.startMonth}/${e.startDay}-${e.endYear}/${e.endMonth}/${e.endDay}`;
				this.propsDate = dateText;
				this.getWalletLog();
				this.$refs.uCalendar.init();
			},
			// 钱包明细
			getWalletLog() {
				let that = this;
				that.loadStatus = 'loading';
				that.$http('money.walletLog', {
					wallet_type: 'money',
					status: that.stateCurrent,
					date: that.propsDate,
					page: that.currentPage
				}).then(res => {
					if (res.code === 1) {
						that.walletLog = [...that.walletLog, ...res.data.wallet_logs.data];
						that.incomeMoney = res.data.income;
						that.expendMoney = Math.abs(res.data.expend);
						that.isEmpty = !that.walletLog.length;
						that.lastPage = res.data.wallet_logs.last_page;
						that.loadStatus = that.currentPage < res.data.wallet_logs.last_page ? 'loadmore' :
							'nomore';
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	// 钱包记录
	.wallet-list {
		width: 750rpx;
		padding: 30rpx;
		background-color: #ffff;
		border-bottom: 1rpx solid #eeeeee;

		.head-img {
			width: 70rpx;
			height: 70rpx;
			border-radius: 50%;
			background: #ccc;
		}

		.list-content {
			justify-content: space-between;
			align-items: flex-start;
			flex: 1;

			.title {
				font-size: 28rpx;
				color: #333;
				width: 400rpx;
			}

			.time {
				color: #c0c0c0;
				font-size: 22rpx;
			}
		}

		.money {
			font-size: 28rpx;
			font-weight: bold;

			.add {
				color: #7063d2;
			}

			.minus {
				color: #333333;
			}
		}
	}

	// 钱包
	.head_box {
		width: 750rpx;
		background-color: #fff;
		padding: 30rpx 0;

		.card-box {
			width: 690rpx;
			min-height: 300rpx;
			padding: 40rpx;
			background: url($IMG_URL+'/imgs/user/money_wallet_bg.png') no-repeat;
			background-size: 100% 100%;
			box-shadow: 1rpx 5rpx 16rpx 0 rgba(94, 73, 195, 0.81);
			border-radius: 30rpx;
			overflow: hidden;
			position: relative;

			.card-head {
				color: #fff;
				font-size: 30rpx;
			}

			.money-num {
				font-size: 70rpx;
				line-height: 70rpx;
				font-weight: 500;
				color: #ffffff;
			}

			.reduce-num {
				font-size: 26rpx;
				font-weight: 400;
				color: #ffffff;
			}

			.withdraw-btn {
				width: 120rpx;
				height: 60rpx;
				line-height: 60rpx;
				background: #ffffff;
				border-radius: 30px;
				font-size: 24rpx;
				font-weight: 500;
				color: #5848c4;
				position: absolute;
				right: 30rpx;
				top: 40rpx;
			}

			.topup-btn {
				width: 120rpx;
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 30px;
				font-size: 24rpx;
				font-weight: 500;
				color: #fff;
				border: 1px solid #fff;
				position: absolute;
				right: 180rpx;
				top: 40rpx;
			}
		}
	}

	// 筛选

	.filter-box {
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
			color: #999999;
		}
	}

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
</style>
