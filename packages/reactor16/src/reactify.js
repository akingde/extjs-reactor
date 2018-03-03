import { l } from './index'
import { ExtJSComponent } from './ExtJSComponent';

// global reactor settings
let settings = {};
/**
 * Store reactor settings from launch
 * @param {Object} reactorSettings 
 */
export function configure(reactorSettings) {
    settings = reactorSettings;
}


function getTheClass(className, isRoot) {
	return class extends ExtJSComponent {
		static get source() {return 'ExtJS'}
		constructor(props) {
			if (isRoot) {
				const newProps = {
					...props,
					fullscreen: true, layout: "fit"
				}
				super(newProps)
			}
			else {
				super(props)
			}
		}
		static get name() {return className}
	}
}


export function reactify2(target) {
	var className = target[0].toUpperCase() + target.substring(1).toLowerCase().replace(/_/g, '-')
	l(`reactify2 ${className}`)
	var reactifiedClass = getTheClass(className, false)
	return reactifiedClass
}

export function reactify(...targets) {
//	const result = [];
	if (targets.length > 1) {
		console.log('error in reactify! **********')
	}
	for (let target of targets) {

		if (target === 'ExtReact') {
			var className = 'Container'
			console.log(`reactify class ExtReact ${className}`)
			var reactifiedClass = getTheClass(className, true)
			return reactifiedClass
		}

		else if (target.substr(0,4) === 'Root') {
			var className = target.substr(4)
			console.log(`reactify class ${className}`)
			var reactifiedClass = getTheClass(className, true)
//			result.push(reactifiedClass)
			return reactifiedClass
		}

		else {
			console.log('reactify push ' + target)
			return target
//			result.push(target);
		}
	}
//	return result
}