import { useState } from "react";
import { mindmap } from "../services/api";

function ChatInput({ setMindmap, mode = "dock" }) {
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    setIsUploading(true);
    try {
      const data = await mindmap.upload(file);
      setDocumentId(data.document_id);
      setFile(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      alert(error.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic && !text && !documentId) {
      alert("Please enter a topic, text, or upload a document");
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        topic: topic || undefined,
        text: text || undefined,
        document_id: documentId || undefined,
      };

      // Remove undefined values
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      const data = await mindmap.generate(payload);
      setMindmap(data.mindmap);
      setTopic("");
      setText("");
    } catch (error) {
      alert(error.message || "Generation failed. Please try again.");
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
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 px-4 py-3 space-y-3">
            <div>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic (optional)"
                disabled={isGenerating || isUploading}
                className="w-full bg-transparent text-black text-base rounded-xl focus:outline-none placeholder:text-slate-500 disabled:opacity-50"
              />
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Or paste text to analyze (optional)"
              disabled={isGenerating || isUploading}
              className="w-full bg-transparent text-black text-sm rounded-xl focus:outline-none placeholder:text-slate-500 resize-none h-24 disabled:opacity-50"
            />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {uploadSuccess ? (
                  <div className="text-green-600 text-sm font-semibold">
                    ✓ Document uploaded
                  </div>
                ) : (
                  <>
                    <label
                      className={`bg-blue-600 text-white px-3 py-1.5 rounded-xl cursor-pointer hover:bg-blue-700 transition-all shadow-sm border border-blue-600 text-sm font-semibold min-w-[96px] text-center ${
                        isUploading || isGenerating ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {file ? `+ ${file.name.substring(0, 12)}...` : "+ Upload PDF"}
                      <input
                        type="file"
                        accept=".pdf"
                        hidden
                        disabled={isUploading || isGenerating}
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </label>

                    <button
                      onClick={handleUpload}
                      disabled={isUploading || !file || isGenerating}
                      className="bg-blue-500 text-white px-3 py-1.5 rounded-xl hover:bg-blue-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[88px] text-sm font-semibold uppercase tracking-wide border border-blue-500"
                    >
                      {isUploading ? "..." : "SEND"}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || isUploading || (!topic && !text && !documentId)}
                className="bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] text-sm font-semibold border border-emerald-600"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden space-y-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 space-y-2">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic"
              disabled={isGenerating || isUploading}
              className="w-full bg-transparent text-black p-1 focus:outline-none text-sm disabled:opacity-50 placeholder:text-slate-500"
            />

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Or paste text"
              disabled={isGenerating || isUploading}
              className="w-full bg-transparent text-black text-xs rounded-lg focus:outline-none placeholder:text-slate-500 resize-none h-16 disabled:opacity-50"
            />

            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                {uploadSuccess ? (
                  <div className="text-green-600 text-xs font-semibold">✓ Uploaded</div>
                ) : (
                  <>
                    <label
                      className={`bg-blue-600 text-white px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-blue-700 transition-all text-center text-xs border border-blue-600 font-semibold ${
                        isUploading || isGenerating ? "opacity-50" : ""
                      }`}
                    >
                      {file ? `+ ${file.name.substring(0, 8)}...` : "+ PDF"}
                      <input
                        type="file"
                        accept=".pdf"
                        hidden
                        disabled={isUploading || isGenerating}
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </label>

                    <button
                      onClick={handleUpload}
                      disabled={isUploading || !file || isGenerating}
                      className="bg-blue-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-600 transition-all text-xs whitespace-nowrap disabled:opacity-50 shadow-sm border border-blue-500 font-semibold uppercase tracking-wide"
                    >
                      {isUploading ? "..." : "SEND"}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || isUploading || (!topic && !text && !documentId)}
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
