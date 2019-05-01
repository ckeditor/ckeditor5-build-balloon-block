import Command from '@ckeditor/ckeditor5-core/src/command';

export default class CustomHighlightCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const model = this.editor.model;
		const doc = model.document;

		this.value = doc.selection.getAttribute( 'customHighlight' );
		this.isEnabled = model.schema.checkAttributeInSelection( doc.selection, 'customHighlight' );
	}

	execute( options = {} ) {
		const model = this.editor.model;
		const document = model.document;
		const selection = document.selection;

		const customHighlighter = options.value;

		model.change( writer => {
			const ranges = model.schema.getValidRanges( selection.getRanges(), 'customHighlight' );

			if ( selection.isCollapsed ) {
				const position = selection.getFirstPosition();

				// When selection is inside text with `customHighlight` attribute.
				if ( selection.hasAttribute( 'customHighlight' ) ) {
					// Find the full customHighlighted range.
					const isSameHighlight = value => {
						return value.item.hasAttribute( 'customHighlight' ) && value.item.getAttribute( 'customHighlight' ) === this.value;
					};

					const customHighlightStart = position.getLastMatchingPosition( isSameHighlight, { direction: 'backward' } );
					const customHighlightEnd = position.getLastMatchingPosition( isSameHighlight );

					const customHighlightRange = writer.createRange( customHighlightStart, customHighlightEnd );

					// Then depending on current value...
					if ( !customHighlighter || this.value === customHighlighter ) {
						// ...remove attribute when passing customHighlighter different then current or executing "eraser".
						writer.removeAttribute( 'customHighlight', customHighlightRange );
						writer.removeSelectionAttribute( 'customHighlight' );
					} else {
						// ...update `customHighlight` value.
						writer.setAttribute( 'customHighlight', customHighlighter, customHighlightRange );
						writer.setSelectionAttribute( 'customHighlight', customHighlighter );
					}
				} else if ( customHighlighter ) {
					writer.setSelectionAttribute( 'customHighlight', customHighlighter );
				}
			} else {
				for ( const range of ranges ) {
					if ( customHighlighter ) {
						writer.setAttribute( 'customHighlight', customHighlighter, range );
					} else {
						writer.removeAttribute( 'customHighlight', range );
					}
				}
			}
		} );
	}
}
