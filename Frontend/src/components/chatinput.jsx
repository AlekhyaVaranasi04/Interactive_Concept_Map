import { useState } from "react";

function ChatInput({ setMindmap, mode = "dock" }) {
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setDocumentId(data.document_id);
      alert("Document uploaded successfully!");
    } catch (error) {
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic) return alert("Enter topic");

    setIsGenerating(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/generate-mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          document_id: documentId,
        }),
      });

      const data = await res.json();
      setMindmap(data.mindmap);
    } catch (error) {
      alert("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const isCenter = mode === "center";

  return (
    <div
      className={
        isCenter
          ? "bg-white border border-slate-200 p-3 md:p-4 shadow-sm rounded-3xl"
          : "bg-white/95 border-t border-slate-200 p-2.5 md:p-3 shadow-sm mb-3 md:mb-4"
      }
    >
      <div className={`${isCenter ? "max-w-full" : "max-w-6xl mx-auto"}`}>
        <div className="hidden md:block">
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 px-4 py-3">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={isCenter ? "Message Mindmap" : "Tell me about the resume"}
              disabled={isGenerating}
              className="w-full bg-transparent text-black text-base rounded-xl focus:outline-none placeholder:text-slate-500"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <label
                  className={`bg-blue-600 text-white px-3 py-1.5 rounded-xl cursor-pointer hover:bg-blue-700 transition-all shadow-sm border border-blue-600 text-sm font-semibold min-w-[96px] text-center ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {file ? `+ ${file.name.substring(0, 8)}...` : "+ Upload"}
                  <input
                    type="file"
                    hidden
                    disabled={isUploading}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>

                <button
                  onClick={handleUpload}
                  disabled={isUploading || !file}
                  className="bg-blue-500 text-white px-3 py-1.5 rounded-xl hover:bg-blue-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[88px] text-sm font-semibold uppercase tracking-wide border border-blue-500"
                >
                  {isUploading ? "..." : "SEND"}
                </button>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !topic}
                className="bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] text-sm font-semibold border border-emerald-600"
              >
                {isGenerating ? "..." : "Generate"}
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden space-y-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={isCenter ? "Message Mindmap" : "Tell me about the resume"}
              disabled={isGenerating}
              className="w-full bg-transparent text-black p-1 focus:outline-none text-sm disabled:opacity-50 placeholder:text-slate-500"
            />

            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <label
                  className={`bg-blue-600 text-white px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-blue-700 transition-all text-center text-xs border border-blue-600 font-semibold ${
                    isUploading ? "opacity-50" : ""
                  }`}
                >
                  {file ? `+ ${file.name.substring(0, 8)}...` : "+ Upload"}
                  <input
                    type="file"
                    hidden
                    disabled={isUploading}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>

                <button
                  onClick={handleUpload}
                  disabled={isUploading || !file}
                  className="bg-blue-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-600 transition-all text-xs whitespace-nowrap disabled:opacity-50 shadow-sm border border-blue-500 font-semibold uppercase tracking-wide"
                >
                  {isUploading ? "..." : "SEND"}
                </button>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !topic}
                className="bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50 text-xs font-semibold border border-emerald-600"
              >
                {isGenerating ? "..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
