<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="content_box">
			<view class="y-bc group-box">
				<view class="tip-box x-f" v-if="false">
					<text class="cuIcon-roundcheckfill"></text>
					<text>恭喜您拼购成功！已有1人跟团购买</text>
				</view>
				<view class="title-box x-f">
					<view class="title-text">
						待成团，还差
						<text class="group-num">1</text>
						人拼团成功
					</view>
					<view class="count-down x-f">
						<text class="count-down-tip">还剩</text>
						<view class="time-box x-f">
							<view class="count-text">{{ time.h || '00' }}</view>
							:
							<view class="count-text">{{ time.m || '00' }}</view>
							:
							<view class="count-text">{{ time.s || '00' }}</view>
						</view>
					</view>
				</view>
				<view class="group-people x-f">
					<view class="img-box">
						<view class="tag">
							2人团
						</view>
						<image class="avatar" src="/static/imgs/base_avatar.png" mode=""></image>
					</view>
				</view>
				<view class="btn-box x-ac">
					<button class="cu-btn check-btn">查看订单</button>
					<button class="cu-btn back-btn">返回首页</button>
					<button class="cu-btn back-btn" v-if="false">邀请好友</button>
				</view>
			</view>
			<view class="detail-item x-bc">
				<text class="title">商品名称</text>
				<view class="x-f">
					<view class="description one-t">
						FQ芙清医美面膜医用男女淡化痘印…FQ芙清医美面膜医用男女淡化痘印…
					</view>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="detail-item x-bc" @tap="routerTo.push('/pages/user/group/rules')">
				<text class="title">拼购玩法</text>
				<view class="x-f">
					<view class="description one-t">
						好友参团·人满发货·不满退款
					</view>
					<text class="cuIcon-right"></text>
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
				time: 0,
				routerTo:this.$Router,
			};
		},
		computed: {},
		onLoad() {
			this.countDown()
		},
		methods: {
			countDown() {
				let _self = this;
				// let t = this.activityData.endtime * 1000 - new Date().getTime();
				let t = 10000;
				let timer = setInterval(() => {
					if (t > 0) {
						_self.time = _self.$tools.format(t);
						t--;
					} else {
						clearInterval(timer);
						_self.time = '倒计时结束';
					}
				}, 1000);
			}
		},

	};
</script>

<style lang="scss">
	.group-box {
		background: #fff;
		padding: 40rpx 0;
		height: 370rpx;
		.tip-box {
			font-size: 28rpx;

			.cuIcon-roundcheckfill {
				color: #ECBE60;
				font-size: 34rpx;
				margin-right: 20rpx;
			}
		}
		.title-box {
			font-size: 26rpx;
			font-weight: bold;
			color: #333;
			.group-num {
				color: #f8002c;
			}
			.count-down-tip {
				font-size: 24rpx;
				padding-left: 10rpx;
			}
			.time-box {
				font-size: 18rpx;
				.count-text {
					display: inline-block;
					background-color: #383a46;
					color: #fff;
					font-size: 18rpx;
					border-radius: 2rpx;
					padding: 0 5rpx;
					height: 28rpx;
					text-align: center;
					line-height: 28rpx;
					margin: 0 6rpx;
				}
			}
		}
		
		.group-people{
			.img-box{
				position: relative;
				margin-right: 20rpx;
				.tag{
					position: absolute;
					line-height:36rpx;
					background:linear-gradient(132deg,rgba(243,223,177,1),rgba(243,223,177,1),rgba(236,190,96,1));
					border-radius:18rpx;
					padding: 0 10rpx;
					white-space: nowrap;
					font-size: 24rpx;
					color: #784F06;
					z-index: 2;
					top: -10rpx;
				}
				.avatar{
					width:80rpx;
					height:80rpx;
					border-radius:50%;
					background: #ccc;
				}
			}
			}
			.btn-box{
				width: 750rpx;
				.check-btn{
					width:320rpx;
					height:70rpx;
					background:rgba(255,255,255,1);
					border:1rpx solid rgba(223,223,223,0.5);
					border-radius:35rpx;
					font-size: 28rpx;
					color: #999;
				}
				.back-btn{
					width:320rpx;
					height:70rpx;
					background:linear-gradient(90deg,rgba(233,180,97,1),rgba(238,204,137,1));
					border-radius:35rpx;
					font-size: 28rpx;
					color:#fff;
				}
			}
	}
	.detail-item{
		height:94rpx;
		border-top:1rpx solid rgba(#DFDFDF,0.5) ;
		padding: 0 20rpx;
		background: #fff;
		.title{
			font-size: 28rpx;
		}
		.description{
			width: 450rpx;
			color: #999;
			font-size: 28rpx;
		}
		.cuIcon-right{
			margin-left: 20rpx;
		}
		}
</style>
