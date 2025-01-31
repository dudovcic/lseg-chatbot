import { useCallback, useState } from "react";
import { ChatContext } from "./chat.context";
import {
  CHAT_ACTION,
  ChatContentOptions,
  Exchange,
  Message,
} from "../types";
import { stockExchangeData as data, Stock } from "@/data/stocks.data";
import { toast } from "sonner";

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Ideally fetched from an API
  const [stockExchangeData] = useState(data);
  const [messages, setMessages] = useState<Message[]>([
    {
      action: CHAT_ACTION.NONE,
      sender: "bot",
      content: "Hello, how can I help you?",
      timestamp: new Date(),
    },
    {
      action: CHAT_ACTION.SELECT_STOCK_EXCHANGE,
      sender: "bot",
      content: {
        title: "Please select a stock exchange",
        options: stockExchangeData.map((sd) => ({
          title: sd.code,
          name: sd.stockExchange,
        })),
      },
      timestamp: new Date(),
    },
  ]);
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(
    null
  );
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const addMessage = useCallback(
    (
      content: ChatContentOptions,
      sender: "bot" | "user",
      action: CHAT_ACTION
    ) => {
      setMessages((prev) => [
        ...prev,
        { content, sender, timestamp: new Date(), action },
      ]);
    },
    []
  );

  const selectExchange = useCallback(
    (exchange: Exchange) => {
      const selectedStockExchange = stockExchangeData.find(
        (se) => se.code === exchange
      );
      if (!selectedStockExchange) {
        toast.error("Error", {
          description: "No stock exchange: " + exchange,
        });
        return;
      }

      setSelectedExchange(exchange);
      setSelectedStock(null);
      addMessage(exchange, "user", CHAT_ACTION.NONE);
      addMessage(
        {
          title: `You selected ${exchange}. Please select a stock:`,
          options: selectedStockExchange.topStocks.map((ts) => ({
            name: ts.stockName,
            title: ts.code,
          }))!,
        },
        "bot",
        CHAT_ACTION.SELECT_STOCK
      );
    },
    [addMessage, stockExchangeData]
  );

  const selectStock = useCallback(
    (stockCode: string) => {
      const exchange = stockExchangeData.find(
        (se) => se.code === selectedExchange
      );
      if (!exchange) {
        toast.error("Error", {
          description: "No stock exchange: " + exchange,
        });
        return;
      }
      const newStock = exchange?.topStocks.find((s) => s.code === stockCode);
      if (!newStock) {
        toast.error("Error", {
          description: "No stock: " + stockCode,
        });
        return;
      }
      console.log("setting it", newStock);
      setSelectedStock(newStock);
      addMessage(newStock.stockName || stockCode, "user", CHAT_ACTION.NONE);
      addMessage(
        {
          title: `Current price of ${
            newStock.stockName
          }: $${newStock.price.toFixed(2)}`,
          options: exchange.topStocks.map((ts) => ({
            name: ts.stockName,
            title: ts.code,
          }))!,
        },
        "bot",
        CHAT_ACTION.SELECT_STOCK
      );
    },
    [addMessage, selectedExchange, stockExchangeData]
  );

  const reset = useCallback(() => {
    setSelectedExchange(null);
    setSelectedStock(null);
    setMessages([
      {
        action: CHAT_ACTION.SELECT_STOCK_EXCHANGE,
        sender: "bot",
        content: {
          title: "Please select a stock exchange",
          options: stockExchangeData.map((sd) => ({
            title: sd.code,
            name: sd.stockExchange,
          })),
        },
        timestamp: new Date(),
      },
    ]);
  }, [stockExchangeData]);

  const value = {
    messages,
    selectedExchange,
    selectedStock,
    addMessage,
    selectExchange,
    selectStock,
    reset,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
