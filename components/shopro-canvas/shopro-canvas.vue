<template>
	<view class="invite-poster-content">
		<canvas class="hideCanvas" canvas-id="self_canvas" :style="{ width: (poster.width || 1) + 'px', height: (poster.height || 1) + 'px' }"></canvas>
	</view>
</template>

<script>
import _app from '@/shopro/poster/QS-SharePoster/app.js';
import { getSharePoster } from '@/shopro/poster/QS-SharePoster/QS-SharePoster.js';
import tools from '@/shopro/poster/tools.js';
import { mapMutations, mapActions, mapState } from 'vuex';
let ctx = null;
export default {
	components: {},
	data() {
		return {
			poster: {},
			posterImage: '',
			canvasId: 'self_canvas'
		};
	},
	props: {
		canvasParams: {
			type: Object,
			default: () => {}
		}
	},
	computed: {
		...mapState({
			userInfo: ({ user }) => user.userInfo,
			shareData: ({ shopro }) => shopro.config.share
		})
	},
	async mounted() {
		ctx = uni.createCanvasContext(this.canvasId, this);
		ctx && this.shareFc();
	},
	methods: {
		async shareFc() {
			let that = this;
			_app.showLoading('绘制中...');
			let config = {};
			if (that.canvasParams.backgroundImage) {
				config = {
					backgroundImage: tools.checkImgHttp(that.canvasParams.backgroundImage, 'bgImage')
				};
			}
			if (that.canvasParams.background) {
				config = {
					background: {
						width: that.canvasParams.background?.width || 100,
						height: that.canvasParams.background?.height || 100,
						backgroundColor: that.canvasParams.background?.color || '#000'
					}
				};
			}

			try {
				_app.log('准备生成:' + new Date());
				const d = await getSharePoster({
					_this: that, //若在组件中使用 必传
					...config,
					posterCanvasId: that.canvasId, //canvasId
					Context: ctx,
					delayTimeScale: 20, //延时系数
					draw: false, //是否执行ctx.draw方法, 推荐false，自己去draw
					drawArray: ({ bgObj, type, bgScale }) => {
						let arr = tools.initDrawArray(bgObj, that.canvasParams.drawArray);
						return new Promise((rs, rj) => {
							rs(arr);
						});
					},
					setCanvasWH: ({ bgObj, type, bgScale }) => {
						// 为动态设置画布宽高的方法，
						this.poster = bgObj;
					}
				});
				ctx.draw(false, () => {
					uni.canvasToTempFilePath(
						{
							canvasId: that.canvasId,
							success: res => {
								_app.hideLoading();
								that.posterImage = res.tempFilePath;
								that.$emit('success', res.tempFilePath);
								_app.log('海报生成成功, 时间:' + new Date() + '， 临时路径: ' + res.tempFilePath);
							},
							fail: err => {
								_app.hideLoading();
								console.log('生成异常', err);
							}
						},
						that
					);
				});
			} catch (e) {
				_app.hideLoading();
				_app.showToast(JSON.stringify(e));
				console.log(JSON.stringify(e));
			}
		}
	}
};
</script>

<style lang="scss">
.hideCanvas {
	position: fixed;
	top: -99999upx;
	left: -99999upx;
	z-index: -99999;
}
</style>
