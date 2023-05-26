/* eslint-disable */
declare module "*.vue" {
	// Declare a module for Vue files with a wildcard import
	import type { DefineComponent } from "vue";
	const component: DefineComponent<{}, {}, any>;
	export default component;
}
