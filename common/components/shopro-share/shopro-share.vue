<template>
	<view class="content">
		<view class="cu-modal bottom-modal" :class="[{ show: showModal }, modalType]" cathctouchmove @tap="hideModal">
			<view class="cu-dialog" @tap.stop style="background: none; overflow: visible;">
				<view class="share-box">
					<view class="share-list-box x-f">
						<!-- #ifdef MP-WEIXIN -->
						<button class="share-item share-btn y-f" open-type="share">
							<image class="share-img" src="http://shopro.7wpp.com/imgs/share_wx.png" mode=""></image>
							<text class="share-title">微信好友</text>
						</button>
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN  -->
						<view class="share-item y-f" @tap="share">
							<image class="share-img" src="http://shopro.7wpp.com/imgs/share_wx.png" mode=""></image>
							<text class="share-title">微信好友</text>
						</view>
						<!-- #endif -->
						<view
							class="share-item y-f"
							@tap="
								sharePoster('/pages/public/poster/index', {
									id: shareData.id,
									image: shareData.image,
									title: shareData.title,
									price: posterType === 'groupon' ? shareData.groupon_price : shareData.price,
									original_price: shareData.original_price,
									teamNum: posterType === 'groupon' ? goodsInfo.num : 0,
									posterType: posterType
								})
							"
						>
							<image class="share-img" src="http://shopro.7wpp.com/imgs/share_poster.png" mode=""></image>
							<text class="share-title">分享海报</text>
						</view>

						<view class="share-item y-f" @tap="copySharePath">
							<image class="share-img" src="http://shopro.7wpp.com/imgs/share_link.png" mode=""></image>
							<text class="share-title">复制链接</text>
						</view>
					</view>
					<view class="share-foot x-c" @tap="hideModal">取消</view>
				</view>
			</view>
		</view>
		<!-- 指引 -->
		<shopro-share-guide v-model="showShareGuide"></shopro-share-guide>
	</view>
</template>

<script>
import shoproShareGuide from '@/components/shopro-share-guide/shopro-share-guide.vue';
export default {
	name: 'shoproShare',
	components: {
		shoproShareGuide
	},
	data() {
		return {
			showShareGuide: false,
			shareData: {} //组装海报分享信息
		};
	},
	props: {
		value: {},
		modalType: {
			type: String,
			default: ''
		},
		posterType: '', //海报类别
		goodsInfo: {} //商品信息
	},
	computed: {
		showModal: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			}
		}
	},
	created() {
		let that = this;
		if (that.posterType === 'groupon') {
			that.shareData = that.goodsInfo.goods;
			that.shareData.id = that.goodsInfo.id;
		} else {
			that.shareData = that.goodsInfo;
			that.shareData.image = that.goodsInfo.image;
		}
		that.setShareInfo({
			query: {
				url: that.posterType + '-' + that.shareData.id
			},
			title: that.shareData.title,
			image: that.shareData.image
		});
	},

	methods: {
		copySharePath() {
			let that = this;
			that.showModal = false;
			uni.setClipboardData({
				data: this.shareInfo.copyLink,
				success: function(data) {
					//#ifdef H5
					that.$tools.toast('已复制到剪切板');
					//#endif
				},
				fail: function(err) {},
				complete: function(res) {}
			});
		},
		sharePoster(path, query) {
			let that = this;
			this.showModal = false;
			this.$Router.push({
				path: path,
				query: query
			});
		},
		hideModal() {
			this.showModal = false;
		},
		share() {
			let that = this;
			that.showModal = false;
			// #ifdef H5
			that.showModal = false;
			that.showShareGuide = true;
			// #endif
			// #ifdef APP-PLUS
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 0,
				href: that.shareInfo.path,
				title: that.shareInfo.title,
				summary: that.shareData.title,
				imageUrl: that.shareData.image,
				success: res => {
					console.log('success:' + JSON.stringify(res));
				},
				fail: err => {
					console.log('fail:' + JSON.stringify(err));
				}
			});
			// #endif
		}
	}
};
</script>

<style lang="scss">
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
