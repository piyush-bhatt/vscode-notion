import { Client } from "@notionhq/client";
import { getNotionKey } from "./utils";

let notionClient: Client;

const getNotionClient = () => (notionClient ? notionClient : new Client({ auth: getNotionKey() }));

export const fetchPages = async () => {
  try {
    const notion = getNotionClient();
    return await notion.search({
      filter: {
        property: "object",
        value: "page" as any,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getBlockChildren = async (blockId: string) => {
  try {
    const notion = getNotionClient();
    return await notion.blocks.children.list({
      block_id: blockId,
    });
  } catch (error) {
    throw error;
  }
};
