<!-- 评论列表 -->
<template>
	<view class="page_box">
		<view class="head_box u-flex">
			<button :class="{ 'btn-active': typeCurrent === t.code }" class="u-reset-button type-btn" @tap="selType(t.code)" v-for="t in commentTypeList" :key="t.code">
				{{ t.name }}({{ t.num }})
			</button>
		</view>
		<view class="content_box">
			<scroll-view scroll-y="true" enable-back-to-top @scrolltolower="loadMore" class="scroll-box">
				<view class="comment-list">
					<block v-for="comment in commentList" :key="comment.id"><sh-comment :comment="comment"></sh-comment></block>
				</view>
				<shopro-empty v-if="isEmpty" :image="$IMG_URL + '/imgs/empty/comment_empty.png'" tipText="暂无此类评价~"></shopro-empty>
				<!-- 加载更多 -->
				<u-loadmore v-if="commentList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
	</view>
</template>

<script>
import shComment from '../components/sh-comment.vue';
export default {
	components: {
		shComment
	},
	data() {
		return {
			isEmpty: false,
			typeCurrent: 'all',
			commentList: [],
			commentTypeList: [],
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1
		};
	},
	computed: {},
	onLoad() {
		this.getCommentType();
	},
	methods: {
		selType(id) {
			if (this.typeCurrent !== id) {
				this.typeCurrent = id;
				this.commentList = [];
				this.currentPage = 1;
				this.getCommentList();
			}
		},
		// 评价类型
		getCommentType() {
			let that = this;
			that.$http('goods.commentType', {
				goods_id: that.$Route.query.goodsId
			}).then(res => {
				if (res.code === 1) {
					that.commentTypeList = res.data;
					that.getCommentList();
				}
			});
		},
		// 商品评论
		getCommentList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http('goods.commentList', {
				goods_id: that.$Route.query.goodsId,
				pre_page: 10,
				page: that.currentPage,
				type: that.typeCurrent
			}, '加载中...').then(res => {
				if (res.code === 1) {
					that.commentList = [...that.commentList, ...res.data.data];
					that.isEmpty = !that.commentList.length;
					that.lastPage = res.data.last_page;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
				}
			});
		},
		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getCommentList();
			}
		}
	}
};
</script>

<style lang="scss">
.empty-box {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
.head_box {
	height: 114rpx;
	background-color: #fff;
	padding: 0 20rpx;
	.type-btn {
		width: 130rpx;
		line-height: 62rpx;
		background: rgba(238, 238, 238, 1);
		border-radius: 31rpx;
		border: none;
		font-size: 28rpx;

		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		padding: 0;
		margin-right: 10rpx;
	}
	.btn-active {
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		color: #a8700d;
	}
}
.comment-list {
	margin-top: 20rpx;
}
</style>
