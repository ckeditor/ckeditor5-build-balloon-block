import DelimiterEditing from './delimiterediting';
import DelimiterUI from './delimiterui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class Delimiter extends Plugin {
	static get requires() {
		return [ DelimiterEditing, DelimiterUI ];
	}
}
