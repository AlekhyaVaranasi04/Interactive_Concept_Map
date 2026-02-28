import { useState } from "react";

function Navbar({ onMenuClick }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="p-2 md:p-4">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-2xl border border-slate-200 flex items-center justify-between px-4 md:px-6 h-14">
        <div className="flex items-center gap-3 text-slate-600">
          <button
            onClick={onMenuClick}
            className="md:hidden text-slate-600 hover:text-black p-2 hover:bg-slate-100 rounded-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="font-semibold text-slate-500 text-sm md:text-base">Light Workspace</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="hidden md:block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all shadow-sm text-sm font-medium border border-red-600">
            Login
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-black px-3 md:px-4 py-2 rounded-lg transition-all shadow-sm border border-slate-200"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                U
              </div>
              <span className="hidden md:inline text-sm font-medium">Profile</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <button className="w-full text-left px-4 py-2 hover:bg-sky-50 text-black text-sm transition-colors">
                  My Profile
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-violet-50 text-black text-sm transition-colors">
                  Settings
                </button>
                <hr className="my-2 border-slate-200" />
                <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm transition-colors">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
