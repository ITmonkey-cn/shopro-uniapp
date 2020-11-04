<template>
	<view>
		<!-- 正常商品 -->
		<view class="normal-price-box" v-if="type !== 'score' && !detail.activity">
			<view class="shopro-selector-rect">
				<text class="unit">￥</text>
				<text class="price">{{ detail.price }}</text>
				<text class="notice">优惠价</text>
			</view>
			<view class="x-bc price-bottom-box">
				<view class="x-f shopro-selector-rect">
					<view class="original-price">原价：￥{{ detail.original_price }}</view>
					<text class="line"></text>
					<view class="sold">已售：{{ detail.sales }}件</view>
				</view>
				<view class="express"></view>
			</view>
		</view>
		<!-- 积分商品 -->
		<view class="score-price-card" v-if="type === 'score'">
			<view class="x-f">
				<image class="score-img" src="http://shopro.7wpp.com/imgs/score.png" mode=""></image>
				<text class="price">{{ detail.price }}</text>
			</view>
			<view class="x-bc price-bottom-box">
				<view class="x-f">
					<view class="original-price">价值：￥{{ detail.original_price }}</view>
					<text class="line"></text>
					<view class="sold">已兑换：{{ detail.sales }}件</view>
				</view>
			</view>
		</view>
		<!-- 团购商品 -->
		<view class="groupon-price-box" v-if="detail.activity && detail.activity.type === 'groupon'">
			<view class="">
				<text class="unit">￥</text>
				<text class="price">{{ detail.activity_type === 'groupon' ? detail.groupon_price : detail.price }}</text>
				<text class="notice">{{ detail.activity.rules.team_num }}人团</text>
			</view>
			<view class="x-bc price-bottom-box">
				<view class="x-f">
					<view class="original-price">原价：￥{{ detail.original_price }}</view>
					<text class="line"></text>
					<view class="sold">已拼：{{ detail.sales }}件</view>
				</view>
				<view class="count-down" v-show="activityRules.status === 'waiting'">
					距开始 {{ activityRules.countDownTime.h || '00' }} : {{ activityRules.countDownTime.m || '00' }} : {{ activityRules.countDownTime.s || '00' }}
				</view>
				<view class="count-down" v-show="activityRules.status === 'end'">已结束</view>
				<view class="count-down" v-show="activityRules.status === 'ing'">
					距结束 {{ activityRules.countDownTime.h || '00' }} : {{ activityRules.countDownTime.m || '00' }} : {{ activityRules.countDownTime.s || '00' }}
				</view>
			</view>
		</view>
		<!-- 秒杀商品 -->
		<view class="seckill-price-box " :class="activityRules.status !== 'end' ? 'seckill-bg' : 'seckilled-bg'" v-if="detail.activity && detail.activity.type === 'seckill'">
			<view class="x-bc price-top-box">
				<view class="x-f">
					<text class="unit">￥</text>
					<text class="price">{{ detail.price }}</text>
					<text class="notice">秒杀价</text>
				</view>
				<view class="count-down" v-show="activityRules.status === 'waiting'">
					距开始 {{ activityRules.countDownTime.h || '00' }} : {{ activityRules.countDownTime.m || '00' }} : {{ activityRules.countDownTime.s || '00' }}
				</view>
				<view class="count-down" v-show="activityRules.status === 'end'">已结束</view>
				<view class="count-down" v-show="activityRules.status === 'ing'">
					距结束 {{ activityRules.countDownTime.h || '00' }} : {{ activityRules.countDownTime.m || '00' }} : {{ activityRules.countDownTime.s || '00' }}
				</view>
			</view>
			<view class="x-bc price-bottom-box">
				<view class="x-f">
					<view class="original-price">原价：￥{{ detail.original_price }}</view>
					<text class="line"></text>
					<view class="sold">已售：{{ detail.sales }}件</view>
				</view>
				<view class="express">
					<view class="x-f">
						<view class="cu-progress round sm" :class="activityRules.status !== 'end' ? 'seckill-progress' : 'seckilled-progress'">
							<view
								:class="activityRules.status !== 'end' ? 'progress-item--noend' : 'progress-item--end'"
								:style="[{ width: loading ? getProgress(detail.sales, detail.stock) : '' }]"
							></view>
						</view>
						<view class="progress-text" v-if="detail.stock > 0">仅剩{{ detail.stock }}件</view>
						<view class="progress-text" v-else>已售罄</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 商品详情价格卡片
 * @property {Object} detail - 商品详情
 * @property {String} type - 商品分类
 */
var timer = null;
export default {
	name: 'shPrice',
	components: {},
	data() {
		return {
			loading: false,
			time: {}, //倒计时
			activityRules: {
				startTime: 0,
				endTime: 0,
				status: '',
				countDownTime: 0
			}
		};
	},
	props: {
		detail: Object,
		type: ''
	},
	created() {
		if (this.detail.activity && this.detail.activity.type) {
			this.doActivityRules();
		}
	},
	destroyed() {
		clearInterval(timer);
	},
	computed: {},
	methods: {
		// 百分比
		getProgress(sales, stock) {
			let unit = '';
			if (stock + sales > 0) {
				let num = (sales / (sales + stock)) * 100;
				unit = num.toFixed(2) + '%';
			} else {
				unit = '0%';
			}
			return unit;
		},
		// 触发活动规则
		doActivityRules() {
			let that = this;
			switch (that.detail.activity.type) {
				case 'seckill':
				case 'groupon':
					that.activityRules.startTime = that.detail.activity.starttime * 1000;
					that.activityRules.endTime = that.detail.activity.endtime * 1000;
					that.countDown();
					setTimeout(() => {
						that.loading = true;
					}, 500);
					break;
			}
		},
		countDown() {
			let that = this;
			let t = 0;
			if (that.activityRules.endTime < new Date().getTime()) {
				that.activityRules.status = 'end';
				that.$emit('change', JSON.stringify(that.activityRules));
			}
			timer = setInterval(() => {
				let nowTime = new Date().getTime();
				if (nowTime < that.activityRules.startTime) {
					that.activityRules.status = 'waiting';
					t = that.activityRules.startTime - nowTime;
				} else if (nowTime > that.activityRules.endTime) {
					that.activityRules.status = 'end';
					clearInterval(timer);
					return;
				} else {
					that.activityRules.status = 'ing';
					t = that.activityRules.endTime - nowTime;
				}
				that.activityRules.countDownTime = that.$tools.formatToHours(t / 1000);
				t--;
				that.$emit('change', JSON.stringify(that.activityRules));
			}, 1000);
		}
	}
};
</script>

<style lang="scss">
// 正常商品
.normal-price-box {
	padding: 20rpx;
	background: url('http://shopro.7wpp.com/imgs/price_normal_bg.png') no-repeat;
	background-size: 100% 100%;
	.unit,
	.notice {
		font-size: 24rpx;
		color: #fff;
	}

	.price {
		font-size: 36rpx;
		color: #fff;
		font-weight: bold;
		margin: 0 10rpx;
	}

	.price-bottom-box {
		font-size: 24rpx;
		color: #fff;
		font-weight: 500;
		padding-top: 10rpx;
		.original-price {
			text-decoration: line-through;
		}
		.line {
			margin: 0 20rpx;
			display: inline-block;
			width: 3rpx;
			height: 24rpx;
			background-color: #fff;
		}
	}
}

// 团购商品
.groupon-price-box {
	padding: 20rpx;
	background: url('http://shopro.7wpp.com/imgs/group_price_bg.png') no-repeat;
	background-size: 100% 100%;
	.unit,
	.notice {
		font-size: 24rpx;
		color: rgba(#fff, 0.9);
	}
	.notice {
		line-height: 40rpx;
		border: 1rpx solid rgba(255, 255, 255, 1);
		border-radius: 6rpx;
		padding: 0 10rpx;
	}
	.price {
		font-size: 36rpx;
		color: rgba(#fff, 0.9);
		font-weight: bold;
		margin: 0 10rpx;
	}

	.price-bottom-box {
		font-size: 24rpx;
		color: rgba(#fff, 0.9);
		font-weight: 500;
		padding-top: 10rpx;

		.line {
			margin: 0 20rpx;
			display: inline-block;
			width: 3rpx;
			height: 24rpx;
			background-color: #fff;
		}
		.count-down {
			font-size: 24rpx;
			color: rgba(#fff, 0.9);
		}
	}
}
// 积分商品价格卡片
.score-price-card {
	padding: 20rpx;
	background: url('http://shopro.7wpp.com/imgs/detail/671e3bc4581f0b35791f382e4b5c2a8.png') no-repeat;
	background-size: 100% 100%;
	width: 750rpx;
	.notice {
		font-size: 24rpx;
		color: #fff;
	}
	.score-img {
		width: 36rpx;
		height: 36rpx;
	}
	.price {
		font-size: 36rpx;
		color: #fff;
		font-weight: bold;
		margin: 0 10rpx;
	}

	.price-bottom-box {
		font-size: 24rpx;
		color: #fff;
		font-weight: 500;
		padding-top: 10rpx;
		.original-price {
			text-decoration: line-through;
		}
		.line {
			margin: 0 20rpx;
			display: inline-block;
			width: 3rpx;
			height: 24rpx;
			background-color: #fff;
		}
	}
}
// 秒杀商品
.seckill-bg {
	background: url('http://shopro.7wpp.com/imgs/price_seckill_bg.png') no-repeat;
	background-size: 100% 100%;
}
.seckilled-bg {
	background: url('http://shopro.7wpp.com/imgs/price_seckilled_bg.png') no-repeat;
	background-size: 100% 100%;
}
.seckill-price-box {
	padding: 20rpx;
	// background-color: #C8091E;
	.unit,
	.notice,
	.count-down {
		font-size: 24rpx;
		color: rgba(#fff, 0.9);
	}

	.notice {
		line-height: 40rpx;
		border: 1rpx solid rgba(255, 255, 255, 1);
		border-radius: 6rpx;
		padding: 0 10rpx;
		margin-left: 10rpx;
	}

	.price {
		font-size: 36rpx;
		color: rgba(#fff, 0.9);
		font-weight: bold;
		margin: 0 10rpx;
	}

	.price-bottom-box {
		font-size: 24rpx;
		color: rgba(#fff, 0.9);
		font-weight: 500;
		padding-top: 10rpx;
		.original-price {
			text-decoration: line-through;
		}
		.express {
			.cu-progress {
				width: 100rpx;
				height: 10rpx;
				.progress-item--end {
					background: #7c7c7c;
				}
				.progress-item--noend {
					background: #fff;
				}
			}
			.seckill-progress {
				background: #a1071a;
			}
			.seckilled-progress {
				background: #fff;
			}
			.progress-text {
				color: rgba(#fff, 0.9);
				font-size: 24rpx;
				margin-left: 10rpx;
			}
		}
		.line {
			margin: 0 20rpx;
			display: inline-block;
			width: 3rpx;
			height: 24rpx;
			background-color: #fff;
		}
	}
}
</style>
