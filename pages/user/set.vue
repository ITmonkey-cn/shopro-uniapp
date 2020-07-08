<template>
	<view class="set-box">
		<view class="list x-bc" @tap="jump('/pages/public/feedback')">
			<view class="title">意见反馈</view>
			<text class="cuIcon-right"></text>
		</view>
		<view class="list x-bc" @tap="jump('/pages/user/address/list')">
			<view class="title">地址管理</view>
			<text class="cuIcon-right"></text>
		</view>
		<view class="list x-bc" @tap="jump('/pages/user/edit-password')">
			<view class="title">修改密码</view>
			<text class="cuIcon-right"></text>
		</view>
		<view class="list x-bc" @tap="jump('/pages/public/richtext', { id: 3 })">
			<view class="title">关于我们</view>
			<text class="cuIcon-right"></text>
		</view>
		<!-- 	<view class="list x-bc">
			<view class="title">
				消息推送
			</view>
			<text class="cuIcon-right"></text>
		</view> -->
		<view class="list x-bc" @tap="onVersion">
			<view class="title">当前版本</view>
			<text class="cuIcon-right"></text>
		</view>
		<!-- <view class="list x-bc">
			<view class="title">
				清除缓存
			</view>
			<text class="cuIcon-right"></text>
		</view> -->
		<!-- <view class="list x-bc">
			<view class="title">分享APP</view>
			<text class="cuIcon-right"></text>
		</view> -->
		<view class="list x-bc" @tap="outLogin">
			<view class="title">退出登录</view>
			<text class="cuIcon-right"></text>
		</view>
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
import { mapState, mapActions } from 'vuex';
export default {
	components: {},
	data() {
		return {};
	},
	computed: {
		...mapState({
			initData: state => state.init.initData //初始化数据
		})
	},
	methods: {
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 退出登录
		outLogin() {
			this.$store.commit('OUT_LOGIN');
			this.$Router.replace('/pages/public/login');
		},
		// 当前版本
		onVersion() {
			let version = this.initData.info.version;
			this.$tools.toast('当前版本:' + version);
		}
	}
};
</script>

<style lang="scss">
page {
	background: #fff;
}

.list {
	height: 110rpx;
	padding: 0 20rpx;
	border-bottom: 1rpx solid rgba(#dfdfdf, 0.6);

	.title {
		font-size: 28rpx;
	}

	.cuIcon-right {
		font-size: 34rpx;
		color: #999;
	}
}
</style>
