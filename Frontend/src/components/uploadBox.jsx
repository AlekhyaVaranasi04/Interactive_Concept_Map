import { useState } from "react";
import { mindmap } from "../services/api";

function UploadBox({ setDocumentId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const data = await mindmap.upload(file);

      setDocumentId(data.document_id);
      setFile(null);
      alert("Upload successful!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-sky-50 p-6 rounded-2xl shadow-md mb-6 border border-sky-200/50">
      <h2 className="text-lg font-semibold mb-4 text-sky-800">Upload Document</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 file:bg-gradient-to-r file:from-sky-500 file:to-cyan-500 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-none file:cursor-pointer file:hover:from-sky-600 file:hover:to-cyan-600 file:transition-all"
      />

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-sky-600 hover:to-cyan-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium border border-sky-300"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default UploadBox;