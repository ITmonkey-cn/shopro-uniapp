import {
	Global
} from './config.js'

const isLog = function (type, errText) {
	const dev = Global.Router.CONFIG.debugger;
	const isObject = dev.toString() === '[object Object]';
	if (dev === false) {
		return false
	} else if (dev === false) {
		return false
	} else if (isObject) {
		if (dev[type] === false) {
			return false
		}
	}
	console[type](errText)
}
export const err = function (err) {
	isLog('error', err);
}

export const warn = function (err) {
	isLog('warn', err);
}

export const log = function (err) {
	isLog('log', err);
}
export const warnLock=function(err){
	console.warn(err)
}