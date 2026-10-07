import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, PlusCircle, Truck, Shield, Radio, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
    { path: '/incidents', label: 'Incidents Directory', icon: AlertTriangle },
    { path: '/report', label: 'Report Incident', icon: PlusCircle, highlight: true },
    { path: '/resources', label: 'Resource Fleet', icon: Truck },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#060913] p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
            MAIN NAVIGATION
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                        : item.highlight
                        ? 'text-cyan-300 hover:bg-cyan-950/40 hover:text-cyan-400 border border-cyan-900/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Live Command Radar Widget */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              AI RADAR ACTIVE
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
              READY
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gemini 2.5 Flash operational parser ready for unstructured incident intake.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/60 text-center">
        <p className="text-[10px] font-mono text-slate-500">
          OpsPilot AI &bull; Hackathon Edition
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
