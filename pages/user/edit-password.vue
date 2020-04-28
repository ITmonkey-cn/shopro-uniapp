<template>
	<view class="bank-wrap">
		<view class="form-box">
			<label>
				<view class="form-item flex align-center justify-between">
					<view class="item-title">旧密码:</view>
					<input class="item-input flex-sub" type="text" v-model="oldPassword" placeholder="请输入旧密码" placeholder-class="pl-input" />
				</view>
			</label>
			<label>
				<view class="form-item flex align-center justify-between">
					<view class="item-title">新密码:</view>
					<input class="item-input flex-sub" type="text" v-model="newPassword1" placeholder="请输入新密码" placeholder-class="pl-input" />
				</view>
			</label>
			<label>
				<view class="form-item flex align-center justify-between">
					<view class="item-title">确认新密码:</view>
					<input class="item-input flex-sub" type="text" v-model="newPassword2" placeholder="请再次输入新密码" placeholder-class="pl-input" />
				</view>
			</label>
		</view>
		<view class="btn-box flex align-center justify-center"><button class="cu-btn confirem-btn" @tap="editPassword">确认修改</button></view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			oldPassword: '',
			newPassword1: '',
			newPassword2: ''
		};
	},
	computed: {},
	onLoad() {},
	methods: {
		...mapActions(['getUserInfo']),
		//修改密码
		editPassword() {
			let that = this;
			if (that.newPassword2 !== that.newPassword1) {
				that.$tools.toast('新密码不一致');
			} else {
				that.$api('user.changepwd', {
					oldpassword: that.oldPassword,
					newpassword: that.newPassword1
				}).then(res => {
					if (res.code === 1) {
						that.$tools.toast('修改密码成功');
						uni.setStorageSync('token', res.data.userinfo.token);
						that.getUserInfo();
						setTimeout(() => {
							that.$Router.back();
						}, 1000);
					}
				});
			}
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
		.item-title {
			color: #333;
			font-size: 28rpx;
			font-weight: 600;
		}
		.item-input {
			font-size: 28rpx;
			color: #333;
			padding-left: 20rpx;
		}
		.pl-input {
			color: #999;
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
