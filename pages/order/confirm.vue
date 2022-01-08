<!-- 确认订单 -->
<template>
	<view class="order-wrap">
		<!-- 地址栏 -->
		<view class="head_box" v-if="orderPre.need_address" @tap="jump('/pages/user/address/list', { from: 'order' })">
			<view class="add-address-box u-flex u-flex-1" v-if="!addressId">
				<view class="box-bg u-p-30 u-flex-1 u-flex u-row-between">
					<text class="select-notice">请选择收货地址</text>
					<text class="u-iconfont uicon-arrow-right" style="color: #bfbfbf;"></text>
				</view>
			</view>
			<view class="add-address-box u-p-30" v-else>
				<view class="top u-flex">
					<text class="name">{{ addressData.consignee }}</text>
					<text class="phone">{{ addressData.phone }}</text>
					<text class="tag" v-show="addressData.is_default == 1">默认</text>
				</view>
				<view class="detail u-flex u-row-between">
					<view class="address">
						{{ addressData.province_name }}{{ addressData.city_name }}{{ addressData.area_name }}{{ addressData.address }}
					</view>
					<text class="u-iconfont uicon-arrow-right" style="color: #bfbfbf;"></text>
				</view>
			</view>
		</view>

		<view class="u-m-b-10">
			<!-- 确认订单商品卡片 -->
			<view class="goods-list" v-for="g in perGoodsList" :key="g.sku_price_id">
				<view class="goods-card u-p-30">
					<shopro-mini-card :title="g.detail.title" :image="g.detail.image">
						<template #describe>
							<view class="order-sku u-ellipsis-1">
								<text class="order-num">
									{{ g.detail.current_sku_price && g.detail.current_sku_price.goods_sku_text ? g.detail.current_sku_price.goods_sku_text : '' }}
								</text>
							</view>
						</template>
						<template #cardBottom>
							<view class="goods-price u-flex  u-row-between">
								<view class="">
									<text
										v-show="orderType === 'score'">{{ g.detail.current_sku_price.score }}积分+</text>
									<text>￥{{ g.detail.current_sku_price.price }}</text>
								</view>
								<text class="goods-num">x{{ g.goods_num }}</text>
							</view>
						</template>
					</shopro-mini-card>
				</view>

				<!-- 配送方式 -->
				<view class="logistic item-list u-flex u-row-between" @tap="onSelExpressType(g)">
					<view class="item-title">配送方式</view>
					<view class="u-flex">
						<view class="detail">{{ getCurGoodsExpress(g) }}</view>
						<text class="u-iconfont uicon-arrow-right" style="color: #bfbfbf;"></text>
					</view>
				</view>
			</view>

			<block v-if="perGoodsList.length">
				<!-- 备注 -->
				<view class="remark-box u-flex item-list u-p-30">
					<view class="item-title">备注</view>
					<input class="item-input " placeholder-class="input-pl" type="text" v-model="remark"
						placeholder="建议留言前先于卖家沟通确认" />
				</view>

				<!-- 选择优惠券 -->
				<sh-select-coupon v-if="hasCoupons" :couponList="couponList" @change="selectCoupon"></sh-select-coupon>

				<!-- 积分 -->
				<view class="score item-list u-flex u-row-between" v-show="orderType === 'score'">
					<view class="u-flex"><text class="item-title">积分</text></view>
					<view class="price">-{{ orderPre.score_amount || 0 }}积分</view>
				</view>
				<!-- 金额明细 -->
				<view class=" u-flex u-row-between item-list border-top u-m-b-10">
					<view class="item-title">商品金额</view>
					<view class="u-flex">
						<text class="price">￥{{ orderPre.goods_amount || '0.00' }}</text>
					</view>
				</view>

				<!-- 活动优惠 -->
				<u-collapse
					v-if="orderPre.activity_discount_infos && orderPre.activity_discount_infos.length && Number(orderPre.activity_discount_money)"
					event-type="close" :arrow="true" :accordion="true" arrowColor="#bfbfbf"
					:head-style="{ background: '#fff', height: '100rpx' }">
					<u-collapse-item>
						<block slot="title">
							<view style="width: 680rpx;padding-right: 0;" class="u-flex u-row-between item-list">
								<view class="item-title">活动优惠</view>
								<view class="u-flex">
									<text class="price"
										style="margin-right: 0;">-￥{{ orderPre.activity_discount_money || '0.00' }}</text>
								</view>
							</view>
						</block>
						<view class="" v-for="item in orderPre.activity_discount_infos" :key="item.activity_id">
							<view class="u-flex u-row-between item-list" v-if="item.activity_type !== 'free_shipping'">
								<view class="item-title">{{ item.activity_title }}</view>
								<view class="u-flex">
									<text class="price"
										style="color: #666;">-￥{{ item.activity_discount_money || '0.00' }}</text>
								</view>
							</view>
						</view>
					</u-collapse-item>
				</u-collapse>
				<!-- 价格 -->
				<view class="price-box  u-flex u-row-between item-list">
					<view class="item-title u-flex u-col-center">
						<view class="u-m-r-10">运费</view>
						<view class="activity-title" v-if="Number(orderPre.dispatch_discount_money) > 0">活动减￥
							{{ orderPre.dispatch_discount_money }}</view>
					</view>
					<view class="u-flex">
						<text class="origin-price u-m-r-10"
							v-if="Number(orderPre.dispatch_discount_money) > 0">-￥{{ orderPre.dispatch_amount }}</text>
						<text
							class="price">￥{{ Number(orderPre.dispatch_amount) - Number(orderPre.dispatch_discount_money) || '0.00' }}</text>
					</view>
				</view>

				<!-- 发票 -->
				<view v-if="orderPre && Number(orderPre.invoice_amount)"
					class="u-flex u-row-between item-list u-p-20 border-top">
					<view class="item-title">申请发票</view>
					<view class="u-flex u-col-center" @tap="onInvoice">
						<text class="selected-invoice"
							style="font-size: 28rpx;color:#c4c4c4;">{{ selectedInvoice }}</text>
						<text class="u-iconfont uicon-arrow-right" style="color: #bfbfbf;"></text>
					</view>
				</view>
			</block>
		</view>

		<!-- 底部 -->
		<view class="foot-box-wrap">
			<view class="foot-box u-flex u-row-between safe-area-inset-bottom">
				<view class="u-flex">
					<text class="num">共{{ totalNum }}件</text>
					<view class="all-money">
						<text>合计：</text>
						<text class="price">￥{{ orderPre.total_fee || '0.00' }}</text>
					</view>
				</view>
				<button class="cu-btn sub-btn" @tap="subOrder" :disabled="isDisabled"
					hover-class="btn-hover">提交订单</button>
			</view>
		</view>

		<!-- 发票弹窗 -->
		<u-popup v-model="showInvoice" @close="showInvoice = false" safe-area-inset-bottom mode="bottom"
			:closeable="false" border-radius="20">
			<view class="invoice-modal page_box">
				<view class="invoice-head u-flex u-col-center">
					<view class="head-nav u-flex u-col-center u-row-center" @tap="changeInvoiceType('person')">
						<text class="nav-title " :class="{ 'nav-title--active': invoiceType === 'person' }">个人</text>
						<view v-show="invoiceType === 'person'" class="head-nav--active"></view>
					</view>
					<view class="head-nav u-flex u-col-center u-row-center" @tap="changeInvoiceType('company')">
						<text class="nav-title"
							:class="{ 'nav-title--active': invoiceType === 'company' }">企/事业单位</text>
						<view v-show="invoiceType === 'company'" class="head-nav--active"></view>
					</view>
				</view>
				<view class="invoice-content content_box">
					<u-form
						:labelStyle="{ 'font-size': '28rpx', 'font-weight': '600', color: '#595959', 'padding-left': '20rpx' }"
						label-position="left" :model="invoiceForm.model" :rules="invoiceForm.rules" ref="invoiceRef"
						:errorType="['toast']">
						<u-form-item class="u-p-r-20" label-width="150" label="名称:" prop="header_name">
							<u-input placeholder="请填写名称" v-model="invoiceForm.model.header_name" type="text"></u-input>
						</u-form-item>
						<u-form-item class="u-p-r-20" v-if="invoiceType === 'company'" label-width="220" label="纳税人识别号:"
							prop="tax_no">
							<u-input placeholder="请输入纳税人识别号" v-model="invoiceForm.model.tax_no" type="text"></u-input>
						</u-form-item>
						<u-form-item class="u-p-r-20" label-width="150" label="手机号:" prop="mobile">
							<u-input placeholder="请输入填写手机号" v-model="invoiceForm.model.mobile" type="number"></u-input>
						</u-form-item>
					</u-form>
				</view>
				<view class="invoice-foot">
					<view class="invoite-price u-flex u-col-center u-row-center u-m-b-40">
						<text class="price-title">可开票金额：</text>
						<text class="price-num">{{ orderPre.invoice_amount }}元</text>
					</view>
					<view class="u-flex u-col-center u-row-around u-p-b-30">
						<button class="cancel-btn u-reset-button" @tap="cancelInvoice">取消</button>
						<button class="save-btn u-reset-button" @tap="saveInvoice">确定</button>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 配送方式弹窗 -->
		<u-popup v-model="showExpressType" @close="showExpressType = false" safe-area-inset-bottom mode="bottom"
			:closeable="false" border-radius="20">
			<!-- 配送方式tab-->
			<view class="express-type page_box">
				<view class="express-type__head head-box u-flex u-col-center">
					<view class="express-type__head-nav u-flex u-col-center u-row-center"
						v-for="(nav, index) in expressType" :key="nav.id" @tap="changeExpressType(nav.value)"
						v-if="inExpressType.includes(nav.value)">
						<text class="head-nav__title"
							:class="{ 'head-nav__title--active': expressTypeCur === nav.value }">{{ nav.title }}</text>
						<view :class="expressClass" v-show="expressTypeCur === nav.value"></view>
					</view>
				</view>
				<view class="express-type__content content_box">
					<!-- 快递 -->
					<!-- 空 -->
					<view class="empty-address u-flex u-col-center"
						v-if="!addressId && expressTypeCur !== 'selfetch' && expressTypeCur !== 'autosend'"
						@tap="jump('/pages/user/address/list', { from: 'order' })">
						请选择收货地址

						<text class="u-iconfont uicon-arrow-right" style="color: #999;"></text>
					</view>
					<!-- 地址 -->
					<view class="express-address" v-if="expressTypeCur == 'express' && addressId">
						<view class="express-top  u-flex u-row-between"
							@tap="jump('/pages/user/address/list', { from: 'order' })">
							<view class="u-flex">
								<text class="tag" style="white-space: nowrap;"
									v-show="addressData.is_default == 1">默认</text>
								<text
									class="address">{{ addressData.province_name }}{{ addressData.city_name }}{{ addressData.area_name }}{{ addressData.address }}</text>
								<view class="address-guide"><text class="u-iconfont uicon-arrow-right"
										style="color: #bfbfbf"></text></view>
							</view>

							<view class="address-location u-flex-col u-col-center">
								<image class="location-img" :src="$IMG_URL + '/imgs/order/e0.png'" mode=""></image>
								<text class="location-text">物流快递</text>
							</view>
						</view>
						<view class="express-content">
							<view class="phone-box1">
								<text class="name">{{ addressData.consignee }}</text>
								<text class="phone">{{ addressData.phone }}</text>
							</view>
						</view>
					</view>
					<!-- 自提  -->
					<view class="express-address" v-if="expressTypeCur == 'selfetch'">
						<!-- 定位 -->
						<view class="u-flex-col u-col-center location-box" v-if="!lat">
							<image class="nolocation-img" :src="$IMG_URL + '/imgs/order/location.png'" mode=""></image>
							<text class="location-title">开启定位服务</text>
							<text class="location-tip">为你推荐更精准的位置信息噢~</text>
							<button class="u-reset-button open-location" @tap="getLocation">去开启</button>
						</view>
						<!-- 已定位 -->
						<view class="" v-else>
							<view class="express-top u-flex u-col-center u-row-between"
								@tap="jump('/pages/order/express/store-address', { goodsId: currentGoodsId, lat: lat, lng: lng, storeId: storeInfo ? storeInfo.id : 0 })">
								<view class="u-flex">
									<text class="tag1" v-if="addressData.is_default == 1">最近</text>
									<text class="address">{{ storeInfo ? storeInfo.name : '暂无自提点' }}</text>
									<text class="u-iconfont uicon-arrow-right" style="color: #999;"></text>
								</view>
								<view class="address-location u-flex-col u-col-center">
									<image class="location-img" :src="$IMG_URL + '/imgs/order/e1.png'" mode=""></image>
									<view class="location-text">距您{{ storeInfo ? storeInfo.distance_text : 0 }}</view>
								</view>
							</view>
							<view class="express-content u-flex u-col-cetner">
								<view class="time-box">
									<view class="box-title u-m-b-20">到店时间</view>
									<view class="box-content u-flex u-col-center" @tap="checkExpressTime('selfetch')">
										<text
											class="box-text">{{ checkTime['day'][checkDayCur].title }}{{ checkTime['time'][checkTimeCur] }}</text>
										<text class="u-iconfont uicon-arrow-right" style="color: #999;"></text>
									</view>
								</view>
								<view class="box-line"></view>
								<view class="phone-box">
									<view class="box-title u-m-b-20">预留电话</view>
									<view class="box-content u-flex" style="width: 340rpx;">
										<u-input placeholder="请输入预留电话" placeholderStyle="font-size:24rpx" border
											height="40" :focus="getFocus" v-model="selfPhone" type="number"></u-input>
									</view>
								</view>
							</view>
							<view class="express-bottom" @tap="checkProtocol">
								<u-checkbox active-color="#f0c785" :value="isProtocol">
									<view class="protocol">
										同意并接受
										<text class="protocol-text"
											@tap.stop="jump('/pages/public/richtext', { id: initStore.selfetch_protocol })">《到店自提服务协议》</text>
									</view>
								</u-checkbox>
							</view>
						</view>
					</view>
					<!-- 商家配送 -->
					<view class="express-address" v-if="expressTypeCur == 'store' && addressId">
						<view class="express-top u-flex u-row-between"
							@tap="jump('/pages/user/address/list', { from: 'order' })">
							<view class="">
								<text class="tag" v-if="addressData.is_default == 1">默认</text>
								<text
									class="address">{{ addressData.province_name }}{{ addressData.city_name }}{{ addressData.area_name }}{{ addressData.address }}</text>
								<text class="address-guide u-iconfont uicon-arrow-right" style="color: #999;"></text>
							</view>

							<view class="address-location u-flex-col u-col-center">
								<image class="location-img" :src="$IMG_URL + '/imgs/order/e2.png'" mode=""></image>
								<text class="location-text">商家配送</text>
							</view>
						</view>
						<view class="express-content u-flex">
							<view class="time-box">
								<view class="box-title u-m-b-20">配送时间</view>
								<view class="box-content u-flex" @tap="checkExpressTime('store')">
									<text
										class="box-text">{{ checkTime['day'][checkDayCur].title }}{{ checkTime['time'][checkTimeCur] }}</text>
									<text class="u-iconfont uicon-arrow-right" style="color: #999"></text>
								</view>
							</view>
							<view class="box-line"></view>
							<view class="phone-box">
								<view class="box-title u-m-b-20">预留电话</view>
								<view class="box-content u-flex">
									<view class="box-content u-flex" style="width: 340rpx;">
										<u-input placeholder="请输入预留电话" placeholderStyle="font-size:24rpx" border
											height="40" :focus="getFocus" v-model="selfPhone" type="number"></u-input>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 自动发货 -->
					<view class="express-address" v-if="expressTypeCur == 'autosend'">
						<view class="express-top u-flex u-row-between">
							<text class="dispatch-notice">订单支付完成后，请在订单详情页查看发货信息</text>
							<view class="address-location u-flex-col u-col-center">
								<image class="location-img" :src="$IMG_URL + '/imgs/order/e3.png'" mode=""></image>
								<text class="location-text">自动发货</text>
							</view>
						</view>
					</view>
				</view>
				<view class="express-type__bottom u-flex u-row-between u-p-b-20"
					v-show="expressTypeCur !== 'selfetch' || (expressTypeCur == 'selfetch' && lat)">
					<button class="u-reset-button cancel-btn" @tap="hideExpressType">取消</button>
					<button class="u-reset-button save-btn" @tap="saveExpressType">确定</button>
				</view>
			</view>
		</u-popup>

		<!-- 配送时间弹窗 -->
		<u-popup v-model="showCheckTime" mode="bottom" safe-area-inset-bottom :closeable="true"
			close-icon-pos="top-right" border-radius="20">
			<view class="checkTime-box page_box">
				<view class="checkTime-head">选择{{ checkType }}时间</view>
				<view class="checkTime-content content_box u-flex">
					<view class="checkTime-content__left">
						<view class="left-item u-flex u-row-center u-col-center" @tap="check('day', index)"
							:class="{ 'item--active': checkDayCur == index }" v-for="(day, index) in checkTime.day"
							:key="day.value">
							{{ day.title }}
						</view>
					</view>
					<scroll-view class="checkTime-content__right scroll-box" :scroll-into-view="'c' + checkTimeId"
						scroll-y scroll-with-animation>
						<view class="right-item" :id="'c' + time.split(':')[0]" @tap="check('time', index)"
							:class="{ 'item--active': checkTimeCur == index }" v-for="(time, index) in checkTime.time"
							:key="time">
							{{ time }}
						</view>
					</scroll-view>
				</view>
				<view class=" checkTime-foot u-flex u-row-center u-col-center"><button class="u-reset-button save-btn"
						@tap="showCheckTime = false">保存并使用</button></view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import shSelectCoupon from './components/sh-select-coupon.vue';
	import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
	import Auth from '@/shopro/permission/index.js';
	export default {
		components: {
			shSelectCoupon
		},
		data() {
			return {
				platform: this.$platform.get(),
				totalNum: 0,
				couponList: [], //优惠券列表
				addressData: {}, //收货地址
				addressId: 0, //收货地址ID
				customStyle: {
					//自定义按钮样式
					width: '210rpx',
					lineHeight: '70rpx',
					background: 'linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1))',
					boxShadow: ' 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22)',
					borderRadius: '100rpx',
					fontSize: '28rpx',
					border: 'none',
					color: '#fff',
					margin: '0'
				},
				isDisabled: false, //提交
				showCheckTime: false, //配送时间弹窗。
				checkTime: {}, //配送时间数据
				showExpressType: false, //配送方式弹窗
				expressTypeMap: {
					express: '物流快递',
					selfetch: '到店/自提',
					store: '商家配送',
					autosend: '自动发货'
				},
				expressType: [
					//配送方式
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
				storeList: [], //门店列表
				storeInfo: {
					id: 0,
					name: '',
					dispatch_text: ''
				}, //自提点商家信息
				from: '',
				orderType: '',
				grouponBuyType: 'alone',
				grouponId: 0,
				goodsList: [], //传递过来的参数
				perGoodsList: {}, //确认单订单商品
				currentGoodsId: 0, //当前商品id.
				currentSkuId: 0, //商品的规格ID
				remark: '',
				orderPre: {},
				couponId: 0,
				couponPrice: '选择优惠券',
				expressTypeCur: '',
				inExpressType: [], //当前商品支持的配送方式。

				isProtocol: true, //自提协议。
				selfPhone: '', //编辑手机号
				getFocus: false, //获取焦点。
				checkType: '自提',
				checkTimeCur: 0, //默认选中时间。
				checkTimeId: 'c1', //锚点用
				checkDayCur: 0, //默认日期
				lat: 0, //地理位置
				lng: 0,

				showInvoice: false, //申请发票
				invoiceType: 'person',
				selectedInvoice: '不开具发票',
				invoiceForm: {
					model: {
						header_name: '',
						mobile: '',
						tax_no: '',
						type: 'person'
					},
					rules: {
						mobile: [{
								required: true,
								message: '请输入手机号',
								trigger: ['change', 'blur']
							},
							{
								validator: (rule, value, callback) => {
									return this.$u.test.mobile(value);
								},
								message: '手机号码不正确',
								trigger: ['change', 'blur']
							}
						],
						header_name: [{
							required: true,
							message: '请填写名称',
							trigger: ['change', 'blur']
						}]
					}
				}
			};
		},
		computed: {
			...mapGetters(['initStore']),
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
			},
			// 是否可以使用优惠券
			hasCoupons() {
				if (this.couponList.length && !this.orderPre.activity_type) {
					return true;
				}
				return Boolean(
					this.couponList.length &&
					this.orderPre.activity_type &&
					this.orderPre.activity_type.indexOf('groupon') === -1 &&
					this.orderPre.activity_type.indexOf('seckill') === -1 &&
					this.orderType !== 'score'
				);
			}
		},
		onShow() {
			// 监听选择自提点
			uni.$once('SELECT_STORE', res => {
				this.storeInfo = JSON.parse(res.storeInfo);
			});
			// 监听地址
			uni.$on('SELECT_ADDRESS', res => {
				if (res.addressData) {
					this.addressData = JSON.parse(res.addressData);
					this.addressId = this.addressData.id;
				} else {
					this.addressId = 0;
				}
				this.getPre();
				res.addressData && uni.$off('SELECT_ADDRESS');
			});
		},
		async onLoad() {
			this.goodsList = this.$Route.query.goodsList;
			this.from = this.$Route.query.from;
			this.orderType = this.$Route.query.orderType;
			this.grouponBuyType = this.$Route.query.grouponBuyType;
			this.grouponId = this.$Route.query.grouponId;
			await this.init();
		},
		methods: {
			...mapActions(['getCartList']),
			// 切换发票类型
			changeInvoiceType(type) {
				this.invoiceType = type;
				this.invoiceForm.model.type = type;
			},
			// 点击开发票
			onInvoice() {
				this.showInvoice = !this.showInvoice;
				this.$nextTick(() => {
					if (this.showInvoice) {
						this.invoiceForm.model.type = 'person';
						this.$refs.invoiceRef.setRules(this.invoiceForm.rules);
					}
				});
			},
			// 发票确认取消
			cancelInvoice() {
				this.selectedInvoice = '不开具发票';
				Object.keys(this.invoiceForm.model).map(key => (this.invoiceForm.model[key] = ''));
				this.showInvoice = false;
			},
			saveInvoice() {
				this.$refs.invoiceRef.validate(valid => {
					if (valid) {
						if (this.invoiceType === 'company' && !this.invoiceForm.model.tax_no) {
							this.$u.toast('请输入纳税人识别号');
						}
						this.selectedInvoice = this.invoiceForm.model.header_name;
						this.showInvoice = false;
					}
				});
			},

			// 初始化
			init() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				return Promise.all([this.getDefaultAddress(), this.initDate(), this.getCoupons()]).then(() => {
					uni.hideLoading();
				});
			},
			jump(path, parmas) {
				this.$Router.push({
					path: path,
					query: parmas
				});
			},

			// 格式化选择时间
			initDate() {
				let week = {
					0: '周日',
					1: '周一',
					2: '周二',
					3: '周三',
					4: '周四',
					5: '周五',
					6: '周六'
				};
				let now = new Date().getTime();
				let today = this.$u.timeFormat(now);
				let tomorrow = this.$u.timeFormat(now + 86400000);
				let aftertomorrow = this.$u.timeFormat(now + 172800000);
				let week1 = week[new Date().getDay()];
				let week2 = week[new Date(now + 86400000).getDay()];
				let week3 = week[new Date(now + 172800000).getDay()];
				let obj = {
					day: [{
							title: '今天（' + week1 + '）',
							value: today
						},
						{
							title: '明天（' + week2 + '）',
							value: tomorrow
						},
						{
							title: '后天（' + week3 + '）',
							value: aftertomorrow
						}
					],
					time: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
						'18:00', '19:00'
					]
				};
				this.checkTime = obj;
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

			// 获取当前商品配送方式
			getCurGoodsExpress(goods) {
				for (let item of this.goodsList) {
					if (item.goods_id == goods.goods_id && goods.sku_price_id == item.sku_price_id) {
						return this.expressTypeMap[item.dispatch_type];
					}
				}
			},

			// 获取位置
			async getLocation() {
				let authState = await new Auth('userLocation').check();
				// #ifdef MP ||　APP-VUE
				authState &&
					uni.getLocation({
						type: 'gcj02',
						success: res => {
							this.lng = res.longitude;
							this.lat = res.latitude;
							this.getStoreAddress();
						},
						fail: err => {
							console.log('确认订单自提位置：', err);
						}
					});
				// #endif
				// #ifdef H5
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						this.lng = res.longitude;
						this.lat = res.latitude;
						this.getStoreAddress();
					}
				});
				// #endif
			},
			// 获取商品支持的自提点。
			getStoreAddress() {
				let that = this;
				that.$http('goods.storeAddress', {
					id: that.currentGoodsId,
					latitude: that.lat,
					longitude: that.lng
				}).then(res => {
					if (res.code == 1) {
						that.storeInfo = res.data.data[0];
						that.storeList = res.data.data;
					}
				});
			},
			// 订单信息
			getPre() {
				let that = this;
				that.$http('order.pre', {
					goods_list: that.goodsList,
					from: that.from,
					address_id: that.addressId,
					coupons_id: that.couponId,
					order_type: that.orderType,
					buy_type: that.grouponBuyType,
					groupon_id: that.grouponId
				}).then(res => {
					if (res.data) {
						that.orderPre = res.data;
						that.perGoodsList = res.data.new_goods_list;
						that.totalNum = 0;
						that.perGoodsList.map(item => {
							item.selType = item.dispatch_type;
							that.totalNum += item.goods_num;
							that.goodsList.forEach(goods => {
								if (item.goods_id == goods.goods_id && item.sku_price_id == goods
									.sku_price_id) {
									goods.dispatch_type = item.dispatch_type;

									if (item.store_id) {
										goods.store_id = item.store_id;
									}
								}
							});
						});
					}
				});
			},
			// 提交订单
			subOrder() {
				let that = this;
				that.isDisabled = true;
				that.$http(
					'order.createOrder', {
						goods_list: that.goodsList,
						from: that.from,
						address_id: that.addressId,
						coupons_id: that.couponId,
						remark: that.remark,
						order_type: that.orderType,
						buy_type: that.grouponBuyType,
						groupon_id: that.grouponId,
						invoice: Number(that.orderPre.invoice_amount) && that.selectedInvoice !== '不开具发票' ? { ...that
							.invoiceForm.model, amount: that.orderPre.invoice_amount } : {}
					},
					'提交中...'
				).then(res => {
					that.isDisabled = false;
					if (res.code === 1) {
						that.getCartList();
						that.$Router.replace({
							path: res.data.status > 0 ? `/pages/order/payment/result` :
								`/pages/order/payment/method`,
							query: {
								orderId: res.data.id,
								payState: res.data.status > 0 ? 'success' : 'paying',
								orderType: 'goods'
							}
						});
					}
				});
			},

			// 初始地址
			getDefaultAddress() {
				this.$http('address.defaults', {}, '', false).then(res => {
					if (res.code === 1 && res.data) {
						this.addressData = res.data;
						this.addressId = res.data.id;
					}
					this.getPre();
				});
			},

			// 可用优惠券
			getCoupons() {
				let that = this;
				that.$http('order.coupons', {
					goods_list: that.goodsList,
					from: that.from,
					address_id: that.addressId,
					coupons_id: that.couponId,
					order_type: that.orderType
				}).then(res => {
					if (res.code === 1) {
						that.couponList = res.data;
					}
				});
			},

			// 选择优惠券
			selectCoupon(index) {
				this.couponId = index >= 0 ? this.couponList[index].user_coupons_id : 0;
				this.getPre();
			},

			// 显示配送方式弹窗
			async onSelExpressType(goods) {
				this.showExpressType = true;
				this.inExpressType = goods.detail.dispatch_type_arr;
				this.currentGoodsId = goods.goods_id;
				this.currentSkuId = goods.sku_price_id;
				this.goodsList.forEach(item => {
					if (item.goods_id == this.currentGoodsId && this.currentSkuId == item.sku_price_id) {
						this.expressTypeCur = item.dispatch_type;
						this.selfPhone = item.dispatch_phone ? item.dispatch_phone : this.addressData && this
							.addressData.phone;
						this.checkDayCur = item.checkDayCur ? item.checkDayCur : 0;
						this.checkTimeCur = item.checkTimeCur ? item.checkTimeCur : 0;
						if (this.expressTypeCur == 'selfetch') {
							!this.lat && this.getLocation();
							this.storeList.forEach(store => {
								if (item.store_id == store.id) {
									this.storeInfo = store;
								}
							});
							this.selfPhone = item.dispatch_phone ? item.dispatch_phone : this.addressData &&
								this.addressData.phone;
						}
					}
				});
			},
			// 关闭配送方式弹窗
			hideExpressType() {
				this.showExpressType = false;
				this.changeGoodsList();
			},
			// 保存配送方式
			saveExpressType() {
				if (this.expressTypeCur === 'selfetch') {
					if (!this.storeInfo) {
						this.$u.toast('暂无自提点，请选择其他配送方式');
						return false;
					}
					if (!this.isProtocol) {
						this.$u.toast('请先勾选门店协议');
						return false;
					}
				}

				this.showExpressType = false;
				this.changeGoodsList();
				this.getPre();
			},

			// 更改提交数据
			changeGoodsList() {
				this.goodsList.forEach(goods => {
					if (goods.goods_id == this.currentGoodsId && this.currentSkuId == goods.sku_price_id) {
						goods.dispatch_type = this.expressTypeCur;
						goods.dispatch_phone = this.selfPhone;
						goods.dispatch_date = this.checkTime['day'][this.checkDayCur].value + ' ' + this.checkTime[
							'time'][this.checkTimeCur] + ':00';
						if (this.expressTypeCur == 'selfetch') {
							if (!this.storeInfo) {
								this.$u.toast('暂无自提点，请选择其他配送方式');
								return false;
							}
							goods.store_id = this.storeInfo.id;
						}
						goods.checkDayCur = this.checkDayCur;
						goods.checkTimeCur = this.checkTimeCur;
					}
				});
			},

			// 选择快递方式
			changeExpressType(cur) {
				this.expressTypeCur = cur;
				this.getFocus = false;
				cur === 'selfetch' && !this.lat && this.getLocation();
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
			}
		}
	};
</script>

<style lang="scss" scoped>
	// 发票弹窗
	.invoice-modal {
		width: 750rpx;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
		height: 700rpx;
		overflow: visible;
	
	.invoice-foot {
			.price-title {
				font-size: 28rpx;
				font-weight: 400;
				color: #333333;
			}

			.price-num {
				font-size: 28rpx;
				font-weight: 500;
				color: #eab662;
			}

			.cancel-btn {
				width: 335rpx;
				line-height: 74rpx;
				background: rgba(238, 238, 238, 1);
				border-radius: 37rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
			}

			.save-btn {
				width: 335rpx;
				line-height: 74rpx;
				background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
				border-radius: 37rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
			}
		}

		.invoice-head {
			width: 100%;
			height: 80rpx;
			background: #f8e3bd;
			border-radius: 20rpx 20rpx 0 0;

			.head-nav {
				width: (750rpx/2);
				position: relative;
				height: 100%;
			}

			.nav-title {
				font-size: 24rpx;
				font-weight: 500;
				color: #666;
				position: relative;
				z-index: 6;
			}

			.nav-title--active {
				color: #a8700d;
				font-size: 26rpx;
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
		}
	}

	// 收货地址栏
	.head_box {
		background-color: #fff;
	}

	.add-address-box {
		min-height: 100rpx;
		background: url($IMG_URL+'/imgs/order/order_address_line.png') no-repeat;
		background-size: 100% auto;
		background-position: bottom center;

		.select-notice {
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			line-height: 40rpx;
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
		margin-top: 20rpx;

		.goods-card {
			min-height: 200rpx;

			.goods-price {
				font-size: 30rpx;
				font-weight: 500;
				width: 480rpx;
				color: #333333;

				.goods-num {
					font-size: 28rpx;
					color: #c4c4c4;
				}
			}

			.order-sku {
				font-size: 24rpx;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
				width: 440rpx;
				margin-bottom: 20rpx;

				.order-num {
					margin-right: 10rpx;
				}
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

			.activity-title {
				font-size: 26rpx;
				color: #999;
			}
		}

		.detail {
			font-size: 28rpx;
			color: #333;
		}

		.origin-price {
			font-size: 26rpx;
			color: #666;
			text-decoration: line-through;
		}

		.price {
			font-size: 26rpx;
			color: #ff0000;
			margin-right: 40rpx;
		}

		.sel-coupon {
			font-size: 26rpx;
			color: #c4c4c4;
			margin-right: 20rpx;
		}
	}

	.logistic,
	.price-box,
	.remark-box,
	.score,
	.coupon {
		border-top: 1rpx solid rgba(#dfdfdf, 0.5);
	}

	.border-top {
		border-top: 1rpx solid rgba(#dfdfdf, 0.5);
	}

	.foot-box-wrap {
		height: calc(100rpx + env(safe-area-inset-bottom) / 2);
		padding-bottom: calc(env(safe-area-inset-bottom) / 2);
		position: relative;
		width: 100%;
		z-index: 70;
	}

	.foot-box {
		position: fixed;
		display: flex;
		align-items: center;
		width: 100%;
		height: calc(100rpx + env(safe-area-inset-bottom) / 2);
		border-top: 1rpx solid #eeeeee;
		background-color: #fff;
		z-index: 998;
		bottom: 0;
		padding-bottom: calc(env(safe-area-inset-bottom) / 2);
		padding: 0 30rpx;
	
	.btn-hover {
			color: #fff;
		}

		.num {
			font-size: 26rpx;
			color: #999;
		}

		.all-money {
			margin: 0 60rpx 0 20rpx;

			.price {
				color: #ff0000;
			}
		}

		.sub-btn {
			width: 210rpx;
			line-height: 70rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
			border-radius: 50rpx;
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
			height: 80rpx;
			background: #f8e3bd;
			border-radius: 20rpx 20rpx 0 0;

			&-nav {
				width: (750rpx/4);
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
				font-size: 28rpx;

				font-weight: 400;
				color: rgba(153, 153, 153, 1);
			}

			// 无定位
			.location-box {
				height: 500rpx;
				justify-content: center;

				.nolocation-img {
					width: 74rpx;
					height: 90rpx;
					margin-bottom: 40rpx;
				}

				.location-title {
					font-size: 35rpx;

					font-weight: bold;
					color: rgba(70, 53, 27, 1);
					margin-bottom: 20rpx;
				}

				.location-tip {
					font-size: 28rpx;

					font-weight: 400;
					color: rgba(153, 153, 153, 1);
					margin-bottom: 40rpx;
				}

				.open-location {
					width: 492rpx;
					line-height: 70rpx;
					background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
					box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
					border-radius: 35rpx;
					font-size: 28rpx;

					font-weight: 500;
					color: rgba(255, 255, 255, 1);
				}
			}

			// 快递
			.express-address {
				position: relative;
				padding: 30rpx 25rpx;
				background: url($IMG_URL+'/imgs/order/address_bg.png') no-repeat;
				background-size: 430rpx 300rpx;
				background-position: top right;

				.express-top {
					margin-bottom: 20rpx;
					width: 550rpx;
					text-align: left;

					.address {
						font-size: 28rpx;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
						line-height: 40rpx;
						text-align: left;
					}

					.dispatch-notice {
						font-size: 28rpx;

						font-weight: 500;
						color: rgba(51, 51, 51, 1);
						line-height: 40rpx;
						text-align: left;
					}

					.address-location {
						position: absolute;
						right: 60rpx;
						top: 30rpx;

						.location-img {
							width: 80rpx;
							height: 90rpx;
						}

						.location-text {
							font-size: 18rpx;

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
						min-height: 120rpx;

						.box-title {
							font-size: 24rpx;

							font-weight: 400;
							color: #666;
							padding-bottom: 10rpx;
						}

						.box-text {
							font-size: 24rpx;

							font-weight: 500;
							color: #333;
						}

						.edit-phone {
							width: 160rpx;
							font-size: 24rpx;

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
					.protocol {
						font-size: 24rpx;

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
				line-height: 74rpx;
				background: rgba(238, 238, 238, 1);
				border-radius: 37rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
			}

			.save-btn {
				width: 335rpx;
				line-height: 74rpx;
				background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
				border-radius: 37rpx;
				font-size: 28rpx;
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
		text-align: center;

		.checkTime-head {
			font-size: 32rpx;

			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			line-height: 100rpx;
			position: relative;
		}

		.checkTime-foot {
			height: 100rpx;

			.save-btn {
				width: 690rpx;
				line-height: 80rpx;
				background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
				border-radius: 40rpx;
				font-size: 30rpx;

				font-weight: 500;
				color: rgba(255, 255, 255, 1);
			}
		}

		.checkTime-content {
			.checkTime-content__left {
				height: 100%;
				width: 190rpx;
				background: #f5f5f5;

				.left-item {
					font-size: 26rpx;

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

				font-weight: 500;
				color: rgba(168, 112, 13, 1) !important;
				background-color: #fff;
			}
		}
	}
</style>
