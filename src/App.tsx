import "./App.css";
import { ChatbotWrapper } from "./chatbot/chatbot";
import { Toaster } from "@/components/ui/sonner";
import { ChatProvider } from "./providers/chat.provider";

function App() {
  return (
    <ChatProvider>
      <div className="min-w-lg">
        <ChatbotWrapper title="Chatbot" />
        <Toaster position="top-center" />
      </div>
    </ChatProvider>
  );
}

export default App;
