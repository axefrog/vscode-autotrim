# AutoTrim: VS Code Extension

Trailing whitespace often exists after editing lines of code, deleting trailing words and so forth. This extension tracks the line numbers where a cursor is active, and removes trailing tabs and spaces from those lines when they no longer have an active cursor. As such, edits in the file are kept to a minimum, and not applied until a line is no longer being edited.