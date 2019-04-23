import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import colorIcon from '../../assets/icons/square.svg';
import eraserIcon from '../../assets/icons/eraser.svg';
import brushIcon from '../../assets/icons/brush.svg';

import ToolbarSeparatorView from '@ckeditor/ckeditor5-ui/src/toolbar/toolbarseparatorview';
import SplitButtonView from '@ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview';
import { createDropdown, addToolbarToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import './theme/highlight.css';

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
		this._addButton( 'removeCustomHighlight', 'Убрать выделение', eraserIcon );
	}

	_addHighlighterButton( option ) {
		const command = this.editor.commands.get( 'highlight' );

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
				editor.execute( 'highlight', { value } );
				editor.editing.view.focus();
			} );

			decorateButton( buttonView );

			return buttonView;
		} );
	}

	_addDropdown( options ) {
		const editor = this.editor;
		const t = editor.t;
		const componentFactory = editor.ui.componentFactory;

		const startingHighlighter = [ ...options.markers, ...options.pens ][ 0 ];

		const optionsMap = [ ...options.markers, ...options.pens ].reduce( ( retVal, option ) => {
			retVal[ option.model ] = option;

			return retVal;
		}, {} );

		componentFactory.add( 'customHighlight', locale => {
			const command = editor.commands.get( 'highlight' );
			const dropdownView = createDropdown( locale, SplitButtonView );
			const splitButtonView = dropdownView.buttonView;

			splitButtonView.set( {
				tooltip: t( 'Highlight' ),
				// Holds last executed highlighter.
				lastExecuted: startingHighlighter.model,
				// Holds current highlighter to execute (might be different then last used).
				commandValue: startingHighlighter.model
			} );

			// Dropdown button changes to selection (command.value):
			// - If selection is in highlight it get active highlight appearance (icon, color) and is activated.
			// - Otherwise it gets appearance (icon, color) of last executed highlight.
			splitButtonView.bind( 'icon' ).to( command, 'value', () => brushIcon );
			splitButtonView.bind( 'color' ).to( command, 'value', value => getActiveOption( value, 'color' ) );
			splitButtonView.bind( 'commandValue' ).to( command, 'value', value => getActiveOption( value, 'model' ) );
			// splitButtonView.bind( 'isOn' ).to( command, 'value', value => !!value );

			splitButtonView.delegate( 'execute' ).to( dropdownView );

			// Create buttons array.
			const buttons = [ ...options.markers, ...options.pens ].map( option => {
				// Get existing highlighter button.
				const buttonView = componentFactory.create( 'customHighlight:' + option.model );

				// Update lastExecutedHighlight on execute.
				this.listenTo( buttonView, 'execute', () => dropdownView.buttonView.set( { lastExecuted: option.model } ) );

				return buttonView;
			} );

			// Make toolbar button enabled when any button in dropdown is enabled before adding separator and eraser.
			dropdownView.bind( 'isEnabled' ).toMany( buttons, 'isEnabled', ( ...areEnabled ) => areEnabled.some( isEnabled => isEnabled ) );

			// Add separator and eraser buttons to dropdown.
			buttons.push( new ToolbarSeparatorView() );
			buttons.push( componentFactory.create( 'removeCustomHighlight' ) );

			addToolbarToDropdown( dropdownView, buttons );
			bindToolbarIconStyleToActiveColor( dropdownView );

			// Execute current action from dropdown's split button action button.
			splitButtonView.on( 'execute', () => {
				editor.execute( 'highlight', { value: splitButtonView.commandValue } );
				editor.editing.view.focus();
			} );

			// Returns active highlighter option depending on current command value.
			// If current is not set or it is the same as last execute this method will return the option key (like icon or color)
			// of last executed highlighter. Otherwise it will return option key for current one.
			function getActiveOption( current, key ) {
				const whichHighlighter = !current ||
				current === splitButtonView.lastExecuted ? splitButtonView.lastExecuted : current;

				return optionsMap[ whichHighlighter ][ key ];
			}

			return dropdownView;
		} );
	}
}

// Extends split button icon style to reflect last used button style.
function bindToolbarIconStyleToActiveColor( dropdownView ) {
	const actionView = dropdownView.buttonView.actionView;

	actionView.iconView.bind( 'fillColor' ).to( dropdownView.buttonView, 'color' );
}

