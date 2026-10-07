import React from 'react';

const KpiCard = ({ title, value, icon: Icon, color = 'cyan', subtext, alert = false }) => {
  const colorMap = {
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    red: 'border-red-500/30 text-red-400 bg-red-500/10',
    emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    indigo: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
  };

  const selectedColor = colorMap[color] || colorMap.cyan;

  return (
    <div className={`glass-panel p-5 rounded-2xl border glass-panel-hover relative overflow-hidden ${alert ? 'border-red-500/40 glow-red' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-black text-white mt-1 tracking-tight font-mono">{value}</h3>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3.5 rounded-xl border ${selectedColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color === 'red' ? 'from-red-500 to-rose-600' : color === 'amber' ? 'from-amber-500 to-yellow-600' : 'from-cyan-500 to-blue-600'}`} />
    </div>
  );
};

export default KpiCard;
