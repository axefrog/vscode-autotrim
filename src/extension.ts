import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(new LineTrimmer());
}

export function deactivate() {
}

class LineTrimmer {
    private _disposable: vscode.Disposable;
    private _lines = new WeakMap<any, Set<number>>()

    constructor() {
        this._disposable = vscode.window.onDidChangeTextEditorSelection(this.onChangeSelection, this);
    }

    onChangeSelection(e: vscode.TextEditorSelectionChangeEvent) {
        const editor = vscode.window.activeTextEditor;
        const doc = editor.document;
        const lines = new Set<number>(e.selections.map(sel => sel.active.line));
        const previousLines = this._lines.get(doc);
        if(previousLines) {
            previousLines.forEach(lineNum => {
                if(!lines.has(lineNum) && doc.lineCount > lineNum) {
                    const line = doc.lineAt(lineNum);
                    if(!line) {
                        return;
                    }
                    if(doc.languageId === 'markdown' && line.text.match(/[^ ]  $/)) {
                        return;
                    }
                    const text = line.isEmptyOrWhitespace ? '' :
                        line.text.replace(/[ \t]+$/, '');
                    if(line.text !== text) {
                        editor.edit(ed => ed.replace(line.range, text), false);
                    }
                }
            });
        }
        this._lines.set(doc, lines);
    }

    dispose() {
        this._disposable.dispose();
    }
}
