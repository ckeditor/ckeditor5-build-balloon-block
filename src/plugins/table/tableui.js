import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

import InsertTableView from '@ckeditor/ckeditor5-table/src/ui/inserttableview';

import tableIcon from '../../assets/icons/table.svg';
import tableColumnIcon from '../../assets/icons/table-column.svg';
import tableRowIcon from '../../assets/icons/table-row.svg';
import tableMergeCellIcon from '@ckeditor/ckeditor5-table/theme/icons/table-merge-cell.svg';
import ContainerView from '../container';
import { addListToDropdownContainer } from '../utils';

export default class TableUI extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'insertTable', locale => {
			const command = editor.commands.get( 'insertTable' );
			const dropdownView = createDropdown( locale );

			dropdownView.set( {
				panelPosition: 'se',
				class: [ 'ck-custom-table-dropdown' ]
			} );

			dropdownView.bind( 'isEnabled' ).to( command );

			// Decorate dropdown's button.
			dropdownView.buttonView.set( {
				icon: tableIcon,
				label: 'Вставить таблицу',
				tooltip: true
			} );

			// Prepare custom view for dropdown's panel.
			const insertTableView = new InsertTableView( locale );
			const container = new ContainerView( 'div', [ insertTableView ] );

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

			dropdownView.render();
			dropdownView.panelView.children.add( container );

			return dropdownView;
		} );

		editor.ui.componentFactory.add( 'tableColumn', locale => {
			const options = [
				{
					type: 'switchbutton',
					model: {
						commandName: 'setTableColumnHeader',
						label: 'Столбец заголовков',
						bindIsOn: true
					}
				},
				{ type: 'separator' },
				{
					type: 'button',
					model: {
						commandName: 'insertTableColumnLeft',
						label: 'Вставить столбец слева'
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'insertTableColumnRight',
						label: 'Вставить столбец справа'
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'removeTableColumn',
						label: 'Удалить столбец'
					}
				}
			];

			return this._prepareDropdown( 'Столбец', tableColumnIcon, options, locale );
		} );

		editor.ui.componentFactory.add( 'tableRow', locale => {
			const options = [
				{
					type: 'switchbutton',
					model: {
						commandName: 'setTableRowHeader',
						label: 'Строка заголовков',
						bindIsOn: true
					}
				},
				{ type: 'separator' },
				{
					type: 'button',
					model: {
						commandName: 'insertTableRowBelow',
						label: 'Вставить строку ниже'
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'insertTableRowAbove',
						label: 'Вставить строку выше'
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'removeTableRow',
						label: 'Удалить строку'
					}
				}
			];

			return this._prepareDropdown( 'Строка', tableRowIcon, options, locale );
		} );

		editor.ui.componentFactory.add( 'mergeTableCells', locale => {
			const options = [
				{
					type: 'button',
					model: {
						commandName: 'mergeTableCellUp',
						label: 'Объединить с ячейкой сверху'
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'mergeTableCellRight',
						label: 'Объединить с ячейкой справа'
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'mergeTableCellDown',
						label: 'Объединить с ячейкой снизу'
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'mergeTableCellLeft',
						label: 'Объединить с ячейкой слева'
					}
				},
				{ type: 'separator' },
				{
					type: 'button',
					model: {
						commandName: 'splitTableCellVertically',
						label: 'Разделить ячейку вертикально'
					}
				},
				{
					type: 'button',
					model: {
						commandName: 'splitTableCellHorizontally',
						label: 'Разделить ячейку горизонтально'
					}
				}
			];

			return this._prepareDropdown( 'Объединить ячейки', tableMergeCellIcon, options, locale );
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

		dropdownView.set( {
			panelPosition: 'se',
			class: 'ck-custom-table-dropdown'
		} );
		const commands = [];

		// Prepare dropdown list items for list dropdown.
		const itemDefinitions = new Collection();

		for ( const option of options ) {
			addListOption( option, editor, commands, itemDefinitions );
		}

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

		const containerListView = new ContainerView( 'div', [ addListToDropdownContainer( dropdownView, itemDefinitions ) ] );
		dropdownView.render();
		dropdownView.panelView.children.add( containerListView );

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
