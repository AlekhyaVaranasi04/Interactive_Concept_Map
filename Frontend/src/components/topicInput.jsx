import { useState } from "react";
import { mindmap } from "../services/api";

function TopicInput({ documentId, setMindmap }) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return alert("Enter a topic");

    try {
      setLoading(true);

      const data = await mindmap.generate({
        topic,
        document_id: documentId,
      });

      setMindmap(data.mindmap);
    } catch (err) {
      console.error(err);
      alert(err.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-sky-50 p-6 rounded-2xl shadow-md mb-6 border border-sky-200/50">
      <h2 className="text-lg font-semibold mb-4 text-sky-800">Generate Mindmap</h2>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic..."
        className="w-full border border-sky-200 p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white/70 text-sky-900 placeholder:text-sky-400"
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-sky-600 hover:to-cyan-600 transition-all shadow-md disabled:opacity-50 font-medium border border-sky-300"
      >
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}

export default TopicInput;