<!-- 售后详情 -->
<template>
	<view class="page_box">
		<view class="content_box">
			<!-- 步骤条 -->
			<view class="steps-box"><u-steps :current="stepsCurrent" :list="steps" activeColor="#39b54a" mode="number" icon="checkmark"></u-steps></view>

			<!-- 服务状态 -->
			<view class="status-box u-flex u-row-between" @tap="jump('/pages/order/after-sale/log', { aftersaleId: aftersaleDetail.id })">
				<view class="">
					<view class="status-text">{{ aftersaleDetail.aftersale_status_desc }}</view>
					<view class="status-time">{{ aftersaleDetail.updatetime }}</view>
				</view>
				<text class="u-iconfont uicon-arrow-right" style="color: #666"></text>
			</view>

			<!-- 退款金额 -->
			<view class="aftersale-money u-flex u-row-between">
				<view class="aftersale-money--title">退款总额</view>
				<view class="aftersale-money--num" v-if="Number(aftersaleDetail.refund_fee)">￥{{ aftersaleDetail.refund_fee }}</view>
				<view class="aftersale-money--num" v-else>未退款</view>
			</view>
			<!-- 服务商品 -->
			<view class="order-shop">
				<shopro-mini-card :title="aftersaleDetail.goods_title" :image="aftersaleDetail.goods_image">
					<template #describe>
						<view class="order-sku u-ellipsis-1">
							<text class="order-num">数量:{{ aftersaleDetail.goods_num || 0 }};</text>
							{{ aftersaleDetail.goods_sku_text ? aftersaleDetail.goods_sku_text : '' }}
						</view>
					</template>
					<template #cardBottom>
						<view class="card-price-box u-flex">
							<text class="order-price">￥{{ aftersaleDetail.goods_price || 0 }}</text>
							<button class="u-reset-button status-btn" v-if="aftersaleDetail.status_name">{{ aftersaleDetail.status_name }}</button>
						</view>
					</template>
				</shopro-mini-card>
			</view>

			<!-- 服务内容 -->
			<view class="aftersale-content">
				<view class="aftersale-item u-flex">
					<view class="item-title">服务单号：</view>
					<view class="item-content">{{ aftersaleDetail.aftersale_sn }}</view>
					<button class="u-reset-button copy-btn" @tap="onCopy(aftersaleDetail.aftersale_sn)">复制</button>
				</view>
				<view class="aftersale-item u-flex">
					<view class="item-title">申请时间：</view>
					<view class="item-content">{{ aftersaleDetail.createtime }}</view>
				</view>
				<view class="aftersale-item u-flex">
					<view class="item-title">售后类型：</view>
					<view class="item-content">{{ aftersaleDetail.type_text }}</view>
				</view>
				<view class="aftersale-item u-flex" v-if="aftersaleLog && aftersaleLog.length">
					<view class="item-title">申请原因：</view>
					<view class="item-content">{{ aftersaleLog[aftersaleLog.length - 1].reason }}</view>
				</view>
				<view class="aftersale-item x-f" v-if="aftersaleLog && aftersaleLog.length">
					<view class="item-title">相关描述：</view>
					<view class="item-content">{{ aftersaleLog[aftersaleLog.length - 1].content }}</view>
				</view>
			</view>
		</view>
		<view class="foot_box">
			<block v-for="orderBtn in aftersaleDetail.btns" :key="orderBtn">
				<button v-if="orderBtn === 'cancel'" @tap.stop="onCancel(aftersaleDetail.id)" class="u-reset-button btn">取消</button>
				<button v-if="orderBtn === 'delete'" @tap.stop="onDelete(aftersaleDetail.id)" class="u-reset-button btn delete-btn">删除</button>
			</block>
			<button class="u-reset-button contcat-btn btn" @tap="onService">联系客服</button>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			stepsCurrent: 0,
			steps: [
				{
					name: '提交申请'
				},
				{
					name: '进行中'
				},
				{
					name: '完成'
				}
			],
			aftersaleDetail: {}, //售后详情
			aftersaleLog: [] //售后记录
		};
	},
	computed: {},
	onLoad() {
		this.getAftersaleDetail();
	},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 跳转客服
		onService() {
			this.$Router.push('/pages/public/chat/index');
		},
		// 复制
		onCopy(code) {
			let that = this;
			uni.setClipboardData({
				data: code,
				success: function(data) {
					that.$u.toast('已复制到剪切板');
				}
			});
		},

		// 设置步骤条
		setSteps(step) {
			if (step >= 0 && step < 2) {
				this.stepsCurrent = step;
			} else {
				this.stepsCurrent = 2;
				let name = '';
				switch (step) {
					case 2:
						name = '完成';
						break;
					case -1:
						name = '取消';
						break;
					case -2:
						name = '驳回';
						break;
					default:
						break;
				}
				this.steps[2].name = name;
			}
		},
		// 服务单详情
		getAftersaleDetail() {
			let that = this;
			that.$http('order.aftersaleDetail', {
				id: that.$Route.query.aftersaleId
			}).then(res => {
				if (res.code === 1) {
					that.aftersaleDetail = res.data;
					that.setSteps(res.data.aftersale_status);
					that.aftersaleLog = res.data.logs;
					that.aftersaleDetail.createtime = that.$u.timeFormat(res.data.createtime, 'yyyy-mm-dd hh:MM');
					that.aftersaleDetail.updatetime = that.$u.timeFormat(res.data.updatetime, 'yyyy-mm-dd hh:MM');
				}
			});
		},
		//取消
		onCancel(aftersaleId) {
			let that = this;
			that.$http(
				'order.cancelAftersaleOrder',
				{
					id: aftersaleId
				},
				'取消中...'
			).then(res => {
				if (res.code === 1) {
					that.$Router.back();
				}
			});
		},
		// 删除
		onDelete(aftersaleId) {
			let that = this;
			uni.showModal({
				title: '删除订单',
				content: '确定要删除这个订单么？',
				cancelText: '取消',
				confirmText: '删除',
				success: res => {
					if (res.confirm) {
						that.$http('order.deleteAftersaleOrder', {
							id: aftersaleId
						}).then(res => {
							if (res.code === 1) {
								that.$Router.back();
							}
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
// 步骤条
.steps-box {
	height: 190rpx;
	padding: 60rpx 0 0;
	background: #fff;
}
// 服务状态
.status-box {
	background-color: #fff;
	border-radius: 20rpx 20rpx 0px 0px;
	padding: 20rpx;
	margin-top: -20rpx;
	.status-text {
		font-size: 28rpx;

		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		margin-bottom: 20rpx;
	}
	.status-time {
		font-size: 24rpx;

		font-weight: 400;
		color: rgba(153, 153, 153, 1);
	}
}
// 退款金额
.aftersale-money {
	background-color: #fff;
	height: 98rpx;
	padding: 0 20rpx;
	margin: 20rpx 0;
	.aftersale-money--title {
		font-size: 28rpx;

		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}
	.aftersale-money--num {
		font-size: 28rpx;

		font-weight: 500;
		color: rgba(225, 33, 43, 1);
	}
}
// order-shop
.order-shop {
	padding: 20rpx;
	background-color: #fff;
	margin-bottom: 20rpx;
	.order-sku {
		font-size: 24rpx;

		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		width: 450rpx;
		margin-bottom: 20rpx;
		.order-num {
			margin-right: 10rpx;
		}
	}
	.card-price-box {
		.status-btn {
			height: 32rpx;
			border: 1rpx solid rgba(207, 169, 114, 1);
			border-radius: 15rpx;
			font-size: 20rpx;
			font-weight: 400;
			color: rgba(168, 112, 13, 1);
			padding: 0 10rpx;
			margin-left: 20rpx;
			background: rgba(233, 183, 102, 0.16);
		}
		.order-price {
			font-size: 26rpx;

			font-weight: 600;
			color: rgba(51, 51, 51, 1);
		}
	}
}
// 服务内容
.aftersale-content {
	background-color: #fff;
	padding: 20rpx;
	.aftersale-item {
		height: 60rpx;
		.copy-btn {
			background: none;
			color: #b38436;
			font-size: 26rpx;
			padding: 0 20rpx;
		}
		.item-tilte {
			color: #333;
			font-size: 28rpx;
		}
		.item-content {
			color: #999999;
			font-size: 28rpx;
		}
	}
}
// 底部功能
.foot_box {
	height: 100rpx;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	.btn {
		width: 160rpx;
		line-height: 60rpx;
		background: rgba(238, 238, 238, 1);
		border-radius: 30rpx;
		padding: 0;
		margin-right: 20rpx;
		font-size: 26rpx;

		font-weight: 400;
		color: rgba(51, 51, 51, 1);
	}
	.delete-btn {
		background: #ffeeee;
		color: #e50808;
	}
}
</style>
