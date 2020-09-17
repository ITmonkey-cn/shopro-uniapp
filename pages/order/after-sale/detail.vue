<template>
	<view class="page_box">
		<view class="content_box">
			<!-- 步骤条 -->
			<view class="bg-gradual-green steps-box">
				<view class="cu-steps">
					<view class="cu-item" :class="aftersaleDetail.aftersale_status > 0 || aftersaleDetail.aftersale_status == 0 ? 'text-white' : 'text-after'">
						<text class="cuIcon-roundcheckfill"></text>
						提交申请
					</view>
					<view class="cu-item" :class="aftersaleDetail.aftersale_status > 0 || aftersaleDetail.aftersale_status == 1 ? 'text-white' : 'text-after'">
						<text class="cuIcon-roundcheckfill"></text>
						进行中
					</view>
					<view class="cu-item" v-if="aftersaleDetail.aftersale_status >= 0" :class="aftersaleDetail.aftersale_status == 2 ? 'text-white' : 'text-after'">
						<text class="cuIcon-roundcheckfill"></text>
						完成
					</view>
					<view class="cu-item" v-if="aftersaleDetail.aftersale_status == -2" :class="aftersaleDetail.aftersale_status == -2 ? 'text-white' : 'text-after'">
						<text class="cuIcon-roundclosefill"></text>
						取消
					</view>
					<view class="cu-item" v-if="aftersaleDetail.aftersale_status == -1" :class="aftersaleDetail.aftersale_status == -1 ? 'text-white' : 'text-after'">
						<text class="cuIcon-roundclosefill"></text>
						驳回
					</view>
				</view>
			</view>
			<!-- 服务状态 -->
			<view class="status-box x-bc" @tap="jump('/pages/order/after-sale/log', { aftersaleId: aftersaleDetail.id })">
				<view class="y-start">
					<view class="status-text">{{ aftersaleDetail.aftersale_status_desc }}</view>
					<view class="status-time">{{ aftersaleDetail.updatetime }}</view>
				</view>
				<text class="cuIcon-right"></text>
			</view>
			<!-- 退款金额 -->
			<view class="aftersale-money x-bc">
				<view class="aftersale-money--title">退款总额</view>
				<view class="aftersale-money--num" v-if="Number(aftersaleDetail.refund_fee)">￥{{ aftersaleDetail.refund_fee }}</view>
				<view class="aftersale-money--num" v-else>未退款</view>
			</view>
			<!-- 服务商品 -->
			<view class="order-shop"><shopro-mini-card :type="'order'" :detail="aftersaleDetail"></shopro-mini-card></view>
			<!-- 服务内容 -->
			<view class="aftersale-content">
				<view class="aftersale-item x-f">
					<view class="item-title">服务单号：</view>
					<view class="item-content">{{ aftersaleDetail.aftersale_sn }}</view>
					<button class="cu-btn copy-btn" @tap="onCopy(aftersaleDetail.aftersale_sn)">复制</button>
				</view>
				<view class="aftersale-item x-f">
					<view class="item-title">申请时间：</view>
					<view class="item-content">{{ aftersaleDetail.createtime }}</view>
				</view>
				<view class="aftersale-item x-f">
					<view class="item-title">售后类型：</view>
					<view class="item-content">{{ aftersaleDetail.type_text }}</view>
				</view>
				<view class="aftersale-item x-f" v-if="aftersaleLog && aftersaleLog.length">
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
				<button v-if="orderBtn === 'cancel'" @tap.stop="onCancel(aftersaleDetail.id)" class="cu-btn btn">取消</button>
				<button v-if="orderBtn === 'delete'" style="background:#FFEEEE;color:#E50808" @tap.stop="onDelete(aftersaleDetail.id)" class="cu-btn btn">删除</button>
			</block>
			<button class="cu-btn contcat-btn btn" v-if="addons.includes('kefu')" @tap="onService">联系客服</button>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			addons: uni.getStorageSync('addons'),
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
			this.$Router.push('/pages/public/kefu/index');
		},
		// 复制
		onCopy(code) {
			let that = this;
			uni.setClipboardData({
				data: code,
				success: function(data) {
					//#ifdef H5
					that.$tools.toast('已复制到剪切板');
					//#endif
				},
				fail: function(err) {},
				complete: function(res) {}
			});
		},
		// 服务单详情
		getAftersaleDetail() {
			let that = this;
			that.$api('order.aftersaleDetail', {
				id: that.$Route.query.aftersaleId
			}).then(res => {
				if (res.code === 1) {
					that.aftersaleDetail = res.data;
					that.aftersaleLog = res.data.log;
					let createdate = new Date(res.data.createtime * 1000);
					let update = new Date(res.data.updatetime * 1000);
					that.aftersaleDetail.createtime = that.$tools.dateFormat('YYYY-mm-dd HH:MM', createdate);
					that.aftersaleDetail.updatetime = that.$tools.dateFormat('YYYY-mm-dd HH:MM', update);
				}
			});
		},
		//取消
		onCancel(aftersaleId) {
			let that = this;
			that.$api('order.cancelAftersaleOrder', {
				id: aftersaleId
			}).then(res => {
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
						that.$api('order.deleteAftersaleOrder', {
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
	padding: 20rpx 0;
	.text-after {
		color: rgba(#fff, 0.5);
	}
}
// 服务状态
.status-box {
	background-color: #fff;
	border-radius: 20rpx 20rpx 0px 0px;
	padding: 20rpx;
	margin-top: -20rpx;
	.status-text {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		margin-bottom: 20rpx;
	}
	.status-time {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
	}
	.cuIcon-right {
		color: rgba(153, 153, 153, 1);
		font-size: 30rpx;
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
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}
	.aftersale-money--num {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(225, 33, 43, 1);
	}
}
// order-shop
.order-shop {
	padding: 20rpx;
	background-color: #fff;
	margin-bottom: 20rpx;
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
		height: 60rpx;
		background: rgba(238, 238, 238, 1);
		border-radius: 30rpx;
		padding: 0;
		margin-right: 20rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
	}
}
</style>
