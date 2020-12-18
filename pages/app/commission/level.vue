<template>
	<view class="page_box">
		<!-- 等级信息 -->
		<view class="head_box">
			<cu-custom isBack>
				<block slot="backText"><text class="nav-text">我的分销等级</text></block>
			</cu-custom>
			<view class="lg-tag-box x-c">
				<image class="lg-tag-img" :src="agentInfo.agent_level.image" mode=""></image>
				<view class="lg-tag-text">{{ agentInfo.agent_level.name }}</view>
			</view>
			<!-- 等级步骤条 -->
			<view class="mini-tag-box">
				<scroll-view scroll-x class="nav flex" scroll-with-animation :scroll-left="scrollLeft">
					<view class="step-item"></view>
					<view class="tag-step-item " v-for="(item, index) in lvInfo" :key="index" @tap="stepSelect(index)">
						<view class="tag-box y-f">
							<view class="mini-img-wrap x-c"><image class="mini-img" :src="item.image" mode=""></image></view>
							<view class="mini-tag-text" :class="{ 'title-active': stepCur === index }">{{ item.name }}</view>
							<view class="tag-index cuIcon-triangleupfill" :class="{ 'icon-opactiy': stepCur !== index }"></view>
						</view>
						<view class="tag-line" v-if="index < lvInfo.length - 1"></view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="content_box">
			<!-- 佣金比例 -->
			<view class="scale-box mb30" v-if="curLvInfo.commission_rules">
				<view class="scale-title mb30">佣金比例</view>
				<view class="scale-content">
					<view class="table-box">
						<view class="tr t-head x-f">
							<view class="th x-c">佣金级别</view>
							<view class="th x-c">佣金比例</view>
						</view>
						<view class="tr x-f t-item" v-if="commissionLv >= 1">
							<view class="td x-c">一级佣金比例</view>
							<view class="td x-c">{{ curLvInfo.commission_rules.commission_1 }}%</view>
						</view>
						<view class="tr x-f t-item" v-if="commissionLv >= 2">
							<view class="td x-c">二级佣金比例</view>
							<view class="td x-c">{{ curLvInfo.commission_rules.commission_2 }}%</view>
						</view>
						<view class="tr x-f t-item" v-if="commissionLv >= 3">
							<view class="td x-c">三级佣金比例</view>
							<view class="td x-c">{{ curLvInfo.commission_rules.commission_3 }}%</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 升级条件 -->
			<view class="ask-box" v-show="curLvInfo.level > 1">
				<view class="ask-title x-bc">
					<text>升级条件</text>
					<text v-show="curLvInfo.upgrade_type === 0" class="ask-sub-title">满足以下任意条件</text>
					<text v-show="curLvInfo.upgrade_type === 1" class="ask-sub-title">满足以下全部条件</text>
				</view>
				<view class="card-wrap x-bc my20" v-for="(item, index) in curLvInfo.arr" :key="index">
					<view class="card-box x-f">
						<view class="img-wrap"><image class="goods-img" :src="item.img" mode=""></image></view>
						<view class="detail">
							<view class="title more-t">{{ item.title }}({{ item.unit }})</view>
							<view class="x-f modal-progress">
								<view class="progress-box">
									<view class="cu-progress round sm">
										<view class="progress--ing" :style="[{ width: '20%' }]"></view>
										<view class="round-wrap"><view class="round-inner"></view></view>
									</view>
									<view class="mini-progress-tip" :style="[{ 'font-size': '14rpx' }, { width: '20%' }]">
										<text class="tip-text">{{ item.value }}</text>
									</view>
								</view>
								<view class="ml-progress-tip">{{ item.total }}</view>
							</view>
						</view>
					</view>
					<button class="cu-btn card-btn" @tap="$tools.routerTo('/pages/index/index')">去完成</button>
				</view>
			</view>
		</view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			scrollLeft: 0, //步骤滚动
			stepCur: 0, //当前步骤
			lvInfo: [],
			curLvInfo: {},
			commissionLv: 1, //佣金级数
			agentInfo: uni.getStorageSync('agentInfo'),
			lvMap: {},
			lvTaskMap: {
				child_agent_count: {
					title: '团队分销商人数',
					img: `${this.$IMG_URL}/imgs/commission/lv_team1.png`,
					unit: '人'
				},
				child_agent_count_1: {
					title: '一级分销商人数',
					img: `${this.$IMG_URL}/imgs/commission/lv_team2.png`,
					unit: '人'
				},
				child_agent_count_2: {
					title: '二级分销商人数',
					img: `${this.$IMG_URL}/imgs/commission/lv_team3.png`,
					unit: '人'
				},
				child_order_count: {
					title: '团队分销订单数',
					img: `${this.$IMG_URL}/imgs/commission/lv_order3.png`,
					unit: '单'
				},
				child_order_count_1: {
					title: '一级分销商订单数',
					img: `${this.$IMG_URL}/imgs/commission/lv_order2.png`,
					unit: '单'
				},
				child_order_count_2: {
					title: '二级分销商订单数',
					img: `${this.$IMG_URL}/imgs/commission/lv_order1.png`,
					unit: '单'
				},
				child_order_money: {
					title: '团队分销订单金额',
					img: `${this.$IMG_URL}/imgs/commission/lv_order3.png`,
					unit: '元'
				},
				child_order_money_1: {
					title: '一级分销订单金额',
					img: `${this.$IMG_URL}/imgs/commission/lv_order1.png`,
					unit: '元'
				},
				child_order_money_2: {
					title: '二级分销订单金额',
					img: `${this.$IMG_URL}/imgs/commission/lv_order2.png`,
					unit: '元'
				},
				child_user_count: {
					title: '团队用户人数',
					img: `${this.$IMG_URL}/imgs/commission/lv_p_team1.png`,
					unit: '人'
				},
				child_user_count_1: {
					title: '一级用户人数',
					img: `${this.$IMG_URL}/imgs/commission/lv_p_team2.png`,
					unit: '人'
				},
				child_user_count_2: {
					title: '二级用户人数',
					img: `${this.$IMG_URL}/imgs/commission/lv_p_team3.png`,
					unit: '人'
				},
				order_count: {
					title: '直推分销订单数量',
					img: `${this.$IMG_URL}/imgs/commission/lv_order3.png`,
					unit: '单'
				},
				order_money: {
					title: '直推分销订单金额',
					img: `${this.$IMG_URL}/imgs/commission/lv_z_order.png`,
					unit: '元'
				},
				total_consume: {
					title: '累计消费金额',
					img: `${this.$IMG_URL}/imgs/commission/lv_money.png`,
					unit: '元'
				}
			}
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},
	onLoad() {
		this.getCommissionLv();
	},
	methods: {
		// 点击步骤条
		stepSelect(index) {
			this.stepCur = index;
			this.curLvInfo = this.lvInfo[index];
			this.scrollLeft = (index - 1) * 100;
			console.log(this.curLvInfo.arr);
		},
		// 构造升级条件数据
		editLvInfoMap() {
			let that = this;
			this.lvInfo.forEach(item => {
				item.arr = [];
				that.lvMap = {
					...that.lvMap,
					[item.level]: {
						title: `${item.name}需要人数`,
						unit: '人',
						img: item.image
					}
				};
				for (let rule in item.upgrade_rules) {
					if (rule != 'child_agent_level' && rule != 'child_agent_level_1') {
						item.arr.push({
							name: rule,
							total: item.upgrade_rules[rule],
							value: that.agentInfo[rule],
							...that.lvTaskMap[rule]
						});
					} else {
						if (rule === 'child_agent_level') {
							item.upgrade_rules['child_agent_level'].forEach(m => {
								item.arr.push({
									total: m.count,
									value: 12222,
									lv: m.level,
									...that.lvMap[m.level]
								});
							});
						}
						if (rule === 'child_agent_level_1') {
							item.upgrade_rules['child_agent_level_1'].forEach(m => {
								item.arr.push({
									total: m.count,
									value: 12222,
									lv: m.level,
									...that.lvMap[m.level]
								});
							});
						}
					}
				}
			});
		},

		// 等级
		getCommissionLv() {
			let that = this;
			that.$api('commission.lv').then(res => {
				if (res.code === 1) {
					that.commissionLv = res.data.commission_level;
					that.lvInfo = res.data.level;
					that.editLvInfoMap();
					that.curLvInfo = res.data.level[0];
				}
			});
		}
	}
};
</script>

<style lang="scss">
.page_box {
	background: #fff;
}
// 头部信息
.head_box {
	background: url($IMG_URL+'/imgs/commission/lv_bg.png') no-repeat;
	.nav-text {
		font-size: 36rpx;
		color: #fff;
	}
	/deep/ .cu-back {
		color: #fff;
		font-size: 38rpx;
	}
	.lg-tag-box {
		width: 100%;
		padding: 50rpx 0;
		position: relative;
		.lg-tag-img {
			width: 134rpx;
			height: 144rpx;
		}
		.lg-tag-text {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 40rpx;
			width: 138rpx;
			border-radius: 36rpx;
			background-color: #ffb400;
			line-height: 36rpx;
			font-size: 24rpx;
			color: #fff;
			text-align: center;
		}
	}
}

// 步骤条
.mini-tag-box {
	.step-item {
		width: 50rpx;
		display: inline-block;
	}
	.tag-step-item {
		display: inline-block;
		width: 200rpx;
		justify-content: flex-start;
		position: relative;
		.tag-box {
			width: 100rpx;
			.mini-img-wrap {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				border: 1rpx solid #fff;
				.mini-img {
					width: 40rpx;
					height: 40rpx;
				}
			}
			.mini-tag-text {
				font-size: 24rpx;
				font-weight: 500;
				color: rgba(#fff, 0.5);
				line-height: 30rpx;
				padding: 30rpx 0;
			}
			.title-active {
				color: #fff;
			}
			.tag-index {
				font-size: 60rpx;
				line-height: 10rpx;
				color: #fff;
				transition: all linear 0.2s;
			}
			.icon-opactiy {
				opacity: 0;
				transition: all linear 0.2s;
			}
		}
		.tag-line {
			width: 100rpx;
			height: 2rpx;
			background-color: #fff;
			position: absolute;
			right: 0;
			top: 30rpx;
		}
	}
}
// 佣金比例
.content_box {
	padding: 40rpx 30rpx;
}
.scale-box {
	.scale-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333333;
	}
	.scale-content {
		border-radius: 10rpx;
		overflow: hidden;
		.t-head {
			.th {
				background-color: #5e4ddf;
				font-size: 25rpx;
				color: #fff;
				font-weight: 500;
				width: 345rpx;
				height: 80rpx;
				border-bottom: 2rpx solid rgba(#fff, 0.1);
				border-right: 2rpx solid rgba(#fff, 0.1);
				&:last-child {
					border-right: none;
				}
			}
		}
		.t-item {
			.td {
				background-color: #edeaff;
				font-size: 24rpx;
				color: #9281e2;
				font-weight: 500;
				width: 345rpx;
				height: 80rpx;
				border-bottom: 2rpx solid rgba(#6041f1, 0.1);
				border-right: 2rpx solid rgba(#6041f1, 0.1);
				&:last-child {
					border-right: none;
				}
			}
		}
	}
}
// 升级条件
// 进度条
.ml-progress-tip {
	font-size: 16rpx;
	font-weight: 500;
	color: #c7b2ff;
	white-space: nowrap;
	margin-left: 10rpx;
}
.progress-box {
	align-items: flex-start;
	.mini-progress-tip {
		font-size: 16rpx;
		font-weight: 500;
		color: #c7b2ff;
		line-height: 30rpx;
		white-space: nowrap;
		margin-top: 10rpx;
	}

	.cu-progress {
		width: 200rpx;
		height: 10rpx;
		background: #503bae;
		overflow: visible;
		.progress--ing {
			background: linear-gradient(180deg, #c6a6ff 0%, #7430ee 100%);
			border-radius: 10rpx;
		}
		.round-wrap {
			width: 30rpx;
			height: 30rpx;
			border: 2rpx solid #5c3cff;
			background: linear-gradient(0deg, #a36fff 0%, #846fff 100%);
			border-radius: 50%;
			position: relative;
			left: -15rpx;
			.round-inner {
				width: 20rpx;
				height: 20rpx;
				border: 2rpx solid #5c3cff;
				background: linear-gradient(0deg, #a36fff 0%, #846fff 100%);
				border-radius: 50%;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
}
.ask-box {
	.ask-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333333;
		.ask-sub-title {
			font-size: 26rpx;
			font-weight: 500;
			color: #999999;
		}
	}
}
.card-wrap {
	background: rgba(#c3b6ff, 0.3);
	padding: 20rpx;
	border-radius: 10rpx;
	.card-btn {
		width: 140rpx;
		height: 60rpx;
		background: linear-gradient(90deg, #a36fff, #5336ff);
		box-shadow: 0 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
		border-radius: 30rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #ffffff;
	}
}
.card-box {
	.img-wrap {
		background: #fff;
		width: 110rpx;
		height: 110rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;

		.goods-img {
			width: 110rpx;
			height: 110rpx;
			border-radius: 10rpx;
		}
	}
	.detail {
		height: 110rpx;
		width: 300rpx;
		align-items: flex-start;
		.title {
			font-size: 20rpx;
			font-weight: 500;
			color: #333333;
			line-height: 35rpx;
			text-align: left;
		}
		.sub {
			font-size: 16rpx;
			font-weight: 500;
			color: #9281e2;
			text-align: left;
		}
	}
}
</style>
