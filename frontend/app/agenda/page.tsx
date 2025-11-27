"use client";

import Link from "next/link";
import { useState } from "react";

export default function AgendaPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Give me your meeting topics and I'll organize them. Just list what you need to cover!",
    },
  ]);

  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Call your FastAPI backend (update URL when you set up backend)
      const response = await fetch("http://localhost:8000/api/agenda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // Add assistant response to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error calling API:", error);
      // Show error message to user
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="bg-surface border-b border-line px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text">
              Agenda Optimizer
            </h1>
            <p className="text-muted text-sm mt-1">
              Turn disorganized topics into structured agenda notes
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 border border-line rounded-lg text-text hover:bg-brand-50 transition-colors"
          >
            Back
          </Link>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-2xl rounded-2xl px-6 py-4 ${
                  message.role === "user"
                    ? "bg-brand-600 text-white"
                    : "bg-surface border border-line text-text"
                }`}
              >
                <p className="leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-2xl rounded-2xl px-6 py-4 bg-surface border border-line text-text">
                <p className="leading-relaxed text-muted">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-surface border-t border-line px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="List your topics (e.g., Budget approval, Gala planning, New member welcome...)"
              className="flex-1 px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-8 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim() || isLoading}
            >
              Send
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
