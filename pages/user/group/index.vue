<template>
	<view class="page_box">
		<view class="head_box">
			<view class="order-nav x-f">
				<view class="nav-item y-f" v-for="nav in groupState" :key="nav.id" @tap="onNav(nav.id)">
					<view class="item-title">{{ nav.title }}</view>
					<text class="nav-line" :class="{ 'line-active': stateId === nav.id }"></text>
				</view>
			</view>
		</view>
		<view class="content_box">
			<view class="group-goods">
				<image class="group-state" :src="grouponStatus ? '/static/imgs/group_state_succeed.png' : '/static/imgs/group_state_failed.png'" mode=""></image>
				<view class="goods-content">
					<shopro-activity-card>
						<block slot="slodEnd">
							<view class="x-f">
								<view class="sell-box">
									<text class="cuIcon-hotfill"></text>
									<text class="sell-num">已拼111件</text>
								</view>
								<text class="group-num">2人团</text>
							</view>
						</block>
					</shopro-activity-card>
				</view>

				<view class="btn-box x-f">
					<button class="cu-btn btn" v-if="stateId === 2">申请退款</button>
					<button class="cu-btn btn" @tap="jump('/pages/order/detail')">拼购详情</button>
					<button class="cu-btn invite-btn" v-if="stateId === 1" @tap="onInvite">邀请好友</button>
				</view>
			</view>
		</view>
		<view class="foot_box"></view>
		<!-- 分享 -->
		<shopro-share v-model="showShare" :goodsInfo="grouponInfo" :posterType="'groupon'"></shopro-share>
	</view>
</template>

<script>
import shoproActivityCard from '@/components/goods/shopro-activity-card.vue';
import shoproShare from '@/components/shopro-share.vue';
export default {
	components: {
		shoproActivityCard,
		shoproShare
	},
	data() {
		return {
			showShare: false,
			stateId: 0,
			grouponStatus: false,
			grouponInfo:{//测试
				id: 17,
				title: 'JMsolution韩国粉色玫瑰防晒SPF50户外美白超强隔离JM防晒喷雾',
				image: 'http://shopro-1253949872.image.myqcloud.com/uploads/20200430/3e61ab01c9280667d36d2e0a38021a66.jpg_2200x2200Q100s50.jpg_.webp.jpg'
			},
			groupState: [
				{
					id: 0,
					title: '全部'
				},
				{
					id: 1,
					title: '进行中'
				},
				{
					id: 2,
					title: '成功'
				},
				{
					id: 3,
					title: '失败'
				}
			]
		};
	},
	computed: {},
	methods: {
		onNav(id) {
			this.stateId = id;
		},
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		onInvite() {
			this.showShare = true;
		}
	}
};
</script>

<style lang="scss">
.order-nav {
	background: #fff;
	height: 80rpx;

	.nav-item {
		flex: 1;

		.item-title {
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 76rpx;
		}

		.nav-line {
			width: 120rpx;
			height: 4rpx;
			background: #fff;
		}

		.line-active {
			background: rgba(230, 184, 115, 1);
		}
	}
}

// ƴ����Ʒ
.group-goods {
	background: #fff;
	margin-top: 20rpx;
	position: relative;
	overflow: hidden;
	.group-state {
		position: absolute;
		top: -20rpx;
		right: -20rpx;
		width: 126rpx;
		height: 126rpx;
	}

	.goods-content {
		padding: 30rpx 20rpx;
		position: relative;
		z-index: 3;
		.tip {
			line-height: 32rpx;
			background: rgba(255, 224, 226, 0.3);
			border-radius: 16rpx;
			padding: 0 10rpx;
			margin-top: 30rpx;

			.cuIcon-hotfill {
				color: #e1212b;
				font-size: 26rpx;
				margin-right: 10rpx;
			}

			.tip-text {
				font-size: 20rpx;
				color: #f7979c;
			}
		}

		.price-box {
			.price {
				font-size: 28rpx;
				color: #e1212b;
				margin-right: 15rpx;
			}

			.original-price {
				font-size: 24rpx;
				color: #999;
				text-decoration: line-through;
			}
		}
	}

	.btn-box {
		height: 95rpx;
		border-top: 1px solid rgba(223, 223, 223, 0.5);
		justify-content: flex-end;

		.btn {
			width: 210rpx;
			height: 65rpx;
			border: 1rpx solid rgba(223, 223, 223, 1);
			border-radius: 33rpx;
			font-size: 26rpx;
			color: #999;
			padding: 0;
			margin-right: 20rpx;
			background: #fff;
		}

		.invite-btn {
			width: 210rpx;
			height: 65rpx;
			border: 1rpx solid #a8700d;
			border-radius: 33rpx;
			font-size: 26rpx;
			color: #a8700d;
			padding: 0;
			margin-right: 20rpx;
			background: #fff;
		}
	}
}
</style>
