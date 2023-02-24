<template>
	<view class="live-card-wrap">
		<!-- 小卡片 -->
		<view class="sp-live-card" v-if="liveType == 2" :style="{ width: wh + 'rpx' }">
			<view class="live-content" @tap="goRoom" :style="{ width: wh + 'rpx' }">
				<image class="item-cover" :src="detail.share_img" mode="aspectFill"></image>
				<view class="item-status">
					<image class="status-img" :src="liveStatus[liveState].img" mode=""></image>
					<text class="status-text">{{ liveStatus[liveState].title }}</text>
				</view>
				<view class="item-title u-ellipsis-1" :style="{ width: wh + 'rpx' }">{{ detail.name }}</view>
			</view>
			<view class="live-bottom" :style="{ width: wh + 'rpx' }">
				<view class="live-info">
					<view class="info-box">
						<view class="info-name u-ellipsis-1" :style="{ width: wh + 'rpx' }">{{ detail.anchor_name }}</view>
					</view>
				</view>
				<slot name="liveGoods">
					<view class="live-goods" v-if="liveGoodsList.length">
						<view class="live-goods__item" v-for="(goods, index) in liveGoodsList" :key="goods.id" v-if="index < 3">
							<image class="live-goods__img" :src="goods.cover_img" mode=""></image>
							<view class="live-goods__price" v-if="index < 2">￥{{ goods.price }}</view>
							<view class="live-goods__mark" v-else>
								<text>{{ liveGoodsList.length }}+</text>
							</view>
						</view>
					</view>
				</slot>
			</view>
		</view>
		<!-- 大卡片 -->
		<view class="big-card-wrap" v-if="liveType == 1">
			<view class="content-one__item" @tap="goRoom">
				<image class="item-cover" :src="detail.share_img" mode="widthFix"></image>
				<view class="item-status">
					<image class="status-img" :src="liveStatus[liveState].img" mode=""></image>
					<text class="status-text">{{ liveStatus[liveState].title }}</text>
				</view>
				<view class="item-title u-ellipsis-1">{{ detail.name }}</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 小程序直播显示卡片
 * @property {Object} detail - 直播卡片显示数据
 * @property {Number} wh = [345] - 直播卡片宽度
 * @property {Number|String} style = 2 - 1:大卡片；2:：小卡片
 */
// #ifdef MP-WEIXIN
import { HAS_LIVE } from '@/env';
let livePlayer = null;
// 全局配置文件控制是否开启直播组件，没有此项功能的小程序，运行会报错。
if (HAS_LIVE) {
	livePlayer = requirePlugin('live-player-plugin');
}
//  #endif
let timer = null;
export default {
	name: 'shoproLiveCard',
	components: {},
	data() {
		return {
			liveType: this.type,
			liveState: this.detail.live_status,
			liveGoodsList: this.detail.goods,
			liveStatus: {
				'101': {
					img: this.$IMG_URL + '/imgs/live/live.png',
					title: '直播中'
				},
				'102': {
					img: this.$IMG_URL + '/imgs/live/prevue.png',
					title: '未开始'
				},
				'103': {
					img: this.$IMG_URL + '/imgs/live/playback.png',
					title: '已结束'
				},
				'104': {
					img: this.$IMG_URL + '/imgs/live/104.png',
					title: '禁播'
				},
				'105': {
					img: this.$IMG_URL + '/imgs/live/105.png',
					title: '暂停中'
				},
				'106': {
					img: this.$IMG_URL + '/imgs/live/106.png',
					title: '异常'
				},
				'107': {
					img: this.$IMG_URL + '/imgs/live/past.png',
					title: '已过期'
				}
			}
		};
	},
	props: {
		detail: {
			type: Object,
			default: null
		},
		wh: {
			type: Number,
			default: 345
		},
		type: {
			type: [Number, String],
			default: 2
		}
	},

	computed: {},
	created() {
		this.getLiveStatus();
	},
	mounted() {
		let that = this;
		timer = setInterval(() => {
			that.getLiveStatus();
		}, 60000);
	},
	beforeDestroy() {
		timer = null;
		clearInterval(timer);
	},
	methods: {
		goRoom() {
			let that = this;
			wx.navigateTo({
				url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${that.detail.room_id}`
			});
		},
		// 轮询liveStatus
		getLiveStatus() {
			if (HAS_LIVE) {
				let that = this;
				let date = '';

				if (that.liveState == 102) {
					date = that.$u.timeFormat(that.detail.starttime, 'mm-dd hh:MM');
					that.liveStatus['102'].title = '预告 ' + date;
				}
				livePlayer
					.getLiveStatus({ room_id: that.detail.room_id })
					.then(res => {
						// 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常，107：已过期
						that.liveState = res.liveStatus;
					})
					.catch(err => {
						console.log('get live status', err);
					});
			}
		}
	}
};
</script>

<style lang="scss">
// 小卡片
.sp-live-card {
	width: 335rpx;
	box-shadow: 0px 0px 10rpx 4rpx rgba(199, 199, 199, 0.22);
	border-radius: 20rpx;
	height: 100%;
	overflow: auto;
}
.live-content {
	position: relative;
	width: 335rpx;
	height: 335rpx;
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
		display: flex;
		justify-content: center;
		align-items: center;
		.status-img {
			width: 40rpx;
			height: 40rpx;
		}
		.status-text {
			font-size: 22rpx;

			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			padding: 0 10rpx;
		}
	}
	.item-title {
		width: 335rpx;
		position: absolute;
		bottom: 0;
		line-height: 60rpx;
		padding: 0 20rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		background: linear-gradient(transparent, rgba(#000, 0.5));
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
	width: 335rpx;
	.live-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		.info-box {
			display: flex;
			align-items: center;
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
			font-size: 24rpx;

			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}
		.views {
			font-size: 20rpx;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
		}
	}
	.live-goods {
		display: flex;
		align-items: center;
		margin-top: 20rpx;
		&__item {
			position: relative;
			width: 96rpx;
			height: 96rpx;
			border: 1rpx solid rgba(238, 238, 238, 1);
			border-radius: 10rpx;
			overflow: hidden;
			margin-right: 8rpx;
			&:nth-child(3n) {
				margin-right: 0;
			}
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
			display: flex;
			justify-content: center;
			align-items: center;
			background: rgba(#000, 0.3);
			font-size: 24rpx;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
		}
	}
}
// 单个大图直播
.big-card-wrap {
	.content-one__item {
		position: relative;
		height: 280rpx;
		border-radius: 20rpx;
		margin-top: 16rpx;
		overflow: hidden;
		.item-cover {
			background-color: #eee;
			width: 100%;
			height: 100%;
		}
		.item-status {
			position: absolute;
			top: 20rpx;
			left: 10rpx;
			height: 40rpx;
			background: rgba(0, 0, 0, 0.4);
			border-radius: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
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
			width: 100%;
			position: absolute;
			bottom: 0;
			line-height: 60rpx;
			padding: 0 20rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			background: linear-gradient(transparent, rgba(#000, 0.5));
		}
		.like-img {
			position: absolute;
			bottom: 20rpx;
			right: 10rpx;
			width: 60rpx;
			height: 130rpx;
		}
	}
}
</style>
