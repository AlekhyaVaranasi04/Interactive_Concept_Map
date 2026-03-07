import { useState, useEffect } from "react";
import { mindmap } from "../services/api";

function HistoryPanel({ onSelectMindmap, refreshTrigger = 0 }) {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    setLoading(true);

    try {

      // Try session based history
      const sessions = await mindmap.listSessions();
      setHistory(sessions);

    } catch (err) {

      try {
        // fallback for old backend
        const h = await mindmap.getHistory();
        setHistory(h);
      } catch (e) {
        console.error(e);
        setHistory([]);
      }

    } finally {
      setLoading(false);
    }
  };

  const openSession = async (sessionId) => {

    try {

      const maps = await mindmap.getSessionMaps(sessionId);

      if (maps && maps.length > 0) {

        // load latest mindmap from that chat
        onSelectMindmap(maps[maps.length - 1].content);

      } else {
        alert("No maps found in this chat");
      }

    } catch (error) {
      console.error(error);
      alert("Failed to load session");
    }

  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-slate-500">Loading history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <p className="text-slate-500 text-lg mb-2">No chats yet</p>
          <p className="text-slate-400 text-sm">Create a mindmap to start</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-700">
          Chat History
        </h2>

        <button
          onClick={fetchHistory}
          className="text-slate-500 hover:text-slate-700"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-2">

        {history.map((item) => (

          <button
            key={item.id}
            onClick={() => openSession(item.id)}
            className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
          >

            <h3 className="font-semibold text-slate-700">
              {item.title || "Chat"}
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              {new Date(item.created_at).toLocaleString()}
            </p>

          </button>

        ))}

      </div>

    </div>
  );
}

export default HistoryPanel;