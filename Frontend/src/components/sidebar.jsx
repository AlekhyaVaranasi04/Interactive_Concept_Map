import { useState } from "react";

function Sidebar({ isOpen, onClose, activeView, setActiveView, startNewChat }){
  const [collapsed, setCollapsed] = useState(false);

  const handleViewChange = (view) => {
    setActiveView(view);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/25 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
        fixed md:static inset-y-0 left-0 z-50
        ${collapsed ? "md:w-16" : "md:w-56"} w-64
        bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 p-5 shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 text-black/70 hover:text-black"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="hidden md:flex absolute top-4 right-4 h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
          title={collapsed ? "Open sidebar" : "Close sidebar"}
        >
          <svg className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="mb-6 mt-2">
          <h2 className={`font-bold text-slate-700 tracking-tight ${collapsed ? "text-xl text-center" : "text-3xl"}`}>
            {collapsed ? "M" : "mindmap"}
          </h2>
        </div>

        <button onClick={() => { startNewChat(); onClose(); }} className="w-full bg-sky-600 text-white px-3 py-2 rounded-xl mb-4">
        + New Chat
        </button>

        <ul className="space-y-3 text-black mb-8">
          <li
            onClick={() => handleViewChange("mindmap")}
            className={`cursor-pointer rounded-xl transition-all border text-sm px-3 py-2 ${collapsed ? "text-center" : "w-fit"} ${
              activeView === "mindmap"
                ? "bg-blue-600 text-white font-semibold border-blue-600 shadow-sm"
                : "hover:bg-slate-100 border-transparent text-slate-700"
            }`}
          >
            {collapsed ? "M" : "Mindmap"}
          </li>
          <li
            onClick={() => handleViewChange("history")}
            className={`cursor-pointer rounded-xl transition-all border text-sm px-3 py-2 ${collapsed ? "text-center" : "w-fit"} ${
              activeView === "history"
                ? "bg-blue-600 text-white font-semibold border-blue-600 shadow-sm"
                : "hover:bg-slate-100 border-transparent text-slate-700"
            }`}
          >
            {collapsed ? "H" : "History"}
          </li>
          <li
            onClick={() => handleViewChange("quiz")}
            className={`cursor-pointer rounded-xl transition-all border text-sm px-3 py-2 ${collapsed ? "text-center" : "w-fit"} ${
              activeView === "quiz"
                ? "bg-blue-600 text-white font-semibold border-blue-600 shadow-sm"
                : "hover:bg-slate-100 border-transparent text-slate-700"
            }`}
          >
            {collapsed ? "Q" : "Quiz"}
          </li>
        </ul>

      </div>
    </>
  );
}

export default Sidebar;
