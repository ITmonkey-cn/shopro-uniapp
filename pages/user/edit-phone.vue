<template>
	<view class="bank-wrap">
		<view class="form-box">
			<label>
				<view class="form-item flex align-center justify-between">
					<view class="item-title">手机号:</view>
					<input class="item-input flex-sub" type="number" v-model="phone" placeholder="请输入要绑定的新手机号" placeholder-class="pl-input" />
				</view>
			</label>
			<view class="form-item flex align-center justify-between">
				<label>
					<view class="x-f">
						<view class="item-title">验证码:</view>
						<input class="item-input flex-sub" type="text" v-model="code.value" placeholder="请输入验证码" placeholder-class="pl-input" />
					</view>
				</label>
				<button class="cu-btn code-btn" :disabled="code.status" @tap.stop="getCode">{{ code.text }}</button>
			</view>
		</view>

		<view class="btn-box flex align-center justify-center"><button class="cu-btn confirem-btn" @tap="editChangemobile">提交</button></view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			code: {
				text: '获取验证码',
				status: false,
				value: ''
			},
			phone: ''
		};
	},
	computed: {},
	onLoad() {
		const fromType = this.$Route.query.fromType;
		switch (fromType) {
			case 'bind':
				uni.setNavigationBarTitle({
					title: '绑定手机号'
				});
				break;
			default:
				uni.setNavigationBarTitle({
					title: '修改手机号'
				});
		}
	},
	methods: {
		...mapActions(['getUserInfo']),
		//修改手机号
		editChangemobile() {
			let that = this;
			that.$api('user.changemobile', {
				mobile: that.phone,
				captcha: that.code.value
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast('修改手机号成功');
					that.getUserInfo();
					setTimeout(() => {
						that.$Router.back();
					}, 500);
				}
			});
		},

		// 获取短信
		getCode() {
			let that = this;
			that.code.status = true;
			let countdown = 60;
			that.$api('sms.send', {
				mobile: that.phone,
				event: 'changemobile'
			}).then(res => {
				if (res.code === 1) {
					that.code.text = countdown + '秒';
					that.code.status = true;
					let timer = setInterval(() => {
						if (countdown > 0) {
							that.code.text = countdown - 1 + '秒';
							countdown--;
						} else {
							clearInterval(timer);
							that.code.text = '获取验证码';
							that.code.status = false;
						}
					}, 1000);
				} else {
					that.code.status = false;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.form-box {
	background: #fff;
	.form-item {
		height: 96rpx;
		border-bottom: 1rpx solid rgba(#dfdfdf, 0.9);
		padding: 0 25rpx;
		position: relative;
		.item-title {
			color: #333;
			font-size: 28rpx;
			font-weight: 600;
		}
		.item-input {
			font-size: 28rpx;
			color: #333;
			padding-left: 20rpx;
			width: 300rpx;
		}
		.pl-input {
			color: #999;
		}
		.code-btn {
			background: none;
			font-size: 28rpx;
			color: #a8700d;
			position: absolute;
			top: 50%;
			padding: 0;
			transform: translateY(-50%);
			right: 30rpx;
		}
	}
}
.notice {
	color: #999;
	font-size: 24rpx;
	padding: 0 25rpx;
	height: 90rpx;
}
.btn-box {
	margin-top: 60rpx;
	.confirem-btn {
		width: 710rpx;
		height: 80rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border: 1rpx solid rgba(238, 238, 238, 1);
		border-radius: 40rpx;
		font-size: 30rpx;
		color: rgba(#fff, 0.9);
	}
}
</style>
