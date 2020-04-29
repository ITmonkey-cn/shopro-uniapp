<template>
	<view class="sp-live-card" :style="{ width: wh + 'rpx' }">
		<view class="live-content" @tap="goRoom" :style="{ width: wh + 'rpx' }">
			<image class="item-cover" :src="detail.share_img" mode="aspectFill"></image>
			<view class="item-status">
				<image class="status-img" :src="liveStatus[detail.live_status]" mode=""></image>
				<text class="status-text">{{ detail.live_status_name }}</text>
			</view>
			<view class="item-title" :style="{ width: wh + 'rpx' }">{{ detail.name }}</view>
			<!-- 	<image v-if="detail.live_status == 101" class="like-img" src="/static/imgs/live/zan.gif" mode=""></image> -->
		</view>
		<view class="live-bottom" :style="{ width: wh + 'rpx' }">
			<view class="live-info">
				<view class="info-box">
					<image class="info-avatar" :src="detail.anchor_img" mode=""></image>
					<view class="info-name">{{ detail.anchor_name }}</view>
				</view>
			<!-- 	<text class="views">15W观看</text> -->
			</view>
			<slot name="liveGoods">
				<view class="live-goods" v-if="detail.goods.length">
					<view class="live-goods__item" v-for="(goods, index) in detail.goods" :key="goods.id" v-if="index < 3">
						<image class="live-goods__img" :src="goods.cover_img" mode=""></image>
						<view class="live-goods__price" v-if="index < 2">￥{{ goods.price }}</view>
						<view class="live-goods__mark" v-else>
							<text>{{ detail.goods.length }}+</text>
						</view>
					</view>
				</view>
			</slot>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			liveStatus: {
				'101': '/static/imgs/live/live.png',
				'102': '/static/imgs/live/prevue.png',
				'103': '/static/imgs/live/playback.png',
				'107': '/static/imgs/live/past.png'
			}
		};
	},
	props: {
		detail: {},
		wh: 344
	},
	computed: {},
	methods: {
		goRoom(live) {
			let that = this;
			wx.navigateTo({
				url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${that.detail.room_id}`
			});
		}
	}
};
</script>

<style lang="scss">
.sp-live-card {
	width: 344rpx;
	box-shadow: 0px 0px 20rpx 4rpx rgba(199, 199, 199, 0.22);
	border-radius: 20rpx;
	height: 100%;
	overflow: auto;
	margin-bottom: 20rpx;
}
.live-content {
	position: relative;
	width: 344rpx;
	height: 344rpx;
	overflow: hidden;
	.item-cover {
		background-color: #eee;
		width: 100%;
		height: 100%;
		border-radius: 20rpx 20rpx 0 0;
	}
	.item-status {
		position: absolute;
		top: 20rpx;
		left: 10rpx;
		height: 40rpx;
		background: rgba(0, 0, 0, 0.4);
		border-radius: 20rpx;
		@include flex($justify: center, $align: center);
		.status-img {
			width: 38rpx;
			height: 38rpx;
		}
		.status-text {
			font-size: 22rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			padding: 0 10rpx;
		}
	}
	.item-title {
		width: 345rpx;
		position: absolute;
		bottom: 0;
		line-height: 60rpx;
		padding: 0 20rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		background: linear-gradient(transparent, rgba(#000, 0.5));
		@include ellipsis(1);
		padding-right: 60rpx;
	}
	.like-img {
		position: absolute;
		bottom: 20rpx;
		right: 10rpx;
		width: 60rpx;
		height: 130rpx;
	}
}
.live-bottom {
	background-color: #fff;
	padding: 20rpx;
	width: 345rpx;
	.live-info {
		@include flex($justify: between, $align: center);
		width: 100%;
		.info-box {
			@include flex($align: center);
		}
		.info-avatar {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			margin-right: 10rpx;
			background: #eee;
		}
		.info-name {
			width: 150rpx;
			@include ellipsis(1);
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}
		.views {
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
		}
	}
	.live-goods {
		@include flex($justify: between, $align: center);
		margin-top: 20rpx;
		&__item {
			position: relative;
			width: 96rpx;
			height: 96rpx;
			border: 1rpx solid rgba(238, 238, 238, 1);
			border-radius: 10rpx;
			overflow: hidden;
		}
		&__img {
			background: #eee;
			width: 100%;
			height: 100%;
		}
		&__price {
			position: absolute;
			bottom: 0;
			line-height: 40rpx;
			width: 100%;
			background: linear-gradient(transparent, rgba(#000, 0.5));
			font-size: 20rpx;
			color: #fff;
		}
		&__mark {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			margin: auto;
			@include flex($justify: center, $align: center);
			background: rgba(#000, 0.3);
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
		}
	}
}
</style>
