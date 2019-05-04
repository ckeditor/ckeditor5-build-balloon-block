import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import { isSupported } from '@ckeditor/ckeditor5-alignment/src/utils';

import alignLeftIcon from '../../assets/icons/align-left.svg';
import alignRightIcon from '../../assets/icons/align-right.svg';
import alignCenterIcon from '../../assets/icons/align-center.svg';
import alignJustifyIcon from '@ckeditor/ckeditor5-alignment/theme/icons/align-justify.svg';
import ContainerView from '../container';
import { addToolbarToDropdownContainer } from '../utils';

const icons = new Map( [
	[ 'left', alignLeftIcon ],
	[ 'right', alignRightIcon ],
	[ 'center', alignCenterIcon ],
	[ 'justify', alignJustifyIcon ]
] );

export default class AlignmentUI extends Plugin {
	get localizedOptionTitles() {
		const t = this.editor.t;

		return {
			'left': 'Выравнивание по левому краю',
			'right': 'Выравнивание по правому краю',
			'center': 'Выравнивание по центру',
			'justify': t( 'Justify' )
		};
	}

	static get pluginName() {
		return 'AlignmentUI';
	}

	init() {
		const editor = this.editor;
		const componentFactory = editor.ui.componentFactory;
		const options = editor.config.get( 'alignment.options' );

		options
			.filter( isSupported )
			.forEach( option => this._addButton( option ) );

		componentFactory.add( 'alignment', locale => {
			const dropdownView = createDropdown( locale );

			dropdownView.set( { 'panelPosition': 'se' } );

			// Add existing alignment buttons to dropdown's toolbar.
			const buttons = options.map( option => componentFactory.create( `alignment:${ option }` ) );
			const container = new ContainerView( 'div', [ addToolbarToDropdownContainer( dropdownView, buttons ) ] );

			// Configure dropdown properties an behavior.
			dropdownView.buttonView.set( {
				label: 'Выравнивание текста',
				tooltip: true
			} );

			dropdownView.toolbarView.isVertical = true;

			dropdownView.extendTemplate( {
				attributes: {
					class: 'ck-alignment-dropdown'
				}
			} );

			// The default icon is align left as we do not support RTL yet (see #3).
			const defaultIcon = alignLeftIcon;

			// Change icon to reflect current selection's alignment.
			dropdownView.buttonView.bind( 'icon' ).toMany( buttons, 'isOn', ( ...areActive ) => {
				// Get the index of an active button.
				const index = areActive.findIndex( value => value );

				// If none of the commands is active, display either defaultIcon or the first button's icon.
				if ( index < 0 ) {
					return defaultIcon;
				}

				// Return active button's icon.
				return buttons[ index ].icon;
			} );

			// Enable button if any of the buttons is enabled.
			dropdownView.bind( 'isEnabled' ).toMany( buttons, 'isEnabled', ( ...areEnabled ) => areEnabled.some( isEnabled => isEnabled ) );

			dropdownView.render();
			dropdownView.panelView.children.add( container );

			return dropdownView;
		} );
	}

	/**
	 * Helper method for initializing the button and linking it with an appropriate command.
	 *
	 * @private
	 * @param {String} option The name of the alignment option for which the button is added.
	 */
	_addButton( option ) {
		const editor = this.editor;

		editor.ui.componentFactory.add( `alignment:${ option }`, locale => {
			const command = editor.commands.get( 'alignment' );
			const buttonView = new ButtonView( locale );

			buttonView.set( {
				label: this.localizedOptionTitles[ option ],
				icon: icons.get( option ),
				tooltip: true
			} );

			// Bind button model to command.
			buttonView.bind( 'isEnabled' ).to( command );
			buttonView.bind( 'isOn' ).to( command, 'value', value => value === option );

			// Execute command.
			this.listenTo( buttonView, 'execute', () => {
				editor.execute( 'alignment', { value: option } );
				editor.editing.view.focus();
			} );

			return buttonView;
		} );
	}
}
