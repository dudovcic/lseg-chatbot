import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useChatContext } from "@/providers/chat.context";
import { CHAT_ACTION, Exchange, Message } from "@/providers/chat.types";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { ChatMessagesContent } from "./chat-messages-content";

interface ChatbotWrapperProps {
  title: string;
}

export const ChatbotWrapper = ({ title }: ChatbotWrapperProps) => {
  const data = useChatContext();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleOptionSelect = (
    message: Message,
    content: string,
    isLastMessage: boolean
  ) => {
    if (!isLastMessage) return;
    switch (message.action) {
      case CHAT_ACTION.SELECT_STOCK_EXCHANGE:
        data.selectExchange(content as Exchange);
        break;
      case CHAT_ACTION.SELECT_STOCK:
        data.selectStock(content);
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data.messages]);

  return (
    <Card className="mx-auto h-[600px] w-[600px] flex flex-col min-w-lg">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col min-w-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {data.messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "bot" ? "justify-start" : "justify-end"
              }`}
              ref={data.messages.length - 1 === index ? cardRef : undefined}
            >
              <div
                className={`
                    flex items-start gap-2 max-w-[80%]
                    ${
                      message.sender === "bot" ? "flex-row" : "flex-row-reverse"
                    }
                  `}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {message.sender === "bot" ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`
                      p-3 rounded-lg
                      ${
                        message.sender === "bot"
                          ? "bg-gray-100 text-gray-900"
                          : "bg-blue-500 text-white"
                      }
                    `}
                >
                  <ChatMessagesContent
                    onOtionsSelect={(m, c) =>
                      handleOptionSelect(
                        m,
                        c,
                        index === data.messages.length - 1
                      )
                    }
                    message={message}
                    goToMenu={data.reset}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full border-t relative">
          <Input placeholder="Select an option" disabled={true}></Input>
          <Send className="absolute top-0 right-2 top-2 opacity-40" />
        </div>
      </CardContent>
    </Card>
  );
};
