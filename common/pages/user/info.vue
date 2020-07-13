<template>
	<view class="container">
		<view class="user-list x-bc">
			<text class="list-name">头像</text>
			<view class="x-f" @tap="onChooseImg">
				<image class="avatar" :src="userData.avatar" mode=""></image>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="user-list x-bc">
			<text class="list-name">昵称</text>
			<view class="x-f">
				<input class="list-val" v-model="userData.nickname" />
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<picker style="width: 750rpx;" mode="date" :value="userData.birthday" :start="startDate" :end="endDate" @change="onDateChange">
			<view class="user-list x-bc">
				<text class="list-name">生日</text>
				<view class="x-f">
					<text class="list-val">{{ userData.birthday || startDate }}</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
		</picker>
		<view class="user-list x-bc" @tap="jump('/pages/user/edit-phone')">
			<text class="list-name">修改手机号</text>
			<view class="x-f">
				<text class="list-val">{{ userData.mobile }}</text>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="btn-box flex align-center justify-center"><button class="cu-btn confirem-btn" @tap="editUserInfo">保存</button></view>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import shoproModal from '@/components/shopro-modal/shopro-modal.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {
		shoproModal
	},
	data() {
		const currentDate = this.getDate({
			format: true
		});
		return {
			userData: {}
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		}),
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	onLoad() {
		let userData = JSON.stringify(this.userInfo);
		this.userData = JSON.parse(userData);
	},
	methods: {
		...mapActions(['getUserInfo']),
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},
		// 选择日期
		onDateChange(e) {
			this.userData.birthday = e.detail.value;
		},
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		editUserInfo() {
			let that = this;
			that.$api('user.profile', {
				nickname: that.userData.nickname,
				birthday: that.userData.birthday,
				avatar: that.userData.avatar
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast('修改信息成功');
					that.getUserInfo();
					setTimeout(() => {
						that.$Router.back();
					}, 1000);
				}
			});
		},
		onChooseImg() {
			let that = this;
			that.$tools.chooseImage(1).then(res => {
				that.$tools.uploadImage('index/upload', res[0]).then(res => {
					that.userData.avatar = res.full_url;
				});
			});
		}
	}
};
</script>

<style lang="scss">
.user-list {
	background: #fff;
	height: 100rpx;
	border-bottom: 1rpx solid #f6f6f6;
	padding: 0 20rpx;

	.list-name {
		font-size: 28rpx;
	}

	.avatar {
		width: 67rpx;
		height: 67rpx;
		border-radius: 50%;
		// background: #ccc;
	}

	.cuIcon-right {
		margin-left: 25rpx;
	}

	.list-val {
		color: #999;
		font-size: 28rpxc;
		text-align: right;
	}
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
