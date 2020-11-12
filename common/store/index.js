import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)
import init from './modules/init.js'
import user from './modules/user.js'
import cart from './modules/cart.js'

const store = new Vuex.Store({
	modules: {
		init,
		user,
		cart
	}
})

export default store
