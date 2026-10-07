import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield, LogOut, Radio, UserCheck, Activity } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#060913]/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand & System Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              OpsPilot <span className="text-cyan-400 text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 uppercase tracking-widest font-mono">AI v1.0</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide">OPERATIONAL DISPATCH SYSTEM</p>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          SYSTEM OPERATIONAL
        </div>
      </div>

      {/* User Controls */}
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/80 flex items-center justify-center font-bold text-sm font-mono">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">{user.name}</p>
              <p className="text-[10px] text-cyan-400 font-mono font-medium">{user.role}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/60 transition-all text-xs font-medium flex items-center gap-1.5"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
