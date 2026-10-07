import React from 'react';
import { ShieldAlert, AlertTriangle, Info, Zap } from 'lucide-react';

const PriorityBadge = ({ level }) => {
  let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
  let Icon = Info;

  switch (level) {
    case 'Critical':
      badgeStyle = 'bg-red-950/90 text-red-400 border-red-700/80 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.3)]';
      Icon = Zap;
      break;
    case 'High':
      badgeStyle = 'bg-amber-950/80 text-amber-400 border-amber-800/80 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      Icon = ShieldAlert;
      break;
    case 'Moderate':
    case 'Medium':
      badgeStyle = 'bg-blue-950/80 text-blue-400 border-blue-800/60';
      Icon = AlertTriangle;
      break;
    case 'Low':
      badgeStyle = 'bg-slate-900 text-slate-400 border-slate-700/60';
      Icon = Info;
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeStyle}`}>
      <Icon className="w-3.5 h-3.5" />
      {level}
    </span>
  );
};

export default PriorityBadge;
