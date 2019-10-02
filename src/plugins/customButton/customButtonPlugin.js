import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import customButtonUi from './customButtonUi';

export default class customButtonPlugin extends Plugin {
	static get requires() {
		return [ customButtonUi ];
	}

	static get pluginName() {
		return 'customButtonPlugin';
	}
}
