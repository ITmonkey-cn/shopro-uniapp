/**
 * uview 工具入口
 * @description 精简掉了部分用不到的，如有需要，根据项目情况添加，或者直接覆盖
 */

// 引入全局mixin
import mixin from './libs/mixin/mixin.js'
// 时间格式化
import timeFormat from './libs/function/timeFormat.js'
// 时间戳格式化,返回多久之前
import timeFrom from './libs/function/timeFrom.js'
// 生成全局唯一guid字符串
import guid from './libs/function/guid.js'
// 对象和数组的深度克隆
import deepClone from './libs/function/deepClone.js'
// 添加单位
import addUnit from './libs/function/addUnit.js'
// 规则检验
import test from './libs/function/test.js'
// 获取整个父组件
import $parent from './libs/function/$parent.js'
// 去除空格
import trim from './libs/function/trim.js'
// toast提示，对uni.showToast的封装
import toast from './libs/function/toast.js'
// 获取sys()和os()工具方法
// 获取设备信息，挂载到$u的sys()(system的缩写)属性中，
// 同时把安卓和ios平台的名称"ios"和"android"挂到$u.os()中，方便取用
import {
	sys,
	os
} from './libs/function/sys.js'
// 防抖方法
import debounce from './libs/function/debounce.js'
// 节流方法
import throttle from './libs/function/throttle.js'
// 配置信息
import config from './libs/config/config.js'
// 各个需要fixed的地方的z-index配置文件
import zIndex from './libs/config/zIndex.js'

const $u = {
	timeFormat,
	timeFrom,
	guid,
	sys,
	os,
	test,
	deepClone,
	$parent,
	addUnit,
	trim,
	toast,
	config, // uView配置信息相关，比如版本号
	zIndex,
	debounce,
	throttle,
}

// $u挂载到uni对象上
uni.$u = $u

const install = Vue => {
	Vue.mixin(mixin)
	// 时间格式化，timeFormat
	Vue.filter('timeFormat', (timestamp, format) => {
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
