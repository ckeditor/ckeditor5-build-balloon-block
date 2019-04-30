/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module heading/headingui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';

import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import Collection from '@ckeditor/ckeditor5-utils/src/collection';

import headingIcon from '../../assets/icons/h1.svg';

// import '../theme/heading.css';

/**
 * The headings UI feature. It introduces the `headings` dropdown.
 *
 * @extends module:core/plugin~Plugin
 */
export default class HeadingUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const options = getLocalizedOptions( editor );
		const dropdownTooltip = 'Заголовок';

		// Register UI component.
		editor.ui.componentFactory.add( 'heading', locale => {
			const titles = {};
			const itemDefinitions = new Collection();

			const headingCommand = editor.commands.get( 'heading' );
			const paragraphCommand = editor.commands.get( 'paragraph' );

			const commands = [ headingCommand ];

			for ( const option of options ) {
				const def = {
					type: 'button',
					model: new Model( {
						label: option.title,
						class: option.class,
						withText: true
					} )
				};

				if ( option.model === 'paragraph' ) {
					def.model.bind( 'isOn' ).to( paragraphCommand, 'value' );
					def.model.set( 'commandName', 'paragraph' );
					commands.push( paragraphCommand );
				} else {
					def.model.bind( 'isOn' ).to( headingCommand, 'value', value => value === option.model );
					def.model.set( {
						commandName: 'heading',
						commandValue: option.model
					} );
				}

				// Add the option to the collection.
				itemDefinitions.add( def );

				titles[ option.model ] = option.title;
			}

			const dropdownView = createDropdown( locale );
			addListToDropdown( dropdownView, itemDefinitions );

			dropdownView.buttonView.set( {
				isOn: false,
				icon: headingIcon,
				// withText: true,
				tooltip: dropdownTooltip
			} );

			dropdownView.extendTemplate( {
				attributes: {
					class: [
						'ck-heading-dropdown'
					]
				}
			} );

			dropdownView.bind( 'isEnabled' ).toMany( commands, 'isEnabled', ( ...areEnabled ) => {
				return areEnabled.some( isEnabled => isEnabled );
			} );

			// dropdownView.buttonView.bind( 'label' ).to( headingCommand, 'value', paragraphCommand, 'value', ( value, para ) => {
			// 	const whichModel = value || para && 'paragraph';
			// 	If none of the commands is active, display default title.
			// return titles[ whichModel ] ? titles[ whichModel ] : defaultTitle;
			// } );

			// Execute command when an item from the dropdown is selected.
			this.listenTo( dropdownView, 'execute', evt => {
				editor.execute( evt.source.commandName, evt.source.commandValue ? { value: evt.source.commandValue } : undefined );
				editor.editing.view.focus();
			} );

			return dropdownView;
		} );
	}
}

function getLocalizedOptions( editor ) {
	const localizedTitles = {
		Paragraph: 'Параграф',
		'Heading 1': 'Заголовок H1',
		'Heading 2': 'Заголовок H2',
		'Heading 3': 'Заголовок H3',
		'Heading 4': 'Заголовок H4',
		'Heading 5': 'Заголовок H5',
		'Heading 6': 'Заголовок H6',
	};

	return editor.config.get( 'heading.options' ).map( option => {
		const title = localizedTitles[ option.title ];

		if ( title && title != option.title ) {
			option.title = title;
		}

		return option;
	} );
}
