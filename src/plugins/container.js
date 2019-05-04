import View from '@ckeditor/ckeditor5-ui/src/view';

export default class ContainerView extends View {
	constructor( tag, children, locale ) {
		super( locale );

		this.setTemplate( {
			tag,
			children,
			attributes: {
				class: [ 'ck', 'ck-dropdown__container' ]
			},
		} );
	}
}
