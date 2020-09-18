<template>
	<view class="page_box">
		<view class="head_box" v-if="orderPre.need_address" >
			<view class="add-address-box flex-sub x-f" v-if="!addressId" @tap="jump('/pages/user/address/list', { from: 'order' })">
				<image class="address-bg" src="http://shopro.7wpp.com/imgs/address_line.png" mode=""></image>
				<view class="box-bg x-bc flex-sub pad">
					<text class="select-notice">请选择收货地址</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="address-list" v-else @tap="jump('/pages/user/address/list', { from: 'order' })">
				<image class="address-bg" src="http://shopro.7wpp.com/imgs/address_line.png" mode=""></image>
				<view class="top x-f">
					<text class="name">{{ address.consignee }}</text>
					<text class="phone">{{ address.phone }}</text>
					<text class="tag" v-if="address.is_default == 1">默认</text>
				</view>
				<view class="detail x-bc">
					<view class="address">{{ address.province_name }}{{ address.city_name }}{{ address.area_name }}{{ address.address }}</view>
					<text class="cuIcon-right"></text>
				</view>
			</view>
		</view>
		<view class="content_box">
			<!-- 确认订单商品卡片 -->
			<view class="goods-list" v-for="g in perGoodsList" :key="g.sku_price_id">
				<view class="goods-card">
					<shopro-mini-card :detail="g.detail" :sku="g.detail.current_sku_price" :type="'sku'">
						<block slot="goodsBottom">
							<view class="goods-price x-bc">
								<view class="">
									<text v-if="orderType === 'score'">{{ g.detail.current_sku_price.score }}积分+</text>
									<text>￥{{ g.detail.current_sku_price.price }}</text>
								</view>
								<text class="goods-num">x{{ g.goods_num }}</text>
							</view>
						</block>
					</shopro-mini-card>
				</view>
				<!-- 配送方式 -->
				<view class="logistic item-list x-bc" @tap="onSelExpressType(g)">
					<view class="x-f"><view class="item-title">配送方式</view></view>
					<view class="x-f" >
						<view class="detail">{{getCurGoodsExpress(g)}}</view>
						<text class="cuIcon-right"></text>
					</view>
				</view>
			</view>
			
			<!-- 备注 -->
			<view class="remark-box x-f item-list">
				<view class="item-title">备注</view>
				<input class="item-input"  placeholder-class="input-pl" type="text" v-model="remark" placeholder="建议留言前先于卖家沟通确认" ></input>
			</view>
			<view class="coupon x-bc item-list" v-if="!orderPre.activity_type && orderType !== 'score'">
				<view class="item-title">优惠券</view>
				<view class="x-f" @tap="selCoupon">
					<text class="price" v-if="pickerData.couponList.length">{{ pickerData.title }}</text>
					<text class="sel-coupon" v-else>暂无优惠券</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="score item-list x-bc" v-if="orderType === 'score'">
				<view class="x-f"><text class="item-title">积分</text></view>
				<view class="price">-{{ orderPre.score_amount }}积分</view>
			</view>
			<view class=" x-bc item-list border-top">
				<view class="item-title">商品金额</view>
				<view class="x-f">
					<text class="price">￥{{ orderPre.goods_amount || '0.00' }}</text>
				</view>
			</view>
			<view class="price-box x-bc item-list">
				<view class="item-title">运费</view>
				<view class="x-f">
					<text class="price">￥{{ orderPre.dispatch_amount || '0.00' }}</text>
				</view>
			</view>
		</view>
		<view class="foot_box x-f">
			<text class="num">共1件</text>
			<view class="all-money">
				<text>合计：</text>
				<text class="price">￥{{ orderPre.total_fee || '0.00' }}</text>
			</view>
			<button class="cu-btn sub-btn" @tap="subOrder" :disabled="isSubOrder">
				<text v-if="isSubOrder" class="cuIcon-loading2 cuIconfont-spin"></text>
				提交订单
			</button>
		</view>
		<!-- pricker -->
		<sh-picker-modal v-if="pickerData.couponList" @changeCoupon="changeCoupon" v-model="showPicker" :pickerData="pickerData"></sh-picker-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
		<!-- 配送方式弹窗 -->
		<shopro-modal v-model="showExpressType" :modalType="'bottom-modal'">
			<block slot="modalContent">
				<!-- 配送方式 -->
				<view class="express-type page_box">
					<view class="express-type__head head-box">
						<view
							class="express-type__head-nav"
							v-for="(nav, index) in expressType"
							:key="nav.id"
							@tap="changeExpressType(nav.value)"
							v-if="inExpressType.includes(nav.value)"
						>
							<text class="head-nav__title" :class="{ 'head-nav__title--active':expressTypeCur === nav.value }">{{ nav.title }}</text>
							<view :class="expressClass" v-show="expressTypeCur === nav.value"></view>
						</view>
					</view>
					<view class="express-type__content content_box">
						<view class="empty-address" v-if="!addressId && expressTypeCur !== 'selfetch' && expressTypeCur !== 'autosend'" @tap="jump('/pages/user/address/list', { from: 'order' })">
							请选择收货地址
							<text class="cuIcon-right"></text>
						</view>
						<!-- 快递 -->
						<view class="express-address" v-if="expressTypeCur == 'express' && addressId">
							<view class="express-top x-bc" @tap="jump('/pages/user/address/list', { from: 'order' })">
								<view class="">
									<text class="tag" v-if="address.is_default == 1">默认</text>
									<text class="address">{{ address.province_name }}{{ address.city_name }}{{ address.area_name }}{{ address.address }}</text>
									<text class="cuIcon-right address-guide"></text>
								</view>

								<view class="address-location">
									<image class="location-img" src="/static/imgs/order/e0.png" mode=""></image>
									<text class="location-text">物流快递</text>
								</view>
							</view>
							<view class="express-content">
								<view class="phone-box1">
									<text class="name">{{ address.consignee }}</text>
									<text class="phone">{{ address.phone }}</text>
								</view>
							</view>
							<view class="express-bottom"></view>
						</view>
						<!-- 自提  -->
						<view class="express-address" v-if="expressTypeCur == 'selfetch'">
							<!-- 定位 -->
							<view class="y-f location-box" v-if="!hasLocation">
								<image class="nolocation-img" src="/static/imgs/order/location.png" mode=""></image>
								<text class="location-title">开启定位服务</text>
								<text class="location-tip">为你推荐更精准的位置信息噢~</text>
								<button class="cu-btn open-location" @tap="getLocation">去开启</button>
							</view>
							<!-- 已定位 -->
							<view class="" v-else>
								<view class="express-top x-bc" @tap="jump('/pages/order/business-address', {goodsId:currentGoodsId,lat:lat,lng:lng,storeId:storeInfo.id })">
									<view class="">
										<text class="tag1" v-if="address.is_default == 1">最近</text>
										<text class="address">{{storeInfo.name || '暂无自提点'}}</text>
										<text class="cuIcon-right address-guide"></text>
									</view>
									<view class="address-location">
										<image class="location-img" src="/static/imgs/order/e1.png" mode=""></image>
										<text class="location-text">距您{{storeInfo.distance_text ||　0}}</text>
									</view>
								</view>
								<view class="express-content">
									<view class="time-box">
										<text class="box-title">到店时间</text>
										<view class="box-content" @tap="checkExpressTime('selfetch')">
											<text class="box-text">{{ checkTime['day'][checkDayCur].title }}{{ checkTime['time'][checkTimeCur] }}</text>
											<text class="cuIcon-right box-icon"></text>
										</view>
									</view>
									<view class="box-line"></view>
									<view class="phone-box">
										<text class="box-title">预留电话</text>
										<view class="box-content x-f">
											<input class="edit-phone" :focus="getFocus"  type="number" v-model="selfPhone " />
											<text class="cuIcon-write box-icon" @tap="onInput"></text>
										</view>
									</view>
								</view>
								<view class="express-bottom">
									<label class="x-f" @tap="checkProtocol">
										<checkbox class="round protocol-checkbox orange" :class="{ checked: isProtocol }" :checked="true"></checkbox>
										<view class="protocol">
											同意并接受
											<text class="protocol-text" @tap.stop="jump('/pages/public/richtext', { id: 3 })">《到店自提服务协议》</text>
										</view>
									</label>
								</view>
							</view>

						</view>
						<!-- 商家 -->
						<view class="express-address" v-if="expressTypeCur == 'store' && addressId">
							<view class="express-top x-bc" @tap="jump('/pages/user/address/list', { from: 'order' })">
								<view class="">
									<text class="tag" v-if="address.is_default == 1">默认</text>
									<text class="address">{{ address.province_name }}{{ address.city_name }}{{ address.area_name }}{{ address.address }}</text>
									<text class="cuIcon-right address-guide"></text>
								</view>

								<view class="address-location">
									<image class="location-img" src="/static/imgs/order/e2.png" mode=""></image>
									<text class="location-text">商家配送</text>
								</view>
							</view>
							<view class="express-content">
								<view class="time-box">
									<text class="box-title">配送时间</text>
									<view class="box-content" @tap="checkExpressTime('store')">
										<text class="box-text">{{ checkTime['day'][checkDayCur].title }}{{ checkTime['time'][checkTimeCur] }}</text>
										<text class="cuIcon-right box-icon"></text>
									</view>
								</view>
								<view class="box-line"></view>
								<view class="phone-box">
									<text class="box-title">预留电话</text>
									<view class="box-content x-f">
										<input class="edit-phone" :focus="getFocus" type="number" v-model="selfPhone" />
										<text class="cuIcon-write box-icon" @tap="onInput"></text>
									</view>
								</view>
							</view>
							<view class="express-bottom"></view>
						</view>
						<!-- 自动 -->
						<view class="express-address" v-if="expressTypeCur == 'autosend'">
							<view class="express-top x-bc">
								<text class="dispatch-notice">订单支付完成后，请在订单详情页查看发货信息</text>
								<view class="address-location">
									<image class="location-img" src="/static/imgs/order/e3.png" mode=""></image>
									<text class="location-text">自动发货</text>
								</view>
							</view>
						</view>
					</view>
					<view class="express-type__bottom x-bc" v-if="expressTypeCur !== 'selfetch'">
						<button class="cu-btn cancel-btn" @tap="hideExpressType">取消</button>
						<button class="cu-btn save-btn" @tap="saveExpressType">确定</button>
					</view>
					<view class="express-type__bottom x-bc" v-if="expressTypeCur == 'selfetch' &&  lat">
						<button class="cu-btn cancel-btn" @tap="hideExpressType">取消</button>
						<button class="cu-btn save-btn" @tap="saveExpressType">确定</button>
					</view>
				</view>
			</block>
		</shopro-modal>
		<!-- 配送时间弹窗 -->
		<shopro-modal v-model="showCheckTime" :modalType="'bottom-modal'">
			<block slot="modalContent">
				<view class="checkTime-box page_box">
					<view class="checkTime-head">
						选择{{ checkType }}时间
						<text class="cuIcon-roundclosefill" @tap="showCheckTime = false"></text>
					</view>
					<view class="checkTime-content content_box">
						<view class="checkTime-content__left">
							<view
								class="left-item x-c"
								@tap="check('day', index)"
								:class="{ 'item--active': checkDayCur == index }"
								v-for="(day, index) in checkTime.day"
								:key="day.value"
							>
								{{ day.title }}
							</view>
						</view>
						<scroll-view class="checkTime-content__right scroll-box" :scroll-into-view="'c' + checkTimeId" scroll-y scroll-with-animation>
							<view
								class="right-item"
								:id="'c' + time.split(':')[0]"
								@tap="check('time', index)"
								:class="{ 'item--active': checkTimeCur == index }"
								v-for="(time, index) in checkTime.time"
								:key="time"
							>
								{{ time }}
							</view>
						</scroll-view>
					</view>
					<view class=" checkTime-foot x-c"><button class="cu-btn save-btn" @tap="showCheckTime = false">保存并使用</button></view>
				</view>
			</block>
		</shopro-modal>
	</view>
</template>

<script>
import shoproMiniCard from '@/components/shopro-mini-card/shopro-mini-card.vue';
import shPickerModal from './children/sh-picker-modal.vue';
import { mapMutations, mapActions, mapState } from 'vuex';
// #ifdef H5
import wxsdk from '@/common/wechat/sdk'
// #endif
  // #ifdef APP-PLUS
    import permision from "@/common/permission.js"
    // #endif
export default {
	components: {
		shoproMiniCard,
		shPickerModal
	},
	data() {
		return {
			showPicker: false,
			isSubOrder: false,
			pickerData: {
				title: '选择优惠券',
				couponList: []
			},
			address: {
				is_default: 0
			},
			storeList:[],//门店列表
			storeInfo:{
				id:0
			},//商家信息
			addressId: 0,
			from: '',
			orderType: '',
			grouponBuyType: 'alone',
			grouponId: 0,
			goodsList: [],//传递过来的参数
			perGoodsList:{},//确认单订单商品
			currentGoodsId:0,//当前商品id.
			currentSkuId:0,//商品的规格ID
			remark: '',
			orderPre: {},
			couponId: 0,
			couponPrice: '选择优惠券',
			showExpressType: false, //配送方式弹窗
			expressTypeCur: '',
			showCheckTime: false, //配送时间弹窗。
			inExpressType: [], //当前商品支持的配送方式。
			expressTypeMap:{
				express:'物流快递',
				selfetch:'到店/自提',
				store:'商家配送',
				autosend:'自动发货'
						
			},
			expressType: [
				//快递方式
				{
					id: 'e1',
					title: '物流快递',
					value: 'express'
				},
				{
					id: 'e2',
					title: '到店/自提',
					value: 'selfetch'
				},
				{
					id: 'e3',
					title: '商家配送',
					value: 'store'
				},
				{
					id: 'e4',
					title: '自动发货',
					value: 'autosend'
				}
			],
			isProtocol: true, //自提协议。
			selfPhone: 0, //编辑手机号
			getFocus:false,//获取焦点。
			checkType: '自提',
			checkTime:{},
			checkTimeCur: 0, //默认选中时间。
			checkTimeId: 'c1',//锚点用
			checkDayCur: 0,//默认日期
			hasLocation:false,//是否已经授权过
			lat:0,
			lng:0
			
		};
	},
	computed: {
		expressClass() {
			let cl = 'head-nav--active';
			const { expressType, expressTypeCur } = this;
			if (expressTypeCur === 0) {
				cl = 'head-nav__left--active';
			}
			if (expressTypeCur === expressType.length - 1) {
				cl = 'head-nav__right--active';
			}
			return cl;
		}
		
	},
	watch: {
		address(val, oldVal) {
			if (this.address) {
				this.addressId = this.address.id;
				this.getPre();
			}
		}
	},
	async onLoad() {
		this.goodsList = JSON.parse(this.$Route.query.goodsList);
		this.from = this.$Route.query.from;
		this.orderType = this.$Route.query.orderType;
		this.grouponBuyType = this.$Route.query.grouponBuyType;
		this.grouponId = this.$Route.query.grouponId;
		// #ifdef MP-WEIXIN
		this.getSetting()
		// #endif
		this.initDate()
		await this.init();
	},
	onShow() {},
	methods: {
		...mapActions(['getCartList']),
		init() {
			return Promise.all([this.getDefaultAddress(), this.getPre(), this.getCoupons()]);
		},
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		initDate(){
		let week = {
			0:'周日',
			1:'周一',
			2:'周二',
			3:'周三',
			4:'周四',
			5:'周五',
			6:'周六'
		}
		let now = new Date().getTime();
		let today = this.$tools.timestamp(now/1000);
		let tomorrow = this.$tools.timestamp((now+86400000)/1000);
		let aftertomorrow = this.$tools.timestamp((now+172800000)/1000);
		let week1 = week[new Date().getDay()]
		let week2 = week[new Date(now+86400000).getDay()]
		let week3 = week[new Date(now+172800000).getDay()]
			let obj = {
				day: [
					{
						title:"今天（" +week1 +"）",
						value:today
					},
					{
					title:"明天（" +week2 +"）",
						value:tomorrow
					},
					{
					title:"后天（" +week3 +"）",
						value:aftertomorrow
					}
				],
				time: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00','14:00','15:00','16:00','17:00','18:00','19:00']
			}
			this.checkTime = obj;
		},
		   
		// 开启定位
		async getLocation() {
		    // #ifdef APP-PLUS
		    let status = await this.checkPermission();
		    if (status !== 1) {
		        return;
		    }
		    // #endif
		    // #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ
		    let status = await this.getSetting();
		    if (status === 1) {
		       this.getStoreAddress()
		        return;
		    }else{
				if(status === 2){
					this.openSetting();
					return;
				}
			}
		    // #endif
		
		    this.openLocation();
		},
		openLocation(){
			let platform = uni.getStorageSync('platform');
			if(platform == 'wxOfficialAccount'){
				// #ifdef H5
				this.$wxsdk.getlocation(res => {
					this.hasLocation = true;
					this.lng =  res.longitude;
					this.lat = res.latitude;
					console.log('h5',res)
					this.getStoreAddress()
				})
				// #endif
			}else{
				uni.getLocation({
				    type: platform == 'h5' ? 'wgs84' : 'gcj02',
				    success: res => {
						this.hasLocation = true;
				        this.lng =  res.longitude;
				       this.lat = res.latitude;
					   this.getStoreAddress()
				    },
					fail:err => {
						uni.chooseLocation({
							success: res => {
								this.hasLocation = true;
								this.lng =  res.longitude;
								this.lat = res.latitude;
								this.getStoreAddress()
							},
							fail: err => {
								console.log(err);
							}
						});
					}
				});
			}
		},
		getSetting: function() {
		    return new Promise((resolve, reject) => {
		        uni.getSetting({
		            success: (res) => {
		                if (res.authSetting['scope.userLocation'] === undefined) {
							this.hasLocation = false
		                    resolve(0);
		                    return;
		                }
		                if (res.authSetting['scope.userLocation']) {
							this.hasLocation = true
		                    resolve(1);
		                } else {
		                    resolve(2);
		                }
		            }
		        });
		    });
		},
		openSetting: function() {
		    uni.openSetting({
		        success: (res) => {
		            if (res.authSetting && res.authSetting['scope.userLocation']) {
		                this.openLocation();
		            }
		        },
		        fail: (err) => {}
		    })
		},
		async checkPermission() {
		    let status = permision.isIOS ? await permision.requestIOS('location') :
		        await permision.requestAndroid('android.permission.ACCESS_FINE_LOCATION');
		
		    if (status === null || status === 1) {
				this.hasLocation = true;
		        status = 1;
		    } else if (status === 2) {
		        uni.showModal({
		            content: "系统定位已关闭",
		            confirmText: "确定",
		            showCancel: false,
		            success: function(res) {
		            }
		        })
		    } else if (status.code) {
		        uni.showModal({
		            content: status.message
		        })
		    } else {
		        uni.showModal({
		            content: "需要定位权限",
		            confirmText: "设置",
		            success: function(res) {
		                if (res.confirm) {
		                    permision.gotoAppSetting();
		                }
		            }
		        })
		    }
		
		    return status;
		},
		// 编译预留手机号
		onInput(){
			this.getFocus = true;
			this.selfPhone = '' ;
			
		},
		// 获取当前商品配送方式
		getCurGoodsExpress(goods){
			for( let item of this.goodsList){
				if(item.goods_id == goods.goods_id &&  goods.sku_price_id == item.sku_price_id  ){
					return this.expressTypeMap[item.dispatch_type];
				}
			}
		},
		// 获取商品支持的自提点。
		getStoreAddress(){
			let that = this;
			that.$api('goods.storeAddress',{
				id:that.currentGoodsId,
				latitude:that.lat,
				longitude:that.lng
			}).then(res=>{
				if(res.code == 1){
					that.storeInfo = res.data[0]
					that.storeList = res.data;
				}
			})
		},
		// 订单信息
		getPre() {
			let that = this;
			that.$api('order.pre', {
				goods_list: that.goodsList,
				from: that.from,
				address_id: that.addressId,
				coupons_id: that.couponId,
				order_type: that.orderType,
				buy_type: that.grouponBuyType,
				groupon_id: that.grouponId
			}).then(res => {
				if (res.code === 1) {
					that.orderPre = res.data;
					that.perGoodsList = res.data.new_goods_list
					that.perGoodsList.map(item =>{
						item.selType = item.dispatch_type;
						that.goodsList.forEach(goods =>{
							if(item.goods_id == goods.goods_id && item.sku_price_id == goods.sku_price_id){
								goods.dispatch_type = item.dispatch_type;
								
								if(item.store_id){
									goods.store_id = item.store_id;
								}
							}
						})
					})
				}
			});
		},
		// 提交订单
		subOrder() {
			let that = this;
			that.isSubOrder = true;
			that.$api('order.createOrder', {
				goods_list: that.goodsList,
				from: that.from,
				address_id: that.addressId,
				coupons_id: that.couponId,
				remark: that.remark,
				order_type: that.orderType,
				buy_type: that.grouponBuyType,
				groupon_id: that.grouponId
			}).then(res => {
				if (res.code === 1) {
					let orderId = res.data.id;
					let orderSn = res.data.order_sn;
					that.getCartList();
					that.isSubOrder = false;
					//  #ifdef MP-WEIXIN
					res.data.activity_type == 'groupon' ? this.$store.dispatch('getMessageIds', 'grouponResult') : this.$store.dispatch('getMessageIds', 'result');
					//  #endif
					if (res.data.status > 0) {
						that.$Router.replace({
							path: '/pages/order/payment/result',
							query: {
								orderSn: orderSn,
								type: '',
								pay: 1
							}
						});
					} else {
						uni.redirectTo({
							url: `/pages/order/payment/method?orderId=${orderId}`
						});
					}
				} else {
					that.isSubOrder = false;
				}
			});
		},
		// 初始地址
		getDefaultAddress() {
				this.$api('address.defaults').then(res => {
					if (res.code === 1) {
						if(res.data){
							this.address = res.data;
							this.selfPhone = res.data.phone
						}
					
					}
				});
		},
		// 可用优惠券
		getCoupons() {
			let that = this;
			that.$api('order.coupons', {
				goods_list: that.goodsList,
				from: that.from,
				address_id: that.addressId,
				coupons_id: that.couponId,
				order_type: that.orderType
			}).then(res => {
				if (res.code === 1) {
					that.pickerData.couponList = res.data;
				}
			});
		},
		// 选择优惠券
		selCoupon() {
			if (this.pickerData.couponList.length) {
				this.showPicker = true;
			} else {
				this.$tools.toast('暂无优惠券');
			}
		},
		changeCoupon(index) {
			if (index >= 0) {
				this.couponId = this.pickerData.couponList[index].user_coupons_id;
				this.pickerData.title = '-￥' + this.pickerData.couponList[index].amount;
				this.getPre();
			} else {
				this.couponId = 0;
				this.pickerData.title = '选择优惠券';
				this.getPre();
			}
		},
		// 显示配送方式弹窗
	  async	onSelExpressType(goods) {
			this.showExpressType = true;
			this.inExpressType = goods.detail.dispatch_type_arr;
			this.currentGoodsId = goods.goods_id;
			this.currentSkuId = goods.sku_price_id;
				this.goodsList.forEach(item => {
					if(item.goods_id == this.currentGoodsId &&  this.currentSkuId == item.sku_price_id  ){
						this.expressTypeCur = item.dispatch_type;
						this.selfPhone =  item.dispatch_phone?item.dispatch_phone:this.address && this.address.phone;
						this.checkDayCur = item.checkDayCur ? item.checkDayCur : 0 ;
						this.checkTimeCur = item.checkTimeCur ? item.checkTimeCur : 0;
						if (this.expressTypeCur == 'selfetch') {
								// #ifdef MP-WEIXIN
							 this.getSetting().then(res =>{
								 	 res == 1 && this.openLocation()
							 });
							 	// #endif
							this.storeList.forEach(store => {
								if(item.store_id == store.id ){
									this.storeInfo = store;
								}
							})
						}
					}
				})
		},
		// 关闭配送方式弹窗
		hideExpressType() {
			this.showExpressType = false;
			this.changeGoodsList()
		},
		// 保存配送方式
		saveExpressType(){
			this.showExpressType = false;
			this.changeGoodsList()
			this.getPre();
		},

	// 更改提交数据
		changeGoodsList(){
			this.goodsList.forEach(goods => {
				if(goods.goods_id == this.currentGoodsId &&  this.currentSkuId == goods.sku_price_id  ){
					goods.dispatch_type = this.expressTypeCur
					goods.dispatch_phone =  this.selfPhone
					goods.dispatch_date = this.checkTime['day'][this.checkDayCur].value + ' ' +  this.checkTime['time'][this.checkTimeCur]+':00'
					if(this.expressTypeCur == 'selfetch'){
						goods.store_id =  this.storeInfo.id ;
					}
					goods.checkDayCur = this.checkDayCur;
					goods.checkTimeCur = this.checkTimeCur;
				}
			})
		},
		// 选择快递方式
	  async	changeExpressType(cur) {
			this.expressTypeCur = cur;
			this.getFocus = false;
			// #ifdef MP-WEIXIN
			if(cur == 'selfetch' ){
				let status =  await this.getSetting();
				status == 1 && await this.openLocation()
				}
			// #endif
		},
	
		// 格式日期
		check(type, index) {
			if (type == 'time') {
				this.checkTimeCur = index;
				this.checkTimeId = this.checkTime['time'][index].split(':')[[0]];
			}
			if (type == 'day') {
				this.checkDayCur = index;
			}
		},
		// 是否同意协议
		checkProtocol() {
			this.isProtocol = !this.isProtocol;
		},
		// 选择配送时间
		checkExpressTime(type) {
			switch (type) {
				case 'store':
					this.checkType = '配送';
					break;
				case 'selfetch':
					this.checkType = '自提';
					break;
				default:
					this.checkType = '自提';
			}
			this.showCheckTime = !this.showCheckTime;
		},
		
	}
};
</script>

<style lang="scss">
.add-address-box {
	height: 100rpx;
	background: #fff;
	position: relative;
	.address-bg {
		position: absolute;
		bottom: 0;
		height: 8rpx;
		width: 100%;
	}
	.select-notice {
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 40rpx;
	}
}
.address-list {
	padding: 40rpx;
	background: #fff;

	position: relative;
	.address-bg {
		position: absolute;
		bottom: 0;
		height: 8rpx;
		width: 750rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.name,
	.phone {
		font-size: 30rpx;
		font-weight: 500;
	}

	.phone {
		margin: 0 20rpx;
	}

	.tag {
		background: rgba(233, 191, 113, 0.2);
		border-radius: 6rpx;
		padding: 0 16rpx;
		line-height: 38rpx;
		color: #a8700d;
		font-size: 22rpx;
	}

	.detail {
		.address {
			margin-top: 25rpx;
			width: 543rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			line-height: 40rpx;
		}
	}
}
// 备注
.remark-box {
		margin-top: 20rpx;
		background: #fff;
		padding: 25rpx;
		.item-input {
			flex: 1;
			text-align: end;
			font-size: 28rpx;
		}
		.input-pl {
			color: #c4c4c4;
		}
	}
// 商品卡片
.goods-list {
	background: #fff;
	position: relative;
	margin-top: 20rpx;

	/deep/ .goods-title {
		width: 460rpx !important;
	}
	.goods-card {
		padding: 30rpx;
	}
	.goods-price {
		font-size: 30rpx;
		font-weight: 500;
		width: 480rpx;
		.goods-num {
			font-size: 28rpx;
			color: #c4c4c4;
		}
	}
}

.item-list {
	height: 100rpx;
	background: #fff;
	padding: 0 25rpx;

	.item-title {
		font-size: 28rpx;
		margin-right: 20rpx;
	}

	.detail {
		font-size: 28rpx;
		color: #333;
	}

	.price {
		font-size: 26rpx;
		color: #e1212b;
		margin-right: 20rpx;
	}
	.sel-coupon {
		font-size: 26rpx;
		color: #c4c4c4;
		margin-right: 20rpx;
	}
	.cuIcon-right {
		color: #c4c4c4;
	}
}
.logistic,
.price-box,
.remark-box,
.score,
.coupon{
	border-top: 1rpx solid rgba(#dfdfdf, 0.5);
}
.border-top {
	border-top: 1rpx solid rgba(#dfdfdf, 0.5);
}

.foot_box {
	height: 100rpx;
	padding: 0 25rpx;
	justify-content: flex-end;
	background-color: #fff;

	.num {
		font-size: 26rpx;
		color: #999;
	}

	.all-money {
		margin: 0 60rpx 0 20rpx;

		.price {
			color: #e1212b;
		}
	}

	.sub-btn {
		width: 210rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		border-radius: 35rpx;
		font-size: 28rpx;
		color: #fff;
	}
}
// 弹窗之配送方式
// 配送方式
.express-type {
	width: 750rpx;
	background-color: #fff;
	border-radius: 20rpx 20rpx 0 0;
	height: 700rpx;
	overflow: visible;
	.express-type__head {
		width: 100%;
		height: 74rpx;
		background: #F8E3BD;
		@include flex($align: center);
		border-radius: 20rpx 20rpx 0 0;
		&-nav {
			width: (750rpx/4);
			@include flex($align: center, $justify: center);
			position: relative;
			height: 100%;
		}
		.head-nav--active {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 0;
			background: #fff;
			width: 100%;
			height: 80rpx;
			background-color: #fff;
			border-radius: 20rpx 20rpx 0px 0px;
			&::after {
				content: '';
				display: block;
				width: 40rpx;
				height: 80rpx;
				position: absolute;
				transform: skewX(20deg);
				background: #fff;
				border-top-right-radius: 20rpx;
				top: 0;
				right: -15rpx;
			}
			&::before {
				content: '';
				display: block;
				width: 40rpx;
				height: 80rpx;
				position: absolute;
				transform: skewX(-20deg);
				background: #fff;
				border-top-left-radius: 20rpx;
				top: 0;
				left: -15rpx;
			}
		}
		.head-nav__left--active {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 0;
			background: #fff;
			width: 100%;
			height: 74rpx;
			background-color: #fff;
			border-radius: 20rpx 20rpx 0px 0px;
			&::after {
				content: '';
				display: block;
				width: 40rpx;
				height: 74rpx;
				position: absolute;
				transform: skewX(20deg);
				background: #fff;
				border-top-right-radius: 20rpx;
				top: 0;
				right: -15rpx;
			}
		}
		.head-nav__right--active {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 0;
			background: #fff;
			width: 100%;
			height: 74rpx;
			background-color: #fff;
			border-radius: 20rpx 20rpx 0px 0px;
			&::before {
				content: '';
				display: block;
				width: 40rpx;
				height: 74rpx;
				position: absolute;
				transform: skewX(-20deg);
				background: #fff;
				border-top-left-radius: 20rpx;
				top: 0;
				left: -15rpx;
			}
		}
		.head-nav__title {
			font-size: 24rpx;
			font-weight: 500;
			color: #666;
			position: relative;
			z-index: 6;
		}
		.head-nav__title--active {
			color: #a8700d;
			font-size: 26rpx;
		}
	}
	.express-type__content {
		.empty-address {
			height: 120rpx;
			padding: 0 25rpx;
			@include flex($justify: null, $align: center, $direction: null, $warp: null, $warpAlign: null);
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
		}
		// 无定位
	.location-box{
		height: 500rpx;
		justify-content: center;
		.nolocation-img{
			width: 74rpx;
			height: 90rpx;
			margin-bottom: 40rpx;
		}
		.location-title{
			font-size:35rpx;
			font-family:PingFang SC;
			font-weight:bold;
			color:rgba(70,53,27,1);
			margin-bottom: 20rpx;
		}
		.location-tip{
			font-size:28rpx;
			font-family:PingFang SC;
			font-weight:400;
			color:rgba(153,153,153,1);
			margin-bottom: 40rpx;
		}
		.open-location{
			width:492rpx;
			height:70rpx;
			background:linear-gradient(90deg,rgba(233,180,97,1),rgba(238,204,137,1));
			box-shadow:0px 7rpx 6rpx 0px rgba(229,138,0,0.22);
			border-radius:35rpx;
			font-size:28rpx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(255,255,255,1);
		}
	}
		// 快递
		.express-address {
			position: relative;
			padding: 30rpx 25rpx;
			background: url('http://shopro.7wpp.com/imgs/address_bg.png') no-repeat;
			background-size: 430rpx 300rpx;
			background-position: top right;
			.express-top {
				margin-bottom: 20rpx;
				width: 550rpx;
				text-align: left;
				.address {
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					line-height: 40rpx;
					text-align: left;
				}
				.dispatch-notice {
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					line-height: 40rpx;
					text-align: left;
				}
				.address-location {
					@include flex($justify: center, $align: center, $direction: column, $warp: null, $warpAlign: null);
					position: absolute;
					right: 60rpx;
					top: 30rpx;
					.location-img {
						width: 80rpx;
						height: 90rpx;
					}
					.location-text {
						font-size: 18rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
					}
				}
				.tag {
					background: rgba(233, 191, 113, 0.2);
					border-radius: 6rpx;
					padding: 0 16rpx;
					line-height: 38rpx;
					color: #a8700d;
					font-size: 22rpx;
					margin-right: 20rpx;
				}
				.tag1 {
					background: rgba(53, 190, 105, 0.2);
					border-radius: 6rpx;
					padding: 0 16rpx;
					line-height: 38rpx;
					color: #1bbc50;
					font-size: 22rpx;
					margin-right: 20rpx;
				}
				.address-guide {
					position: absolute;
					right: 25rpx;
					top: 40rpx;
					color: #999999;
				}
			}

			.express-content {
				@include flex($justify: null, $align: center, $direction: null, $warp: null, $warpAlign: null);
				margin-bottom: 20rpx;
				.box-line {
					width: 1rpx;
					height: 61rpx;
					border-left: 1rpx solid rgba(238, 238, 238, 1);
					margin: 0 40rpx;
				}
				.phone-box1 {
					.name,
					.phone {
						font-size: 26rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: rgba(102, 102, 102, 1);
					}

					.phone {
						margin-left: 20rpx;
					}
				}
				.time-box,
				.phone-box {
					text-align: left;
					.box-title {
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #666;
						padding-bottom: 10rpx;
					}
					.box-text {
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #333;
					}
					.edit-phone {
						width: 160rpx;
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #333;
					}
					.box-icon {
						font-size: 28rpx;
						color: #999;
						display: inline-block;
						width: 40rpx;
						text-align: center;
						line-height: 40rpx;
					}
				}
			}
			.express-bottom {
				.protocol-checkbox {
					transform: scale(0.7);
				}
				.protocol {
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(102, 102, 102, 1);
					.protocol-text {
						color: #6487a4;
					}
				}
			}
		}
	}
	.express-type__bottom {
		height: 90rpx;
		padding: 0 30rpx;
		.cancel-btn {
			width: 335rpx;
			height: 74rpx;
			background: rgba(238, 238, 238, 1);
			border-radius: 37rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
		}
		.save-btn {
			width: 335rpx;
			height: 74rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			border-radius: 37rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
		}
	}
}
// 选择配送给时间
.checkTime-box {
	background: rgba(255, 255, 255, 1);
	border-radius: 20rpx 20rpx 0px 0px;
	height: 720rpx;
	.checkTime-head {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 100rpx;
		position: relative;
		.cuIcon-roundclosefill {
			color: #e0e0e0;
			position: absolute;
			top: 30rpx;
			right: 30rpx;
			line-height: 30rpx;
			font-size: 40rpx;
		}
	}
	.checkTime-foot {
		height: 100rpx;
		.save-btn {
			width: 690rpx;
			height: 80rpx;
			background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
			border-radius: 40rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
		}
	}
	.checkTime-content {
		@include flex($justify: between, $align: center, $direction: null, $warp: null, $warpAlign: null);
		.checkTime-content__left {
			height: 100%;
			width: 190rpx;
			background: #f5f5f5;
			.left-item {
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				height: 100rpx;
				width: 100%;
			}
		}
		.checkTime-content__right {
			flex: 1;
			height: 100%;
			overflow-y: auto;
			.right-item {
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				width: 100%;
				text-align: center;
				border-bottom: 1rpx solid rgba(#dfdfdf, 0.6);
				margin: 0 30rpx;
				line-height: 100rpx;
			}
		}
		.item--active {
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(168, 112, 13, 1) !important;
			background-color: #fff;
		}
	}
}
</style>
