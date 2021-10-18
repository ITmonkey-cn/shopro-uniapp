<template>
	<view class="live-el u-m-p-20 u-m-b-10" v-if="showLive">
		<view class="head">
			<text class="head-title">{{ detail.name }}</text>
			<view class="head-more u-flex u-col-center" @tap="$Router.push('/pages/app/live/list')">
				<text class="u-m-r-10 more-text">更多直播</text>
				<text class="iconfont icon-youjiantou-tianchong more-icon"></text>
			</view>
		</view>

		<!-- 大图 -->
		<view v-if="liveType == 1" v-for="live in liveList" :key="live.id"><shopro-live-card :type="1" :detail="live"></shopro-live-card></view>

		<!-- 小图 -->
		<view class="content-two" v-if="liveType == 2">
			<view class="content-two__item" v-for="live in liveList" :key="live.id">
				<shopro-live-card :type="2" :detail="live" :wh="345">
					<block slot="liveGoods"><text></text></block>
				</shopro-live-card>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 自定义之直播卡片
 * @property {Object} detail - 直播信息
 */
export default {
	components: {},
	data() {
		return {
			liveList: [],
			showLive: this.detail.ids,
			liveType: this.detail.style
		};
	},
	props: {
		detail: {}
	},
	created() {
		this.showLive && this.getLiveList();
	},
	computed: {},
	methods: {
		// 直播列表
		getLiveList() {
			let that = this;
			that.$http('common.live', {
				type: 'all',
				ids: that.detail.ids
			}).then(res => {
				if (res.code === 1) {
					that.liveList = res.data;
				}
			});
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
	padding: 30rpx 20rpx;
	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		&-title {
			font-size: 32rpx;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
		}
		&-more {
			.more-text {
				font-size: 22rpx;
				font-weight: 500;
				color: #333333;
			}
			.more-icon {
				font-size: 24rpx;
				color: #333333;
			}
		}
	}
	// 双图直播
	.content-two {
		width: 710rpx;
		display: flex;
		flex-wrap: wrap;
		&__item {
			margin-right: 20rpx;
			margin-top: 20rpx;
			width: 345rpx;
			&:nth-child(2n) {
				margin-right: 0;
			}
		}
	}
}
</style>
