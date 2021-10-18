<!-- 提现记录 -->
<template>
	<!-- 记录卡片 -->
	<view class="wallet-log-box u-p-b-30">
		<view class="log-list" v-for="item in withdrawLog" :key="item.id">
			<view class="head u-flex u-col-center u-row-between">
				<view class="title">提现至{{ item.apply_type_text }}</view>
				<view class="num">{{ item.money }} 元</view>
			</view>
			<view class="status-box item  u-flex u-col-center u-row-between">
				<view class="item-title">申请状态</view>
				<view class="status-text" :style="{ color: stausMap[item.status] }">{{ item.status_text }}</view>
			</view>
			<view class="time-box item  u-flex u-col-center u-row-between">
				<text class="item-title">账户信息</text>
				<view class="time u-ellipsis-1">{{ item.apply_info | applyInfoFilter }}</view>
			</view>
			<view class="time-box item  u-flex u-col-center u-row-between">
				<text class="item-title">提现单号</text>
				<view class="time">{{ item.apply_sn }}</view>
			</view>
			<view class="time-box item  u-flex u-col-center u-row-between">
				<text class="item-title">手续费</text>
				<view class="time">{{ item.charge_money }} 元</view>
			</view>
			<view class="time-box item  u-flex u-col-center u-row-between">
				<text class="item-title">申请时间</text>
				<view class="time">{{ $u.timeFormat(item.createtime, 'yyyy.mm.dd hh:MM:ss') }}</view>
			</view>
		</view>
		<!-- 更多 -->
		<u-loadmore v-show="!isEmpty" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		<!-- 空置页 -->
		<shopro-empty v-if="isEmpty" marginTop="300rpx" :image="$IMG_URL + '/imgs/empty/no_data.png'" tipText="暂无数据~"></shopro-empty>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			withdrawLog: [],
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1,
			isEmpty: false,
			stausMap: {
				0: '#999',
				1: '#EFAF41',
				2: '#70C140',
				'-1': '#ED5B56'
			}
		};
	},
	computed: {},
	filters: {
	  applyInfoFilter: function (value) {
	    if (!value) return '-';
		return Object.values(value).join(' | ');
	  }
	},
	onLoad() {
		this.getLog();
	},
	// 触底加载更多
	onReachBottom() {
		if (this.currentPage < this.lastPage) {
			this.currentPage += 1;
			this.getLog();
		}
	},
	methods: {
		// 确认提交表单
		getLog() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http('money.withdrawLog', {
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.withdrawLog = [...that.withdrawLog, ...res.data.data];
					that.isEmpty = !that.withdrawLog.length;
					that.lastPage = res.data.last_page;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
				}
			});
		}
	}
};
</script>

<style lang="scss">
// 记录卡片
.log-list {
	min-height: 213rpx;
	background: #ffffff;
	margin-bottom: 10rpx;
	padding-bottom: 10rpx;
	.head {
		padding: 0 35rpx;
		height: 80rpx;
		border-bottom: 1rpx solid #eee;
		margin-bottom: 20rpx;
		.title {
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
		}
		.num {
			font-size: 28rpx;
			font-weight: 500;
			color: #7063d2;
		}
	}
	.item {
		padding: 0 30rpx 10rpx;
		.item-icon {
			color: #c0c0c0;
			font-size: 36rpx;
			margin-right: 8rpx;
		}
		.item-title {
			width: 180rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #c0c0c0;
		}
		.status-text {
			font-size: 24rpx;
			font-weight: 500;
			color: #05c3a1;
		}
		.time {
			font-size: 24rpx;
			font-weight: 400;
			color: #c0c0c0;
		}
	}
}
</style>
