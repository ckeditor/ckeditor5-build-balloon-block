import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import HighlightCommand from './highlightcommand';

export default class CustomHighlightEditing extends Plugin {
	constructor( editor ) {
		super( editor );

		editor.config.define( 'customHighlight', {
			options: {
				markers: [
					{
						model: 'blueMarker',
						class: 'marker-blue',
						title: 'Голубой маркер',
						color: '#ddf5fb',
						type: 'marker'
					},
					{
						model: 'yellowMarker',
						class: 'marker-yellow',
						title: 'Желтый маркер',
						color: '#fdf5dd',
						type: 'marker'
					},
					{
						model: 'greenMarker',
						class: 'marker-green',
						title: 'Зеленый маркер',
						color: '#e3f7f3',
						type: 'marker'
					},
					{
						model: 'orangeMarker',
						class: 'marker-orange',
						title: 'Оранжевый маркер',
						color: '#fbe8df',
						type: 'marker'
					},
					{
						model: 'grayMarker',
						class: 'marker-gray',
						title: 'Серый маркер',
						color: '#f0f2f3',
						type: 'marker'
					}
				],
				pens: [
					{ model: 'lightBluePen', class: 'pen-light-blue', title: 'Голубой', color: '#1ebfe9', type: 'pen' },
					{ model: 'bluePen', class: 'pen-blue', title: 'Синий', color: '#1f8ceb', type: 'pen' },
					{ model: 'yellowPen', class: 'pen-yellow', title: 'Желтый', color: '#f4c221', type: 'pen' },
					{ model: 'greenPen', class: 'pen-green', title: 'Зеленый', color: '#3bc7ab', type: 'pen' },
					{ model: 'orangePen', class: 'pen-orange', title: 'Оранжевый', color: '#e86d31', type: 'pen' },
					{ model: 'redPen', class: 'pen-red', title: 'Красный', color: '#f35e5e', type: 'pen' },
					{ model: 'blackPen', class: 'pen-black', title: 'Черный', color: '#333333', type: 'pen' },
					{ model: 'darkGrayPen', class: 'pen-dark-gray', title: 'Темный серый', color: '#556066', type: 'pen' },
					{ model: 'mediumGrayPen', class: 'pen-medium-gray', title: 'Серый', color: '#9aa5ab', type: 'pen' },
					{ model: 'grayPen', class: 'pen-gray', title: 'Серый', color: '#c4c7cc', type: 'pen' },
					{ model: 'lightGrayPen', class: 'pen-light-gray', title: 'Светлый серый', color: '#e4e5e9', type: 'pen' },
				]
			}
		} );
	}

	init() {
		const editor = this.editor;
		editor.model.schema.extend( '$text', { allowAttributes: 'customHighlight' } );
		const options = editor.config.get( 'customHighlight.options' );
		editor.conversion.attributeToElement( _buildDefinition( options ) );
		editor.commands.add( 'customHighlight', new HighlightCommand( editor ) );
	}
}

function _buildDefinition( options ) {
	const definition = {
		model: {
			key: 'customHighlight',
			values: []
		},
		view: {}
	};

	for ( const option of [ ...options.markers, ...options.pens ] ) {
		definition.model.values.push( option.model );
		definition.view[ option.model ] = {
			name: 'mark',
			classes: option.class
		};
	}

	return definition;
}
