import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)
import init from './modules/init.js'
import user from './modules/user.js'
import cart from './modules/cart.js'
import theme from './modules/theme.js'

const modules = {
	init,
	user,
	cart,
	theme
}
const store = new Vuex.Store({
	modules
})

export default store
