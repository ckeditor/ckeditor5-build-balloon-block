import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertDelimiterCommand extends Command {
	execute() {
		this.editor.model.change( writer => {
			this.editor.model.insertContent( createDelimiter( writer ) );
		} );
	}

	refresh() {
		const elements = Array.from( this.editor.sourceElement.children );
		const delimiter = elements.find( _ => Array.from( _.classList ).indexOf( 'ck-delimiter' ) > -1 );
		this.isEnabled = !delimiter;
	}
}

function createDelimiter( writer ) {
	const delimiter = writer.createElement( 'delimiter' );
	return delimiter;
}
