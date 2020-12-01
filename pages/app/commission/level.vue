<template>
	<view class="page_box">
		<!-- 等级信息 -->
		<view class="head_box">
			<cu-custom isBack>
				<block slot="backText"><text class="nav-text">我的分销等级</text></block>
			</cu-custom>
			<view class="lg-tag-box x-c">
				<image class="lg-tag-img" :src="$IMG_URL + '/imgs/commission/lv1.png'" mode=""></image>
				<view class="lg-tag-text">普通会员</view>
			</view>
			<!-- 等级步骤条 -->
			<view class="mini-tag-box">
				<scroll-view scroll-x class="nav flex" scroll-with-animation :scroll-left="scrollLeft">
					<view class="step-item"></view>
					<view class="tag-step-item " v-for="(item, index) in 10" :key="index" @tap="stepSelect(index)">
						<view class="tag-box y-f">
							<view class="mini-img-wrap x-c"><image class="mini-img" :src="$IMG_URL + '/imgs/commission/lv1.png'" mode=""></image></view>
							<view class="mini-tag-text" :class="{ 'title-active': stepCur === index }">普通会员{{ item }}</view>
							<view class="tag-index cuIcon-triangleupfill" :class="{ 'icon-opactiy': stepCur !== index }"></view>
						</view>
						<view class="tag-line" v-if="item < 10"></view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="content_box">
			<!-- 佣金比例 -->
			<view class="scale-box mb30">
				<view class="scale-title mb30">佣金比例</view>
				<view class="scale-content">
					<view class="table-box">
						<view class="tr t-head x-f">
							<view class="th x-c">佣金级别</view>
							<view class="th x-c">佣金比例</view>
						</view>
						<view class="tr x-f t-item">
							<view class="td x-c">一级佣金比例</view>
							<view class="td x-c">6%</view>
						</view>
						<view class="tr x-f t-item">
							<view class="td x-c">二级佣金比例</view>
							<view class="td x-c">4%</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 升级条件 -->
			<view class="ask-box">
				<view class="ask-title">升级条件</view>
				<view class="card-wrap x-bc my20" v-for="item in 3">
					<view class="card-box x-f">
						<view class="img-wrap"><image class="goods-img" src="/static/imgs/tabbar/tab_type_sel.png" mode=""></image></view>
						<view class="detail">
							<view class="title more-t">累计消费满</view>
							<view class="x-f modal-progress">
								<view class="progress-box">
									<view class="cu-progress round sm">
										<view class="progress--ing" :style="[{ width: '20%' }]"></view>
										<view class="round-wrap"><view class="round-inner"></view></view>
									</view>
									<view class="mini-progress-tip" :style="[{ 'font-size': '14rpx' }, { width: '20%' }]"><text class="tip-text">200</text></view>
								</view>
								<view class="ml-progress-tip">500</view>
							</view>
						</view>
					</view>
					<button class="cu-btn card-btn">去完成</button>
				</view>
			</view>
		</view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			scrollLeft: 0, //步骤滚动
			stepCur: 0 //当前步骤
		};
	},
	computed: {},
	onLoad() {},
	methods: {
		// 点击步骤条
		stepSelect(index) {
			this.stepCur = index;
			this.scrollLeft = (index - 1) * 100;
		}
	}
};
</script>

<style lang="scss">
.page_box {
	background: #fff;
}
// 头部信息
.head_box {
	background: url($IMG_URL+'/imgs/commission/lv_bg.png') no-repeat;
	.nav-text {
		font-size: 36rpx;
		color: #fff;
	}
	/deep/ .cu-back {
		color: #fff;
		font-size: 38rpx;
	}
	.lg-tag-box {
		width: 100%;
		padding: 50rpx 0;
		position: relative;
		.lg-tag-img {
			width: 134rpx;
			height: 144rpx;
		}
		.lg-tag-text {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 40rpx;
			width: 138rpx;
			border-radius: 36rpx;
			background-color: #ffb400;
			line-height: 36rpx;
			font-size: 24rpx;
			color: #fff;
			text-align: center;
		}
	}
}

// 步骤条
.mini-tag-box {
	.step-item {
		width: 50rpx;
		display: inline-block;
	}
	.tag-step-item {
		display: inline-block;
		width: 200rpx;
		justify-content: flex-start;
		position: relative;
		.tag-box {
			width: 100rpx;
			.mini-img-wrap {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				border: 1rpx solid #fff;
				.mini-img {
					width: 40rpx;
					height: 40rpx;
				}
			}
			.mini-tag-text {
				font-size: 24rpx;
				font-weight: 500;
				color: rgba(#fff, 0.5);
				line-height: 30rpx;
				padding: 30rpx 0;
			}
			.title-active {
				color: #fff;
			}
			.tag-index {
				font-size: 60rpx;
				line-height: 10rpx;
				color: #fff;
				transition: all linear 0.2s;
			}
			.icon-opactiy {
				opacity: 0;
				transition: all linear 0.2s;
			}
		}
		.tag-line {
			width: 100rpx;
			height: 2rpx;
			background-color: #fff;
			position: absolute;
			right: 0;
			top: 30rpx;
		}
	}
}
// 佣金比例
.content_box {
	padding: 40rpx 30rpx;
}
.scale-box {
	.scale-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333333;
	}
	.scale-content {
		border-radius: 10rpx;
		overflow: hidden;
		.t-head {
			.th {
				background-color: #5e4ddf;
				font-size: 25rpx;
				color: #fff;
				font-weight: 500;
				width: 345rpx;
				height: 80rpx;
				border-bottom: 2rpx solid rgba(#fff, 0.1);
				border-right: 2rpx solid rgba(#fff, 0.1);
				&:last-child {
					border-right: none;
				}
			}
		}
		.t-item {
			.td {
				background-color: #edeaff;
				font-size: 24rpx;
				color: #9281e2;
				font-weight: 500;
				width: 345rpx;
				height: 80rpx;
				border-bottom: 2rpx solid rgba(#6041f1, 0.1);
				border-right: 2rpx solid rgba(#6041f1, 0.1);
				&:last-child {
					border-right: none;
				}
			}
		}
	}
}
// 升级条件
// 进度条
.ml-progress-tip {
	font-size: 16rpx;
	font-weight: 500;
	color: #c7b2ff;
	white-space: nowrap;
	margin-top: -1.5em;
	margin-left: 10rpx;
}
.progress-box {
	align-items: flex-start;
	.mini-progress-tip {
		font-size: 16rpx;
		font-weight: 500;
		color: #c7b2ff;
		line-height: 30rpx;
		white-space: nowrap;
		margin-top: 10rpx;
	}

	.cu-progress {
		width: 200rpx;
		height: 10rpx;
		background: #503bae;
		overflow: visible;
		.progress--ing {
			background: linear-gradient(180deg, #c6a6ff 0%, #7430ee 100%);
			border-radius: 10rpx;
		}
		.round-wrap {
			width: 30rpx;
			height: 30rpx;
			border: 2rpx solid #5c3cff;
			background: linear-gradient(0deg, #a36fff 0%, #846fff 100%);
			border-radius: 50%;
			position: relative;
			left: -15rpx;
			.round-inner {
				width: 20rpx;
				height: 20rpx;
				border: 2rpx solid #5c3cff;
				background: linear-gradient(0deg, #a36fff 0%, #846fff 100%);
				border-radius: 50%;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
}
.ask-box {
	.ask-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333333;
	}
}
.card-wrap {
	background: rgba(#c3b6ff, 0.3);
	padding: 20rpx;
	border-radius: 10rpx;
	.card-btn {
		width: 140rpx;
		height: 60rpx;
		background: linear-gradient(90deg, #a36fff, #5336ff);
		box-shadow: 0 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
		border-radius: 30rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #ffffff;
	}
}
.card-box {
	.img-wrap {
		background: #fff;
		width: 110rpx;
		height: 110rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;

		.goods-img {
			width: 110rpx;
			height: 110rpx;
			border-radius: 10rpx;
		}
	}
	.detail {
		height: 110rpx;
		width: 300rpx;
		align-items: flex-start;
		.title {
			font-size: 20rpx;
			font-weight: 500;
			color: #333333;
			line-height: 35rpx;
			text-align: left;
		}
		.sub {
			font-size: 16rpx;
			font-weight: 500;
			color: #9281e2;
			text-align: left;
		}
	}
}
</style>
