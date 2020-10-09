<template>
	<view class="content">
		<image class="bg_img" src="http://shopro.7wpp.com/imgs/poster/invite_poster.png" mode=""></image>
		<view class="poster-box y-f">
			<image :src="poster.finalPath" mode="widthFix" class="posterImage"></image>
			<view class="share-box" v-if="poster.finalPath">
				<view class="share-list-box x-f">
					<!-- #ifdef MP-WEIXIN -->
					<button class="share-btn share-item y-f" open-type="share">
						<image class="share-img" src="http://shopro.7wpp.com/imgs/share_wx.png" mode=""></image>
						<text class="share-title">微信好友</text>
					</button>
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN -->
					<view class="share-item y-f" @tap="share">
						<image class="share-img" src="http://shopro.7wpp.com/imgs/share_wx.png" mode=""></image>
						<text class="share-title">微信好友</text>
					</view>
					<!-- #endif -->
					<view class="share-item y-f" @tap="saveImage">
						<image class="share-img" src="http://shopro.7wpp.com/imgs/share_poster.png" mode=""></image>
						<text class="share-title">保存图片</text>
					</view>
					<view class="share-item y-f" @tap="copyLink">
						<image class="share-img" src="http://shopro.7wpp.com/imgs/share_link.png" mode=""></image>
						<text class="share-title">复制链接</text>
					</view>
				</view>
			</view>
		</view>
		<view class="hideCanvasView">
			<canvas class="hideCanvas" canvas-id="invite_poster" :style="{ width: (poster.width || 1) + 'px', height: (poster.height || 1) + 'px' }"></canvas>
		</view>
		<!-- 指引 -->
		<shopro-share-guide v-model="showShareGuide"></shopro-share-guide>
	</view>
</template>

<script>
import _app from '@/common/utils/QS-SharePoster/app.js';
import { getSharePoster } from '@/common/utils/QS-SharePoster/QS-SharePoster.js';
import { BASE_URL } from '@/env.js';
// #ifdef H5
import wxsdk from '@/common/wechat/sdk';
// #endif
import { mapMutations, mapActions, mapState } from 'vuex';
import shoproShareGuide from '@/components/shopro-share-guide/shopro-share-guide.vue';
import shoproShare from '@/common/mixins/shopro-share';
export default {
	components: {
		shoproShareGuide
	},
	mixins: ['shoproShare'],
	data() {
		return {
			poster: {},
			qrShow: false,
			canvasId: 'invite_poster',
			showShareGuide: false
		};
	},
	props: {},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
			shareData: state => state.init.initData.share
		})
	},
	created() {
		let that = this;
		that.setShareInfo();
		if (that.shareInfo) {
			setTimeout(function() {
				that.$emit('getShareInfo', that.shareInfo);
				that.scene = encodeURIComponent(that.shareInfo.path.split('?')[1]);
				that.shareFc();
			}, 100);
		}
	},
	methods: {
		async shareFc() {
			let that = this;
			try {
				console.log('准备生成:' + new Date());
				const d = await getSharePoster({
					_this: this, //若在组件中使用 必传
					// type: 'invitePoster',
					backgroundImage: that.$tools.checkImgHttp(that.shareData.user_poster_bg), //接口返回的背景图
					formData: {
						//访问接口获取背景图携带自定义数据
					},
					posterCanvasId: this.canvasId, //canvasId
					delayTimeScale: 20, //延时系数
					/* background: {
							width: 1080,
							height: 1920,
							backgroundColor: '#666'
						}, */
					drawArray: ({ bgObj, type, bgScale }) => {
						const dx = bgObj.width * 0.3;
						const fontSize = bgObj.width * 0.042;
						const lineHeight = bgObj.height * 0.04;
						//可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
						return new Promise((rs, rj) => {
							rs([
								// {
								// 	type: 'custom',
								// 	setDraw(Context) {
								// 		Context.setFillStyle('black');
								// 		Context.setGlobalAlpha(1);
								// 		Context.fillRect(0, bgObj.height - bgObj.height * 0.2, bgObj.width, bgObj.height * 0.2);
								// 		Context.setGlobalAlpha(1);
								// 	}
								// },
								{
									type: 'image', //头像
									url:that.$tools.checkImgHttp(that.userInfo.avatar),
									alpha: 1,
									dx: bgObj.width * 0.5 - (bgObj.width * 0.16) / 2,
									dy: bgObj.width * 0.16,
									infoCallBack(imageInfo) {
										let scale = (bgObj.width * 0.16) / imageInfo.height;
										return {
											circleSet: {
												x: (imageInfo.width * scale) / 2,
												y: (bgObj.width * 0.16) / 2,
												r: (bgObj.width * 0.16) / 2
											}, // 圆形图片 , 若circleSet与roundRectSet一同设置 优先circleSet设置
											dWidth: imageInfo.width * scale, // 因为设置了圆形图片 所以要乘以2
											dHeight: bgObj.width * 0.16
											/* roundRectSet: { // 圆角矩形
													r: imageInfo.width * .1
												} */
										};
									}
								},
								{
									type: 'text', //昵称
									// fontStyle: 'italic',//倾斜
									text: that.userInfo.nickname,
									size: fontSize,
									color: 'black',
									alpha: 1,
									textAlign: 'middle',
									textBaseline: 'middle',
									infoCallBack(textLength) {
										_app.log('index页面的text的infocallback ，textlength:' + textLength);
										return {
											dx: bgObj.width * 0.5 - textLength * 0.5,
											dy: bgObj.width * 0.42
										};
									},
									serialNum: 0,
									id: 'tag1' //自定义标识
								},
								// #ifdef MP-WEIXIN
								{
									type: 'image', //微信小程序码
									url: `${that.$API_URL}wechat/wxacode?scene=${that.scene}`,
									alpha: 1,
									drawDelayTime: 500, //draw延时时间
									dx: bgObj.width * 0.5 - (bgObj.width * 0.26) / 2,
									dy: bgObj.width * 0.855,
									infoCallBack(imageInfo) {
										return {
											dWidth: bgObj.width * 0.26,
											dHeight: bgObj.width * 0.26
											// roundRectSet: { // 圆角矩形
											// 	r: imageInfo.width * 0.025
											// }
										};
									}
								},
								// #endif
								// #ifndef  MP-WEIXIN
								{
									type: 'qrcode',
									text: that.shareInfo.path,
									size: bgObj.width * 0.26,
									dx: bgObj.width * 0.5 - (bgObj.width * 0.26) / 2,
									dy: bgObj.width * 0.855
								}
								// #endif
							]);
						});
					},
					setCanvasWH: ({ bgObj, type, bgScale }) => {
						// 为动态设置画布宽高的方法，
						this.poster = bgObj;
					}
				});
				// console.log('海报生成成功, 时间:' + new Date() + '， 临时路径: ' + d.poster.tempFilePath);
				// this.poster.finalPath = d.poster.tempFilePath;
				this.$set(this.poster, 'finalPath', d.poster.tempFilePath);
				this.qrShow = true;
			} catch (e) {
				_app.hideLoading();
				_app.showToast(JSON.stringify(e));
				console.log(JSON.stringify(e));
			}
		},
		saveImage() {
			let that = this;
			let platform = uni.getStorageSync('platform');
			if (platform === 'wxOfficialAccount') {
				that.$tools.toast('长按图片保存');
			} else {
				uni.saveImageToPhotosAlbum({
					filePath: that.poster.finalPath,
					success: res => {
						that.$tools.toast('保存成功');
					},
					fail: err => {
						that.$tools.toast('保存失败');
					}
				});
			}
		},
		share() {
			let that = this;
			// #ifdef APP-PLUS
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 0,
				href: that.shareInfo.path,
				title: that.shareInfo.title,
				summary: that.shareInfo.title,
				imageUrl: that.shareInfo.imageUrl,
				success: res => {
					console.log('success:' + JSON.stringify(res));
				},
				fail: err => {
					console.log('fail:' + JSON.stringify(err));
				}
			});
			// #endif

			// #ifdef H5
			that.showShareGuide = true;
			// #endif
		},
		copyLink() {
			let that = this;
			uni.setClipboardData({
				data: that.shareInfo.copyLink,
				success: () => {
					//#ifdef H5
					that.$tools.toast('已复制到剪贴板');
					//#endif
				}
			});
		},
		hideQr() {
			this.qrShow = false;
		}
	}
};
</script>

<style lang="scss">
.hideCanvasView {
	position: relative;
}

.hideCanvas {
	position: fixed;
	top: -99999upx;
	left: -99999upx;
	z-index: -99999;
}

.content {
	position: relative;
	width: 100%;
	height: 1350rpx;

	.bg_img {
		width: 100%;
		height: 100%;
	}

	.poster-box {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 50rpx;

		.posterImage {
			width: 660rpx;
		}
	}
}

.share-box {
	width: 750rpx;
	border-radius: 30rpx;
	margin-top: 60rpx;
	.share-list-box {
		.share-btn {
			background: none;
			border: none;
			line-height: 1;
			padding: 0;
			&::after {
				border: none;
			}
		}
		.share-item {
			flex: 1;
			padding-bottom: 20rpx;

			.share-img {
				width: 70rpx;
				height: 70rpx;
				background: rgba(246, 246, 254, 1);
				border-radius: 50%;
				margin-bottom: 20rpx;
			}

			.share-title {
				font-size: 24rpx;
				color: #666;
			}
		}
	}
}
</style>
