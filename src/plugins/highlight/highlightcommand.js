import Command from '@ckeditor/ckeditor5-core/src/command';

export default class CustomHighlightCommand extends Command {
	refresh() {
		const model = this.editor.model;
		const doc = model.document;

		this.value = doc.selection.getAttribute( 'highlight' );
		this.isEnabled = model.schema.checkAttributeInSelection( doc.selection, 'highlight' );
	}

	execute( options = {} ) {
		const model = this.editor.model;
		const document = model.document;
		const selection = document.selection;

		const highlighter = options.value;

		model.change( writer => {
			const ranges = model.schema.getValidRanges( selection.getRanges(), 'highlight' );

			if ( selection.isCollapsed ) {
				const position = selection.getFirstPosition();

				if ( selection.hasAttribute( 'highlight' ) ) {
					const isSameHighlight = value => {
						return value.item.hasAttribute( 'highlight' ) && value.item.getAttribute( 'highlight' ) === this.value;
					};

					const highlightStart = position.getLastMatchingPosition( isSameHighlight, { direction: 'backward' } );
					const highlightEnd = position.getLastMatchingPosition( isSameHighlight );

					const highlightRange = writer.createRange( highlightStart, highlightEnd );

					if ( !highlighter || this.value === highlighter ) {
						writer.removeAttribute( 'highlight', highlightRange );
						writer.removeSelectionAttribute( 'highlight' );
					} else {
						writer.setAttribute( 'highlight', highlighter, highlightRange );
						writer.setSelectionAttribute( 'highlight', highlighter );
					}
				} else if ( highlighter ) {
					writer.setSelectionAttribute( 'highlight', highlighter );
				}
			} else {
				for ( const range of ranges ) {
					if ( highlighter ) {
						writer.setAttribute( 'highlight', highlighter, range );
					} else {
						writer.removeAttribute( 'highlight', range );
					}
				}
			}
		} );
	}
}
