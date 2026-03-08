import React, { useState } from "react";
import QuestionInput from "./QuestionInput";import ChatInput from "./ChatInput";
function ChatPanel({ messages, setMessages, mindmap, onMindmapGenerated }) {

  const [chatMessages, setChatMessages] = useState([]);

  const handleQuestion = async (question) => {

    const userMsg = {
      role: "user",
      content: question
    };

    setChatMessages(prev => [...prev, userMsg]);

    // temporary AI response
    const aiMsg = {
      role: "assistant",
      content: "AI response will appear here."
    };

    setChatMessages(prev => [...prev, userMsg, aiMsg]);
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <ChatInput
          setMessages={setMessages}
          mode="panel"
          sessionId={sessionId}
          onMindmapGenerated={onMindmapGenerated}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* CHAT HISTORY */}
      <div className="flex-1 overflow-auto p-3 space-y-3">

        {chatMessages.length === 0 && (
          <div className="text-slate-400 text-sm">
            Ask questions about the mindmap.
          </div>
        )}

        {chatMessages.map((msg, i) => (

          <div
            key={i}
            className={
              msg.role === "user"
                ? "text-right"
                : "text-left"
            }
          >
            <div
              className={
                msg.role === "user"
                  ? "inline-block bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                  : "inline-block bg-slate-100 px-3 py-2 rounded-lg text-sm"
              }
            >
              {msg.content}
            </div>
          </div>

        ))}

      </div>

      {/* INPUT */}
      <QuestionInput onSend={handleQuestion} />

    </div>
  );
}

export default ChatPanel;
