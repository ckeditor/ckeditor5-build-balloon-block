import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview';
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview';

import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';
import TextView from '../textview';

export default class LinkFormView extends View {
	constructor( locale ) {
		super( locale );

		this.focusTracker = new FocusTracker();
		this.keystrokes = new KeystrokeHandler();
		this.headerView = this._createHeader();
		this.urlInputView = this._createUrlInput();
		this.saveButtonView = this._createButton( 'Вставить', 'ck-button-save' );
		this.saveButtonView.type = 'submit';

		this.cancelButtonView = this._createButton( 'Отменить ', 'ck-button-cancel', 'cancel' );
		this._focusables = new ViewCollection();

		this._focusCycler = new FocusCycler( {
			focusables: this._focusables,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				focusPrevious: 'shift + tab',
				focusNext: 'tab'
			}
		} );

		this.setTemplate( {
			tag: 'form',

			attributes: {
				class: [
					'ck',
					'ck-link-form',
				],
				tabindex: '-1'
			},

			children: [
				this.headerView,
				this.urlInputView,
				this.saveButtonView,
				// this.cancelButtonView
			]
		} );
	}

	render() {
		super.render();

		submitHandler( {
			view: this
		} );

		const childViews = [
			this.urlInputView,
			this.saveButtonView,
			// this.cancelButtonView
		];

		childViews.forEach( v => {
			this._focusables.add( v );
			this.focusTracker.add( v.element );
		} );

		this.keystrokes.listenTo( this.element );
	}

	focus() {
		this._focusCycler.focusFirst();
	}

	_createHeader() {
		const header = new TextView( 'Вставка ссылки', this.locale );
		return header;
	}

	_createUrlInput() {
		const labeledInput = new LabeledInputView( this.locale, InputTextView );

		labeledInput.set( {
			class: [ 'ck-input_link' ]
		} );

		labeledInput.label = 'Ссылка';
		labeledInput.inputView.placeholder = 'https://example.com';

		return labeledInput;
	}

	_createButton( label, className, eventName ) {
		const button = new ButtonView( this.locale );

		button.set( {
			label,
			withText: true,
			tooltip: false
		} );

		button.extendTemplate( {
			attributes: {
				class: className
			}
		} );

		if ( eventName ) {
			button.delegate( 'execute' ).to( this, eventName );
		}

		return button;
	}
}
