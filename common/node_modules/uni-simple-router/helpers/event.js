const Dep = function() {
	this.Evens = Object.create(null);
}
class Event {
	constructor({
		dep = new Dep()
	} = {}) {
		if (dep.constructor === Object && Object.keys(dep).length === 0) {
			dep.Evens = Object.create(null);
		}
		this.Dep = dep;
	}
	/** 绑定事件 可以重复绑定
	 * @param {Object} handler		需要绑定的事件名称
	 * @param {Object} fn	事件处理函数
	 */
	on(handler, fn, oneEv = false) {
		if (typeof fn != 'function') {
			return console.error(`The registered custom event type must be a function \r\n ${fn.toString()}`);
		}
		if (this instanceof Event) {
			let typeArr = this.Dep.Evens[handler];
			if (!typeArr) {
				this.Dep.Evens[handler] = [];
			}
			const eventArr = this.Dep.Evens[handler]
			if (oneEv) {
				eventArr.splice(0, eventArr.length);
			}
			eventArr.push(fn);
		} else {
			console.error(`You can't manually modify the 'this' pointer is '${handler}' Event type \r\n ${fn.toString()}`)
		}
	}
	/** 绑定事件 仅会绑定一次事件，如果发现有重名的事件则全部移除
	 * @param {Object} handler		需要绑定的事件名称
	 * @param {Object} fn	事件处理函数
	 */
	one(handler, fn) {
		if (this instanceof Event) {
			this.on(handler, fn, true);
		} else {
			console.error(`You can't manually modify the 'this' pointer is '${handler}' Event type \r\n ${fn.toString()}`)
		}
	}
	/** 解除已经绑定事件 
	 * @param {Object} handler		指定需要解除的事件类型	不传则清楚全部
	 * @param {Object} callback		解除事件后的回调函数
	 */
	off(handler, callback) {
		if (this instanceof Event) {
			let callInfo = {
				0: {
					success: false,
					msg: `'${handler}' event is not defined`
				},
				1: {
					success: true,
					msg: 'Successful ok'
				}
			};
			if (!handler) {
				this.Dep.Evens = {};
				return true;
			}
			let typeArr = this.Dep.Evens[handler];
			if (typeArr) {
				delete this.Dep.Evens[handler];
				return callback.call(this, callInfo[1]);
			}
			return callback.call(this, callInfo[0]);
		} else {
			console.error(`You can't manually modify the 'this' pointer`)
		}
	}
	/**	触发指定事件
	 * @param {Object} type		需要触发的事件
	 * @param {Object} options	为此事件传递的参数
	 */
	notify(type, options) {
		if (this instanceof Event) {
			let eventArr = this.Dep.Evens[type];
			if (!eventArr || eventArr.length == 0) {
				return console.error(`The specified event does not exist is '${type}'`)
			}
			let i = eventArr.length - 1;
			while (true) {
				eventArr[i].call(this, options);
				i--
				if (i < 0) {
					break
				}
			}
		} else {
			console.error(`You can't manually modify the 'this' pointer`)
		}
	}
}
export default Event;
