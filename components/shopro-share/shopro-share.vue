<template>
	<view class="content">
		<!-- 海报弹窗 -->
		<view class="cu-modal" :class="{ show: showPoster }" @tap="onClosePoster">
			<view class="cu-dialog" style="width: 640rpx;background: none;">
				<view class="poster-img-box"><image class="poster-img" :src="posterImage" mode="widthFix"></image></view>
				<view class="poster-btn-box u-m-t-20 u-flex u-row-between u-col-center" v-show="posterImage">
					<button class="cancel-btn u-reset-button" @tap="showPoster = false">取消</button>
					<button class="save-btn u-reset-button" @tap="saveImage">{{ ['wxOfficialAccount', 'H5'].includes(platform) ? '长按图片保存' : '保存图片' }}</button>
				</view>
			</view>
		</view>
		<!-- 分享tools -->
		<view class="cu-modal bottom-modal" :class="{ show: showShare }" @tap="showShare = false">
			<view class="cu-dialog safe-area-inset-bottom" style="border-radius: 20rpx 20rpx 0 0;background: none;">
				<view class="share-box">
					<view class="share-list-box u-flex">
						<!-- #ifdef MP-WEIXIN -->
						<button class="share-item share-btn u-flex-col u-col-center" open-type="share">
							<image class="share-img" :src="$IMG_URL + '/imgs/share/share_wx.png'" mode=""></image>
							<text class="share-title">微信好友</text>
						</button>
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN  -->
						<view v-if="platform !== 'H5'" class="share-item u-flex-col u-col-center" @tap="shareFriend">
							<image class="share-img" :src="$IMG_URL + '/imgs/share/share_wx.png'" mode=""></image>
							<text class="share-title">微信好友</text>
						</view>
						<!-- #endif -->
						<view class="share-item u-flex-col u-col-center" @tap="onPoster">
							<image class="share-img" :src="$IMG_URL + '/imgs/share/share_poster.png'" mode=""></image>
							<text class="share-title">生成海报</text>
						</view>

						<view class="share-item u-flex-col u-col-center" @tap="copySharePath">
							<image class="share-img" :src="$IMG_URL + '/imgs/share/share_link.png'" mode=""></image>
							<text class="share-title">复制链接</text>
						</view>
					</view>
					<view class="share-foot u-flex u-row-center u-col-center" @tap="showShare = false">取消</view>
				</view>
			</view>
		</view>
		<!-- 分享指引 -->
		<view class="cu-modal bottom-modal" :class="{ show: showShareGuide }" @tap="showShareGuide = false">
			<view class="cu-dialog safe-area-inset-bottom" style="border-radius: 20rpx 20rpx 0 0;background: none;vertical-align: top;">
				<view class="guide-wrap u-flex u-col-top u-row-center"><image class="guide-img" :src="$IMG_URL + '/imgs/share/share_guide.png'" mode=""></image></view>
			</view>
		</view>

		<!-- 各海报模块 -->
		<shopro-canvas v-if="showPoster" ref="shoproCanvas" :canvasParams="canvasParams" @success="onSuccess"></shopro-canvas>
	</view>
</template>
<script>
/**
 * 分享弹窗
 * @property {Boolean} value = showModal - v-model控制显隐
 * @property {String} posterType - 海报类别
 * @property {Object} posterInfo - 海报数据
 */
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
import Auth from '@/shopro/permission/index.js';
export default {
	name: 'shoproShare',
	components: {},
	data() {
		return {
			showShareGuide: false, //H5的指引。
			showPoster: false, //海报弹窗
			platform: this.$platform.get(),
			posterImage: '',
			canvasParams: {}
		};
	},
	props: {
		posterType: {
			type: String,
			default: ''
		},
		posterInfo: {
			type: Object,
			default: () => {}
		},
		value: {}
	},
	computed: {
		...mapGetters(['initShare', 'userInfo', 'isLogin', 'shareInfo']),
		showShare: {
			get() {
				return this.value;
			},
			set(val) {
				if (!this.showPoster) {
					val ? uni.hideTabBar() : uni.showTabBar();
				}
				this.$emit('input', val);
			}
		}
	},

	created() {
		uni.$on('ON_WX_SHARE', () => {
			this.showShare = false;
		});
	},
	methods: {
		// 关闭弹窗
		onClosePoster() {
			this.showPoster = false;
			uni.showTabBar();
		},
		// 绘制成功
		onSuccess(e) {
			this.posterImage = e;
		},
		// 开始绘制
		onPoster() {
			this.posterImage = '';
			uni.hideTabBar();
			if (this.$store.getters.isLogin) {
				this.canvasParams = this.getPosterFormatter();
				this.showPoster = true;
			} else {
				this.$store.dispatch('showAuthModal', 'accountLogin');
			}
			this.showShare = false;
		},
		// 分享好友
		shareFriend() {
			let that = this;
			// #ifdef APP-PLUS
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 0,
				href: that.shareInfo.path,
				title: that.shareInfo.title,
				summary: that.shareInfo.title,
				image: that.shareInfo.image,
				success: res => {
					console.log('success:' + JSON.stringify(res));
					this.showShare = false;
				},
				fail: err => {
					console.log('fail:' + JSON.stringify(err));
				}
			});
			// #endif
			// #ifdef H5
			this.showShare = false;
			this.showShareGuide = true;
			// #endif
		},

		// 保存图片
		async saveImage() {
			let that = this;
			if (['wxOfficialAccount', 'H5'].includes(this.platform)) {
				this.$u.toast('长按图片保存');
				return false;
			}
			let authState = await new Auth('writePhotosAlbum').check();
			if (authState) {
				uni.saveImageToPhotosAlbum({
					filePath: that.posterImage,
					success: res => {
						this.$u.toast('保存成功');
						this.showPoster = false;
					},
					fail: err => {
						console.log(`图片保存失败:`, err);
						this.$u.toast('保存失败');
					}
				});
			}
		},
		// 复制链接
		copySharePath() {
			let that = this;
			uni.setClipboardData({
				data: that.shareInfo.copyLink,
				success: data => {
					that.$u.toast('已复制到剪切板');
					that.showShare = false;
				}
			});
		},
		// 获取海报格式,规则说明在@/shopro/poster/tools.js中的initDrawArray
		getPosterFormatter() {
			const that = this;
			let data = {};
			switch (this.posterType) {
				case 'user':
					data = {
						backgroundImage: that.initShare.user_poster_bg,
						drawArray: [
							{
								name: '用户昵称',
								type: 'text',
								text: that.userInfo.nickname,
								isBgCenter: true,
								size: 28,
								dy: 250,
								color: '#333',
								textAlign: 'middle',
								textBaseLine: 'middle'
							},
							{
								name: 'avatar',
								type: 'image',
								url: that.userInfo.avatar,
								alpha: 1,
								isBgCenter: true,
								dy: 95,
								dWidth: 120,
								dHeight: 120,
								circleSet: {}
							},
							// #ifdef MP-WEIXIN
							{
								name: 'wxCode',
								type: 'image',
								url: `${that.$API_URL}wechat/wxacode?scene=${that.shareInfo.query}`,
								alpha: 1,
								dy: 560,
								isBgCenter: true,
								dWidth: 180,
								dHeight: 180
							},
							// #endif
							// #ifndef  MP-WEIXIN
							{
								name: '普通二维码',
								type: 'qrcode',
								text: that.shareInfo.path,
								size: 180,
								dy: 560,
								isBgCenter: true
							}
							// #endif
						]
					};
					break;
				case 'goods':
					data = {
						backgroundImage: that.initShare.goods_poster_bg,
						drawArray: [
							{
								name: 'avatar',
								type: 'image',
								url: that.userInfo.avatar,
								alpha: 1,
								dy: 40,
								dx: 38,
								dWidth: 80,
								dHeight: 80,
								circleSet: {}
							},
							{
								type: 'text',
								text: that.userInfo.nickname,
								size: 28,
								color: '#333',
								alpha: 1,
								textAlign: 'middle',
								textBaseline: 'bottom',
								dx: 140,
								dy: 40
							},
							{
								type: 'text',
								text: '推荐一个好物给你,请查收！',
								size: 26,
								color: '#333',
								alpha: 1,
								textAlign: 'middle',
								textBaseline: 'middle',
								dx: 140,
								dy: 80
							},
							{
								name: 'goodsImage',
								type: 'image',
								url: that.posterInfo.image,
								alpha: 1,
								isBgCenter: true,
								dy: 140,
								dWidth: 620,
								dHeight: 620,
								roundRectSet: {
									r: 20
								}
							},
							{
								type: 'text', //标题
								text: that.posterInfo.title,
								size: 28,
								color: '#333',
								alpha: 1,
								textAlign: 'left',
								textBaseline: 'middle',
								fontWeight: 'bold',
								lineFeed: {
									maxWidth: 620,
									lineHeight: 40,
									lineNum: 2
								},
								dx: 36,
								dy: 780
							},
							{
								type: 'text',
								text: `￥${that.posterInfo.price}`,
								size: 38,
								color: '#E1212B',
								alpha: 1,
								textAlign: 'left',
								textBaseline: 'middle',
								fontWeight: 'bold',
								fontFamily: 'OPPOSANS',
								dx: 30,
								dy: 860
							},
							{
								type: 'text',
								text: `￥${that.posterInfo.original_price}`,
								size: 28,
								color: '#999999',
								alpha: 1,
								textAlign: 'left',
								textBaseline: 'top',
								lineThrough: {
									style: '#999999'
								},
								dx: 400,
								dy: 860
							},
							// #ifdef MP-WEIXIN
							{
								name: 'wxCode',
								type: 'image', //微信小程序码
								url: `${that.$API_URL}wechat/wxacode?scene=${that.shareInfo.query}`,
								alpha: 1,
								dx: 522,
								dy: 911,
								dWidth: 110,
								dHeight: 110
							},
							// #endif
							// #ifndef MP-WEIXIN
							{
								type: 'qrcode',
								text: that.shareInfo.copyLink,
								size: 110,
								dx: 530,
								dy: 930
							}
							// #endif
						]
					};
					break;
				case 'groupon':
					data = {
						backgroundImage: that.initShare.groupon_poster_bg,
						drawArray: [
							{
								name: 'avatar',
								type: 'image',
								url: that.userInfo.avatar,
								alpha: 1,
								dy: 40,
								dx: 38,
								dWidth: 80,
								dHeight: 80,
								circleSet: {}
							},
							{
								type: 'text',
								text: that.userInfo.nickname,
								size: 28,
								color: '#333',
								alpha: 1,
								textAlign: 'middle',
								textBaseline: 'bottom',
								dx: 140,
								dy: 40
							},
							{
								type: 'text',
								text: '发现一个好物，快来和我一起拼吧！',
								size: 26,
								color: '#333',
								alpha: 1,
								textAlign: 'middle',
								textBaseline: 'middle',
								dx: 140,
								dy: 80
							},
							{
								name: 'goodsImage',
								type: 'image',
								url: that.posterInfo.goods.image,
								alpha: 1,
								isBgCenter: true,
								dy: 140,
								dWidth: 620,
								dHeight: 620,
								roundRectSet: {
									r: 20
								}
							},
							{
								type: 'text', //标题
								text: that.posterInfo.goods.title,
								size: 28,
								color: '#333',
								alpha: 1,
								textAlign: 'left',
								textBaseline: 'middle',
								fontWeight: 'bold',
								lineFeed: {
									maxWidth: 620,
									lineHeight: 40,
									lineNum: 2
								},
								dx: 36,
								dy: 780
							},
							{
								type: 'text',
								text: `拼团价：￥${that.posterInfo.goods.groupon_price}`,
								size: 32,
								color: '#E1212B',
								alpha: 1,
								textAlign: 'left',
								textBaseline: 'middle',
								fontWeight: 'bold',
								fontFamily: 'OPPOSANS',
								dx: 30,
								dy: 860
							},
							{
								type: 'text',
								text: `${that.posterInfo.num}人团`,
								size: 24,
								color: '#fff',
								alpha: 1,
								textAlign: 'left',
								textBaseline: 'top',
								dx: 565,
								dy: 863
							},
							// #ifdef MP-WEIXIN
							{
								name: 'wxCode',
								type: 'image', //微信小程序码
								url: `${that.$API_URL}wechat/wxacode?scene=${that.shareInfo.query}`,
								alpha: 1,
								dx: 530,
								dy: 930,
								dWidth: 110,
								dHeight: 110
							},
							// #endif
							// #ifndef MP-WEIXIN
							{
								type: 'qrcode',
								text: that.shareInfo.path,
								size: 110,
								dx: 530,
								dy: 930
							}
							// #endif
						]
					};
					break;
				default:
					console.log('%cerr:没有此类型海报数据', 'color:green;background:yellow');
					break;
			}
			return data;
		}
	}
};
</script>

<style lang="scss">
// 指引
.guide-wrap {
	height: 100%;
	.guide-img {
		width: 580rpx;
		height: 430rpx;
	}
}
// 分享海报
.poster-btn-box {
	.cancel-btn {
		width: 300rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: #ffffff;
		border-radius: 35rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #999999;
	}
	.save-btn {
		width: 300rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: linear-gradient(90deg, #e9b461, #eecc89);
		border-radius: 35rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #ffffff;
	}
}
.poster-img-box {
	.poster-img {
		width: 660rpx;
		min-height: 800rpx;
		border-radius: 20rpx;
	}
}
// 分享tool
.share-box {
	background: #fff;
	width: 750rpx;
	border-radius: 30rpx 30rpx 0 0;
	padding-top: 30rpx;
	position: relative;

	.share-foot {
		font-size: 24rpx;
		color: #bfbfbf;
		height: 80rpx;
		border-top: 1rpx solid #eee;
	}

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
