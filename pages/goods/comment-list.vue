<template>
	<view class="page_box">
		<view class="head_box x-f">
			<button :class="{ 'btn-active': typeCurrent === t.code }" class="cu-btn type-btn" @tap="selType(t.code)" v-for="t in commentTypeList" :key="t.code">
				{{ t.name }}({{t.num}})
			</button>
		</view>
		<view class="content_box">
			<scroll-view scroll-y="true" enable-back-to-top @scrolltolower="loadMore" class="scroll-box">
				<view class="comment-list">
					<block v-for="comment in commentList" :key="comment.id"><sh-comment :comment="comment"></sh-comment></block>
				</view>
				<view class="cu-load text-gray" :class="loadStatus"></view>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
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
import shComment from './children/sh-comment.vue';
import shoproEmpty from '@/components/shopro-empty/shopro-empty.vue';
export default {
	components: {
		shComment,
		shoproEmpty
	},
	data() {
		return {
			typeCurrent: 'all',
			commentList: [],
			commentTypeList: [],
			loadStatus: '', //loading,over
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
			this.typeCurrent = id;
			this.commentList = [];
			this.currentPage = 1;
			this.getCommentList();
		},
		// 评价类型
		getCommentType() {
			let that = this;
			that.$api('goods_comment.type', {
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
			that.$api('goods_comment.list', {
				goods_id: that.$Route.query.goodsId,
				pre_page: 10,
				page: that.currentPage,
				type: that.typeCurrent
			}).then(res => {
				if (res.code === 1) {
					that.commentList = [...that.commentList, ...res.data.data];
					that.lastPage = res.data.last_page;
					if (that.currentPage < res.data.last_page) {
						that.loadStatus = '';
					} else {
						that.loadStatus = 'over';
					}
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
		height: 62rpx;
		background: rgba(238, 238, 238, 1);
		border-radius: 31rpx;
		border: none;
		font-size: 28rpx;
		font-family: PingFang SC;
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
