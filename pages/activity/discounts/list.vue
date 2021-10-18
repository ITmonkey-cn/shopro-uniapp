<!-- 商品列表 -->
<template>
	<view class="list-box">
		<!-- 倒计时 -->
		<u-sticky ref="uSticky" bgColor="#f6f6f6" offsetTop="0">
			<view class="tip-list-box">
				<view class="tip-list u-flex-col u-flex-1 u-p-30">
					<view class="count-down-box u-flex u-col-center">
						<view class="u-m-r-10">{{ timeRule.title }}</view>
						<u-count-down
							v-if="timeRule.time"
							class="count-down-demo"
							:timestamp="timeRule.time / 1000"
							separator-color="#333 "
							bg-color="#FF0000 "
							ref="uCountDown"
							color="#fff"
							@end="getTime"
							autoplay
						></u-count-down>
					</view>
					<view class="u-flex u-flex-1 u-col-center modal-item u-flex-wrap u-m-t-10" v-if="activityInfo.tags">
						<view class="title-tag cu-tag bg-red sm radius u-m-r-10 u-m-t-10" >{{ activityInfo.title }}</view>
						<view class="tag-box cu-tag line-red sm radius u-m-r-10 u-m-t-10" v-for="(tag, index) in activityInfo.tags" :key="tag">{{ tag }}</view>
					</view>
				</view>
			</view>
		</u-sticky>
		<!-- 商品列表 -->
		<view class="u-waterfall u-p-16" v-if="!isEmpty">
			<view id="u-left-column" class="u-column">
				<view class="goods-item u-m-b-16 u-flex u-row-center u-col-center" v-for="leftGoods in leftList" :key="leftGoods.id">
					<shopro-goods-card
						:detail="leftGoods"
						:type="leftGoods.activity_type"
						:image="leftGoods.image"
						:title="leftGoods.title"
						:subtitle="leftGoods.subtitle"
						:price="leftGoods.price"
						:originPrice="leftGoods.original_price"
						:sales="leftGoods.sales"
						:tagTextList="leftGoods.activity_discounts_tags"
						@click="$Router.push({ path: '/pages/goods/detail', query: { id: leftGoods.id } })"
					></shopro-goods-card>
				</view>
			</view>
			<view id="u-right-column" class="u-column">
				<view class="goods-item u-m-b-16 u-flex u-row-center u-col-center" v-for="rightGoods in rightList" :key="rightGoods.id">
					<shopro-goods-card
						:detail="rightGoods"
						:type="rightGoods.activity_type"
						:image="rightGoods.image"
						:title="rightGoods.title"
						:subtitle="rightGoods.subtitle"
						:price="rightGoods.price"
						:originPrice="rightGoods.original_price"
						:sales="rightGoods.sales"
						:tagTextList="rightGoods.activity_discounts_tags"
						@click="$Router.push({ path: '/pages/goods/detail', query: { id: rightGoods.id } })"
					></shopro-goods-card>
				</view>
			</view>
		</view>

		<!-- 缺省页 -->
		<shopro-empty v-if="isEmpty" :image="$IMG_URL + '/imgs/empty/empty_goods.png'" tipText="暂无该商品，还有更多好货等着你噢~"></shopro-empty>

		<!-- 加载更多 -->
		<u-loadmore v-show="goodsList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />

		<!-- 登录弹窗 -->
		<shopro-auth-modal></shopro-auth-modal>
	</view>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			activityInfo: {},
			timeRule: {
				title: '',
				time: 0
			},
			isEmpty: false,
			goodsList: [],
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			lastPage: 1,
			currentPage: 1,
			
			// 瀑布流 350-330
			addTime: 100, //排序间隙时间
			leftHeight: 0,
			rightHeight: 0,
			leftList: [],
			rightList: [],
			tempList: []
		};
	},
	// 触底加载更多
	onReachBottom() {
		if (this.currentPage < this.lastPage) {
			this.currentPage += 1;
			this.getGoodsList();
		}
	},
	onLoad() {
		this.activityInfo = this.$Route.query;
		this.getGoodsList();
		this.getCartList();
	},
	mounted() {
		this.$nextTick(() => {
			this.getTime();
		});
	},
	methods: {
		...mapActions(['getCartList']),
		// 瀑布流相关
		async splitData() {
			if (!this.tempList.length) return;
			let item = this.tempList[0];
			if (!item) return;
		
			// 分左右
			if (this.leftHeight < this.rightHeight) {
				this.leftHeight += item.activity_discounts_tags.length ? 350 : 330;
				this.leftList.push(item);
			} else if (this.leftHeight > this.rightHeight) {
				this.rightHeight += item.activity_discounts_tags.length ? 350 : 330;
				this.rightList.push(item);
			} else {
				this.leftHeight += item.activity_discounts_tags.length ? 350 : 330;
				this.leftList.push(item);
			}
		
			// 移除临时列表的第一项，如果临时数组还有数据，继续循环
			this.tempList.splice(0, 1);
			if (this.tempList.length) {
				setTimeout(() => {
					this.splitData();
				}, this.addTime);
			}
		},
		clear() {
			this.leftList = [];
			this.rightList = [];
			this.leftHeight = 0;
			this.rightHeight = 0;
			this.tempList = [];
		},
		
		// 计算倒计时
		getTime() {
			let nowTime = new Date().getTime();
			let { endtime, starttime } = this.activityInfo;
			endtime = endtime * 1000;
			starttime = starttime * 1000;
			// 当前时间小于开始时间，未开始
			if (nowTime < starttime) {
				this.timeRule.title = '距开始';
				this.timeRule.time = starttime - nowTime;
			}
			// 当前时间大于开始时间，小于结束时间，进行中
			if (nowTime > starttime && nowTime < endtime) {
				this.timeRule.title = '距结束';
				this.timeRule.time = endtime - nowTime;
			}
			// 当前时间大于结束时间，已结束
			if (nowTime > endtime) {
				this.timeRule.title = '已结束';
				this.timeRule.time = 0;
			}
		},
		// 商品列表
		getGoodsList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$http('goods.lists', {
				goods_ids: that.activityInfo.goods_ids,
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.goodsList = [...that.goodsList, ...res.data.data];
					that.isEmpty = !that.goodsList.length;
					that.lastPage = res.data.last_page;
					that.loadStatus = that.currentPage < res.data.last_page ? 'loadmore' : 'nomore';
					that.tempList = res.data.data;
					that.splitData();
				}
			});
		}
	}
};
</script>

<style lang="scss">
@mixin vue-flex($direction: row) {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: $direction;
	/* #endif */
}
.u-waterfall {
	@include vue-flex;
	flex-direction: row;
	align-items: flex-start;
}

.u-column {
	@include vue-flex;
	flex: 1;
	flex-direction: column;
	height: auto;
}
.tip-list-box {
	background-color: #f6f6f6;
	padding: 20rpx;
}
.tip-list {
	font-size: 28rpx;
	background-color: #fff;
	border-radius: 20rpx;
}
</style>
