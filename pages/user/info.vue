<!-- 个人信息 -->
<template>
	<view class="container">
		<view class="u-flex u-row-between u-p-x-30 info-head u-p-y-20">
			<view class="info-title">基本信息</view>
			<button class="u-reset-button save-btn" :class="{ 'dis-btn': editInfoDisabled }" :disabled="editInfoDisabled" @tap="editUserInfo">保存</button>
		</view>
		<view class="user-list u-flex u-row-between">
			<text class="list-name">头像</text>
			<view class="u-flex" @tap="onChooseImg">
				<image class="avatar" :src="userData.avatar" mode=""></image>
				<text class="u-iconfont uicon-arrow-right u-m-l-20" style="color:#999;"></text>
			</view>
		</view>
		<view class="user-list u-flex u-row-between">
			<text class="list-name">昵称</text>
			<view class="u-flex">
				<input
					class="list-val"
					v-model="userData.nickname"
					@input="onChangeNickName"
					@blur="onChangeNickName"
					@confirm="onChangeNickName"
					placeholder="请输入昵称~"
					maxlength="50"
					placeholder-style="color:#c8c9cc;fontSize:28rpx"
				/>
				<text class="u-iconfont uicon-arrow-right u-m-l-20" style="color:#999;"></text>
			</view>
		</view>
		<view class="user-list  u-flex u-row-between u-m-b-10" @tap="showCalendar = true">
			<text class="list-name">生日</text>
			<view class="u-flex">
				<text class="list-val">{{ userData.birthday || '请选择生日~' }}</text>
				<text class="u-iconfont uicon-arrow-right u-m-l-20" style="color:#999;"></text>
			</view>
		</view>

		<view class="user-list u-flex u-row-between" @tap="$Router.push('/pages/user/address/list')">
			<text class="list-name">地址管理</text>
			<view class="u-flex">
				<text class="list-val"></text>
				<text class="u-iconfont uicon-arrow-right u-m-l-20" style="color:#999;"></text>
			</view>
		</view>
		<view class="user-list u-flex u-row-between" @tap="changePwd">
			<text class="list-name">修改密码</text>
			<view class="u-flex">
				<text class="list-val"></text>
				<text class="u-iconfont uicon-arrow-right u-m-l-20" style="color:#999;"></text>
			</view>
		</view>
		<view class="user-list u-flex u-row-between" @tap="bindMobile">
			<text class="list-name">手机号</text>
			<view class="u-flex">
				<text class="list-val">{{ userInfo.mobile || '暂未绑定手机号' }}</text>
				<text v-if="userInfo.id && !userInfo.verification.mobile" class="u-iconfont uicon-arrow-right u-m-l-20" style="color:#999;"></text>
				<text v-else class="u-iconfont uicon-checkmark-circle-fill u-m-l-20" style="color:#09BB07;"></text>
			</view>
		</view>

		<!-- 第三方账号 -->
		<view class="other-account" v-if="platform !== 'H5'">
			<view class="head-title u-p-x-30">第三方账号绑定</view>
			<!-- #ifdef MP-WEIXIN  -->
			<!-- 微信小程序 -->
			<view v-if="platform === 'wxMiniProgram'" class="account-list u-flex u-row-between">
				<view class=" u-flex u-col-center">
					<image class="list-img" :src="$IMG_URL + '/imgs/user/bind_wxmp.png'" mode=""></image>
					<text class="list-name">微信小程序</text>
				</view>
				<view class="u-flex u-col-center">
					<view class="info u-flex u-col-center">
						<open-data class="avatar u-m-r-20" type="userAvatarUrl"></open-data>
						<open-data class="name" type="userNickName"></open-data>
					</view>
					<view class="bind-box u-m-l-20">
						<button class="u-reset-button bind-btn" v-if="userInfo.id && !userInfo.verification.wxMiniProgram" @tap="bindThirdOauth('wxMiniProgram', 'Wechat')">
							绑定
						</button>
						<button class="u-reset-button relieve-btn" v-else @tap="unbindThirdOauth('wxMiniProgram', 'Wechat')">解绑</button>
					</view>
				</view>
			</view>
			<!-- #endif  -->

			<!-- #ifdef H5  -->
			<!-- 微信公众号 -->
			<view v-if="platform === 'wxOfficialAccount'" class="account-list u-flex u-row-between">
				<view class=" u-flex u-col-center">
					<image class="list-img" :src="$IMG_URL + '/imgs/user/bind_wxh5.png'" mode=""></image>
					<text class="list-name">微信公众号</text>
				</view>
				<view class="u-flex u-col-center">
					<view class="info u-flex u-col-center" v-if="thirdOauthInfo">
						<image class="avatar u-m-r-20" :src="thirdOauthInfo.headimgurl" mode=""></image>
						<view class="name">{{ thirdOauthInfo.nickname }}</view>
					</view>
					<view class="bind-box u-m-l-20">
						<button class="u-reset-button bind-btn" v-if="userInfo.id && !userInfo.verification.wxOfficialAccount" @tap="bindThirdOauth('wxOfficialAccount', 'Wechat')">
							绑定
						</button>
						<button class="u-reset-button relieve-btn" v-else @tap="unbindThirdOauth('wxOfficialAccount', 'Wechat')">解绑</button>
					</view>
				</view>
			</view>
			<!-- #endif  -->

			<!-- #ifdef APP-PLUS  -->
			<!-- App -->
			<view v-if="platform === 'App'" class="account-list u-flex u-row-between">
				<view class=" u-flex u-col-center">
					<image class="list-img" :src="$IMG_URL + '/imgs/user/bind_wx.png'" mode=""></image>
					<text class="list-name">微信</text>
				</view>
				<view class="u-flex u-col-center">
					<view class="info u-flex u-col-center" v-if="thirdOauthInfo">
						<image class="avatar u-m-r-20" :src="thirdOauthInfo.headimgurl" mode=""></image>
						<view class="name">{{ thirdOauthInfo.nickname }}</view>
					</view>
					<view class="bind-box u-m-l-20">
						<button class="u-reset-button bind-btn" v-if="userInfo.id && !userInfo.verification.wxOpenPlatform" @tap="bindThirdOauth('App', 'Wechat')">绑定</button>
						<button class="u-reset-button relieve-btn" v-else @tap="unbindThirdOauth('App', 'Wechat')">解绑</button>
					</view>
				</view>
			</view>
			<!-- #endif  -->
		</view>

		<view class="btn-box u-flex u-row-center u-col-center">
			<button hover-class="hover-logout-btn" class="u-reset-button logout-btn" @tap="showModal = true">退出登录</button>
		</view>

		<!-- 登录提示 -->
		<shopro-auth-modal v-if="authType"></shopro-auth-modal>
		<!-- 日历 -->
		<u-picker
			@confirm="changeCalendar"
			mode="time"
			confirm-color="#e9b461"
			v-model="showCalendar"
			:params="{ year: true, month: true, day: true, hour: false, minute: false, second: false }"
		></u-picker>
		<!-- modal -->
		<u-modal
			ref="uModal"
			v-model="showModal"
			:show-cancel-button="true"
			confirm-color="#F54141"
			cancel-color="#666666"
			@confirm="confirmLogOut"
			content="确定退出登录？"
		></u-modal>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
import Auth from '@/shopro/permission/index.js';
import wechat from '@/shopro/wechat/wechat';

export default {
	components: {},
	data() {
		return {
			platform: this.$platform.get(),
			userData: {},
			showCalendar: false,
			showModal: false,
			editInfoDisabled: true,
			thirdOauthInfo: null //第三方信息
		};
	},
	computed: {
		...mapGetters(['userInfo', 'authType'])
	},
	onLoad() {
		this.userData = JSON.parse(JSON.stringify(this.userInfo));
		this.getThirdOauthInfo();
	},
	methods: {
		...mapActions(['getUserInfo', 'showAuthModal', 'logout']),
		// 选择日期
		changeCalendar(e) {
			this.userData.birthday = `${e.year}-${e.month}-${e.day}`;
			this.editInfoDisabled = this.userData.birthday == this.userInfo.birthday;
		},
		// 修改密码
		changePwd() {
			this.showAuthModal('changePwd');
		},
		// 修改昵称
		onChangeNickName() {
			this.editInfoDisabled = this.userData.nickname == this.userInfo.nickname;
		},
		// 修改手机号
		bindMobile() {
			!this.userInfo.verification.mobile && this.showAuthModal('bindMobile');
		},
		// 更换头像
		async onChooseImg() {
			let authState = 0;
			authState += await new Auth('writePhotosAlbum').check();
			if (authState < 1) return;
			authState += await new Auth('camera').check();
			if (authState < 2) return;
			const chooseImageRes = await this.chooseImage(1);
			const uploadImageRes = await this.uploadImage(chooseImageRes[0]);
			this.userData.avatar = uploadImageRes.fullurl;
			this.userData.fileUrl = uploadImageRes.url;
			this.editInfoDisabled = this.userData.avatar == this.userInfo.avatar;
		},

		// 第三方绑定信息
		getThirdOauthInfo() {
			let that = this;
			that.$http('user.thirdOauthInfo').then(res => {
				if (res.code === 1) {
					that.thirdOauthInfo = res.data;
				}
			});
		},

		// 解绑
		unbindThirdOauth(platform, provider) {
			let that = this;
			that.$http('user.unbindThirdOauth', {
				platform,
				provider
			}).then(res => {
				if (res.code === 1) {
					uni.showToast({
						title: res.msg
					});
					that.thirdOauthInfo = null;
					that.getUserInfo();
				}
			});
		},
		// 绑定
		async bindThirdOauth(platform, provider) {
			let that = this;
			switch (platform) {
				case 'wxOfficialAccount':
					wechat.bind();
					break;
				case 'wxMiniProgram':
					await wechat.bind();
					that.getUserInfo();
					break;
				case 'App':
					if (provider === 'Wechat') {
						await wechat.bind();
					}
					that.getUserInfo();
					that.getThirdOauthInfo();
					break;
			}
		},

		// 退出登录
		confirmLogOut() {
			this.logout();
			this.$Router.back();
		},
		// 修改信息
		editUserInfo() {
			let that = this;
			if (!that.userData.nickname) {
				this.$u.toast('昵称不能为空');
				return false;
			}
			that.$http(
				'user.profile',
				{
					nickname: that.userData.nickname,
					birthday: that.userData.birthday,
					avatar: that.userData.fileUrl
				},
				'保存中...'
			).then(res => {
				if (res.code === 1) {
					that.getUserInfo();
					that.editInfoDisabled = true;
					that.$u.toast('保存成功');
				}
			});
		},
		// 图片处理-选择图片
		async chooseImage(count = 1) {
			return new Promise((resolve, reject) => {
				uni.chooseImage({
					count: count, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: res => {
						resolve(res.tempFilePaths);
					}
				});
			}).catch(e => {
				console.log(e);
			});
		},
		// 图片处理-上传图片
		async uploadImage(url) {
			const that = this;
			return new Promise((resolve, reject) => {
				that.$u.toast('上传中...');
				uni.uploadFile({
					url: that.$API_URL + 'index/upload',
					filePath: url,
					name: 'file',
					success: res => {
						res = JSON.parse(res.data);
						if (res.code === 1) {
							that.$u.toast('上传成功');
							resolve(res.data);
						} else {
							that.$u.toast('上传失败');
						}
					},
					complete: e => {
						uni.hideLoading();
					}
				});
			}).catch(e => {
				console.log(e);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
// 基本信息
.info-head {
	.info-title {
		line-height: 60rpx;
		font-size: 28rpx;
		font-weight: 600;
		color: #333333;
	}
	.save-btn {
		color: #fff;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		width: 100rpx;
		border-radius: 30rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 28rpx;
	}
	.dis-btn {
		opacity: 0.5;
	}
}
// 三方
.other-account {
	.head-title {
		line-height: 82rpx;
		font-size: 28rpx;
		font-weight: 600;
		color: #333333;
	}
	.list-img {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}
	.account-list {
		background-color: #fff;
		height: 100rpx;
		padding: 0 20rpx;
		.info {
			.avatar {
				width: 38rpx;
				height: 38rpx;
				border-radius: 50%;
				overflow: hidden;
			}
			.name {
				font-size: 28rpx;
				font-weight: 400;
				color: #999999;
			}
		}
		.bind-box {
			.bind-btn {
				padding: 0 20rpx;
				line-height: 60rpx;
				background: #f5f6f8;
				border-radius: 20rpx;
				color: #999;
			}
			.relieve-btn {
				border-radius: 20rpx;
				padding: 0 20rpx;
				line-height: 60rpx;
				background: rgba(#ff0000, 0.05);
				color: #ff0000;
			}
		}
	}
}

// 个人信息项
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
	}
	.list-val {
		color: #999;
		font-size: 28rpx;
		text-align: right;
	}
}

.btn-box {
	margin-top: 200rpx;

	.logout-btn {
		width: 710rpx;
		height: 80rpx;
		line-height: 80rpx;
		border: 1rpx solid #f54141;
		border-radius: 40rpx;
		font-size: 30rpx;
		font-weight: 500;
		color: #f54141;
	}
	.hover-logout-btn {
		width: 710rpx;
		height: 80rpx;
		background: #f54141;
		border: 1rpx solid #f54141;
		border-radius: 40rpx;
		font-size: 30rpx;
		font-weight: 500;
		color: #ffffff;
	}
}
</style>
