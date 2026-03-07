import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatInput from "../components/ChatInput";
import MindMapView from "../components/MindMapView";
import HistoryPanel from "../components/HistoryPanel";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

function Home({ onLogout }) {

  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("mindmap");
  const [mindmapLayout, setMindmapLayout] = useState("TB");
  const [nodeStyle, setNodeStyle] = useState("rounded");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

  const latestMindmap = messages.length > 0 ? messages[messages.length - 1].content : null;

  const handleMindmapGenerated = () => {
    // Trigger history refresh
    setHistoryRefreshTrigger(prev => prev + 1);
  };

  // NEW CHAT
  const startNewChat = () => {
    setMessages([]);
  };

  const handleExportPDF = async () => {
    if (!latestMindmap) {
      alert("Please generate a mindmap first!");
      return;
    }

    try {
      const element = document.getElementById("mindmap");

      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [element.offsetWidth, element.offsetHeight],
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("mindmap.pdf");

    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed");
    }
  };

  const handleExportPNG = async () => {
    if (!latestMindmap) {
      alert("Please generate a mindmap first!");
      return;
    }

    try {
      const element = document.getElementById("mindmap");

      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
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
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-slate-200 mb-3 mx-auto">

                  <div className="flex flex-wrap gap-2 items-center justify-center">

                    <span className="text-xs font-semibold text-black">Style:</span>

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

                <div className="flex-1 flex flex-col items-center justify-center overflow-auto">

                  <div className="w-full max-w-7xl flex-1 overflow-auto">

                    <div className="h-full">

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

                </div>

                <div className="w-full max-w-4xl">
                  <ChatInput setMessages={setMessages} mode="center" onMindmapGenerated={handleMindmapGenerated} />
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

        <Navbar onMenuClick={() => setSidebarOpen(true)} onLogout={onLogout} />

        <div className="flex-1 overflow-hidden px-2 md:px-6">
          {renderMainContent()}
        </div>

        {activeView === "mindmap" && (
          <ChatInput setMessages={setMessages} mode="dock" onMindmapGenerated={handleMindmapGenerated} />
        )}

      </div>

    </div>
  );
}

export default Home;