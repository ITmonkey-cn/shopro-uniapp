<template>
	<view class="">
		<view class="mask" v-if="isShowDropDown" cathctouchmove @tap.stop="onHideDropDown"></view>
		<!-- 商家信息 -->
		<view class="shopinfo-box">
			<image class="user-bg" src="/static/imgs/user/shop_headbg.png" mode=""></image>
			<view class="head-wrap">
				<view class="titleNav pad">
					<view class="status-bar"></view>
					<text class="nav-title x-f">我的</text>
				</view>
				<view class="user-head x-bc">
					<view class="shop-info" @tap="jump('/pages/app/merchant/info')">
						<view class="x-f mb30">
							<text class="shop-title">龙宇国际店</text>
							<text class="cuIcon-roundrightfill"></text>
						</view>
						<view class="shop-phone">郑州市金水区曼哈顿广场</view>
					</view>

					<button v-if="true" @tap="jump('/pages/index/user')" class="cu-btn merchant-btn">切换个人版</button>
				</view>
			</view>
		</view>
		<!-- 信息卡片 -->
		<view class="info-card-box x-bc">
			<view class="info-card">
				<image class="card-bg" src="/static/imgs/user/shop_info.png" mode="aspectFill"></image>
				<view class="card-content y-c">
					<view class="card-title">输码核销</view>
					<view class="x-f card-detail-box" @tap="onEditCode">
						<text class="cuIcon-edit card-icon"></text>
						<text class="card-detail">输码</text>
					</view>
				</view>
			</view>
			<view class="info-card">
				<image class="card-bg" src="/static/imgs/user/shop_qrcode.png" mode="aspectFill"></image>
				<view class="card-content y-c">
					<view class="card-title">扫码核销</view>
					<view class="x-f card-detail-box">
						<text class="cuIcon-qr_code card-icon" style="color: #129BF9;"></text>
						<text class="card-detail" style="color: #129BF9;">扫码</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 核销商品信息 -->
		<view class="cancel-shop-box">
			<view class="cancel-nav x-f">
				<view class="nav-item x-f" v-for="nav in cancelTypeList" :key="nav.id" @tap="onNav(nav.type)">
					<view class="y-f" style="width: 100%;">
						<view class="item-title x-f" :class="{ 'title-active': cancelType === nav.type }">
							<text>{{ nav.title }}</text>
							<view :class="{ 'icon-active': cancelType === nav.type }">
								<text class="cuIcon-triangleupfill" :class="{ 'icon-active': cancelType === nav.type }"></text>
							</view>
						</view>
						<text class="nav-line" :class="{ 'line-active': cancelType === nav.type }"></text>
					</view>
				</view>
				<!-- 下拉窗 -->
				<view class="drop-down-box" :class="{ 'hide-drop-down': !isShowDropDown }">
					<view class="drop-down-item x-bc" v-for="(item, index) in dropDown[cancelType]" :key="index" @tap="onFilter(item.value)">
						<text class="item-title">{{ item.title }}</text>
						<text class="cuIcon-check" v-if="filter[cancelType] == item.value"></text>
					</view>
				</view>
			</view>
			<!-- 销量 -->
			<view class="sales-volume-box x-bc pa30">
				<view class="sales-volume x-c">订单量(单)：15893</view>
				<view class="sales-volume x-c">交易额(元)：5693.86</view>
			</view>
		</view>
		<!-- 订单列表 -->
		<view class="order-list" v-for="order in 7" :key="order" @tap.stop="jump('/pages/app/merchant/detail')">
			<view class="order-head x-bc">
				<text class="no">订单编号：25689456336</text>
				<text class="state">已完成</text>
			</view>
			<view class="goods-order" v-if="false">
				<view class="order-content"><shopro-mini-card :type="'order'" :detail="goods"></shopro-mini-card></view>
			</view>
			<view class="order-bottom x-f">
				<text class="total-price-title">实付款：</text>
				<text class="total-price">678.90</text>
			</view>
		</view>

		<!-- 日期选择 -->
		<uni-calendar
			v-model="showCalendar"
			:mode="mode"
			:start-text="startText"
			:end-text="endText"
			:range-color="rangeColor"
			:range-bg-color="rangeBgColor"
			:active-bg-color="activeBgColor"
			@change="selDate"
		></uni-calendar>
		<!-- 输码弹窗 -->
		<shopro-modal v-model="showInputModal" style="z-index: 88;">
			<block slot="modalContent">
				<view class="modal-box">
					<view class="modal-head">
						<image class="modal-head-img" src="/static/imgs/modal/qrcode_modal.png" mode=""></image>
						<text class="modal-head-title">输码核销</text>
					</view>
					<input class="inp" type="number" v-model="qrcode" placeholder="在此输入核销码" placeholder-class="pl-inp" />
					<button class="cu-btn post-btn" @tap="onConfirm">核销</button>
				</view>
			</block>
		</shopro-modal>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			cancelType: 'date', //核销分类
			cancelTypeList: [
				{
					id: 0,
					title: '今日',
					type: 'date'
				},
				{
					id: 1,
					title: '全部',
					type: 'status'
				}
			],
			showInputModal: false, //输码核销
			qrcode: '',
			showCalendar: false, //日期选择
			mode: 'range',
			result: '请选择日期',
			startText: '开始',
			endText: '结束',
			rangeColor: '#4CB89D',
			rangeBgColor: 'rgba(76,184,157,0.13)',
			activeBgColor: '#4CB89D',
			isShowDropDown: false, //是否显示下拉菜单
			filter: {
				date: 'yesterday',
				status: 'all'
			},
			dropDown: {
				date: [
					{ title: '昨日', value: 'yesterday', isChecked: false },
					{ title: '今日', value: 'today', isChecked: false },
					{ title: '本周', value: 'week', isChecked: false },
					{ title: '本月', value: 'month', isChecked: false },
					{ title: '自定义', value: 'custom', isChecked: false }
				],
				status: [{ title: '全部', value: 'all', isChecked: false }, { title: '已完成', value: 'end', isChecked: true }, { title: '待完成', value: 'ing', isChecked: false }]
			}
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
		onNav(type) {
			this.cancelType = type;
			this.isShowDropDown = true;
		},
		// 选择日期
		selDate(e) {
			console.log(11111111, e);
			this.isShowDropDown = false;
		},
		// 下拉筛选
		onHideDropDown() {
			this.isShowDropDown = false;
		},
		// 选择筛选
		onFilter(val) {
			if (val == 'custom') {
				this.showCalendar = true;
			}
			this.filter[this.cancelType] = val;
			console.log(this.filter);
		},
		//输码
		onEditCode() {
			this.showInputModal = true;
		}
	}
};
</script>

<style lang="scss">
// 遮罩
.mask {
	width: 100%;
	height: 100%;
	position: fixed;
	z-index: 20;
}
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
			}
			.cuIcon-roundrightfill {
				color: rgba(255, 255, 255, 1);
				font-size: 34rpx;
				margin-left: 10rpx;
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
				.cuIcon-edit {
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
	margin: 10rpx 0 0;
	position: relative;
	z-index: 22;
	.nav-item {
		flex: 1;
		&:first-child {
			&::after {
				content: '';
				height: 30rpx;
				width: 2rpx;
				background-color: #bdbdbd;
				display: inline-block;
			}
		}

		.item-title {
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #bdbdbd;
			line-height: 76rpx;
		}
		.cuIcon-triangleupfill {
			color: #bdbdbd;
			transition: all linear 0.2s;
		}
		.icon-active {
			transform: rotate(180deg);
			transition: all linear 0.2s;
			color: #4cb89d;
		}
		.title-active {
			color: #4cb89d;
		}
		.nav-line {
			width: 100%;
			height: 2rpx;
			background: rgba(#ccc, 0.5);
		}

		.line-active {
			background: #4cb89d;
			height: 2rpx;
		}
	}
}
// 下拉窗

.drop-down-box {
	position: absolute;
	z-index: 22;
	width: 750rpx;
	top: 82rpx;
	background-color: #ffff;
	box-shadow: 0px 15rpx 27rpx 0px rgba(203, 203, 203, 0.34);
	transform: scaleX(1);
	transition: all linear 0.1s;
	.drop-down-item {
		height: 60rpx;
		border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);
		padding: 0 60rpx;
		.item-title {
			font-size: 24rpx;
			color: #bdbdbd;
		}
		.cuIcon-check {
			color: #4cb89d;
		}
		.title-active {
			color: #4cb89d;
		}
	}
}
.hide-drop-down {
	top: 0;
	width: 750rpx;
	transform: scaleY(0);
	transition: all linear 0.1s;
}
// 销量
.sales-volume-box {
	background-color: #fff;
	.sales-volume {
		width: 338rpx;
		height: 72rpx;
		background: rgba(76, 184, 157, 0.06);
		border: 1rpx solid rgba(185, 227, 217, 1);
		border-radius: 10rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(76, 184, 157, 1);
	}
}
// 输码弹窗
.modal-box {
	background: #fff;
	width: 610rpx;
	margin: 0 auto;
	border-radius: 20rpx;
	.modal-head-img {
		width: 100%;
		height: 213rpx;
	}

	.modal-head-title {
		font-size: 35rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #6d5028;
		line-height: 42rpx;
	}

	.inp {
		width: 501rpx;
		height: 78rpx;
		border: 1rpx solid rgba(168, 112, 13, 1);
		margin: 60rpx auto 40rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #6d5028;

		.pl-inp {
			color: #bd9560;
		}
	}
	.post-btn {
		width: 492rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		padding: 0;
		margin-bottom: 60rpx;
	}
}
// 订单列表
.order-list {
	background: #fff;
	margin: 20rpx 0;
	.order-bottom {
		justify-content: flex-end;
		height: 80rpx;
		padding: 0 20rpx;
		.total-price-title {
			color: #999999;
			font-size: 24rpx;
		}
		.total-price{
			color: #333;
			font-size: 26rpx;
			&::before{
				content: '￥';
				font-size: 20rpx;
			}
		}
	}
	.order-head {
		padding: 0 25rpx;
		height: 77rpx;
		border-bottom: 1rpx solid #dfdfdf;

		.no {
			font-size: 26rpx;
			color: #999;
		}

		.state {
			font-size: 26rpx;
			color: #a8700d;
		}
	}
	.goods-order {
		border-bottom: 1px solid rgba(223, 223, 223, 0.5);
		padding: 20rpx 20rpx 0;
		margin-bottom: 20rpx;
	}
}
</style>
