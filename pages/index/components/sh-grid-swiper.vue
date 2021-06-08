<template>
	<!-- 产品分类导航 -->
	<view class="wrap">
		<view v-if="true" class="menu-category-box u-m-b-10" :style="list.length <= oneRowNum ? `height:180rpx` : `height:380rpx`">
			<swiper
				class="menu-swiper-box"
				@change="onSwiper"
				:style="list.length <= oneRowNum ? `height:160rpx` : `height:380rpx`"
				circular
				:autoplay="false"
				:interval="3000"
				:duration="1000"
			>
				<swiper-item class="menu-swiper-item" v-for="(itemList, index) in newList" :key="index">
					<view class="menu-tab-box u-flex u-flex-wrap">
						<view
							class="tab-list u-flex-col u-col-center u-row-center"
							:style="{ width: 100 / oneRowNum + '%' }"
							v-for="(item, index) in itemList"
							:key="index"
							@tap="$tools.routerTo(item.path)"
						>
							<image class="tab-img" :src="item.image"></image>
							<text class="">{{ item.name }}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="menu-category-dots" v-if="newList.length > 1">
				<text :class="categoryCurrent === index ? 'category-dot-active' : 'category-dot'" v-for="(dot, index) in newList.length" :key="index"></text>
			</view>
		</view>

		<!-- cell -->
		<view class="menu-list-box" v-else>
			<view
				class="menu-item u-flex u-col-center u-row-between"
				hover-stay-time="150"
				hover-class="u-cell-hover"
				v-for="(nav, index) in list"
				:key="nav.name"
				@tap="jump(nav)"
			>
				<view class="u-flex u-col-center">
					<image v-if="nav.image" class="item-img" :src="nav.image" mode=""></image>
					<text class="item-title">{{ nav.name }}</text>
				</view>
				<u-icon class="u-m-l-20" name="arrow-right" size="26" color="#999"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * shGridSwiper-滑动宫格列表
 * @property {Array} list - 列表数据
 * @property {Number|String} oneRowNum - 单行数量
 */
export default {
	components: {},
	data() {
		return {
			categoryCurrent: 0 //分类轮播下标
		};
	},
	props: {
		list: {
			type: Array,
			default: () => {
				return [];
			}
		},
		oneRowNum: {
			type: [Number, String],
			default: 5
		}
	},
	computed: {
		newList() {
			if (this.list.length) {
				let data = this.$tools.splitData(this.list, this.oneRowNum * 2);
				return data;
			}
		}
	},
	methods: {
		// 轮播
		onSwiper(e) {
			this.categoryCurrent = e.detail.current;
		},
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
// 产品分类
.menu-category-box,
.menu-swiper-box {
	position: relative;
	background: #fff;
	.menu-swiper-item {
		background: #fff;
		height: 100%;
		width: 100%;
	}
	.menu-tab-box {
		.tab-list {
			font-size: 26rpx;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			margin: 20rpx 0;
			.tab-img {
				width: 98rpx;
				height: 98rpx;
				margin-bottom: 10rpx;
			}
		}
	}

	.menu-category-dots {
		display: flex;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 10rpx;

		.category-dot {
			width: 12rpx;
			height: 12rpx;
			background: #eeeeee;
			border-radius: 50%;
			margin-right: 10rpx;
		}

		.category-dot-active {
			width: 12rpx;
			height: 12rpx;
			background: #e9b461;
			border-radius: 50%;
			margin-right: 10rpx;
		}
	}
}
// cell
.menu-list-box {
	.menu-item {
		height: 100rpx;
		padding: 0 30rpx;
		background: #fff;
		border-bottom: 1rpx solid #f3f3f3;
		.item-img {
			width: 44rpx;
			height: 44rpx;
			margin-right: 20rpx;
		}

		.item-title {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			line-height: 24rpx;
		}
	}
}
</style>
