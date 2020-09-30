<template>
	<view class="live-el mx20 mb10" v-if="detail.ids">
		<view class="head">
			<text class="head-title">{{ detail.name }}</text>
			<view class="head-more" @tap="$Router.push('/pages/app/live/list')">
				<text>更多</text>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="content-one" v-if="detail.style == 1">
			<view class="content-one__item" v-for="live in liveList" :key="live.id" @tap="goRoom(live)">
				<image class="item-cover" :src="live.share_img" mode="widthFix"></image>
				<view class="item-status">
					<image class="status-img" :src="liveStatus[live.live_status].img" mode=""></image>
					<text class="status-text">{{ liveStatus[live.live_status].title }}</text>
				</view>
				<view class="item-title">{{ live.name }}</view>
				<!-- <image v-if="live.live_status == 101" class="like-img" src="http://shopro.7wpp.com/imgs/live/zan.gif" mode=""></image> -->
			</view>
		</view>
		<view class="content-two" v-if="detail.style == 2">
			<view class="content-two__item" v-for="live in liveList" :key="live.id">
				<shopro-live-card :detail="live" :wh="320">
					<block slot="liveGoods"><text></text></block>
				</shopro-live-card>
			</view>
		</view>
	</view>
</template>

<script>
import shoproLiveCard from '@/components/shopro-live-card/shopro-live-card.vue';
// #ifdef MP-WEIXIN
import { HAS_LIVE } from '@/env';
let livePlayer = null;
if (HAS_LIVE) {
	livePlayer = requirePlugin('live-player-plugin');
}
//  #endif
let timer = null;
export default {
	components: {
		shoproLiveCard
	},
	data() {
		return {
			liveList: [],
			liveStatus: {
				'101': {
					img: 'http://shopro.7wpp.com/imgs/live/live.png',
					title: '直播中'
				},
				'102': {
					img: 'http://shopro.7wpp.com/imgs/live/prevue.png',
					title: '未开始'
				},
				'103': {
					img: 'http://shopro.7wpp.com/imgs/live/playback.png',
					title: '已结束'
				},
				'104': {
					img: 'http://shopro.7wpp.com/imgs/live/104.png',
					title: '禁播'
				},
				'105': {
					img: 'http://shopro.7wpp.com/imgs/live/105.png',
					title: '暂停中'
				},
				'106': {
					img: 'http://shopro.7wpp.com/imgs/live/106.png',
					title: '异常'
				},
				'107': {
					img: 'http://shopro.7wpp.com/imgs/live/past.png',
					title: '已过期'
				}
			}
		};
	},
	props: {
		detail: {}
	},
	created() {
		this.detail.ids && this.getLiveList();
	},
	mounted() {
		let that = this;
		timer = setInterval(() => {
			that.getLiveStatus();
		}, 60000);
	},
	beforeDestroy() {
		timer = null;
	},
	computed: {},
	methods: {
		// 直播列表
		getLiveList() {
			let that = this;
			that.$api('live', {
				type: 'all',
				ids: that.detail.ids
			}).then(res => {
				if (res.code === 1) {
					that.liveList = res.data;
					that.getLiveStatus();
				}
			});
		},
		// 轮询liveStatus
		getLiveStatus() {
			if (HAS_LIVE) {
				let that = this;
				let date = '';
				if (that.detail.live_status == 102) {
					date = that.$tools.dateFormat('mm-dd HH:MM', new Date(that.detail.starttime * 1000)).replace('-', '/');
					that.liveStatus['102'].title = '预告 ' + date;
				}
				livePlayer
					.getLiveStatus({ room_id: that.detail.room_id })
					.then(res => {
						// 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常，107：已过期
						that.detail.live_status = res.liveStatus;
					})
					.catch(err => {
						console.log('get live status', err);
					});
			}
		},
		goRoom(live) {
			wx.navigateTo({
				url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${live.room_id}`
			});
		}
	}
};
</script>

<style lang="scss">
.live-el {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx 20rpx 25rpx;
	.head {
		@include flex($justify: between, $align: center);
		&-title {
			font-size: 32rpx;
			font-weight: bold;
			font-family: PingFang SC;
			color: rgba(51, 51, 51, 1);
		}
		&-more {
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}
	}
	// 单个大图直播
	.content-one {
		.content-one__item {
			position: relative;
			height: 280rpx;
			border-radius: 20rpx;
			margin-top: 25rpx;
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
				width: 680rpx;
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
	// 双图直播
	.content-two {
		width: 100%;
		// -moz-column-count: 2;
		// -webkit-column-count: 2;
		// column-count: 2;
		// padding-top: 20rpx;
		display: flex;
		flex-wrap: wrap;
		&__item {
			margin-right: 30rpx;
			margin-top: 20rpx;
			&:nth-child(2n) {
				margin-right: 0;
			}
		}
	}
}
</style>
