<template>
	<view class="sh-user-menu-box">
		<view class="tools-box" v-if="false">
			<view class="tool-item y-f" @tap="jump(menu.url, menu.parmas)" v-for="menu in menuList" :key="menu.title">
				<image class="tool-img" :src="menu.img" mode=""></image>
				<text class="item-title">{{ menu.title }}</text>
			</view>
		</view>
		<view class="menu-list-box">
			<view class="menu-item x-bc" @tap="jump(menu.url, menu.parmas)" v-for="menu in menuList" :key="menu.title">
				<view class="x-f">
					<image class="item-img" :src="menu.img" mode=""></image>
					<text class="item-title">{{ menu.title }}</text>
				</view>
				<text class="cuIcon-right item-arrow"></text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'shUserMenu',
	components: {},
	data() {
		return {};
	},
	props: {
		menuList: {
			type: Array,
			default() {
				return [
					{
						title: '商品收藏',
						img: 'http://shopro.7wpp.com/imgs/user/list1.png',
						url: '/pages/user/favorite'
					},
					{
						title: '浏览足迹',
						img: 'http://shopro.7wpp.com/imgs/user/user_log.png',
						url: '/pages/user/log'
					},

					{
						title: '常见问题',
						img: 'http://shopro.7wpp.com/imgs/user/list7.png',
						url: '/pages/public/faq'
					},
					{
						title: '邀请好友',
						img: 'http://shopro.7wpp.com/imgs/user/list11.png',
						url: '/pages/public/poster/index',
						parmas: { posterType: 'user' }
					},
					{
						title: '积分商城',
						img: 'http://shopro.7wpp.com/imgs/user/list12.png',
						url: '/pages/app/score/list'
					},
					{
						title: '我的拼团',
						img: 'http://shopro.7wpp.com/imgs/user/list5.png',
						url: '/pages/activity/groupon/my-groupon'
					},
					{
						title: '系统设置',
						img: 'http://shopro.7wpp.com/imgs/user/list8.png',
						url: '/pages/user/set'
					}
				];
			}
		}
	},
	computed: {},
	methods: {
		jump(path, query) {
			this.$Router.push({
				path: path,
				query: query
			});
		}
	}
};
</script>

<style lang="scss">
// 宫格
.tools-box {
	background: #fff;
	display: flex;
	flex-wrap: wrap;
	padding-bottom: 40rpx;
	margin-bottom: 20rpx;

	.tool-item {
		width: (750rpx/4);
		padding-top: 40rpx;

		.tool-img {
			width: 44rpx;
			height: 44rpx;
			// background: #ccc;
		}

		.item-title {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			line-height: 24rpx;
			padding-top: 30rpx;
		}
	}
}
// 列表
.menu-list-box {
	.menu-item {
		height: 100rpx;
		padding: 0 30rpx;
		background: #fff;
		border-bottom: 1rpx solid #f3f3f3;
		.item-img {
			width: 44rpx;
			height: 44rpx;
			// background: #ccc;
		}

		.item-title {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			line-height: 24rpx;
			margin-left: 20rpx;
		}
		.item-arrow{
			color:rgba(153, 153, 153, 1);
		}
	}
}
</style>
