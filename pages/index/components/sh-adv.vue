<template>
	<view class="adv-box mx20 mb10">
		<!-- 模板1-->
		<view class="x-f" v-if="detail.style == 1">
			<image style="width:710rpx;height: 220rpx;" @tap="jump(detail.list[0].path)" :src="detail.list[0].image" mode="aspectFill"></image>
		</view>
		<!-- 模板2-->
		<view class="type1 x-f" v-if="detail.style == 2">
			<image class="type1-img" @tap="jump(detail.list[0].path)" :src="detail.list[0].image" mode="aspectFill"></image>
			<image class="type1-img" @tap="jump(detail.list[1].path)" :src="detail.list[1].image" mode="aspectFill"></image>
		</view>
		<!-- 模板3-->
		<view class="type2 x-bc" v-if="detail.style == 3">
			<image class="type2-img1" @tap="jump(detail.list[0].path)" :src="detail.list[0].image" mode="aspectFill"></image>
			<view class="y-f type2-box">
				<image class="type2-img2" @tap="jump(detail.list[1].path)" :src="detail.list[1].image" mode="aspectFill" style="border-bottom:1rpx solid #f6f6f6"></image>
				<image class="type2-img2" @tap="jump(detail.list[2].path)" :src="detail.list[2].image" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 模板4-->
		<view class="type3 x-bc" v-if="detail.style == 4">
			<view class="type3-box y-f">
				<image class="type3-img1" @tap="jump(detail.list[0].path)" :src="detail.list[0].image" mode="aspectFill"></image>
				<image class="type3-img1" @tap="jump(detail.list[1].path)" :src="detail.list[1].image" mode="aspectFill"></image>
			</view>
			<image class="type3-img2" @tap="jump(detail.list[2].path)" :src="detail.list[2].image" mode="aspectFill"></image>
		</view>
		<!-- 模板5-->
		<view class="type4 y-f" v-if="detail.style == 5">
			<view class="type4-box x-f">
				<image class="type4-img1" @tap="jump(detail.list[0].path)" :src="detail.list[0].image" mode="aspectFill"></image>
				<image class="type4-img1" @tap="jump(detail.list[1].path)" :src="detail.list[1].image" mode="aspectFill"></image>
			</view>
			<image class="type4-img2" @tap="jump(detail.list[2].path)" :src="detail.list[2].image" mode="aspectFill"></image>
		</view>
		<!-- 模板6-->
		<view class="type5 y-f" v-if="detail.style == 6">
			<image class="type5-img1" @tap="jump(detail.list[0].path)" :src="detail.list[0].image" mode="aspectFill"></image>
			<view class="type5-box x-bc">
				<image class="type5-img2" @tap="jump(detail.list[1].path)" :src="detail.list[1].image" mode="aspectFill" style="border-bottom:1rpx solid #f6f6f6"></image>
				<image class="type5-img2" @tap="jump(detail.list[2].path)" :src="detail.list[2].image" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 模板7-->
		<view class="type6 y-f" v-if="detail.style == 7">
			<view class="x-f type6-box1">
				<image class="type6-img1" @tap="jump(detail.list[0].path)" :src="detail.list[0].image" mode="aspectFill"></image>
				<image class="type6-img1" @tap="jump(detail.list[1].path)" :src="detail.list[1].image" mode="aspectFill"></image>
			</view>
			<view class="x-f type6-box2">
				<image class="type6-img2" @tap="jump(detail.list[2].path)" :src="detail.list[2].image" mode="aspectFill"></image>
				<image class="type6-img2" @tap="jump(detail.list[3].path)" :src="detail.list[3].image" mode="aspectFill"></image>
				<image class="type6-img2" @tap="jump(detail.list[4].path)" :src="detail.list[4].image" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
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
.adv-box {
	background-color: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	.type1 {
		.type1-img {
			flex: 1;
			height: 220rpx;

			&:first-child {
				border-right: 1rpx solid #f6f6f6;
			}
		}
	}

	.type2 {
		.type2-img1 {
			width: (710rpx/2);
			height: 340rpx;
			border-right: 1rpx solid #f6f6f6;
		}

		.type2-box {
			flex: 1;
			height: 340rpx;
			width: (710rpx/2);

			.type2-img2 {
				height: (340rpx/2);
			}
		}
	}

	.type3 {
		.type3-box {
			width: (710rpx/2);
			border-right: 1rpx solid #f6f6f6;
			.type3-img1 {
				flex: 1;
				height: (340rpx/2);

				&:first-child {
					border-bottom: 1rpx solid #f6f6f6;
				}
			}
		}

		.type3-img2 {
			flex: 1;
			height: 340rpx;
			width: (710rpx/2);
		}
	}

	.type4 {
		.type4-box {
			border-bottom: 1rpx solid #f6f6f6;
			.type4-img1 {
				flex: 1;
				height: (340rpx/2);

				&:first-child {
					border-right: 1rpx solid #f6f6f6;
				}
			}
		}

		.type4-img2 {
			flex: 1;
			height: (340rpx/2);
			width: 710rpx;
		}
	}

	.type5 {
		.type5-img1 {
			width: 710rpx;
			height: (340rpx/2);
			border-bottom: 1rpx solid #f6f6f6;
		}

		.type5-box {
			flex: 1;
			height: (340rpx/2);
			width: 710rpx;

			.type5-img2 {
				height: (340rpx/2);

				&:first-child {
					border-right: 1rpx solid #f6f6f6;
				}
			}
		}
	}

	.type6 {
		.type6-box1 {
			.type6-img1 {
				width: (710rpx/2);
				height: (340rpx/2);

				&:first-child {
					border-right: 1rpx solid #f6f6f6;
				}
			}
		}

		.type6-box2 {
			border-top: 1rpx solid #f6f6f6;

			.type6-img2 {
				width: (710rpx/3);
				height: (340rpx/2);
				border-right: 1rpx solid #f6f6f6;

				&:last-child {
					border-right: 0;
				}
			}
		}
	}

	image {
		// background-color: #ccc;
	}
}
</style>
