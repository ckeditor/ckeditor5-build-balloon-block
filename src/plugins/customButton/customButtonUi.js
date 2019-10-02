import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import plusSolidIcon from '../../icons/plus-solid.svg';

export default class customButtonUi extends Plugin {
	init() {
		const customButtons = this.editor.config.get( 'customButtons' ) || [];
		customButtons.forEach( buttonProperties => {
			this.createToolbarButton( buttonProperties );
		} );
	}

	createToolbarButton( buttonProperties ) {
		const editor = this.editor;

		editor.ui.componentFactory.add( buttonProperties.name, locale => {
			const button = new ButtonView( locale );
			button.set( {
				label: buttonProperties.label,
				icon: button.icon || plusSolidIcon,
				tooltip: true,
				withText: true,
			} );

			button.on( 'execute', () => {
				buttonProperties.onClick( editor, button );
			} );
			return button;
		} );
	}
}
