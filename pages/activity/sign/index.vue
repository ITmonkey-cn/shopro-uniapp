<!-- 签到 -->
<template>
	<view class="sign-wrap">
		<view class="calendar">
			<!-- 每日签到 -->
			<view class="sign-everyday u-flex u-row-between u-p-30">
				<text class="sign-everyday-title">每日签到</text>
				<view class="sign-num-box">
					已连续签到
					<text class="sign-num">{{ cuntinueDays }}</text>
					天
				</view>
			</view>

			<!-- 切换年月 -->
			<view class="bar u-flex u-row-center">
				<view class="previous" @tap="handleCalendar(0)">
					<button class="u-reset-button bar-btn u-p-r-30"><u-icon name="arrow-left" size="28" color="#c4c4c4"></u-icon></button>
				</view>
				<view class="date">{{ cur_year || '--' }} 年 {{ cur_month || '--' }} 月</view>
				<view class="next" @tap="handleCalendar(1)">
					<button class="u-reset-button bar-btn u-p-l-30"><u-icon name="arrow-right" size="28" color="#c4c4c4"></u-icon></button>
				</view>
			</view>

			<!-- 显示星期 -->
			<view class="week u-flex">
				<view class="week-item u-flex u-row-center" v-for="(item, index) in weeks_ch" :key="index">{{ item }}</view>
			</view>

			<!-- 日历表 -->
			<view class="myDateTable">
				<view v-for="(item, j) in days" :key="j" class="dateCell u-flex u-row-center u-col-center">
					<!-- 空格 -->
					<view v-if="!item.date" class="cell"><text :decode="true">&nbsp;&nbsp;</text></view>
					<view v-else>
						<!-- 已签到日期 -->
						<view v-if="item.is_sign" class="cell is-sign">
							<text>{{ item.day }}</text>
						</view>
						<!-- 未签到日期 -->
						<view class="cell" v-else>
							<text>{{ item.day }}</text>
						</view>
					</view>
				</view>
				<!-- 签到按钮 -->
				<view class="u-flex u-col-center u-row-center sign-box">
					<button :disabled="isPresentMonth || isSign" @tap="onSign" class="u-reset-button sign-btn">{{ isSign ? '已签到' : '签到' }}</button>
				</view>
			</view>
		</view>
		<u-popup v-model="showSign" mode="center" border-radius="20">
			<view class="sign-modal-box">
				<view class="modal-head u-flex-col u-col-center">
					<image class="modal-bg" :src="$IMG_URL + '/imgs/modal/sign_modal_bg.jpg'" mode=""></image>
					<image class="sign-tag" :src="$IMG_URL + '/imgs/modal/sign_modal_succeed.png'" mode=""></image>
					<view class="sign-num-box">
						已连续打卡
						<text class="sign-num">{{ cuntinueDays }}</text>
						天
					</view>
				</view>
				<view class="modal-content u-flex-col u-col-center">
					<view class="sign-success">签到成功</view>
					<view class="sign-score">恭喜您获得{{ score || '0' }}积分</view>
				</view>
				<view class="modal-bottom u-flex u-row-center"><button class="u-reset-button confirem-btn" @tap="showSign = false">确认</button></view>
			</view>
		</u-popup>
		<!-- 登录 -->
		<shopro-auth-modal ></shopro-auth-modal>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			days: [], //日历
			cuntinueDays: 0, //签到天数
			score: '', //签到获得的积分
			cur_year: 0, //当前选的年
			cur_month: 0, //当前选的月
			cur_day: 0, //当前选择的天
			today: parseInt(new Date().getDate()), //本日
			toMonth: parseInt(new Date().getMonth() + 1), //本月
			toYear: parseInt(new Date().getFullYear()), //本年
			weeks_ch: ['日', '一', '二', '三', '四', '五', '六'], //星期
			isPresentMonth: false, //是否可签到
			isSign: false,
			showSign: false
		};
	},
	computed: {},
	onLoad() {
		this.cur_year = this.toYear;
		this.cur_month = this.toMonth;
		this.cur_day = this.today;
		this.getSignList();
	},
	methods: {
		...mapActions(['getUserInfo']),
		// 当前签到记录
		getSignList() {
			let that = this;
			let month = that.cur_month < 10 ? '0' + that.cur_month : that.cur_month;
			let query = `${that.cur_year}-${month}`;
			that.$http('user.signList', {
				month: query
			}).then(res => {
				if (res.code == 1) {
					let emptyDays = that.calculateEmptyGrids();
					that.cuntinueDays = that.cuntinueDays === 0 ? res.data.cuntinue_days : that.cuntinueDays;
					that.days = [...emptyDays, ...res.data.days];
					that.selSign();
				}
			});
		},
		// 选中日期
		selSign() {
			let that = this;
			let selToday = `${that.toYear}-${that.toMonth.toString().padStart(2, '0')}-${that.today.toString().padStart(2, '0')}`;
			let newDay = `${that.cur_year}-${that.cur_month.toString().padStart(2, '0')}-${that.cur_day.toString().padStart(2, '0')}`;
			if (selToday === newDay) {
				let day = that.days.find(item => {
					return item.date === selToday;
				});
				that.isSign = day.is_sign;
			}
		},
		// 计算当月1号前空了几个格子
		calculateEmptyGrids() {
			let that = this;
			let emptyDays = [];
			const firstDayOfWeek = new Date(Date.UTC(that.cur_year, that.cur_month - 1, 1)).getDay();
			if (firstDayOfWeek > 0) {
				for (let i = 0; i < firstDayOfWeek; i++) {
					let obj = {
						day: null,
						is_sign: false
					};
					emptyDays.push(obj);
				}
			}
			return emptyDays;
		},
		//签到
		onSign() {
			let that = this;
			let month = that.cur_month.toString().padStart(2, '0');
			let query = `${that.cur_year}-${month}`;
			that.$http('user.sign', {
				month: query
			},
			'签到中...'
			).then(res => {
				if (res.code == 1) {
					that.getSignList();
					that.score = res.data.score;
					that.getUserInfo();
					that.showSign = true;
				}
			});
		},

		// 切换控制年月，上一个月，下一个月
		handleCalendar(type) {
			const cur_year = parseInt(this.cur_year);
			const cur_month = parseInt(this.cur_month);
			let newMonth = cur_month;
			let newYear = cur_year;
			switch (type) {
				case 0:
					//上个月
					this.isPresentMonth = true;
					newMonth = cur_month - 1;
					if (newMonth < 1) {
						newYear = cur_year - 1;
						newMonth = 12;
					}
					if (newYear < this.toYear || (newYear === this.toYear && newMonth <= this.toMonth)) {
						this.isPresentMonth = false;
					}
					break;
				case 1:
					newMonth = cur_month + 1;
					if (newMonth > 12) {
						newYear = cur_year + 1;
						newMonth = 1;
					}

					if (newYear > this.toYear || (newYear === this.toYear && newMonth > this.toMonth)) {
						this.isPresentMonth = true;
					}
					break;
				default:
					break;
			}
			this.cur_year = newYear;
			this.cur_month = newMonth;
			this.getSignList();
		}
	}
};
</script>

<style lang="scss">
// 日历
.calendar {
	background: #fff;
	.sign-everyday {
		height: 100rpx;
		background: rgba(255, 255, 255, 1);
		border: 1rpx solid rgba(223, 223, 223, 0.4);
		.sign-everyday-title {
			font-size: 32rpx;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}
		.sign-num-box {
			font-size: 26rpx;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			.sign-num {
				font-weight: 600;
				color: #e3ad5b;
				padding: 0 10rpx;
			}
		}
	}
	// 年月日
	.bar {
		height: 100rpx;
		.date {
			font-weight: 600;
		}
	}
	// 星期
	.week {
		.week-item {
			font-size: 24rpx;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			flex: 1;
		}
	}
	// 日历表
	.myDateTable {
		display: flex;
		flex-wrap: wrap;
		.dateCell {
			width: (750rpx/7);
			height: 80rpx;
			font-size: 26rpx;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			.cell {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
}

.is-sign {
	width: 40rpx;
	height: 40rpx;
	background: linear-gradient(132deg, rgba(243, 223, 177, 1), rgba(243, 223, 177, 1), rgba(236, 190, 96, 1));
	border-radius: 50%;
	box-shadow: 0 0 4rpx 4rpx rgba(#e3ad5b, 0.4);
	color: #fff;
}

// 签到按钮
.sign-box {
	height: 140rpx;
	width: 100%;
	.sign-btn {
		width: 219rpx;
		line-height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border-radius: 35rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.9);
	}
}

.sign-modal-box {
	width: 520rpx;
	background: #fff;
	border-radius: 20rpx;
	position: relative;

	.modal-head {
		height: 320rpx;
		align-items: center;
		justify-content: center;
		position: relative;
		.modal-bg {
			width: 100%;
			height: 100%;
		}
		.sign-tag {
			width: 70rpx;
			height: 70rpx;
			position: absolute;
			top: 50rpx;
			left: 50%;
			transform: translateX(-50%);
		}
		.sign-num-box {
			font-size: 30rpx;
			color: #fff;
			position: absolute;
			top: 150rpx;
			left: 50%;
			transform: translateX(-50%);
			.sign-num {
				font-size: 36rpx;
				font-weight: 600;
				padding: 0 10rpx;
			}
		}
	}
	.modal-content {
		padding: 30rpx 0;
		.sign-success {
			font-size: 34rpx;
			
			font-weight: bold;
			color: rgba(227, 173, 91, 1);
		}
		.sign-score {
			font-size: 26rpx;
			
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			padding-top: 16rpx;
		}
	}
	.modal-bottom {
		padding-bottom: 47rpx;
		.confirem-btn {
			width: 300rpx;
			line-height: 70rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			border-radius: 35rpx;
			padding: 0;
			font-size: 28rpx;
			
			font-weight: 500;
			color: rgba(255, 255, 255, 0.9);
		}
	}
}
</style>
