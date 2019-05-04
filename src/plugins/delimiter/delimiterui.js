import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import delimiterIcon from '../../assets/icons/delimiter.svg';
import removeDelimiterIcon from '../../assets/icons/close.svg';

export default class DelimiterUI extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'delimiter', locale => {
			const command = editor.commands.get( 'insertDelimiter' );

			const buttonView = new ButtonView( locale );

			buttonView.set( {
				label: 'Разделитель',
				icon: delimiterIcon,
				tooltip: true
			} );

			buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			this.listenTo( buttonView, 'execute', () => editor.execute( 'insertDelimiter' ) );

			return buttonView;
		} );

		editor.ui.componentFactory.add( 'removeDelimiter', locale => {
			const command = editor.commands.get( 'removeDelimiter' );
			const buttonView = new ButtonView( locale );

			buttonView.set( {
				label: 'Удалить разделитель',
				icon: removeDelimiterIcon,
				tooltip: false
			} );

			buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			this.listenTo( buttonView, 'execute', () => editor.execute( 'removeDelimiter' ) );

			return buttonView;
		} );
	}
}
