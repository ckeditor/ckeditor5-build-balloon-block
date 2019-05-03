import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import colorIcon from '../../assets/icons/square.svg';
import eraserIcon from '../../assets/icons/eraser.svg';
import brushIcon from '../../assets/icons/brush.svg';

import TextView from '../textview';
import { createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import { addToolbarToDropdownContainer } from '../utils';
import ContainerView from '../container';

export default class CustomHighlightUI extends Plugin {
	static get pluginName() {
		return 'CustomHighlightUI';
	}

	init() {
		const options = this.editor.config.get( 'customHighlight.options' );

		for ( const option of [ ...options.markers, ...options.pens ] ) {
			this._addHighlighterButton( option );
		}

		this._addRemoveHighlightButton();
		this._addDropdown( options );
	}

	_addRemoveHighlightButton() {
		this._addButton( 'removeCustomHighlight', 'Убрать выделение', eraserIcon, null, button => {
			button.class = 'ck-button_eraser';
		} );
	}

	_addHighlighterButton( option ) {
		const command = this.editor.commands.get( 'customHighlight' );

		this._addButton( 'customHighlight:' + option.model, option.title, colorIcon, option.model, decorateHighlightButton );

		function decorateHighlightButton( button ) {
			button.bind( 'isEnabled' ).to( command, 'isEnabled' );
			button.bind( 'isOn' ).to( command, 'value', value => value === option.model );
			button.class = option.class;
		}
	}

	_addButton( name, label, icon, value, decorateButton = () => {} ) {
		const editor = this.editor;

		editor.ui.componentFactory.add( name, locale => {
			const buttonView = new ButtonView( locale );

			buttonView.set( {
				label,
				icon,
				tooltip: true
			} );

			buttonView.on( 'execute', () => {
				editor.execute( 'customHighlight', { value } );
				editor.editing.view.focus();
			} );

			decorateButton( buttonView );

			return buttonView;
		} );
	}

	_addDropdown( options ) {
		const editor = this.editor;
		const componentFactory = editor.ui.componentFactory;

		const startingHighlighter = [ ...options.markers, ...options.pens ][ 0 ];

		componentFactory.add( 'customHighlight', locale => {
			const command = editor.commands.get( 'customHighlight' );
			const dropdownView = createDropdown( locale );

			dropdownView.set( {
				panelPosition: 'se',
				class: [ 'ck-custom-highlight' ]
			} );

			const dropdownButtonView = dropdownView.buttonView;
			dropdownView.bind( 'isEnabled' ).to( command );

			dropdownButtonView.set( {
				tooltip: 'Цвет текста',
				lastExecuted: startingHighlighter.model,
				commandValue: startingHighlighter.model,
				icon: brushIcon,
			} );

			const penButtons = options.pens.map( option => {
				const buttonView = componentFactory.create( 'customHighlight:' + option.model );
				this.listenTo( buttonView, 'execute', () => {
					editor.execute( 'customHighlight', { value: option.model } );
				} );
				return buttonView;
			} );

			const customHighlightButtons = options.markers.map( option => {
				const buttonView = componentFactory.create( 'customHighlight:' + option.model );
				this.listenTo( buttonView, 'execute', () => {
					editor.execute( 'customHighlight', { value: option.model } );
				} );
				return buttonView;
			} );

			const headerPen = new TextView( 'Выбор цвета текста' );
			const headerHighlight = new TextView( 'Выбор цвета выделения текста' );

			penButtons.push( componentFactory.create( 'removeCustomHighlight' ) );
			customHighlightButtons.push( componentFactory.create( 'removeCustomHighlight' ) );

			const container = new ContainerView( 'div', [
				headerPen,
				addToolbarToDropdownContainer( dropdownView, penButtons ),
				headerHighlight,
				addToolbarToDropdownContainer( dropdownView, customHighlightButtons )
			] );

			dropdownView.render();

			dropdownView.panelView.children.add( container );

			return dropdownView;
		} );
	}
}

