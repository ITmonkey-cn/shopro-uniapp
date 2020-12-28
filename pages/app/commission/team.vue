<!-- 我的团队 -->
<template>
	<view class="page_box team-wrap">
		<view class="head_box">
			<cu-custom isBack>
				<block slot="backText"><text class="head-title">我的团队</text></block>
			</cu-custom>
			<!-- 推荐人 -->
			<view class="referrer-box x-f px30 ">
				推荐人：
				<image class="referrer-avatar" :src="referrerInfo.avatar" mode=""></image>
				{{ referrerInfo.nickname }}
			</view>
			<!-- 团队数据总览 -->
			<view class="team-data-box x-bc">
				<view class="data-card">
					<view class="total-item">
						<view class="item-title">团队总人数(人)</view>
						<view class="total-num">{{ userInfo.child_user_count || 0 }}</view>
					</view>
					<view class="category-item x-f">
						<view class="y-start flex-sub">
							<view class="item-title">一级成员</view>
							<view class="category-num">{{ userInfo.child_user_count_1 || 0 }}</view>
						</view>
						<view class="y-start flex-sub">
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
					<view class="category-item x-f">
						<view class="y-start flex-sub">
							<view class="item-title">一级分销商</view>
							<view class="category-num">{{ agentInfo.child_agent_count_1 || 0 }}</view>
						</view>
						<view class="y-start ">
							<view class="item-title">二级分销商</view>
							<view class="category-num">{{ agentInfo.child_agent_count_2 || 0 }}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 筛选 TODO -->
			<view class="filter-box x-f" v-if="false">
				<view class="filter-item flex-sub" v-for="(filter, index) in filterList" :key="index" @tap="onFilter(index)">
					<view class="x-f">
						<text class="filter-title" :class="{ 'title-active': filterCurrent == index }">{{ filter.title }}</text>
						<text v-show="index" class="cuIcon-unfold" :class="{ 'icon-active': filter.isUnfold }"></text>
					</view>
					<text class="underline" :class="{ 'underline-active': filterCurrent == index }"></text>
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
								<view class="team-children x-f" v-for="children in childrenTeamList" :key="children.id">
									<image class="head-img" :src="children.avatar" mode=""></image>
									<view class="head-info">
										<view class="name-box x-f">
											<view class="name-text">{{ children.nickname }}</view>
											<view class="grade-tag tag-box x-f" v-if="children.agent">
												<image class="tag-img" :src="children.agent ? children.agent.level.image : ''" mode=""></image>
												<text class="tag-title">{{ children.agent ? children.agent.level.name : '' }}</text>
											</view>
										</view>
										<view class="head-time">{{ $u.timeFormat(children.createtime, 'yyyy年mm月dd日') }}</view>
									</view>
								</view>
								<button class="cu-btn refresh-btn x-f" @tap.stop="childrenLoadMore(item.id)">
									<text class="cuIcon-refresh" :class="{ 'refresh-active': isRefresh }"></text>
									{{ childrenLoad ? '点击加载更多' : '没有更多~' }}
								</button>
							</view>
						</sh-collapse-item>
					</view>
				</view>
				<!-- 缺省页 -->
				<shopro-empty v-if="emptyData.show" :emptyData="emptyData"></shopro-empty>
				<!-- 更多 -->
				<u-loadmore v-if="teamList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
			</scroll-view>
		</view>
	</view>
</template>

<script>
import shCollapseItem from '../children/sh-collapse-item.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {
		shCollapseItem
	},
	data() {
		return {
			emptyData: {
				show: false,
				img: this.$IMG_URL + '/imgs/empty/no_team.png',
				tip: '暂无团队人员',
				path: '',
				pathText: ''
			},
			referrerInfo: {}, //推荐人信息
			twoTeamCount: 0, //二级成员
			agentInfo: uni.getStorageSync('agentInfo'),
			filterCurrent: 0,
			filterList: [
				{
					title: '综合',
					isUnfold: false
				},
				{
					title: '等级',
					isUnfold: false
				},
				{
					title: '加入时间',
					isUnfold: false
				}
			],
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
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},
	onLoad() {
		this.getTeam();
		this.getAgent();
	},
	methods: {
		...mapActions(['getAgent']),
		// 点击筛选项
		onFilter(index) {
			this.filterCurrent = index;
			if (this.filterCurrent == index) {
				this.filterList[index].isUnfold = !this.filterList[index].isUnfold;
			}
		},
		// 点击队员项
		onTeamList(id, ind) {
			this.childrenTeamList = [];
			this.childrenCurrentPage = 1;
			this.childrenLastPage = 1;
			this.childrenLoad = false;
			this.isRefresh = false;
			this.teamList.map((item, index) => {
				if (index === ind) {
					item.isUnfold ? (item.isUnfold = false) : (item.isUnfold = true);
				} else {
					item.isUnfold = false;
				}
			});
			!this.isLoading && this.getChildrenTeam(id, ind);
		},

		// 团队列表
		getTeam() {
			let that = this;
			that.emptyData.show = false;
			that.loadStatus = 'loading';
			that.isLoading = true;
			that.$api('commission.team', {
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.isLoading = false;
					this.referrerInfo = res.data.parent_user;
					let arr = res.data.teams.data;
					arr.map(item => {
						item.isUnfold = false;
					});

					that.teamList = [...that.teamList, ...arr];
					if (!that.teamList.length) {
						that.emptyData.show = true;
					}
					that.lastPage = res.data.teams.last_page;
					if (that.currentPage < res.data.teams.last_page) {
						that.isLoadMore = 'loadmore';
					} else {
						that.loadStatus = 'nomore';
					}
				}
			});
		},

		// 二级队员
		getChildrenTeam(id, index) {
			let that = this;
			that.$api('commission.team', {
				id: id,
				page: that.childrenCurrentPage
			}).then(res => {
				if (res.code === 1) {
					that.childrenTeamList = [...that.childrenTeamList, ...res.data.teams.data];
					that.childrenLastPage = res.data.teams.last_page;
					if (that.childrenCurrentPage < res.data.teams.last_page) {
						that.childrenLoad = true;
					} else {
						that.childrenLoad = false;
					}
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
	.cuIcon-refresh {
		color: #dbdbdb;
		margin-right: 12rpx;
		font-size: 32rpx;
	}
}
.refresh-active {
	transform: rotate(360deg);
	transition: all linear 0.5s;
}
// 头部卡片
.head_box {
	background: url($IMG_URL+'/imgs/commission/card_bg.png') no-repeat;
	background-size: 100% auto;

	/deep/ .cu-back {
		color: #fff;
		font-size: 40rpx;
	}

	.head-title {
		font-size: 38rpx;
		color: #fff;
	}
}

// 团队信息总览
.team-data-box {
	margin: 30rpx 20rpx;

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

// 筛选
.filter-box {
	width: 750rpx;
	height: 95rpx;
	background: #ffffff;

	.filter-item {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.filter-title {
			color: #666;
			font-weight: 500;
			font-size: 28rpx;
			line-height: 90rpx;
		}

		.cuIcon-unfold {
			font-size: 24rpx;
			color: #c4c4c4;
			margin-left: 10rpx;
			transition: all linear 0.3s;
		}

		.icon-active {
			transform: rotate(180deg);
			transform-origin: center center;
			transition: all linear 0.3s;
		}

		.title-active {
			color: #333;
		}

		.underline {
			display: block;
			width: 68rpx;
			height: 4rpx;
			background: #fff;
			border-radius: 2rpx;
		}

		.underline-active {
			background: #5e49c3;
			display: block;
			width: 68rpx;
			height: 4rpx;
			border-radius: 2rpx;
		}
	}
}

// 团队列表
.team-box {
	margin-top: 20rpx;

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
							font-family: PingFang SC;
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
