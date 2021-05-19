import * as vscode from "vscode";
import { ToDoListEntry } from "../types";
import { fetchPages, getBlockChildren } from "./notion";

export const outputChannel = vscode.window.createOutputChannel("Notion");

export const getNotionKey = (): string => vscode.workspace.getConfiguration("notion").get("key", "");

export const setNotionKey = (key: string) =>
  vscode.workspace.getConfiguration().update("notion.key", key, vscode.ConfigurationTarget.Global);

export const getQuickInput = (prompt: string, value: string = "") => vscode.window.showInputBox({ prompt, value });

export const getQuickPick = (placeHolder: string, items: vscode.QuickPickItem[]) =>
  vscode.window.showQuickPick(items, { canPickMany: true, placeHolder });

export const getToDoLists = async (): Promise<ToDoListEntry[]> => {
  let toDoLists: ToDoListEntry[] = [];
  const pages = await fetchPages();
  if (pages.results.length > 0) {
    const lists = pages.results.filter((item: any) => !item.archived);
    lists.forEach((list) => {
      if (list.properties.title) {
        const id = list.id;
        const title = (list.properties.title as any).title[0]["plain_text"];
        toDoLists.push({ id, title });
      }
    });
  }
  return toDoLists;
};

export const getListItems = async (id: string) => {
  const items = await getBlockChildren(id);
  return items.results.reduce((acc: vscode.QuickPickItem[], cur: any) => {
    if (cur.type === "to_do") {
      acc.push({ label: cur.to_do.text[0].plain_text, picked: cur.to_do.checked });
    }
    return acc;
  }, []);
};
