import Command from '@ckeditor/ckeditor5-core/src/command';

export default class RemoveDelimiterCommand extends Command {
	execute() {
		const model = this.editor.model;
		const selection = model.document.selection;

		const delimiter = selection.focus.nodeBefore;

		model.change( writer => {
			writer.remove( delimiter );
		} );
	}

	refresh() {
		this.isEnabled = true;
	}
}
