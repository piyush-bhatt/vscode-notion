import * as vscode from "vscode";
import { ToDoListProvider } from "./toDoList";
import { getListItems, getNotionKey, getQuickInput, getQuickPick, setNotionKey } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  let disposables: vscode.Disposable[] = [];
  const todoListProvider = new ToDoListProvider();
  disposables.push(vscode.window.registerTreeDataProvider("notion.todo", todoListProvider));
  disposables.push(
    vscode.commands.registerCommand("notion.addKey", async () => {
      const notionKey: string = getNotionKey();
      const userInput = await getQuickInput("Enter Notion Key", notionKey);
      if (userInput) {
        setNotionKey(userInput);
      }
    })
  );
  disposables.push(
    vscode.commands.registerCommand("notion.todo.refresh", async () => {
      todoListProvider.refresh();
    })
  );
  disposables.push(
    vscode.commands.registerCommand("notion.todo.listItems", async (id: string) => {
      const items = await getListItems(id);
      await getQuickPick("Read-only list of ToDo items", items);
    })
  );
}

export function deactivate() {}
