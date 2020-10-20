<!-- 我的团队 -->
<template>
	<view class="page_box team-wrap">
		<view class="head_box">
			<cu-custom isBack>
				<block slot="backText"><text class="head-title">我的团队</text></block>
			</cu-custom>
			<!-- 团队数据总览 -->
			<view class="team-data-box x-bc">
				<view class="data-card">
					<view class="total-item">
						<view class="item-title">团队总人数(人)</view>
						<view class="total-num">12345678</view>
					</view>
					<view class="category-item x-f">
						<view class="y-start flex-sub">
							<view class="item-title">一级成员</view>
							<view class="category-num">20000.00</view>
						</view>
						<view class="y-start flex-sub">
							<view class="item-title">二级成员</view>
							<view class="category-num">20000.00</view>
						</view>
					</view>
				</view>
				<view class="data-card">
					<view class="total-item">
						<view class="item-title">总业绩(元)</view>
						<view class="total-num">123456.00</view>
					</view>
					<view class="category-item x-f">
						<view class="y-start flex-sub">
							<view class="item-title">我的业绩</view>
							<view class="category-num">20000.00</view>
						</view>
						<view class="y-start flex-sub">
							<view class="item-title">团队业绩</view>
							<view class="category-num">20000.00</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 筛选 -->
			<view class="filter-box x-f">
				<view class="filter-item flex-sub" v-for="(filter, index) in filterList" :key="index" @tap="onFilter(index)">
					<view class="x-f">
						<text class="filter-title" :class="{ 'title-active': filterCurrent == index }">{{ filter.title }}</text>
						<text v-show="index" class="cuIcon-unfold" :class="{ 'icon-active': filter.isUnfold }"></text>
					</view>
					<text class="underline" :class="{ 'underline-active': filterCurrent == index }"></text>
				</view>
			</view>
		</view>
		<view class="content_box">
			<!-- 团队列表 -->
			<view class="team-box">
				<view class="team-list" v-for="item in 6" :key="item" @tap="onTeamList(item)">
					<sh-collapse-item>
						<block slot="collapse-children">
							<view class="team-children x-f" v-for="item in 6" :key="item">
								<image class="head-img" src="/static/imgs/app_icon/icon1.png" mode=""></image>
								<view class="head-info">
									<view class="name-box x-f">
										<view class="name-text">会员昵称</view>
										<view class="grade-tag tag-box x-f">
											<image class="tag-img" src="/static/imgs/app_icon/icon1.png" mode=""></image>
											<text class="tag-title">铜牌逍客</text>
										</view>
									</view>
									<view class="head-time">2020年10月13日</view>
								</view>
							</view>
						</block>
					</sh-collapse-item>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import shCollapseItem from '../children/sh-collapse-item.vue';
export default {
	components: {
		shCollapseItem
	},
	data() {
		return {
			filterCurrent: 0,
			filterList: [{ title: '综合', isUnfold: false }, { title: '等级', isUnfold: false }, { title: '加入时间', isUnfold: false }]
		};
	},
	computed: {},
	onLoad() {},
	methods: {
		// 点击筛选项
		onFilter(index) {
			this.filterCurrent = index;
			if (this.filterCurrent == index) {
				this.filterList[index].isUnfold = !this.filterList[index].isUnfold;
			}
		},
		// 点击队员项
		onTeamList(index) {}
	}
};
</script>

<style lang="scss">
// 头部卡片
.head_box {
	background: url('http://shopro.7wpp.com/imgs/commission/card_bg.png') no-repeat;
	background-size: 100% auto;
	/deep/ .cu-back {
		color: #fff;
		font-size: 40rpx;
	}
	.head-title {
		font-size: 38rpx;
		color: #fff;
	}
}
// 团队信息总览
.team-data-box {
	margin: 36rpx 20rpx;
	.data-card {
		width: 340rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 20rpx;
		.item-title {
			font-size: 22rpx;
			font-weight: 500;
			color: #999999;
			line-height: 30rpx;
			margin-bottom: 10rpx;
		}
		.total-item {
			margin-bottom: 20rpx;
		}
		.total-num {
			font-size: 38rpx;
			font-weight: 500;
			color: #333333;
		}
		.category-num {
			font-size: 26rpx;
			font-weight: 500;
			color: #333333;
		}
	}
}
// 筛选
.filter-box {
	width: 750rpx;
	height: 95rpx;
	background: #ffffff;
	.filter-item {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.filter-title {
			color: #666;
			font-weight: 500;
			font-size: 28rpx;
			line-height: 90rpx;
		}
		.cuIcon-unfold {
			font-size: 24rpx;
			color: #c4c4c4;
			margin-left: 10rpx;
			transition: all linear 0.3s;
		}
		.icon-active {
			transform: rotate(180deg);
			transform-origin: center center;
			transition: all linear 0.3s;
		}
		.title-active {
			color: #333;
		}
		.underline {
			display: block;
			width: 68rpx;
			height: 4rpx;
			background: #fff;
			border-radius: 2rpx;
		}
		.underline-active {
			background: #5e49c3;
			display: block;
			width: 68rpx;
			height: 4rpx;
			border-radius: 2rpx;
		}
	}
}
// 团队列表
.team-box {
	margin-top: 20rpx;
	.team-list {
		.team-children {
			margin-left: 80rpx;
			margin-right: 20rpx;
			height: 132rpx;
			border-bottom: 1rpx solid #eee;
			.head-img {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				margin-right: 38rpx;
			}
			.head-info {
				.head-time {
					font-size: 22rpx;
					font-weight: 400;
					color: #999999;
				}
				.name-box {
					margin-bottom: 12rpx;
					.name-text {
						font-size: 24rpx;
						font-weight: 500;
						color: #666;
					}
					.tag-box {
						background: rgba(0, 0, 0, 0.2);
						border-radius: 21rpx;
						line-height: 30rpx;
						padding-right: 10rpx;
						margin-left: 10rpx;

						.tag-img {
							width: 34rpx;
							height: 34rpx;
							margin-right: 6rpx;
							border-radius: 50%;
						}

						.tag-title {
							font-size: 18rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: rgba(255, 255, 255, 1);
							line-height: 20rpx;
						}
					}
				}
			}
		}
	}
}
</style>
