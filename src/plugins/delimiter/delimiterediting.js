import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InsertDelimiterCommand from './delimitercommand';

export default class DelimiterEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		this._defineSchema();
		this._defineConverters();

		this.editor.commands.add( 'insertDelimiter', new InsertDelimiterCommand( this.editor ) );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'delimiter', {
			isObject: true,
			allowWhere: '$block',
			isLimit: true,
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for( 'upcast' ).elementToElement( {
			model: 'delimiter',
			view: {
				name: 'section',
				classes: 'ck-delimiter'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'delimiter',
			view: {
				name: 'section',
				classes: 'ck-delimiter'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'delimiter',
			view: ( modelElement, viewWriter ) => {
				const section = viewWriter.createContainerElement( 'section', { class: 'ck-delimiter' } );

				return toWidget( section, viewWriter, { label: 'разделитель' } );
			}
		} );
	}
}
