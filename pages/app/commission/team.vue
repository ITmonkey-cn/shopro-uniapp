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
							<view class="category-num">2000000</view>
						</view>
						<view class="y-start flex-sub">
							<view class="item-title">二级成员</view>
							<view class="category-num">2000000</view>
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
							<view class="category-num">2000000</view>
						</view>
						<view class="y-start flex-sub">
							<view class="item-title">团队业绩</view>
							<view class="category-num">2000000</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content_box">
			<!-- 筛选 -->
			<view class="filter-box x-f">
				<view class="filter-item flex-sub" v-for="(filter, index) in filterList" :key="index" @tap="onFilter(index)">
					<text class="filter-title" :class="{ 'title-active': filterCurrent == index }">{{ filter.title }}</text>
					<text class="underline" :class="{ 'underline-active': filterCurrent == index }"></text>
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
			filterCurrent: 0,
			filterList: [{ title: '综合' }, { title: '等级' }, { title: '加入时间' }]
		};
	},
	computed: {},
	onLoad() {},
	methods: {
		// 点击筛选项
		onFilter(index) {
			this.filterCurrent = index;
		}
	}
};
</script>

<style lang="scss">
// 头部卡片
.head_box {
	background-color: #4d3cbe;
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
</style>
