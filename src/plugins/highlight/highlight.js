import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import CustomHighlightEditing from './highlightediting';
import CustomHighlightUI from './highlightui';

export default class CustomHighlight extends Plugin {
	static get requires() {
		return [ CustomHighlightEditing, CustomHighlightUI ];
	}

	static get pluginName() {
		return 'CustomHighlight';
	}
}
