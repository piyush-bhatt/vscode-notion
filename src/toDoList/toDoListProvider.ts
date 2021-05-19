import * as vscode from "vscode";
import { ToDoListEntry } from "../types";
import { getToDoLists } from "../utils";

export class ToDoListProvider implements vscode.TreeDataProvider<ToDoTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<ToDoTreeItem | undefined | null | void> = new vscode.EventEmitter<
    ToDoTreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData: vscode.Event<ToDoTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ToDoTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ToDoTreeItem): Thenable<ToDoTreeItem[]> {
    return Promise.resolve(this.getLists());
  }

  private async getLists(): Promise<ToDoTreeItem[]> {
    let items: ToDoTreeItem[];
    const lists: ToDoListEntry[] = await getToDoLists();
    items = lists.map((item: ToDoListEntry) => {
      const toDoTreeItem = new ToDoTreeItem(item.title);
      toDoTreeItem.command = {
        title: "",
        command: "notion.todo.listItems",
        arguments: [item.id],
      };
      toDoTreeItem.iconPath = new vscode.ThemeIcon('checklist');
      return toDoTreeItem;
    });
    return items;
  }
}

class ToDoTreeItem extends vscode.TreeItem {
  constructor(public label: string) {
    super(label);
  }
}
