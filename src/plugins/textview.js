import View from '@ckeditor/ckeditor5-ui/src/view';

export default class TextView extends View {
	constructor( text, locale ) {
		super( locale );

		this.setTemplate( {
			tag: 'p',

			// The element of the view can be defined with its children.
			children: [
				{
					text
				}
			],
			attributes: {
				class: [ 'ck', 'ck-dropdown__header' ]

			},
		} );
	}
}
