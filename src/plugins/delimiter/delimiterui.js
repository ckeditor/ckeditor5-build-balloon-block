import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class DelimiterUI extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'delimiter', locale => {
			const command = editor.commands.get( 'insertDelimiter' );

			const buttonView = new ButtonView( locale );

			buttonView.set( {
				label: 'Разделитель',
				icon: '<svg width="19" height="4" viewBox="0 0 19 4" xmlns="http://www.w3.org/2000/svg">' +
				'<path d="M1.25 0H7a1.25 1.25 0 1 1 0 2.5H1.25a1.25 1.25 0 1 1 0-2.5zM11 ' +
				'0h5.75a1.25 1.25 0 0 1 0 2.5H11A1.25 1.25 0 0 1 11 0z"/></svg>',
				tooltip: true
			} );

			buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			this.listenTo( buttonView, 'execute', () => editor.execute( 'insertDelimiter' ) );

			return buttonView;
		} );
	}
}
