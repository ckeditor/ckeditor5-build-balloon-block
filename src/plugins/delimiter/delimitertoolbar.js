import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { isWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import WidgetToolbarPlugin from './widgettoolbar';

export default class DelimiterToolbar extends Plugin {
	static get requires() {
		return [ WidgetToolbarPlugin ];
	}

	static get pluginName() {
		return 'DelimiterToolbar';
	}

	afterInit() {
		const editor = this.editor;
		const widgetToolbarPlugin = editor.plugins.get( WidgetToolbarPlugin );

		widgetToolbarPlugin.register( 'delimiter', {
			items: [ 'removeDelimiter' ],
			balloonClassName: 'ck-delimiter-remove-container',
			getRelatedElement: getSelectedDelimiterWidget
		} );
	}
}

function isDelimiterWidget( viewElement ) {
	return !!viewElement.getCustomProperty( 'delimiter' ) && isWidget( viewElement );
}

export function getSelectedDelimiterWidget( selection ) {
	const viewElement = selection.getSelectedElement();

	if ( viewElement && isDelimiterWidget( viewElement ) ) {
		return viewElement;
	}

	return null;
}
