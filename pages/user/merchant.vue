<template>
	<view class="">
		<!-- 商家信息 -->
		<view class="shopinfo-box">
			<image class="user-bg" src="/static/imgs/user/shop_headbg.png" mode=""></image>
			<view class="head-wrap">
				<view class="titleNav pad">
					<view class="status-bar"></view>
					<text class="nav-title x-f">我的</text>
				</view>
				<view class="user-head x-bc">
					<view class="shop-info">
						<view class="shop-title">龙宇国际店</view>
						<view class="shop-phone">联系电话：15689562356</view>
					</view>

					<button v-if="true" @tap="jump('/pages/index/user')" class="cu-btn merchant-btn">切换个人版</button>
				</view>
			</view>
		</view>
		<!-- 信息卡片 -->
		<view class="info-card-box x-bc">
			<view class="info-card">
				<image class="card-bg" src="/static/imgs/user/shop_qrcode.png" mode="aspectFill"></image>
				<view class="card-content y-c">
					<view class="card-title">扫码核销</view>
					<view class="x-f card-detail-box">
						<text class="cuIcon-qr_code card-icon"></text>
						<text class="card-detail">扫码</text>
					</view>
				</view>
			</view>
			<view class="info-card" @tap="jump('/pages/user/merchant-info')">
				<image class="card-bg" src="/static/imgs/user/shop_info.png" mode="aspectFill"></image>
				<view class="card-content y-c">
					<view class="card-title">门店信息</view>
					<view class="x-f card-detail-box">
						<text class="cuIcon-shop card-icon"></text>
						<text class="card-detail">查看</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 核销商品信息 -->
		<view class="cancel-shop-box">
			<view class="cancel-nav x-f">
				<view class="nav-item y-f" v-for="nav in cancelTypeList" :key="nav.id" @tap="onNav(nav.id)">
					<view class="item-title">{{ nav.title }}</view>
					<text class="nav-line" :class="{ 'line-active': cancelType === nav.id }"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			cancelType: 0, //核销分类
			cancelTypeList: [
				{
					id: 0,
					title: '全部',
					type: 'all'
				},
				{
					id: 1,
					title: '未核销',
					type: 'nopay'
				},
				{
					id: 2,
					title: '已核销',
					type: 'nosend'
				}
			]
		};
	},
	computed: {},
	methods: {
		jump(path, query) {
			this.$Router.push({
				path: path,
				query: query
			});
		},
		// 切换核销分类
		onNav(id) {
			this.cancelType = id;
		}
	}
};
</script>

<style lang="scss">
// 商户信息
.shopinfo-box {
	position: relative;
	height: 320rpx;
	.user-bg {
		width: 100%;
		height: 320rpx;
	}
	.head-wrap {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		z-index: 9;
		top: 0;
		.nav-title {
			font-size: 38rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #fff;
		}
		.status-bar {
			// #ifndef H5
			height: var(--status-bar-height);
			// #endif
			// #ifdef H5
			height: 50rpx;
			// #endif
			width: 750rpx;
		}
	}

	.user-head {
		padding-top: 50rpx;
		.shop-info {
			padding-left: 30rpx;
			.shop-title {
				font-size: 34rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
				margin-bottom: 30rpx;
			}
			.shop-phone {
				font-size: 22rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
			}
		}
		.merchant-btn {
			padding: 0;
			width: 136rpx;
			height: 46rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 23rpx 0px 0px 23rpx;
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #3eb49c;
		}
	}
}
// 卡片
.info-card-box {
	background-color: #fff;
	padding: 30rpx 20rpx;
	.info-card {
		position: relative;
		width: 344rpx;
		height: 165rpx;
		border-radius: 10rpx;
		overflow: hidden;
		.card-bg {
			width: 100%;
			height: 100%;
		}
		.card-content {
			position: absolute;
			width: 100%;
			height: 100%;
			z-index: 3;
			top: 0;
			left: 0;
			padding: 30rpx 0 0 30rpx;
			.card-title {
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
			}
			.card-detail-box {
				padding: 10rpx 20rpx;
				height: 45rpx;
				background: rgba(255, 255, 255, 1);
				width: 150rpx;
				border-radius: 23rpx;
				margin-top: 20rpx;
				.card-detail {
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(0, 187, 206, 1);
				}
				.cuIcon-qr_code {
					color: #0f98f9;
				}
				.cuIcon-shop {
					color: #00b6ce;
				}
				.card-icon {
					font-size: 36rpx;
					margin-right: 14rpx;
				}
			}
		}
	}
}
// 核销nav
.cancel-nav {
	background: #fff;
	height: 80rpx;
	margin: 10rpx 0;

	.nav-item {
		width:160rpx ;
		
		.item-title {
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 76rpx;
		}

		.nav-line {
			width: 100rpx;
			height: 4rpx;
			background: #fff;
		}

		.line-active {
			background: rgba(230, 184, 115, 1);
		}
	}
}
</style>
