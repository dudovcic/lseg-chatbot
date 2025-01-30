export type Exchange = "LSE" | "NASDAQ" | "NYSE";

export type ChatContentOptions =
  | string
  | { title: string; options: Array<{ title: string; name: string }> };

export interface Message {
  action: CHAT_ACTION;
  content: ChatContentOptions;
  sender: "bot" | "user";
  timestamp: Date;
}

export enum CHAT_ACTION {
  NONE,
  BACK_TO_MAIN,
  SELECT_STOCK,
  SELECT_STOCK_EXCHANGE,
}
