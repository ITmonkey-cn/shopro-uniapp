<!-- 收藏列表 -->
<template>
	<view class="page_box">
		<!-- 总收藏数 -->
		<view class="head_box u-flex u-row-between" v-show="!isEmpty">
			<view class="count-box">
				共
				<text class="all-num">{{ total }}</text>
				件商品
			</view>
			<button class="set-btn u-reset-button" @tap="onSet">{{ isEdit ? '完成' : '编辑' }}</button>
		</view>

		<!-- 收藏列表 -->
		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<u-checkbox-group @change="checkboxGroupChange" activeColor="#e9b461">
					<view class="collect-list u-flex" v-for="f in favoriteList" :key="f.id">
						<u-checkbox v-show="isEdit" :name="f.goods_id" shape="circle" v-model="f.checked"></u-checkbox>
						<shopro-mini-card
							:image="f.goods.image"
							:title="f.goods.title"
							:price="f.goods.price"
							:originPrice="f.goods.original_price"
							:subtitle="f.goods.subtitle"
							@click="$Router.push({ path: '/pages/goods/detail', query: { id: f.goods_id } })"
						></shopro-mini-card>
					</view>
				</u-checkbox-group>
				<!-- 缺省页 -->
				<shopro-empty
					v-if="isEmpty"
					:image="$IMG_URL + '/imgs/empty/empty_goods.png'"
					tipText="暂无收藏"
					btnText="去首页逛逛"
					@click="$Router.pushTab('/pages/index/index')"
				></shopro-empty>
				<!-- 更多 -->
				<u-loadmore v-show="!isEmpty" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
		<view class="foot_box ">
			<view class="tools-box u-flex u-row-between u-flex-1" v-show="isEdit && !isEmpty">
				<u-checkbox shape="circle" activeColor="#e9b461" @change="onAllSel" v-model="isAllSel"><text>全选</text></u-checkbox>
				<button class="u-reset-button close-btn" @tap="cancelFavorite">取消收藏</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			isEmpty: false,
			isEdit: false,
			isAllSel: false, //是否全选
			selList: [],
			favoriteList: [],
			total: 0,
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1
		};
	},
	computed: {},
	onLoad() {
		this.getFavoriteList();
	},
	methods: {
		// 单选
		checkboxGroupChange(e) {
			this.selList = e;
			this.isAllSel = this.favoriteList.every(item => item.checked);
		},

		// 编辑
		onSet() {
			this.isEdit = !this.isEdit;
		},

		// 全选
		onAllSel(e) {
			this.isAllSel = e.value;
			this.selList = [];
			this.favoriteList.forEach(item => {
				e.value && this.selList.push(item.goods_id);
				this.$set(item, 'checked', e.value);
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
			let list = [];
			that.loadStatus = 'loading';
			that.$http('user.favoriteList', {
				pre_page: 10,
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.total = res.data.total;
					list = res.data.data;
					list.map(item => {
						that.$set(item, 'checked', false);
					});
					that.favoriteList = [...that.favoriteList, ...list];
					that.isEmpty = !that.favoriteList.length;
					that.lastPage = res.data.last_page;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
				}
			});
		},

		// 取消收藏
		cancelFavorite() {
			let that = this;
			let { favoriteList, selList } = this;
			favoriteList = JSON.parse(JSON.stringify(favoriteList));
			that.$http('goods.favorite', {
				goods_ids: selList
			}).then(res => {
				if (res.code === 1) {
					if (that.isAllSel) {
						that.favoriteList = [];
						that.isEmpty = true;
					} else {
						that.favoriteList = favoriteList.filter(f => !selList.includes(f.goods_id));
						that.total = that.favoriteList.length;
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
		padding: 20rpx;
	}
}

.collect-list {
	padding: 30rpx 20rpx;
	background: #fff;
	width: 750rpx;
	margin-bottom: 20rpx;
}

.tools-box {
	height: 100rpx;
	width: 750rpx;
	padding: 0 20rpx;
	background: #fff;
	.close-btn {
		width: 200rpx;
		line-height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		border-radius: 35rpx;
		padding: 0;
		color: rgba(#fff, 0.9);
	}
}
</style>
