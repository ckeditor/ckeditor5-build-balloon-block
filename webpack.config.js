/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const { bundler, styles } = require( '@ckeditor/ckeditor5-dev-utils' );
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const UglifyJsWebpackPlugin = require( 'uglifyjs-webpack-plugin' );

const icons = [
	new webpack.NormalModuleReplacementPlugin( /bold\.svg/, __dirname + '/src/assets/icons/bold.svg' ),
	new webpack.NormalModuleReplacementPlugin( /italic\.svg/, __dirname + '/src/assets/icons/italic.svg' ),
	new webpack.NormalModuleReplacementPlugin( /underline\.svg/, __dirname + '/src/assets/icons/underline.svg' ),
	new webpack.NormalModuleReplacementPlugin( /strikethrough\.svg/, __dirname + '/src/assets/icons/strikethrough.svg' ),
	new webpack.NormalModuleReplacementPlugin( /quote\.svg/, __dirname + '/src/assets/icons/quote.svg' ),
	new webpack.NormalModuleReplacementPlugin( /numberedlist\.svg/, __dirname + '/src/assets/icons/numberedlist.svg' ),
	new webpack.NormalModuleReplacementPlugin( /bulletedlist\.svg/, __dirname + '/src/assets/icons/bulletedlist.svg' ),
	new webpack.NormalModuleReplacementPlugin( /link\.svg/, __dirname + '/src/assets/icons/link.svg' ),
	new webpack.NormalModuleReplacementPlugin( /align-center\.svg/, __dirname + '/src/assets/icons/align-center.svg' ),
	// new webpack.NormalModuleReplacementPlugin( /align-justify\.svg/, __dirname + '/src/assets/icons/align-justify.svg' ),
	new webpack.NormalModuleReplacementPlugin( /align-left\.svg/, __dirname + '/src/assets/icons/align-left.svg' ),
	new webpack.NormalModuleReplacementPlugin( /align-right\.svg/, __dirname + '/src/assets/icons/align-right.svg' ),
	new webpack.NormalModuleReplacementPlugin( /linkui\.js/, __dirname + '/src/plugins/link/linkui.js' ),
	new webpack.NormalModuleReplacementPlugin( /headingui\.js/, __dirname + '/src/plugins/heading/headingui.js' ),
	new webpack.NormalModuleReplacementPlugin( /table\.svg/, __dirname + '/src/assets/icons/table.svg' ),
	new webpack.NormalModuleReplacementPlugin( /table-column\.svg/, __dirname + '/src/assets/icons/table-column.svg' ),
	new webpack.NormalModuleReplacementPlugin( /table-row\.svg/, __dirname + '/src/assets/icons/table-row.svg' ),
	// new webpack.NormalModuleReplacementPlugin( /table-merge-cell\.svg/, __dirname + '/src/assets/icons/link.svg' ),
	new webpack.NormalModuleReplacementPlugin( /pilcrow\.svg/, __dirname + '/src/assets/icons/plus-add.svg' ),
	new webpack.NormalModuleReplacementPlugin( /image\.svg/, __dirname + '/src/assets/icons/picture.svg' ),
	new webpack.NormalModuleReplacementPlugin( /dropdown-arrow\.svg/, __dirname + '/src/assets/icons/dropdown-arrow.svg' ),
];

module.exports = {
	devtool: 'source-map',
	performance: { hints: false },

	entry: path.resolve( __dirname, 'src', 'ckeditor.js' ),

	output: {
		// The name under which the editor will be exported.
		library: 'BalloonEditor',

		path: path.resolve( __dirname, 'build' ),
		filename: 'ckeditor.js',
		libraryTarget: 'umd',
		libraryExport: 'default'
	},

	optimization: {
		minimizer: [
			new UglifyJsWebpackPlugin( {
				sourceMap: true,
				uglifyOptions: {
					output: {
						// Preserve CKEditor 5 license comments.
						comments: /^!/
					}
				}
			} )
		]
	},

	plugins: [
		...icons,
		new CKEditorWebpackPlugin( {
			// UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
			// When changing the built-in language, remember to also change it in the editor's configuration (src/ckeditor.js).
			language: 'ru',
			additionalLanguages: 'all'
		} ),
		new webpack.BannerPlugin( {
			banner: bundler.getLicenseBanner(),
			raw: true
		} )
	],

	module: {
		rules: [
			{
				test: /\.svg$/,
				use: [ 'raw-loader' ]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							singleton: true
						}
					},
					{
						loader: 'postcss-loader',
						options: styles.getPostCssConfig( {
							themeImporter: {
								themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
							},
							minify: true
						} )
					},
				]
			}
		]
	}
};
