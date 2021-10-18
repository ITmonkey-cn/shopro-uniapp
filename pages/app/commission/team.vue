<!-- 我的团队 -->
<template>
	<view class="page_box team-wrap">
		<view class="head_box">
			<!-- 标题栏 -->
			<shopro-navbar back-icon-color="#fff" :background="{}" :backTextStyle="{ color: '#fff', fontSize: '40rpx', fontWeight: '500' }" backText="我的团队"></shopro-navbar>
			<!-- 推荐人 -->
			<view class="referrer-box u-flex u-p-x-20" v-if="referrerInfo && referrerInfo.avatar">
				推荐人：
				<image class="referrer-avatar u-m-r-10" :src="referrerInfo.avatar" mode=""></image>
				{{ referrerInfo.nickname }}
			</view>

			<!-- 团队数据总览 -->
			<view class="team-data-box u-flex u-row-between">
				<view class="data-card">
					<view class="total-item">
						<view class="item-title">团队总人数(人)</view>
						<view class="total-num">{{ userInfo.child_user_count || 0 }}</view>
					</view>
					<view class="category-item u-flex">
						<view class=" u-flex-1">
							<view class="item-title">一级成员</view>
							<view class="category-num">{{ userInfo.child_user_count_1 || 0 }}</view>
						</view>
						<view class=" u-flex-1">
							<view class="item-title">二级成员</view>
							<view class="category-num">{{ userInfo.child_user_count_2 || 0 }}</view>
						</view>
					</view>
				</view>
				<view class="data-card">
					<view class="total-item">
						<view class="item-title">团队分销商人数(人)</view>
						<view class="total-num">{{ agentInfo.child_agent_count || 0 }}</view>
					</view>
					<view class="category-item u-flex">
						<view class=" u-flex-1">
							<view class="item-title">一级分销商</view>
							<view class="category-num">{{ agentInfo.child_agent_count_1 || 0 }}</view>
						</view>
						<view class="u-flex-1 ">
							<view class="item-title">二级分销商</view>
							<view class="category-num">{{ agentInfo.child_agent_count_2 || 0 }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="content_box">
			<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-box">
				<!-- 团队列表 -->
				<view class="team-box">
					<view class="team-list" v-for="(item, index) in teamList" :key="item.id">
						<sh-collapse-item
							:avatar="item.avatar"
							:dateTime="item.createtime"
							:level="item.agent ? item.agent.level : null"
							:name="item.nickname"
							:isUnfold="item.isUnfold"
							:childNum="item.child_user_count_1"
							@click="onTeamList(item.id, index)"
						>
							<view slot="collapse-children" v-if="childrenTeamList.length">
								<view class="team-children u-flex" v-for="children in childrenTeamList" :key="children.id">
									<image class="head-img" :src="children.avatar" mode=""></image>
									<view class="head-info">
										<view class="name-box u-flex">
											<view class="name-text">{{ children.nickname }}</view>
											<view class="grade-tag tag-box u-flex" v-if="children.agent">
												<image class="tag-img" :src="children.agent ? children.agent.level.image : ''" mode=""></image>
												<text class="tag-title">{{ children.agent ? children.agent.level.name : '' }}</text>
											</view>
										</view>
										<view class="head-time">{{ $u.timeFormat(children.createtime, 'yyyy年mm月dd日') }}</view>
									</view>
								</view>
								<button class="cu-btn refresh-btn u-flex u-row-center u-col-center" @tap.stop="childrenLoadMore(item.id)">
									<view
										v-if="childrenCurrentPage < childrenLastPage"
										class="u-iconfont uicon-reload u-m-r-10"
										:class="{ 'refresh-active': isRefresh }"
										style="color: #999;font-size: 26rpx;"
									></view>
									{{ childrenLoad ? '点击加载更多' : '没有更多~' }}
								</button>
							</view>
						</sh-collapse-item>
					</view>
				</view>
				<!-- 缺省页 -->
				<shopro-empty v-if="isEmpty" marginTop="50rpx" :image="$IMG_URL + '/imgs/empty/no_team.png'" tipText="暂无团队人员"></shopro-empty>
				<!-- 更多 -->
				<u-loadmore v-if="teamList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
	</view>
</template>

<script>
import shCollapseItem from '../components/sh-collapse-item.vue';
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {
		shCollapseItem
	},
	data() {
		return {
			isEmpty: false,
			referrerInfo: {}, //推荐人信息
			twoTeamCount: 0, //二级成员
			teamList: [], //团队列表
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1,
			// 二级
			childrenTeamList: [],
			childrenCurrentPage: 1,
			childrenLastPage: 1,
			childrenLoad: false,
			isRefresh: false
		};
	},
	computed: {
		...mapGetters(['userInfo', 'agentInfo'])
	},
	onLoad() {
		this.getTeam();
		this.getAgent();
	},
	methods: {
		...mapActions(['getAgent']),
		// 点击队员项
		onTeamList(id, current) {
			this.childrenTeamList = [];
			this.childrenCurrentPage = 1;
			this.childrenLastPage = 1;
			this.childrenLoad = false;
			this.isRefresh = false;
			!this.teamList[current].isUnfold && this.teamList[current].child_user_count_1 && this.getChildrenTeam(id);
			this.teamList.map((item, index) => {
				if (index === current) {
					item.isUnfold ? (item.isUnfold = false) : (item.isUnfold = true);
				} else {
					item.isUnfold = false;
				}
			});
		},

		// 团队列表
		getTeam() {
			let that = this;
			that.loadStatus = 'loadmore';
			that.$http('commission.team', {
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.referrerInfo = res.data.parent_user;
					let arr = res.data.teams.data;
					arr.map(item => {
						item.isUnfold = false;
					});
					that.teamList = [...that.teamList, ...arr];
					that.isEmpty = !that.teamList.length;
					that.lastPage = res.data.teams.last_page;
					that.loadStatus = that.currentPage < res.data.teams.last_page ? 'loadmore' : 'nomore';
				}
			});
		},

		// 二级队员
		getChildrenTeam(id) {
			let that = this;
			that.$http(
				'commission.team',
				{
					id: id,
					page: that.childrenCurrentPage
				},
				'加载中...'
			).then(res => {
				if (res.code === 1) {
					that.childrenTeamList = [...that.childrenTeamList, ...res.data.teams.data];
					that.childrenLastPage = res.data.teams.last_page;
					that.childrenLoad = that.childrenCurrentPage < res.data.teams.last_page;
				}
			});
		},

		// 二级加载更多
		childrenLoadMore(id) {
			if (!this.isRefresh) {
				// 加载更多
				if (this.childrenCurrentPage < this.childrenLastPage) {
					this.isRefresh = true;
					this.childrenCurrentPage += 1;
					this.getChildrenTeam(id);
				}
			}
		},

		// 加载更多
		loadMore() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getTeam();
			}
		}
	}
};
</script>

<style lang="scss">
// 推荐人
.referrer-box {
	font-size: 28rpx;
	font-weight: 500;
	color: #ffffff;
	margin-top: 10rpx;
	.referrer-avatar {
		width: 34rpx;
		height: 34rpx;
		border-radius: 50%;
	}
}
// 二级加载更多按钮
.refresh-btn {
	width: 100%;
	line-height: 100rpx;
	background: #ffffff;
	border-radius: 25rpx;
	font-size: 22rpx;
	font-weight: 500;
	color: #999999;
	white-space: nowrap;
}
.refresh-active {
	transform: rotate(360deg);
	transition: all linear 0.5s;
}
// 头部卡片
.head_box {
	background: url($IMG_URL+'/imgs/commission/card_bg.png') no-repeat;
	background-size: 100% 100%;
	padding-bottom: 30rpx;
}

// 团队信息总览
.team-data-box {
	margin: 30rpx 20rpx 0;

	.data-card {
		width: 340rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 20rpx;

		.item-title {
			font-size: 22rpx;
			font-weight: 500;
			color: #999999;
			line-height: 30rpx;
			margin-bottom: 10rpx;
		}

		.total-item {
			margin-bottom: 20rpx;
		}

		.total-num {
			font-size: 38rpx;
			font-weight: 500;
			color: #333333;
		}

		.category-num {
			font-size: 26rpx;
			font-weight: 500;
			color: #333333;
		}
	}
}

// 团队列表
.team-box {
	.team-list {
		.team-children {
			margin-left: 80rpx;
			margin-right: 20rpx;
			height: 132rpx;
			border-bottom: 1rpx solid #eee;

			.head-img {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				margin-right: 38rpx;
			}

			.head-info {
				.head-time {
					font-size: 22rpx;
					font-weight: 400;
					color: #999999;
				}

				.name-box {
					margin-bottom: 12rpx;

					.name-text {
						font-size: 24rpx;
						font-weight: 500;
						color: #666;
					}

					.tag-box {
						background: rgba(0, 0, 0, 0.2);
						border-radius: 21rpx;
						line-height: 30rpx;
						padding-right: 10rpx;
						margin-left: 10rpx;

						.tag-img {
							width: 34rpx;
							height: 34rpx;
							margin-right: 6rpx;
							border-radius: 50%;
						}

						.tag-title {
							font-size: 18rpx;

							font-weight: 500;
							color: rgba(255, 255, 255, 1);
							line-height: 20rpx;
						}
					}
				}
			}
		}
	}
}
</style>
