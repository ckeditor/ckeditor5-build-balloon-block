import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertDelimiterCommand extends Command {
	execute() {
		this.editor.model.change( writer => {
			this.checkDelimiterInit( writer );
			this.editor.model.insertContent( this.createDelimiter( writer ) );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const schema = model.schema;

		const validParent = getInsertDelimiterParent( selection.getFirstPosition() );

		this.isEnabled = schema.checkChild( validParent, 'delimiter' );
	}

	createDelimiter( writer ) {
		this.checkDelimiterInit();

		if ( this.delimiter ) {
			writer.remove( this.delimiter );
		}

		this.delimiter = writer.createElement( 'delimiter' );
		return this.delimiter;
	}

	checkDelimiterInit( writer ) {
		const nodes = this.editor.model.document.getRoot()._children._nodes;
		const delimiter = nodes.find( _ => _.name === 'delimiter' );

		if ( delimiter ) {
			writer.remove( delimiter );
			this.editor.updateSourceElement();
		}
	}
}

function getInsertDelimiterParent( position ) {
	const parent = position.parent;
	return parent === parent.root ? parent : parent.parent;
}
