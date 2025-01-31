import { Button } from "@/components/ui/button";
import { CHAT_ACTION, Message } from "@/types";
import { ArrowLeft } from "lucide-react";

interface ChatMessagesContentProps {
  message: Message;
  goToMenu(): void;
  onOtionsSelect(message: Message, content: string): void;
}

export const ChatMessagesContent = ({
  message,
  goToMenu,
  onOtionsSelect,
}: ChatMessagesContentProps) => {
  return typeof message.content === "string" ? (
    message.content
  ) : (
    <div>
      <p className="mb-2">{message.content.title}</p>
      {message.action === CHAT_ACTION.SELECT_STOCK ? (
        <div className="">
          <Button
            variant="outline"
            onClick={goToMenu}
            className="w-full"
            size="sm"
          >
            <ArrowLeft />
            Stock Exchange menu
          </Button>
        </div>
      ) : null}
      {message.content.options.map((option) => (
        <Button
          key={option.title}
          className="w-full"
          size="sm"
          variant="outline"
          onClick={() => onOtionsSelect(message, option.title)}
        >
          <p>{option.name}</p>
        </Button>
      ))}
    </div>
  );
};
