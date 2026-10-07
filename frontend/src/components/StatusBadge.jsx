import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Radio, Wrench, ShieldAlert } from 'lucide-react';

const StatusBadge = ({ status }) => {
  let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
  let Icon = Clock;

  switch (status) {
    case 'Open':
      badgeStyle = 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]';
      Icon = AlertCircle;
      break;
    case 'In Progress':
      badgeStyle = 'bg-amber-950/80 text-amber-400 border-amber-800/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      Icon = Clock;
      break;
    case 'Resolved':
    case 'Completed':
      badgeStyle = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
      Icon = CheckCircle2;
      break;
    case 'Available':
      badgeStyle = 'bg-emerald-950/70 text-emerald-400 border-emerald-800/50';
      Icon = Radio;
      break;
    case 'Assigned':
      badgeStyle = 'bg-indigo-950/80 text-indigo-400 border-indigo-800/60 shadow-[0_0_10px_rgba(99,102,241,0.2)]';
      Icon = ShieldAlert;
      break;
    case 'Maintenance':
      badgeStyle = 'bg-rose-950/80 text-rose-400 border-rose-800/60';
      Icon = Wrench;
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

export default StatusBadge;
