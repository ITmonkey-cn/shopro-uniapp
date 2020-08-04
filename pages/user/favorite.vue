<template>
	<view class="page_box">
		<view class="head_box x-bc" v-if="favoriteList.length">
			<view class="count-box">
				共
				<text class="all-num">{{ total }}</text>
				件商品
			</view>
			<button class="cu-btn set-btn" @tap="onSet">{{ isSel ? '完成' : '编辑' }}</button>
		</view>
		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<checkbox-group @change="onSel" v-if="favoriteList.length">
					<view class="collect-list x-f" v-if="f.goods_id" v-for="f in favoriteList" :key="f.id">
						<checkbox v-if="isSel" :value="f.goods_id.toString()" :checked="f.checked" :class="{ checked: f.checked }" class="goods-radio round orange"></checkbox>
						<shopro-mini-card :detail="f" :type="'favorite'"></shopro-mini-card>
					</view>
				</checkbox-group>
				<!-- 缺省页 -->
				<shopro-empty v-if="!favoriteList.length" :emptyData="emptyData"></shopro-empty>
				<!-- 更多 -->
				<view v-if="favoriteList.length" class="cu-load text-gray" :class="loadStatus"></view>
			</scroll-view>
		</view>
		<view class="foot_box ">
			<view class="tools-box x-bc" v-if="isSel && favoriteList.length">
				<label class="check-all" @tap="onAllSel">
					<radio :checked="allSel" :class="{ checked: allSel }" class="check-all-radio orange"></radio>
					<text>全选</text>
				</label>
				<button class="cu-btn close-btn" @tap="cancelFavorite">取消收藏</button>
			</view>
		</view>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import shoproMiniCard from '@/components/shopro-mini-card/shopro-mini-card.vue';
import shoproEmpty from '@/components/shopro-empty/shopro-empty.vue';
export default {
	components: {
		shoproMiniCard,
		shoproEmpty
	},
	data() {
		return {
			isSel: false,
			allSel: false,
			routerTo: this.$Router,
			selList: [],
			emptyData: {
				img: '/static/imgs/empty/empty_goods.png',
				tip: '暂无收藏商品，赶紧去收藏好货吧~'
			},
			favoriteList: [],
			total: 0,
			loadStatus: '', //loading,over
			currentPage: 1,
			lastPage: 1
		};
	},
	computed: {},
	onShow() {
		this.init();
	},
	onHide() {
		this.favoriteList = [];
	},
	methods: {
		// init
		init() {
			return Promise.all([this.getFavoriteList()]);
		},
		onSel(e) {
			let items = this.favoriteList,
				values = e.detail.value;
			this.selList = values;
			items.forEach(i => {
				if (values.includes(i.goods_id.toString())) {
					this.$set(i, 'checked', true);
				} else {
					this.$set(i, 'checked', false);
				}
			});
			if (this.selList.length < items.length) {
				this.allSel = false;
			} else {
				this.allSel = true;
			}
		},
		onSet() {
			this.isSel = !this.isSel;
		},
		onAllSel() {
			this.allSel = !this.allSel;
			this.selList = [];
			const { favoriteList } = this;
			favoriteList.forEach(i => {
				if (this.allSel) {
					this.$set(i, 'checked', true);
					this.selList.push(i.goods_id);
				} else {
					this.$set(i, 'checked', false);
				}
			});
		},
		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getFavoriteList();
			}
		},
		// 收藏列表
		getFavoriteList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$api('goods.favoriteList', {
				pre_page: 10,
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.total = res.data.total;
					that.favoriteList = [...that.favoriteList, ...res.data.data];
					that.lastPage = res.data.last_page;
					if (that.currentPage < res.data.last_page) {
						that.loadStatus = '';
					} else {
						that.loadStatus = 'over';
					}
				}
			});
		},
		// 取消收藏
		cancelFavorite() {
			let that = this;
			let ids = that.selList;
			const { favoriteList } = this;
			that.$api('goods.favorite', {
				goods_ids: ids
			}).then(res => {
				if (res.code === 1) {
					if (that.allSel) {
						that.favoriteList = [];
					} else {
						that.favoriteList = favoriteList.filter(f => !ids.includes(f.goods_id.toString()));
						that.total = favoriteList.length;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.head_box {
	height: 70rpx;
	padding: 0 30rpx;

	.count-box {
		font-size: 26rpx;
		color: #999;

		.all-num {
			color: #a8700d;
		}
	}

	.set-btn {
		background: none;
		font-size: 26rpx;
		color: #a8700d;
	}
}

.collect-list {
	padding: 30rpx 20rpx;
	background: #fff;
	margin-bottom: 20rpx;

	.goods-radio {
		transform: scale(0.7);
		margin-right: 20rpx;
	}
}

.tools-box {
	height: 100rpx;
	width: 750rpx;
	padding: 0 20rpx;
	background: #fff;

	.check-all {
		font-size: 26rpx;

		.check-all-radio {
			transform: scale(0.7);
		}
	}

	.close-btn {
		width: 200rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		border-radius: 35rpx;
		padding: 0;
		color: rgba(#fff, 0.9);
	}
}
</style>
