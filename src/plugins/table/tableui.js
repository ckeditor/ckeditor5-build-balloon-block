import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

import InsertTableView from '@ckeditor/ckeditor5-table/src/ui/inserttableview';

import tableIcon from '../../assets/icons/table.svg';
import tableColumnIcon from '../../assets/icons/table-column.svg';
import tableRowIcon from '../../assets/icons/table-row.svg';
import tableMergeCellIcon from '@ckeditor/ckeditor5-table/theme/icons/table-merge-cell.svg';
import ContainerView from '../container';

export default class TableUI extends Plugin {
	init() {
		const editor = this.editor;
		const t = this.editor.t;

		editor.ui.componentFactory.add( 'insertTable', locale => {
			const command = editor.commands.get( 'insertTable' );
			const dropdownView = createDropdown( locale );
			//
			// dropdownView.set( {
			//  class: [ 'ck-custom-insert-table' ]
			// } );

			dropdownView.bind( 'isEnabled' ).to( command );

			// Decorate dropdown's button.
			dropdownView.buttonView.set( {
				icon: tableIcon,
				label: t( 'Insert table' ),
				tooltip: true
			} );

			// Prepare custom view for dropdown's panel.
			const insertTableView = new InsertTableView( locale );
			const container = new ContainerView( 'div', [ insertTableView ] );

			dropdownView.render();

			dropdownView.panelView.children.add( container );

			insertTableView.delegate( 'execute' ).to( dropdownView );

			dropdownView.buttonView.on( 'open', () => {
				// Reset the chooser before showing it to the user.
				insertTableView.rows = 0;
				insertTableView.columns = 0;
			} );

			dropdownView.on( 'execute', () => {
				editor.execute( 'insertTable', { rows: insertTableView.rows, columns: insertTableView.columns } );
				editor.editing.view.focus();
			} );

			return dropdownView;
		} );

		editor.ui.componentFactory.add( 'tableColumn', locale => {
			const options = [
				{
					type: 'switchbutton',
					model: {
						commandName: 'setTableColumnHeader',
						label: t( 'Header column' ),
						bindIsOn: true
					}
				},
				{ type: 'separator' },
				{
					type: 'button',
					model: {
						commandName: 'insertTableColumnLeft',
						label: t( 'Insert column left' )
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'insertTableColumnRight',
						label: t( 'Insert column right' )
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'removeTableColumn',
						label: t( 'Delete column' )
					}
				}
			];

			return this._prepareDropdown( t( 'Column' ), tableColumnIcon, options, locale );
		} );

		editor.ui.componentFactory.add( 'tableRow', locale => {
			const options = [
				{
					type: 'switchbutton',
					model: {
						commandName: 'setTableRowHeader',
						label: t( 'Header row' ),
						bindIsOn: true
					}
				},
				{ type: 'separator' },
				{
					type: 'button',
					model: {
						commandName: 'insertTableRowBelow',
						label: t( 'Insert row below' )
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'insertTableRowAbove',
						label: t( 'Insert row above' )
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'removeTableRow',
						label: t( 'Delete row' )
					}
				}
			];

			return this._prepareDropdown( t( 'Row' ), tableRowIcon, options, locale );
		} );

		editor.ui.componentFactory.add( 'mergeTableCells', locale => {
			const options = [
				{
					type: 'button',
					model: {
						commandName: 'mergeTableCellUp',
						label: t( 'Merge cell up' )
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'mergeTableCellRight',
						label: t( 'Merge cell right' )
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'mergeTableCellDown',
						label: t( 'Merge cell down' )
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'mergeTableCellLeft',
						label: t( 'Merge cell left' )
					}
				},
				{ type: 'separator' },
				{
					type: 'button',
					model: {
						commandName: 'splitTableCellVertically',
						label: t( 'Split cell vertically' )
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'splitTableCellHorizontally',
						label: t( 'Split cell horizontally' )
					}
				}
			];

			return this._prepareDropdown( t( 'Merge cells' ), tableMergeCellIcon, options, locale );
		} );
	}

	/**
	 * Creates a dropdown view from the set of options.
	 *
	 * @private
	 * @param {String} label The dropdown button label.
	 * @param {String} icon An icon for the dropdown button.
	 * @param {Array.<module:ui/dropdown/utils~ListDropdownItemDefinition>} options The list of options for the dropdown.
	 * @param {module:utils/locale~Locale} locale
	 * @returns {module:ui/dropdown/dropdownview~DropdownView}
	 */
	_prepareDropdown( label, icon, options, locale ) {
		const editor = this.editor;

		const dropdownView = createDropdown( locale );
		const commands = [];

		// Prepare dropdown list items for list dropdown.
		const itemDefinitions = new Collection();

		for ( const option of options ) {
			addListOption( option, editor, commands, itemDefinitions );
		}

		addListToDropdown( dropdownView, itemDefinitions );

		// Decorate dropdown's button.
		dropdownView.buttonView.set( {
			label,
			icon,
			tooltip: true
		} );

		// Make dropdown button disabled when all options are disabled.
		dropdownView.bind( 'isEnabled' ).toMany( commands, 'isEnabled', ( ...areEnabled ) => {
			return areEnabled.some( isEnabled => isEnabled );
		} );

		this.listenTo( dropdownView, 'execute', evt => {
			editor.execute( evt.source.commandName );
			editor.editing.view.focus();
		} );

		return dropdownView;
	}
}

function addListOption( option, editor, commands, itemDefinitions ) {
	const model = option.model = new Model( option.model );
	const { commandName, bindIsOn } = option.model;

	if ( option.type !== 'separator' ) {
		const command = editor.commands.get( commandName );

		commands.push( command );

		model.set( { commandName } );

		model.bind( 'isEnabled' ).to( command );

		if ( bindIsOn ) {
			model.bind( 'isOn' ).to( command, 'value' );
		}
	}

	model.set( {
		withText: true
	} );

	itemDefinitions.add( option );
}
