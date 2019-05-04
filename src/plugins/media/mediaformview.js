
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

export default class MediaFormView extends View {
	constructor( validators, locale ) {
		super( locale );

		this.focusTracker = new FocusTracker();
		this.keystrokes = new KeystrokeHandler();

		this.header = this._createHeader();
		this.urlInputView = this._createUrlInput();

		this.saveButtonView = this._createButton( 'Вставить', 'ck-button-save' );
		this.saveButtonView.type = 'submit';

		// this.cancelButtonView = this._createButton( t( 'Cancel' ), cancelIcon, 'ck-button-cancel', 'cancel' );

		this._focusables = new ViewCollection();

		this._focusCycler = new FocusCycler( {
			focusables: this._focusables,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				// Navigate form fields backwards using the Shift + Tab keystroke.
				focusPrevious: 'shift + tab',

				// Navigate form fields forwards using the Tab key.
				focusNext: 'tab'
			}
		} );

		this._validators = validators;

		this.setTemplate( {
			tag: 'form',

			attributes: {
				class: [
					'ck',
					'ck-media-form'
				],

				tabindex: '-1'
			},

			children: [
				this.header,
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
			this.header,
			this.urlInputView,
			this.saveButtonView,
			// this.cancelButtonView
		];

		childViews.forEach( v => {
			// Register the view as focusable.
			this._focusables.add( v );

			// Register the view in the focus tracker.
			this.focusTracker.add( v.element );
		} );

		// Start listening for the keystrokes coming from #element.
		this.keystrokes.listenTo( this.element );

		const stopPropagation = data => data.stopPropagation();

		// Since the form is in the dropdown panel which is a child of the toolbar, the toolbar's
		// keystroke handler would take over the key management in the URL input. We need to prevent
		// this ASAP. Otherwise, the basic caret movement using the arrow keys will be impossible.
		this.keystrokes.set( 'arrowright', stopPropagation );
		this.keystrokes.set( 'arrowleft', stopPropagation );
		this.keystrokes.set( 'arrowup', stopPropagation );
		this.keystrokes.set( 'arrowdown', stopPropagation );

		// Intercept the "selectstart" event, which is blocked by default because of the default behavior
		// of the DropdownView#panelView.
		// TODO: blocking "selectstart" in the #panelView should be configurable per–drop–down instance.
		this.listenTo( this.urlInputView.element, 'selectstart', ( evt, domEvt ) => {
			domEvt.stopPropagation();
		}, { priority: 'high' } );
	}

	focus() {
		this._focusCycler.focusFirst();
	}

	get url() {
		return this.urlInputView.inputView.element.value.trim();
	}

	set url( url ) {
		this.urlInputView.inputView.element.value = url.trim();
	}

	isValid() {
		this.resetFormStatus();

		for ( const validator of this._validators ) {
			const errorText = validator( this );

			// One error per field is enough.
			if ( errorText ) {
				// Apply updated error.
				this.urlInputView.errorText = errorText;

				return false;
			}
		}

		return true;
	}

	resetFormStatus() {
		this.urlInputView.errorText = null;
	}

	_createHeader() {
		const header = new TextView( 'Вставка видео', this.locale );
		return header;
	}

	_createUrlInput() {
		const labeledInput = new LabeledInputView( this.locale, InputTextView );
		const inputView = labeledInput.inputView;

		labeledInput.label = 'Ссылка';
		labeledInput.infoText = this._urlInputViewInfoDefault;
		inputView.placeholder = 'https://example.com';

		return labeledInput;
	}

	_createButton( label, className, eventName ) {
		const button = new ButtonView( this.locale );

		button.set( {
			label,
			tooltip: true,
			withText: true
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
