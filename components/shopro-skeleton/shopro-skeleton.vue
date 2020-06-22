<template>
	<view v-if="showSkeleton" class="shopro-skeleton-box" :style="{ width: skeletonWidth, height: skeletonHeight, backgroundColor: skeletonBgColor }">
		<view
			class="shopro-skeleton__type"
			v-for="(item, index) in skeletonElements"
			:key="index"
			:style="{
				width: item.width + 'px',
				height: item.height + 'px',
				left: item.left + 'px',
				top: item.top + 'px',
				backgroundColor: elementBgColor,
				borderRadius: getRadius(item.skeletonType, borderRadius)
			}"
		></view>
	</view>
</template>

<script>
export default {
	name: 'shoproSkeleton',
	data() {
		return {
			skeletonWidth: 375,
			skeletonHeight: 800,
			skeletonElements: []
		};
	},
	/*
	 *组件嵌套太深不行
	 *
	 * selector：最外层骨架屏包裹元素类名
	 * skeletonBgColor：包裹元素背景色
	 * elementBgColor：渲染元素背景色
	 * skeletonType：渲染元的类型，rect：直角，circular：圆形，fillet：圆角
	 * borderRadius：控制type的圆角。
	 * 例子:<shopro-skeleton  skeletonBgColor="#DDB26E" elementBgColor="#ffff" borderRadius="16rpx"></tui-skeleton>
	 *  shopro-selector:最外层包裹，shopro-selector-rect：直角元素。shopro-selector-circular：圆形。shopro-selector-fillet：圆角
	 */

	props: {
		showSkeleton: {
			type: Boolean,
			default: false
		},
		selector: {
			type: String,
			default: 'shopro-selector'
		},
		skeletonBgColor: {
			type: String,
			default: '#fff'
		},
		elementBgColor: {
			type: String,
			default: '#F3F3F1'
		},
		skeletonType: {
			type: Array,
			default() {
				return ['rect', 'circular', 'fillet'];
			}
		},
		borderRadius: {
			type: String,
			default: '16rpx'
		}
	},
	created() {
		const res = uni.getSystemInfoSync();
		this.skeletonWidth = res.windowWidth + 'px';
		this.skeletonHeight = res.windowHeight + 'px';
	},
	mounted() {
		setTimeout(() => {
			this.selectorQuery();
		}, 500);
	},

	methods: {
		getRadius(type, val) {
			let radius = '0';
			if (type == 'circular') {
				radius = '50%';
			} else if (type == 'fillet') {
				radius = val;
			}
			return radius;
		},
		async selectorQuery() {
			let skeletonType = this.skeletonType || [];
			let nodes = [];
			for (let item of skeletonType) {
				let className = `.${item}`;
				if (~'rect_circular_fillet'.indexOf(item)) {
					// #ifdef MP-WEIXIN
					className = `.${this.selector} >>> .${this.selector}-${item}`;
					// #endif
					// #ifndef MP-WEIXIN
					className = `.${this.selector}-${item}`;
					// #endif
				}
				await this.nodesRef(className).then(res => {
					res.map(d => {
						d.skeletonType = item;
					});
					nodes = nodes.concat(res);
				});
			}
			this.skeletonElements = nodes;
		},
		async nodesRef(className) {
			let that = this;
			return await new Promise((resolve, reject) => {
				uni.createSelectorQuery()
					.selectAll(className)
					.boundingClientRect(res => {
						if (res) {
							resolve(res);
						} else {
							reject(res);
						}
					})
					.exec();
			});
		}
	}
};
</script>

<style lang="scss">
.shopro-skeleton-box {
	position: fixed;
	z-index: 99999;
	overflow: hidden;
	left: 0;
	top: 0;
	.shopro-skeleton__type {
		position: absolute;
	}
}
</style>
