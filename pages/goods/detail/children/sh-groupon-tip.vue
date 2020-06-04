<template>
	<swiper class="silde-tip-wrap" @change="changeSwiper" circular vertical disable-touch autoplay :interval="5000" :duration="1000">
		<swiper-item class="silde-box" v-for="item in 3" :key="item">
			<view class="silde-item x-f" :class="{ 'silde--active': current == item - 1 }">
				<image class="item-img" src="/static/imgs/base_avatar.png" mode="aspectFill"></image>
				<text class="item-text">美**{{ item }}刚刚参与了团购</text>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			current: 0
		};
	},
	computed: {},
	methods: {
		changeSwiper(e) {
			this.current = e.detail.current;
		}
	}
};
</script>

<style lang="scss">
.silde-tip-wrap {
	position: absolute;
	left: 30rpx;
	top: 30rpx;
	height: 100rpx;
	width: 750rpx;
	z-index: 999;
	.silde-box {
		.silde-item {
			height: 64rpx;
			background: linear-gradient(90deg, rgba(255, 95, 95, 1) 0%, rgba(255, 108, 0, 1) 100%);
			border-radius: 32rpx;
			padding: 0 10rpx;
			transition: all 1s linear;
			opacity: 0;
			width: 400rpx;
			.item-img {
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				margin-right: 10rpx;
			}
			.item-text {
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(254, 254, 254, 1);
			}
		}
		.silde--active {
			transition: all 1s linear;
			opacity: 0.8;
		}
	}
}
</style>
