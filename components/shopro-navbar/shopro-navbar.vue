<template>
	<view>
		<view class="cu-custom" :style="[{ height: customBar + 'px' }]">
			<view class="cu-bar fixed u-flex u-row-between" :style="[style]">
				<view class="action u-flex" @tap="goBack" v-if="isBack">
					<view class="u-iconfont" :class="'uicon-' + backIconName" :style="{ color: backIconColor, fontSize: backIconSize+'rpx' }"></view>
					<view class="u-back-text u-line-1 u-m-l-20" v-if="backText" :style="[backTextStyle]">{{ backText || '' }}</view>
				</view>
				<view class="content" :style="[{ top: statusBarHeight + 'px' }]"><slot name="content"></slot></view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
export default {
	name: 'shopro-tabbar',
	data() {
		return {
			statusBarHeight: systemInfo.statusBarHeight
		};
	},
	computed: {
		// tabbar样式
		style() {
			let statusBarHeight = systemInfo.statusBarHeight;
			let style = {};
			style.height = `${this.customBar}px`;
			style.paddingTop = `${statusBarHeight}px`;
			Object.assign(style, this.background);
			return style;
		},
		// 高度
		customBar() {
			let statusBarHeight = systemInfo.statusBarHeight;
			// #ifndef MP
			return systemInfo.platform == 'android' ? statusBarHeight + 50 : statusBarHeight + 45;
			// #endif
			// #ifdef MP-WEIXIN
			return menuButtonInfo.bottom + menuButtonInfo.top - statusBarHeight;
			// #endif
			// #ifdef MP-ALIPAY
			return statusBarHeight + systemInfo.titleBarHeight;
			// #endif
		}
	},
	props: {
		isBack: {
			type: Boolean,
			default: true
		},
		background: {
			type: Object,
			default() {
				return {
					background: '#ffffff'
				};
			}
		},
		// 返回箭头的颜色
		backIconColor: {
			type: String,
			default: '#606266'
		},
		// 左边返回的图标
		backIconName: {
			type: String,
			default: 'arrow-left'
		},
		// 左边返回图标的大小，rpx
		backIconSize: {
			type: [String, Number],
			default: '44'
		},
		// 返回的文字提示
		backText: {
			type: String,
			default: ''
		},
		// 返回的文字的 样式
		backTextStyle: {
			type: Object,
			default() {
				return {
					color: '#606266'
				};
			}
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
.cu-custom {
	width: 100%;
}
.cu-bar {
	width: 100%;
	.content {
		width: 560rpx;
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
		pointer-events: auto;
	}
}
</style>
