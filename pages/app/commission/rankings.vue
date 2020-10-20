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
			<view class="ranking-list x-bc" v-for="item in 8" :key="item">
				<view class="list-left x-f">
					<view class="tag-box x-c">
						<text class="tag-text" v-if="item >= 4">{{ item }}</text>
						<image v-else class="tag-icon" :src="rankingsIcon[item]" mode=""></image>
					</view>
					<image class="user-avatar" src="/static/imgs/app_icon/icon1.png" mode=""></image>
					<view class="user-info">
						<view class="name mb10">大卫</view>
						<view class="date">2020年10月13日</view>
					</view>
				</view>
				<view class="list-right y-end">
					<view class="num mb10">15679.00</view>
					<view class="des">累计收益</view>
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
			rankingsIcon: {
				1: 'http://shopro.7wpp.com/imgs/commission/01.png',
				2: 'http://shopro.7wpp.com/imgs/commission/02.png',
				3: 'http://shopro.7wpp.com/imgs/commission/03.png'
			}
		};
	},
	computed: {},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss">
.rankings-wrap {
	background: url('http://shopro.7wpp.com/imgs/commission/rankings_bg.png') no-repeat;
	background-size: 100% auto;
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
