import {init} from './init/createdTab'
import {mergeConfig,assertTabbar} from './util/util'

class HoldTabbar {
	constructor(config = {}) {
		const isNext=assertTabbar();
		if(!isNext){
			return false
		}
		config = mergeConfig(config);
		this.tabbarView=init(config,isNext);
	}
	get getTabbarView(){
		return this.tabbarView;
	}
	get isVisible(){
		return this.tabbarView.isVisible();
	}
	hideHoldTab(){
		this.tabbarView.hide();
	}
	showHoldTab(){
		this.tabbarView.show();
	}
}

export default HoldTabbar;
