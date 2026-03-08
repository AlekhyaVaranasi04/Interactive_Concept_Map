import { useState } from "react";

function QuestionInput({ onSend }) {
  const [question, setQuestion] = useState("");

  const handleSend = () => {
    if (!question.trim()) return;

    onSend(question);
    setQuestion("");
  };

  return (
    <div className="border-t p-2 flex gap-2">
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something about the mindmap..."
        className="flex-1 border rounded px-3 py-2 text-sm"
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
      >
        Send
      </button>
    </div>
  );
}

export default QuestionInput;