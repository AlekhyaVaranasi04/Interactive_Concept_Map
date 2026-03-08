import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatPanel from "../components/ChatPanel";
import MindMapView from "../components/MindMapView";
import HistoryPanel from "../components/HistoryPanel";
import { mindmap } from "../services/api";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

function Home({ onLogout }) {

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("mindmap");
  const [mindmapLayout, setMindmapLayout] = useState("TB");
  const [nodeStyle, setNodeStyle] = useState("rounded");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

  const latestMindmap =
    messages.length > 0 ? messages[messages.length - 1].content : null;

  const handleMindmapGenerated = () => {
    setHistoryRefreshTrigger((prev) => prev + 1);
  };

  // Create new chat session
  const startNewChat = async () => {
    setMessages([]);

    try {
      const res = await mindmap.createSession("New chat");
      setSessionId(res.session.id);
    } catch (e) {
      console.error("Session creation failed", e);
    }
  };

  // Export PDF
  const handleExportPDF = async () => {
    if (!latestMindmap) {
      alert("Please generate a mindmap first!");
      return;
    }

    try {
      const element = document.querySelector(".react-flow__viewport");

      const dataUrl = await toPng(element, {
        pixelRatio: 3,
        width: element.scrollWidth,
        height: element.scrollHeight,
        backgroundColor: "white",
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [element.scrollWidth, element.scrollHeight],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0);
      pdf.save("mindmap.pdf");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed");
    }
  };

  // Export PNG
  const handleExportPNG = async () => {
    if (!latestMindmap) {
      alert("Please generate a mindmap first!");
      return;
    }

    try {
      const element = document.querySelector(".react-flow__viewport");

      const dataUrl = await toPng(element, {
        pixelRatio: 3,
        width: element.scrollWidth,
        height: element.scrollHeight,
        backgroundColor: "white",
      });

      const link = document.createElement("a");
      link.download = "mindmap.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed");
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    if (!latestMindmap) {
      alert("Please generate a mindmap first!");
      return;
    }

    const jsonString = JSON.stringify(latestMindmap, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.download = "mindmap.json";
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case "mindmap":
        return (
          <div className="h-full flex flex-col">

            {messages.length > 0 ? (
              <>
                {/* Top toolbar */}
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-slate-200 mb-3 mx-auto">
                  <div className="flex flex-wrap gap-2 items-center justify-center">

                    <span className="text-xs font-semibold text-black">
                      Style:
                    </span>

                    <button
                      onClick={() => setNodeStyle("rounded")}
                      className="px-3 py-1 rounded bg-blue-600 text-white"
                    >
                      Rounded
                    </button>

                    <button
                      onClick={() => setNodeStyle("sharp")}
                      className="px-3 py-1 rounded bg-blue-600 text-white"
                    >
                      Sharp
                    </button>

                    <button
                      onClick={() => setNodeStyle("pill")}
                      className="px-3 py-1 rounded bg-blue-600 text-white"
                    >
                      Pill
                    </button>

                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="px-4 py-1 rounded bg-blue-600 text-white"
                    >
                      Export
                    </button>

                    {showExportMenu && (
                      <div className="absolute mt-10 bg-white shadow rounded border">

                        <button
                          onClick={handleExportPDF}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Export PDF
                        </button>

                        <button
                          onClick={handleExportPNG}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Export PNG
                        </button>

                        <button
                          onClick={handleExportJSON}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Export JSON
                        </button>

                      </div>
                    )}
                  </div>
                </div>

                {/* Mindmap canvas */}
                <div className="flex-1 flex flex-col items-center justify-center overflow-auto">
                  <div className="w-full max-w-7xl flex-1 overflow-auto">

                    {messages.map((msg, i) => (
                      <div key={i} className="h-full">

                        <MindMapView
                          data={msg.content}
                          layout={mindmapLayout}
                          nodeStyle={nodeStyle}
                        />

                      </div>
                    ))}

                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center px-4">

                <div className="text-center mb-7">
                  <h2 className="text-5xl font-semibold text-slate-700 mb-4">
                    Hi, I'm Mindmap
                  </h2>

                  <p className="text-xl text-slate-500">
                    How can I help you today?
                  </p>

                  <p className="text-sm text-slate-400 mt-4">
                    Use the panel on the right to generate your mindmap.
                  </p>
                </div>

              </div>
            )}

          </div>
        );

      case "history":
        return (
          <HistoryPanel
            onSelectMindmap={(map) =>
              setMessages([{ type: "mindmap", content: map }])
            }
            refreshTrigger={historyRefreshTrigger}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
        startNewChat={startNewChat}
      />

      <div className="flex flex-col flex-1">

        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={onLogout}
        />

        <div className="flex flex-1 overflow-hidden">

          {/* Mindmap Workspace */}
          <div className="flex-1 min-w-0 px-4">
            {renderMainContent()}
          </div>

          {/* Chat Panel */}
          <div className="w-96 border-l bg-white">
            <ChatPanel
              messages={messages}
              setMessages={setMessages}
              mindmap={latestMindmap}
              onMindmapGenerated={handleMindmapGenerated}
              sessionId={sessionId}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;