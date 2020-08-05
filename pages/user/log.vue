<template>
	<view class="page_box">
		<view class="head_box x-bc" v-if="browseList && browseList.length">
			<view class="count-box"></view>
			<button class="cu-btn set-btn" @tap="onSet">{{ isSel ? '完成' : '编辑' }}</button>
		</view>
		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<checkbox-group @change="onSel" v-if="browseList.length">
					<view class="collect-list x-f" v-for="f in browseList" :key="f.id">
						<checkbox v-if="isSel" :value="f.goods_id.toString()" :checked="f.checked" :class="{ checked: f.checked }" class="goods-radio round orange"></checkbox>
						<shopro-mini-card :detail="f" :type="'favorite'"></shopro-mini-card>
					</view>
				</checkbox-group>
				<!-- 缺省页 -->
				<shopro-empty v-if="!browseList.length" :emptyData="emptyData"></shopro-empty>
				<!-- 更多 -->
				<view v-if="browseList.length" class="cu-load text-gray" :class="loadStatus"></view>
			</scroll-view>
		</view>
		<view class="foot_box ">
			<view class="tools-box x-bc" v-if="isSel && browseList.length">
				<label class="check-all" @tap="onAllSel">
					<radio :checked="allSel" :class="{ checked: allSel }" class="check-all-radio orange"></radio>
					<text>全选</text>
				</label>
				<button class="cu-btn close-btn" @tap="cancelFavorite">删除</button>
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
				tip: '暂无浏览记录',
				path: '/pages/index/index',
				pathText: '去首页逛逛'
			},
			browseList: [],
			loadStatus: '', //loading,over
			currentPage: 1,
			lastPage: 1
		};
	},
	computed: {},
	async created() {
		this.init();
	},
	//  onLoad() {
	//   	this.init();
	// },
	methods: {
		// init
		init() {
			return Promise.all([this.getbrowseList()]);
		},
		onSel(e) {
			let items = this.browseList,
				values = e.detail.value;
			this.selList = values;
			items.forEach(i => {
				if (values.includes(i.goods_id.toString())) {
					this.$set(i, 'checked', true);
				} else {
					this.$set(i, 'checked', false);
				}
			});
		},
		onSet() {
			this.isSel = !this.isSel;
		},
		onAllSel() {
			this.allSel = !this.allSel;
			this.selList = [];
			const { browseList } = this;
			browseList.forEach(i => {
				if (this.allSel) {
					this.$set(i, 'checked', true);
					this.selList.push(i.goods_id);
				} else {
					this.$set(i, 'checked', false);
				}
			});
		},
		// 历史记录
		getbrowseList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$api('goods.viewList', {
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.browseList = [...that.browseList, ...res.data.data];
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
			const { browseList } = this;
			that.$api('goods.viewDelete', {
				goods_ids: ids
			}).then(res => {
				if (res.code === 1) {
					if (that.allSel) {
						that.browseList = [];
					} else {
						that.browseList = browseList.filter(f => !ids.includes(f.goods_id.toString()));
					}
				}
			});
		},
		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getbrowseList();
			}
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
