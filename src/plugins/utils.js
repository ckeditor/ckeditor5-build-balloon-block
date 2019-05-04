import ToolbarView from '@ckeditor/ckeditor5-ui/src/toolbar/toolbarview';
import ListView from '@ckeditor/ckeditor5-ui/src/list/listview';
import SwitchButtonView from '@ckeditor/ckeditor5-ui/src/button/switchbuttonview';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ListItemView from '@ckeditor/ckeditor5-ui/src/list/listitemview';
import ListSeparatorView from '@ckeditor/ckeditor5-ui/src/list/listseparatorview';

export function addToolbarToDropdownContainer( dropdownView, buttons ) {
	const toolbarView = dropdownView.toolbarView = new ToolbarView();

	buttons.map( view => toolbarView.items.add( view ) );
	toolbarView.items.delegate( 'execute' ).to( dropdownView );

	return toolbarView;
}

export function addListToDropdownContainer( dropdownView, items ) {
	const locale = dropdownView.locale;
	const listView = dropdownView.listView = new ListView( locale );

	listView.items.bindTo( items ).using( ( { type, model } ) => {
		if ( type === 'separator' ) {
			return new ListSeparatorView( locale );
		} else if ( type === 'button' || type === 'switchbutton' ) {
			const listItemView = new ListItemView( locale );
			let buttonView;

			if ( type === 'button' ) {
				buttonView = new ButtonView( locale );
			} else {
				buttonView = new SwitchButtonView( locale );
			}

			// Bind all model properties to the button view.
			buttonView.bind( ...Object.keys( model ) ).to( model );
			buttonView.delegate( 'execute' ).to( listItemView );

			listItemView.children.add( buttonView );

			return listItemView;
		}
	} );

	listView.items.delegate( 'execute' ).to( dropdownView );

	return listView;
}
