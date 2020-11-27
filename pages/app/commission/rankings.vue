<!-- 分销排行 -->
<template>
	<view class="rankings-wrap">
		<!-- 标题栏 -->
		<view class="nav-box">
			<cu-custom isBack>
				<block slot="backText"><text class="head-title">分销排行</text></block>
			</cu-custom>
		</view>

		<!-- 排行榜 -->
		<view class="rankings-list-box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<view class="ranking-list x-bc" v-for="(item, index) in rankingsList" :key="index">
					<view class="list-left x-f">
						<view class="tag-box x-c">
							<text class="tag-text" v-if="index >= 3">{{ index }}</text>
							<image v-else class="tag-icon" :src="rankingsIcon[index]" mode=""></image>
						</view>
						<image class="user-avatar" :src="item.user.avatar" mode=""></image>
						<view class="user-info">
							<view class="name mb10">{{ item.user.nickname }}</view>
							<view class="date">{{ $u.timeFormat(item.createtime, 'yyyy年mm月dd日') }}</view>
						</view>
					</view>
					<view class="list-right y-end">
						<view class="num mb10">{{ item.total_income }}</view>
						<view class="des">累计收益</view>
					</view>
				</view>
				<!-- 更多 -->
				<u-loadmore v-if="rankingsList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			rankingsIcon: {
				0: this.$IMG_URL + '/imgs/commission/01.png',
				1: this.$IMG_URL + '/imgs/commission/02.png',
				2: this.$IMG_URL + '/imgs/commission/03.png'
			},
			rankingsList: [], //排行榜
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1
		};
	},
	computed: {},
	onLoad() {
		this.getRankings();
	},
	methods: {
		getRankings() {
			let that = this;
			that.loadStatus = 'loading';
			that.$api('commission.ranking').then(res => {
				if (res.code === 1) {
					that.rankingsList = [...that.rankingsList, ...res.data.data];
					that.lastPage = res.data.last_page;
					if (that.currentPage < res.data.last_page) {
						that.loadStatus = 'loadmore';
					} else {
						that.loadStatus = 'nomore';
					}
				}
			});
		},

		// 加载更多
		loadMore() {
			if (this.currentPage < 6) {
				this.currentPage += 1;
				this.getRankings();
			}
		}
	}
};
</script>

<style lang="scss">
.rankings-wrap {
	background: url($IMG_URL+'/imgs/commission/rankings_bg.png') no-repeat;
	background-size: 100% auto;
	height: 100%;
	overflow: hidden;
}
.nav-box {
	/deep/ .cu-back {
		color: #fff;
		font-size: 40rpx;
	}
	.head-title {
		font-size: 38rpx;
		color: #fff;
	}
}

// 排行榜列表
.rankings-list-box {
	background-color: #fff;
	border-radius: 20rpx 20rpx 0px 0px;
	width: 690rpx;
	height: 100%;
	margin: 60rpx auto 0;
	.ranking-list {
		height: 140rpx;
		padding: 0 30rpx;
		border-bottom: 1rpx solid #e5e5e5;
		.list-left {
			.tag-box {
				width: 50rpx;
				font-size: 36rpx;
				font-weight: 500;
				color: #beb4b3;
				margin-right: 20rpx;
				.tag-icon {
					width: 40rpx;
					height: 60rpx;
				}
			}
			.user-avatar {
				width: 66rpx;
				height: 66rpx;
				border-radius: 50%;
				margin-right: 30rpx;
			}
			.user-info {
				.name {
					font-size: 28rpx;
					font-weight: bold;
					color: #333333;
				}
				.date {
					font-size: 24rpx;
					font-weight: 400;
					color: #999999;
				}
			}
		}
		.list-right {
			.num {
				font-size: 30rpx;
				font-weight: 500;
				color: #5e4ddf;
			}
			.des {
				font-size: 24rpx;
				font-weight: 500;
				color: #a09a98;
			}
		}
	}
}
</style>
