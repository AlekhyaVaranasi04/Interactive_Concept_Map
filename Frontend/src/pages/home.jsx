import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatInput from "../components/ChatInput";
import MindMapView from "../components/MindMapView";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

function Home() {
  const [mindmap, setMindmap] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("mindmap");
  const [mindmapLayout, setMindmapLayout] = useState("TB");
  const [nodeStyle, setNodeStyle] = useState("rounded");
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportPDF = async () => {
    if (!mindmap) {
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
      alert("Mindmap exported as PDF successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  const handleExportPNG = async () => {
    if (!mindmap) {
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
      alert("Mindmap exported as PNG successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  const handleExportJSON = () => {
    if (!mindmap) {
      alert("Please generate a mindmap first!");
      return;
    }

    try {
      const jsonString = JSON.stringify(mindmap, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "mindmap.json";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      alert("Mindmap exported as JSON successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  const renderMainContent = () => {
    switch (activeView) {
      case "mindmap":
        return (
          <div className="h-full flex flex-col">
            {mindmap ? (
              <>
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-slate-200 mb-3 mx-auto">
                  <div className="flex flex-wrap gap-2 items-center justify-center">
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-semibold text-black">Layout:</span>
                      <button
                        onClick={() => setMindmapLayout("TB")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                          mindmapLayout === "TB"
                            ? "bg-blue-600 text-white shadow-sm border-blue-600"
                            : "bg-white text-black hover:bg-sky-50 border-slate-200 hover:border-sky-300"
                        }`}
                      >
                        TB
                      </button>
                      <button
                        onClick={() => setMindmapLayout("LR")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                          mindmapLayout === "LR"
                            ? "bg-blue-600 text-white shadow-sm border-blue-600"
                            : "bg-white text-black hover:bg-emerald-50 border-slate-200 hover:border-emerald-300"
                        }`}
                      >
                        LR
                      </button>
                      <button
                        onClick={() => setMindmapLayout("RL")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                          mindmapLayout === "RL"
                            ? "bg-blue-600 text-white shadow-sm border-blue-600"
                            : "bg-white text-black hover:bg-violet-50 border-slate-200 hover:border-violet-300"
                        }`}
                      >
                        RL
                      </button>
                    </div>

                    <div className="w-px h-6 bg-slate-200" />

                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-semibold text-black">Style:</span>
                      <button
                        onClick={() => setNodeStyle("rounded")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                          nodeStyle === "rounded"
                            ? "bg-blue-600 text-white shadow-sm border-blue-600"
                            : "bg-white text-black hover:bg-sky-50 border-slate-200 hover:border-sky-300"
                        }`}
                      >
                        Rounded
                      </button>
                      <button
                        onClick={() => setNodeStyle("sharp")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                          nodeStyle === "sharp"
                            ? "bg-blue-600 text-white shadow-sm border-blue-600"
                            : "bg-white text-black hover:bg-emerald-50 border-slate-200 hover:border-emerald-300"
                        }`}
                      >
                        Sharp
                      </button>
                      <button
                        onClick={() => setNodeStyle("pill")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                          nodeStyle === "pill"
                            ? "bg-blue-600 text-white shadow-sm border-blue-600"
                            : "bg-white text-black hover:bg-violet-50 border-slate-200 hover:border-violet-300"
                        }`}
                      >
                        Pill
                      </button>
                    </div>

                    <div className="w-px h-6 bg-slate-200" />

                    <div className="relative">
                      <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="px-4 py-1.5 rounded-xl text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2 border border-blue-600"
                      >
                        Export
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {showExportMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                          <button
                            onClick={() => {
                              handleExportPDF();
                              setShowExportMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-sky-50 text-black text-sm transition-colors"
                          >
                            Export as PDF
                          </button>
                          <button
                            onClick={() => {
                              handleExportPNG();
                              setShowExportMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-black text-sm transition-colors"
                          >
                            Export as PNG
                          </button>
                          <button
                            onClick={() => {
                              handleExportJSON();
                              setShowExportMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-violet-50 text-black text-sm transition-colors"
                          >
                            Export as JSON
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-7xl h-full">
                    <MindMapView data={mindmap} layout={mindmapLayout} nodeStyle={nodeStyle} />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="text-center mb-7">
                  <h2 className="text-5xl font-semibold text-slate-700 tracking-tight mb-4">Hi, I&apos;m Mindmap.</h2>
                  <p className="text-xl text-slate-500">How can I help you today?</p>
                </div>
                <div className="w-full max-w-4xl">
                  <ChatInput setMindmap={setMindmap} mode="center" />
                </div>
              </div>
            )}
          </div>
        );

      case "quiz":
        return (
          <div className="flex items-center justify-center h-full text-black p-4">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4 text-slate-300">QZ</div>
              <h2 className="text-2xl font-bold text-black mb-2">Quiz Feature</h2>
              <p className="text-black/70">
                Test your knowledge with AI-generated quizzes based on your documents.
              </p>
              <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-sm border border-blue-600">
                Start Quiz
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 text-black transition-colors duration-300">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-hidden px-2 md:px-6">{renderMainContent()}</div>

        {mindmap && activeView === "mindmap" ? <ChatInput setMindmap={setMindmap} mode="dock" /> : null}
      </div>
    </div>
  );
}

export default Home;
