<template>
	<view>
		<!-- 正常商品 -->
		<view class="normal-price-box" v-if="detail.activity === null">
			<view class="">
				<text class="unit">￥</text>
				<text class="price">{{ detail.price }}</text>
				<text class="notice">券后价</text>
			</view>
			<view class="x-bc price-bottom-box">
				<view class="x-f">
					<view class="original-price">原价：￥{{ detail.original_price }}</view>
					<text class="line"></text>
					<view class="sold">已售：{{ detail.sales }}件</view>
				</view>
				<view class="express">快递：0元</view>
			</view>
		</view>
		<!-- 团购商品 -->
		<view class="groupon-price-box" v-if="detail.activity && detail.activity.type === 'groupon'">
			<view class="">
				<text class="unit">￥</text>
				<text class="price">111.00</text>
				<text class="notice">2人团</text>
			</view>
			<view class="x-bc price-bottom-box">
				<view class="x-f">
					<view class="original-price">原价：￥200</view>
					<text class="line"></text>
					<view class="sold">已售：1.2万件</view>
				</view>
				<view class="express">2人团 · 已拼256件</view>
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
				<view class="count-down" v-if="activityRules.status === 'waiting'">
					距开始 {{ activityRules.countDownTime.h || '00' }} : {{ activityRules.countDownTime.m || '00' }} : {{ activityRules.countDownTime.s || '00' }}
				</view>
				<view class="count-down" v-else-if="activityRules.status === 'end'">已结束</view>
				<view class="count-down" v-else>
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
							<view class="progress-item" :style="[{ width: loading ? pct : '' }]"></view>
						</view>
						<view class="progress-text">仅剩{{ detail.stock }}件</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
let timer;
let flag = false;
export default {
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
		detail: Object
	},
	created() {
		this.doActivityRules();
	},
	destroyed() {
		clearInterval(timer);
	},
	computed: {
		pct() {
			const { sales, stock } = this.detail;
			let pctText = (sales / (sales + stock)).toFixed(1) * 100 + '%';
			return pctText;
		}
	},
	methods: {
		// 触发活动规则
		doActivityRules() {
			let that = this;
			switch (that.detail.activity.type) {
				case 'seckill':
					that.activityRules.startTime = that.detail.activity.starttime * 1000;
					that.activityRules.endTime = that.detail.activity.endtime * 1000;
					that.countDown();
					break;
				case 'groupon':
					setTimeout(() => {
						that.loading = true;
					}, 500);
					break;
			}
		},
		countDown() {
			let that = this;
			let t = 0;
			if (!flag) {
				timer = setInterval(() => {
					flag = true;
					let nowTime = new Date().getTime();
					if (nowTime < that.activityRules.startTime) {
						that.activityRules.status = 'waiting';
						t = that.activityRules.startTime - nowTime;
					} else if (nowTime > that.activityRules.endTime) {
						that.activityRules.status = 'end';
						clearInterval(timer);
						flag = false;
						return;
					} else {
						that.activityRules.status = 'ing';
						t = that.activityRules.endTime - nowTime;
					}
					that.activityRules.countDownTime = that.$tools.formatToHours(t / 1000);
					console.log(that.activityRules);
					t--;
					that.$emit('change', JSON.stringify(that.activityRules));
				}, 1000);
			}
		}
	}
};
</script>

<style lang="scss">
// 正常商品
.normal-price-box {
	padding: 20rpx;
	// background:linear-gradient(90deg,rgba(221,178,110,1) 0%,rgba(241,209,146,1) 100%);
	background: url(data:image/png;base64,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)
		no-repeat;
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
	}
}
// 秒杀商品
.seckill-bg {
	background: url(data:image/png;base64,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)
		no-repeat;
	background-size: 100% 100%;
}
.seckilled-bg {
	background: url('http://shopro.7wpp.com/imgs/seckill_end.png') no-repeat;
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
				.progress-item {
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
