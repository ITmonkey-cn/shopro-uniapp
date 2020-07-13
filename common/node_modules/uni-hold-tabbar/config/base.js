
export const eventBind={
	dbClick:'doubleclick',
	click:'click',
	touchstart:'touchstart',
	touchmove:'touchmove',
	touchend:'touchend'
}

export const BaseConfig={
	registerPageHook:false,
	id:'HoldTabbar',
	style:{
		width: '100%',
		height: '50px',
		opacity: 0,
		bottom: '0'
	},
	event:{},
	beforeMount:()=>{},
	mounted:()=>{}
}