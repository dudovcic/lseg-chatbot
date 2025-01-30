import { render, renderHook, screen } from "@testing-library/react";
import { ChatProvider } from "./chat.provider";
import { useChatContext } from "./chat.context";
import { test, expect } from "vitest";
import { CHAT_ACTION } from "./chat.types";

const TestComponent = () => {
  const { messages, selectedExchange, selectedStock } = useChatContext();

  return (
    <div>
      <div data-testid="messages">{messages.length}</div>
      <div data-testid="selectedExchange">{selectedExchange}</div>
      <div data-testid="selectedStock">{selectedStock as null}</div>
    </div>
  );
};

test("should initialize correctly", () => {
  render(
    <ChatProvider>
      <TestComponent />
    </ChatProvider>
  );

  expect(screen.getByTestId("messages").textContent).toBe("2");
  expect(screen.getByTestId("selectedExchange").textContent).toBe("");
  expect(screen.getByTestId("selectedStock").textContent).toBe("");
});

test("should add a new message", () => {
  const { result, rerender } = renderHook(() => useChatContext(), {
    wrapper: ChatProvider,
  });

  const { addMessage } = result.current;
  addMessage("New message", "bot", CHAT_ACTION.NONE);

  rerender();

  expect(result.current.messages.length).toBe(3);
  expect(result.current.messages[2].content).toBe("New message");
});

test("should select an exchange", () => {
  const { result, rerender } = renderHook(() => useChatContext(), {
    wrapper: ChatProvider,
  });

  const { selectExchange } = result.current;

  selectExchange("NASDAQ");

  rerender();

  expect(result.current.selectedExchange).toBe("NASDAQ");

  expect(result.current.messages.length).toBe(4);
  expect(result.current.messages[3].content).toHaveProperty("options");
});
test("should select a stock after selecting an exchange", async () => {
  const { result, rerender } = renderHook(() => useChatContext(), {
    wrapper: ChatProvider,
  });

  result.current.selectExchange("LSE");
  rerender();

  result.current.selectStock("FLTR");
  rerender();

  expect(result.current.selectedStock?.stockName).toBe(
    "FLUTTER ENTERTAINMENT PLC"
  );
  expect(result.current.selectedStock?.price).toBe(16340);

  const lastMessage =
    result.current.messages[result.current.messages.length - 1];
  expect(lastMessage.content).toMatchObject({
    title: "Current price of FLUTTER ENTERTAINMENT PLC: $16340.00",
    options: expect.any(Array),
  });
});
