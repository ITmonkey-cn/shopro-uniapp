// 引入全局mixin
import mixin from './libs/mixin/mixin.js'
// 引入关于是否mixin集成小程序分享的配置

// 时间格式化
import timeFormat from './libs/function/timeFormat.js'
// 时间戳格式化,返回多久之前
import timeFrom from './libs/function/timeFrom.js'
// 生成全局唯一guid字符串
import guid from './libs/function/guid.js'
// 根据type获取图标名称
import type2icon from './libs/function/type2icon.js'
// 对象和数组的深度克隆
import deepClone from './libs/function/deepClone.js'
// 对象深度拷贝
import deepMerge from './libs/function/deepMerge.js'
// 添加单位
import addUnit from './libs/function/addUnit.js'
// 配置信息
import config from './libs/config/config.js'
// 各个需要fixed的地方的z-index配置文件
import zIndex from './libs/config/zIndex.js'
// 规则检验
import test from './libs/function/test.js'
// 去除空格
import trim from './libs/function/trim.js'
// toast提示，对uni.showToast的封装
import toast from './libs/function/toast.js'
// 获取父组件参数
import getParent from './libs/function/getParent.js'
// 获取整个父组件
import $parent from './libs/function/$parent.js'
// 防抖方法
import debounce from './libs/function/debounce.js'
// 节流方法
import throttle from './libs/function/throttle.js'


const $u = {
	timeFormat: timeFormat,
	date: timeFormat, // 另名date
	timeFrom,
	guid,
	config,
	zIndex,
	type2icon,
	test,
	deepClone,
	deepMerge,
	getParent,
	$parent,
	addUnit,
	trim,
	type: ['primary', 'success', 'error', 'warning', 'info'],
	toast,
	debounce,
	throttle,
}

const install = Vue => {
	Vue.mixin(mixin)
	// 时间格式化，同时两个名称，date和timeFormat
	Vue.filter('timeFormat', (timestamp, format) => {
		return timeFormat(timestamp, format)
	})
	Vue.filter('date', (timestamp, format) => {
		return timeFormat(timestamp, format)
	})
	// 将多久以前的方法，注入到全局过滤器
	Vue.filter('timeFrom', (timestamp, format) => {
		return timeFrom(timestamp, format)
	})
	Vue.prototype.$u = $u
}

export default {
	install
}
