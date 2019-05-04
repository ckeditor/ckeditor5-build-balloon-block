import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import ToolbarView from '@ckeditor/ckeditor5-ui/src/toolbar/toolbarview';
import CKEditorError from '@ckeditor/ckeditor5-utils/src/ckeditorerror';

const positionEast = ( targetRect, balloonRect ) => ( {
	top: targetRect.top + ( targetRect.height - balloonRect.height ) + 3,
	left: targetRect.left + targetRect.width,
} );

export default class WidgetToolbarPlugin extends Plugin {
	static get requires() {
		return [ ContextualBalloon ];
	}

	static get pluginName() {
		return 'WidgetToolbarPlugin';
	}

	init() {
		const editor = this.editor;

		// Disables the default balloon toolbar for all widgets.
		if ( editor.plugins.has( 'BalloonToolbar' ) ) {
			const balloonToolbar = editor.plugins.get( 'BalloonToolbar' );

			this.listenTo( balloonToolbar, 'show', evt => {
				if ( isWidgetSelected( editor.editing.view.document.selection ) ) {
					evt.stop();
				}
			}, { priority: 'high' } );
		}

		this._toolbarDefinitions = new Map();

		this._balloon = this.editor.plugins.get( 'ContextualBalloon' );

		this.listenTo( editor.ui, 'update', () => {
			this._updateToolbarsVisibility();
		} );

		this.listenTo( editor.ui.focusTracker, 'change:isFocused', () => {
			this._updateToolbarsVisibility();
		}, { priority: 'low' } );
	}

	destroy() {
		super.destroy();

		for ( const toolbarConfig of this._toolbarDefinitions.values() ) {
			toolbarConfig.view.destroy();
		}
	}

	register( toolbarId, { items, getRelatedElement, balloonClassName = 'ck-toolbar-container' } ) {
		const editor = this.editor;
		const toolbarView = new ToolbarView();

		toolbarView.set( {
			isVertical: true,
		} );

		if ( this._toolbarDefinitions.has( toolbarId ) ) {
			/**
			 * Toolbar with the given id was already added.
			 *
			 * @error widget-toolbar-duplicated
			 * @param toolbarId Toolbar id.
			 */
			throw new CKEditorError( 'widget-toolbar-duplicated: Toolbar with the given id was already added.', { toolbarId } );
		}

		toolbarView.fillFromConfig( items, editor.ui.componentFactory );

		this._toolbarDefinitions.set( toolbarId, {
			view: toolbarView,
			getRelatedElement,
			balloonClassName,
		} );
	}

	_updateToolbarsVisibility() {
		let maxRelatedElementDepth = 0;
		let deepestRelatedElement = null;
		let deepestToolbarDefinition = null;

		for ( const definition of this._toolbarDefinitions.values() ) {
			const relatedElement = definition.getRelatedElement( this.editor.editing.view.document.selection );

			if ( !this.editor.ui.focusTracker.isFocused || !relatedElement ) {
				this._hideToolbar( definition );
			} else {
				const relatedElementDepth = relatedElement.getAncestors().length;

				// Many toolbars can express willingness to be displayed but they do not know about
				// each other. Figure out which toolbar is deepest in the view tree to decide which
				// should be displayed. For instance, if a selected image is inside a table cell, display
				// the ImageToolbar rather than the TableToolbar (#60).
				if ( relatedElementDepth > maxRelatedElementDepth ) {
					maxRelatedElementDepth = relatedElementDepth;
					deepestRelatedElement = relatedElement;
					deepestToolbarDefinition = definition;
				}
			}
		}

		if ( deepestToolbarDefinition ) {
			this._showToolbar( deepestToolbarDefinition, deepestRelatedElement );
		}
	}

	_hideToolbar( toolbarDefinition ) {
		if ( !this._isToolbarVisible( toolbarDefinition ) ) {
			return;
		}

		this._balloon.remove( toolbarDefinition.view );
	}

	_showToolbar( toolbarDefinition, relatedElement ) {
		if ( this._isToolbarVisible( toolbarDefinition ) ) {
			repositionContextualBalloon( this.editor, relatedElement );
		} else if ( !this._balloon.hasView( toolbarDefinition.view ) ) {
			this._balloon.add( {
				view: toolbarDefinition.view,
				position: getBalloonPositionData( this.editor, relatedElement ),
				balloonClassName: toolbarDefinition.balloonClassName,
			} );
		}
	}

	_isToolbarVisible( toolbar ) {
		return this._balloon.visibleView == toolbar.view;
	}
}

function repositionContextualBalloon( editor, relatedElement ) {
	const balloon = editor.plugins.get( 'ContextualBalloon' );

	const position = getBalloonPositionData( editor, relatedElement );

	balloon.set( { withArrow: false } );
	balloon.updatePosition( position );
}

function getBalloonPositionData( editor, relatedElement ) {
	const editingView = editor.editing.view;

	return {
		target: editingView.domConverter.viewToDom( relatedElement ),
		positions: [
			positionEast
		]
	};
}

function isWidgetSelected( selection ) {
	const viewElement = selection.getSelectedElement();

	return !!( viewElement && isWidget( viewElement ) );
}

export function isWidget( node ) {
	if ( !node.is( 'element' ) ) {
		return false;
	}

	return !!node.getCustomProperty( 'widget' );
}
