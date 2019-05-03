import View from '@ckeditor/ckeditor5-ui/src/view';

import '@ckeditor/ckeditor5-ui/theme/components/tooltip/tooltip.css';

export default class TooltipView extends View {
	constructor( locale ) {
		super( locale );
		this.set( 'text', '' );
		this.set( 'position', 'n' );

		const bind = this.bindTemplate;

		this.setTemplate( {
			tag: 'span',
			attributes: {
				class: [
					'ck',
					'ck-tooltip',
					// bind.to( 'position', position => 'ck-tooltip_' + position ),
					bind.to( 'position', () => 'ck-tooltip_n' ),
					bind.if( 'text', 'ck-hidden', value => !value.trim() )
				]
			},
			children: [
				{
					tag: 'span',

					attributes: {
						class: [
							'ck',
							'ck-tooltip__text'
						]
					},

					children: [
						{
							text: bind.to( 'text' ),
						}
					]
				}
			]
		} );
	}
}
