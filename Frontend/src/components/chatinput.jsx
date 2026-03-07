import { useState } from "react";
import { mindmap } from "../services/api";

function ChatInput({ setMessages, mode = "dock", onMindmapGenerated }) {

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

      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      const data = await mindmap.generate(payload);

      // APPEND MINDMAP TO CHAT
      setMessages(prev => [
        ...prev,
        {
          type: "mindmap",
          content: data.mindmap
        }
      ]);

      // Notify parent to refresh history
      if (onMindmapGenerated) {
        onMindmapGenerated();
      }

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

            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic (optional)"
              disabled={isGenerating || isUploading}
              className="w-full bg-transparent text-black text-base rounded-xl focus:outline-none placeholder:text-slate-500"
            />

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Or paste text to analyze (optional)"
              disabled={isGenerating || isUploading}
              className="w-full bg-transparent text-black text-sm rounded-xl focus:outline-none placeholder:text-slate-500 resize-none h-24"
            />

            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-2">

                {uploadSuccess ? (

                  <div className="text-green-600 text-sm font-semibold">
                    ✓ Document uploaded
                  </div>

                ) : (

                  <>
                    <label className="bg-blue-600 text-white px-3 py-1.5 rounded-xl cursor-pointer hover:bg-blue-700 text-sm font-semibold">
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
                      className="bg-blue-500 text-white px-3 py-1.5 rounded-xl hover:bg-blue-600 text-sm font-semibold"
                    >
                      {isUploading ? "..." : "SEND"}
                    </button>
                  </>
                )}

              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || isUploading || (!topic && !text && !documentId)}
                className="bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700 text-sm font-semibold"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ChatInput;