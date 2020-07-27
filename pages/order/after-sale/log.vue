<template>
	<view class="log-box">
		<view class="cu-timeline">
			<view class="cu-item " v-for="(log, index) in aftersaleLog" :key="log.id" :class="index == 0 ? 'text-green' : 'text-gray'">
				<view class="item-list">
					<view class="item-title">{{ log.reason }}</view>
					<view class="item-content"><rich-text :nodes="log.content"></rich-text></view>
					<view class="item-img-box" v-if="log.images.length">
						<block v-for="img in log.images" :key="img"><image :src="img" class="log-img" mode="aspectFill"></image></block>
					</view>
					<view class="item-time">{{ formatTime(log.createtime) }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			aftersaleLog: []
		};
	},
	computed: {},
	onLoad() {
		this.getAftersaleDetail();
	},
	methods: {
		// 服务单详情
		getAftersaleDetail() {
			let that = this;
			that.$api('order.aftersaleDetail', {
				id: that.$Route.query.aftersaleId
			}).then(res => {
				if (res.code === 1) {
					that.aftersaleLog = res.data.logs;
				}
			});
		},
		//格式时间
		formatTime(time) {
			let createdate = new Date(time * 1000);
			let newTime = this.$tools.dateFormat('YYYY-mm-dd HH:MM', createdate);
			return newTime;
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #fff;
}
.item-list {
	color: #333;
	padding: 20rpx;
	.item-title {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		padding-bottom: 20rpx;
	}
	.item-content {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		line-height: 40rpx;
		padding-bottom: 20rpx;
	}
	.item-img-box {
		.log-img {
			width: 120rpx;
			height: 120rpx;
			background-color: #ccc;
			margin-right: 10rpx;
		}
	}
	.item-time {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
	}
}
</style>
