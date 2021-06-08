import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import shopro from './modules/shopro.js'
import user from './modules/user.js'
import cart from './modules/cart.js'

const store = new Vuex.Store({
	modules: {
		shopro,
		user,
		cart
	}
})

export default store
