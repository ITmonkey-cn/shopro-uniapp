<template>
	<view class="page_box">
		<view class="head_box">
			<view class="tab-box x-f">
				<view class="tab-item" @tap="onTab(tab.id)" :class="{ 'tab-active': tabCurrent === tab.id }" v-for="tab in tabList" :key="tab.id">
					<text class="tab-title">{{ tab.title }}</text>
					<text v-show="tabCurrent === tab.id" class="tab-triangle"></text>
				</view>
			</view>
		</view>
		<view class="content_box">
			<scroll-view scroll-y="true" class="scroll-box" enable-back-to-top scroll-with-animation>
				<view class="goods-item" v-if="false" v-for="item in 3" :key="item">
					<shopro-dis-goods>
						<block slot="slodEnd">
							<view class="x-f">
								<view class="cu-progress round sm"><view class="bg-orange" :style="[{ width: loading ? '61.8%' : '' }]"></view></view>
								<view class="progress-text">已抢61.8%</view>
							</view>
						</block>
					</shopro-dis-goods>
				</view>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
import ssDisGoods from '@/components/goods/shopro-dis-goods.vue';
export default {
	components: {
		ssDisGoods
	},
	data() {
		return {
			loading: false,
			tabCurrent: 2,
			tabList: [
				{
					id: 1,
					title: '已结束'
				},
				{
					id: 2,
					title: '进行中'
				},
				{
					id: 3,
					title: '即将开始'
				}
			]
		};
	},
	computed: {},
	onLoad() {
		console.log(this.$Route.query,11111111111);
		setTimeout(() => {
			this.loading = true;
		}, 500);
	},
	methods: {
		onTab(id) {
			this.tabCurrent = id;
		}
	}
};
</script>

<style lang="scss">
.tab-box {
	.tab-item {
		flex: 1;
		line-height: 84rpx;
		text-align: center;
		background: #636363;
		color: #fff;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		position: relative;

		.tab-triangle {
			position: absolute;
			z-index: 2;
			bottom: -14rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 28rpx;
			height: 28rpx;
			background: #e6b873;
			transform: rotate(45deg);
			transform-origin: center;
		}
	}

	.tab-active {
		background: #e6b873;
	}
}
.goods-item {
	.cu-progress {
		width: 225rpx;
	}
	.progress-text {
		color: #999999;
		font-size: 20rpx;
		margin-left: 25rpx;
	}
}
</style>
