import { Client } from "@notionhq/client";
import { getNotionKey, outputChannel } from "./utils";

let notionClient: Client;

const getNotionClient = () => (notionClient ? notionClient : new Client({ auth: getNotionKey() }));

export const fetchPages = async () => {
  const notion = getNotionClient();
  outputChannel.appendLine("getting pages");
  return await notion.search({
    filter: {
      property: "object",
      value: "page" as any,
    },
  });
};

export const getBlockChildren = async (blockId: string) => {
  const notion = getNotionClient();
  return await notion.blocks.children.list({
    block_id: blockId,
  });
};
