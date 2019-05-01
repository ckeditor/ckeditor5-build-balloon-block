/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

// The editor creator to use.
import BalloonEditorBase from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';

import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
import BlockToolbar from '@ckeditor/ckeditor5-ui/src/toolbar/block/blocktoolbar';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import Delimiter from './plugins/delimiter/delimiter';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from '@ckeditor/ckeditor5-link/src/link';
import { FileUploadAdapter } from './plugins/file-upload-adapter/file-upload-adapter';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import '../theme/theme.css';
import CustomHighlight from './plugins/highlight/highlight';

export default class BalloonEditor extends BalloonEditorBase {}

// Plugins to include in the build.
BalloonEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	Alignment,
	FontSize,
	FontFamily,
	Highlight,
	CustomHighlight,
	BlockToolbar,
	Bold,
	Delimiter,
	Italic,
	Strikethrough,
	Underline,
	BlockQuote,
	CKFinder,
	EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar
];

// Editor configuration.
BalloonEditor.defaultConfig = {
	extraPlugins: [	FileUploadAdapterPlugin ],
	blockToolbar: [
		'delimiter', 'bulletedList', 'imageUpload', 'blockQuote', 'insertTable', 'alignment'
	],
	toolbar: {
		items: [
			'bold', 'italic', 'underline', 'strikethrough', '|', 'numberedList', 'bulletedList', 'link',
			'heading', 'customHighlight', 'blockQuote'
		]
	},
	image: {
		toolbar: [ 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight' ],
		styles: [ 'full', 'alignLeft', 'alignRight' ]
	},
	heading: {
		options: [
			{ model: 'paragraph', title: 'Параграф', class: 'ck-heading_paragraph' },
			{ model: 'heading1', view: 'h1', title: 'Заголовок H1', class: 'ck-heading_heading1' },
			{ model: 'heading2', view: 'h2', title: 'Заголовок H2', class: 'ck-heading_heading2' },
			// { model: 'code', view: 'code', title: 'Код', class: 'ck-heading_code' }
		]
	},
	table: {
		contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
	},
	options: [ 'left', 'right', 'center' ],
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'ru'
};

function FileUploadAdapterPlugin( editor ) {
	/* eslint-disable */
	editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
		// Configure the URL to the upload script in your back-end here!
		return new FileUploadAdapter( loader, editor.config[ '_config' ].fileUploadOptions );
	};
	/* eslint-enable */
}
