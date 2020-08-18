<template>
	<view class="page_box store-list-wrap">
		<view class="head_box"></view>
		<view class="content_box">
			<label>
				<view class="store-item x-bc">
					<view class="item-left y-start">
						<text class="store-title">龙宇国际店</text>
						<text class="store-content">郑东新区运动场东路龙宇国际A座</text>
					</view>
					<radio style="transform: scale(0.7);" class="orange" :checked="true" :class="{ checked: true }"></radio>
				</view>
			</label>
		</view>
		<view class="foot_box x-c"><button class="cu-btn save-btn">确认</button></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
	},
	computed: {},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss">
.store-item {
	padding: 0 30rpx;
	height: 180rpx;
	background-color: #fff;
	border-bottom: 1rpx solid rgba(223, 223, 223, 0.6);
	width: 100%;
	.store-title {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(52, 52, 52, 1);
	}
	.store-content {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
	}
}
.foot_box {
	height: 100rpx;
	background: rgba(255, 255, 255, 1);
	padding: 0 20rpx;
	.save-btn {
		width: 710rpx;
		height: 80rpx;
		background: linear-gradient(90deg, rgba(233, 181, 97, 1), rgba(238, 204, 138, 1));
		border: 1rpx solid rgba(238, 238, 238, 1);
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		padding: 0;
		border-radius: 40rpx;
	}
}
</style>
