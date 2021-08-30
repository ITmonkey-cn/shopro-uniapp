<template>
	<view class="adv-box u-m-y-10 u-m-x-20">
		<!-- 模板1-->
		<view class="u-flex" v-if="advType === 1">
			<image style="width:710rpx;height:220rpx;border-radius: 10rpx;" @tap="jump(advList[0].path)" :src="advList[0].image" mode="aspectFill"></image>
		</view>
		<!-- 模板2-->
		<view class="type1 u-flex" v-if="advType === 2">
			<image class="type1-img u-m-r-10" @tap="jump(advList[0].path)" :src="advList[0].image" mode="aspectFill"></image>
			<image class="type1-img" @tap="jump(advList[1].path)" :src="advList[1].image" mode="aspectFill"></image>
		</view>
		<!-- 模板3-->
		<view class="type2 u-flex" v-if="advType === 3">
			<view class="type2-img1 u-m-r-10"><image class="type2-img1 " @tap="jump(advList[0].path)" :src="advList[0].image" mode="aspectFill"></image></view>
			<view class="type2-box">
				<image class="type2-img2" @tap="jump(advList[1].path)" :src="advList[1].image" mode="aspectFill"></image>
				<image class="type2-img2" @tap="jump(advList[2].path)" :src="advList[2].image" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 模板4-->
		<view class="type3 u-flex" v-if="advType === 4">
			<view class="type3-box">
				<image class="type3-img1" @tap="jump(advList[0].path)" :src="advList[0].image" mode="aspectFill"></image>
				<image class="type3-img1" @tap="jump(advList[1].path)" :src="advList[1].image" mode="aspectFill"></image>
			</view>
			<view class="type3-img2 u-m-l-10"><image class="type3-img2" @tap="jump(advList[2].path)" :src="advList[2].image" mode="aspectFill"></image></view>
		</view>
		<!-- 模板5-->
		<view class="type4 " v-if="advType === 5">
			<view class="type4-box u-flex">
				<image class="type4-img1 u-m-r-10" @tap="jump(advList[0].path)" :src="advList[0].image" mode="aspectFill"></image>
				<image class="type4-img1" @tap="jump(advList[1].path)" :src="advList[1].image" mode="aspectFill"></image>
			</view>
			<view class="type4-img2 u-m-t-10"><image class="type4-img2" @tap="jump(advList[2].path)" :src="advList[2].image" mode="aspectFill"></image></view>
		</view>
		<!-- 模板6-->
		<view class="type5" v-if="advType === 6">
			<view class="type5-img1 u-m-b-10"><image class="type5-img1" @tap="jump(advList[0].path)" :src="advList[0].image" mode="aspectFill"></image></view>
			<view class="type5-box u-flex">
				<image class="type5-img2 u-m-r-10" @tap="jump(advList[1].path)" :src="advList[1].image" mode="aspectFill"></image>
				<image class="type5-img2" @tap="jump(advList[2].path)" :src="advList[2].image" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 模板7-->
		<view class="type6" v-if="advType === 7">
			<view class="u-flex type6-box1 u-m-b-10">
				<image class="type6-img1 u-m-r-10" @tap="jump(advList[0].path)" :src="advList[0].image" mode="aspectFill"></image>
				<image class="type6-img1" @tap="jump(advList[1].path)" :src="advList[1].image" mode="aspectFill"></image>
			</view>
			<view class="u-flex type6-box2">
				<image class="type6-img2 u-m-r-10" @tap="jump(advList[2].path)" :src="advList[2].image" mode="aspectFill"></image>
				<image class="type6-img2 u-m-r-10" @tap="jump(advList[3].path)" :src="advList[3].image" mode="aspectFill"></image>
				<image class="type6-img2" @tap="jump(advList[4].path)" :src="advList[4].image" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 自定义之广告魔方
 * @property {Object} detail -广告魔方信息
 */
export default {
	components: {},
	data() {
		return {
			advType: this.detail.style ,// 模板样式
			advList:this.detail.list // adv数据
		};
	},
	props: {
		detail: {}
	},
	computed: {},
	created() {},
	methods: {
		// 路由跳转
		jump(path) {
			this.$tools.routerTo(path);
		}
	}
};
</script>

<style lang="scss">
@mixin grid($row: 1) {
	width: (710 - ($row - 1) * 10) / $row + rpx;
	border-radius: 10rpx;
}
.adv-box {
	.type1 {
		.type1-img {
			@include grid(2);
			height: 220rpx;
		}
	}

	.type2 {
		.type2-img1 {
			height: 350rpx;
			@include grid(2);
		}
		.type2-box {
			height: 350rpx;
			@include grid(2);
			.type2-img2 {
				height: 170rpx;
				@include grid(2);
			}
		}
	}

	.type3 {
		.type3-box {
			height: 350rpx;
			@include grid(2);
			.type3-img1 {
				height: 170rpx;
				@include grid(2);
			}
		}

		.type3-img2 {
			height: 350rpx;
			@include grid(2);
		}
	}

	.type4 {
		.type4-box {
			.type4-img1 {
				height: 170rpx;
				@include grid(2);
			}
		}

		.type4-img2 {
			@include grid(1);
			height: 220rpx;
		}
	}

	.type5 {
		.type5-img1 {
			@include grid(1);
			height: 220rpx;
		}

		.type5-box {
			.type5-img2 {
				height: 170rpx;
				@include grid(2);
			}
		}
	}

	.type6 {
		.type6-box1 {
			.type6-img1 {
				height: 170rpx;
				@include grid(2);
			}
		}

		.type6-box2 {
			.type6-img2 {
				height: 170rpx;
				@include grid(3);
			}
		}
	}
}
</style>
