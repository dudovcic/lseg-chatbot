import { createContext, useContext } from "react";
import {
  CHAT_ACTION,
  ChatContentOptions,
  Exchange,
  Message,
} from "./chat.types";
import { Stock } from "@/data/stocks.data";

export interface ChatContextType {
  messages: Message[];
  selectedExchange: Exchange | null;
  selectedStock: Stock | null;
  addMessage: (
    content: ChatContentOptions,
    sender: "bot" | "user",
    action: CHAT_ACTION
  ) => void;
  selectExchange: (exchange: Exchange) => void;
  selectStock: (stockCode: string) => void;
  reset: () => void;
}

export const ChatContext = createContext<ChatContextType | undefined>({
  messages: [],
  selectedExchange: null,
  selectedStock: null,
  addMessage: () => {},
  selectExchange: () => {},
  selectStock: () => {},
  reset: () => {},
});

export const useChatContext = () => {
  const data = useContext(ChatContext);
  if (!data) throw new Error("No chat context!");
  return data;
};
