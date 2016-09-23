import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(new LineTrimmer());
}

export function deactivate() {
}

class LineTrimmer {
    private _disposable: vscode.Disposable;
    private _lines = new Set<number>();

    constructor() {
        this._disposable = vscode.window.onDidChangeTextEditorSelection(this.onChangeSelection, this);
    }

    onChangeSelection(e: vscode.TextEditorSelectionChangeEvent) {
        const editor = vscode.window.activeTextEditor;
        const doc = editor.document;
        const lines = new Set<number>(e.selections.map(sel => sel.active.line));
        this._lines.forEach(lineNum => {
            if(!lines.has(lineNum)) {
                const line = doc.lineAt(lineNum);
                if(!line) return;
                const text = line.isEmptyOrWhitespace ? '' :
                    line.text.replace(/[ \t]+$/, '');
                editor.edit(ed => ed.replace(line.range, text));
            }
        });
        this._lines = lines;
    }

    dispose() {
        this._disposable.dispose();
    }
}