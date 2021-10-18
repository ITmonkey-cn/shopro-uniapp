<!-- 售后进行 -->
<template>
	<view class="log-box wrap">
		<u-time-line>
			<u-time-line-item v-for="(log, index) in aftersaleLog" :key="log.id" nodeTop="4">
				<template v-slot:node>
					<view class="u-node" :style="index === 0 ? 'background: #19be6b;' : ''"><text class="u-iconfont uicon-bell-fill" style="color: #fff;font-size: 26rpx;"></text></view>
				</template>
				<template v-slot:content>
					<view class="u-order-title unacive u-m-b-20">{{ log.reason }}</view>
					<view class="u-order-desc  u-m-b-10" v-show="log.content"><u-parse :html="log.content"></u-parse></view>
					<view class="item-img-box u-flex u-flex-wrap" v-show="log.images.length">
						<block v-for="(img, index) in log.images" :key="index"><image :src="img" class="log-img" mode="aspectFill"></image></block>
					</view>
					<view class="u-order-time">{{ $u.timeFormat(log.createtime, 'yyyy-mm-dd hh:MM') }}</view>
				</template>
			</u-time-line-item>
		</u-time-line>
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
			that.$http('order.aftersaleDetail', {
				id: that.$Route.query.aftersaleId
			}).then(res => {
				if (res.code === 1) {
					that.aftersaleLog = res.data.logs;
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	padding: 24rpx 24rpx 24rpx 40rpx;
	background-color: #fff;
}

.u-node {
	width: 44rpx;
	height: 44rpx;
	border-radius: 100rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #d0d0d0;
}

.u-order-title {
	color: #333333;
	font-weight: bold;
	font-size: 32rpx;
}

.u-order-title.unacive {
	color: rgb(150, 150, 150);
}

.u-order-desc {
	color: rgb(150, 150, 150);
	font-size: 28rpx;
	margin-bottom: 6rpx;
}
.item-img-box {
	.log-img {
		display: block;
		width: 140rpx;
		height: 140rpx;
		background-color: #ccc;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 6rpx;
	}
}
.u-order-time {
	color: rgb(200, 200, 200);
	font-size: 26rpx;
}
</style>
