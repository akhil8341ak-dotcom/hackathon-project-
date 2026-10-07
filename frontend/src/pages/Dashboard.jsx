import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import KpiCard from '../components/KpiCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import {
  AlertTriangle,
  Zap,
  Truck,
  Workflow,
  Radio,
  Clock,
  ArrowRight,
  ShieldAlert,
  Activity,
  PlusCircle,
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/dashboard');
      setData(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Could not connect to OpsPilot API server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh] text-cyan-400 font-mono">
        <div className="flex flex-col items-center gap-3">
          <Activity className="w-8 h-8 animate-spin" />
          <p className="text-sm animate-pulse uppercase tracking-widest">Gathering Command Center Metrics...</p>
        </div>
      </div>
    );
  }

  const { kpis, distributions, criticalAlerts, recentActivity } = data || {
    kpis: { totalIncidents: 0, criticalIncidents: 0, resourcesAssigned: 0, resourcesTotal: 0, activeWorkflows: 0 },
    distributions: { severity: { Critical: 0, High: 0, Moderate: 0, Low: 0 }, status: { Open: 0, InProgress: 0, Resolved: 0 } },
    criticalAlerts: [],
    recentActivity: [],
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 font-mono">
            COMMAND CENTER DASHBOARD
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-Time AI Operational Dispatch & Tactical Resource Monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition-all flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Refresh Telemetry
          </button>

          <Link
            to="/report"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Report New Incident
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchDashboardData} className="underline font-bold">Retry</button>
        </div>
      )}

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Incidents"
          value={kpis.totalIncidents}
          icon={AlertTriangle}
          color="cyan"
          subtext="Logged in command database"
        />

        <KpiCard
          title="Critical Emergencies"
          value={kpis.criticalIncidents}
          icon={Zap}
          color="red"
          alert={kpis.criticalIncidents > 0}
          subtext="Requires immediate dispatch"
        />

        <KpiCard
          title="Resources Assigned"
          value={`${kpis.resourcesAssigned} / ${kpis.resourcesTotal}`}
          icon={Truck}
          color="amber"
          subtext="Fleet deployment capacity"
        />

        <KpiCard
          title="Active AI Workflows"
          value={kpis.activeWorkflows}
          icon={Workflow}
          color="indigo"
          subtext="Tasks in active execution"
        />
      </div>

      {/* Visual Distributions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            Severity Level Breakdown
          </h2>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-red-400">Critical</span>
                <span className="font-mono text-slate-300">{distributions.severity.Critical}</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${kpis.totalIncidents ? (distributions.severity.Critical / kpis.totalIncidents) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-400">High</span>
                <span className="font-mono text-slate-300">{distributions.severity.High}</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${kpis.totalIncidents ? (distributions.severity.High / kpis.totalIncidents) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-blue-400">Moderate</span>
                <span className="font-mono text-slate-300">{distributions.severity.Moderate}</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${kpis.totalIncidents ? (distributions.severity.Moderate / kpis.totalIncidents) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">Low</span>
                <span className="font-mono text-slate-300">{distributions.severity.Low}</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-slate-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${kpis.totalIncidents ? (distributions.severity.Low / kpis.totalIncidents) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Operational Status Pipeline
          </h2>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-center">
              <span className="text-2xl font-black text-cyan-400 font-mono">{distributions.status.Open}</span>
              <p className="text-[11px] font-semibold text-slate-300 uppercase mt-1">Open</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/50 text-center">
              <span className="text-2xl font-black text-amber-400 font-mono">{distributions.status.InProgress}</span>
              <p className="text-[11px] font-semibold text-slate-300 uppercase mt-1">In Progress</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-center">
              <span className="text-2xl font-black text-emerald-400 font-mono">{distributions.status.Resolved}</span>
              <p className="text-[11px] font-semibold text-slate-300 uppercase mt-1">Resolved</p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total System Throughput</span>
            <span className="font-mono text-cyan-400 font-bold">{kpis.totalIncidents} Managed</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Critical Alerts Feed & System Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Alerts Feed (2 Columns) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-mono">
              <Zap className="w-4 h-4 text-red-500 animate-pulse" />
              CRITICAL ALERTS & PRIORITY FEED
            </h2>
            <Link to="/incidents" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              View All Directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {criticalAlerts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
              No active Critical or High severity alerts at this time. All sectors nominal.
            </div>
          ) : (
            <div className="space-y-3">
              {criticalAlerts.map((incident) => (
                <div
                  key={incident._id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <PriorityBadge level={incident.severity} />
                      <StatusBadge status={incident.status} />
                      <span className="text-xs text-slate-400 font-mono">{incident.location}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100">{incident.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{incident.summary || incident.description}</p>
                  </div>

                  <Link
                    to={`/incidents/${incident._id}`}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 text-xs font-semibold whitespace-nowrap text-center transition-all flex items-center gap-1 justify-center"
                  >
                    Manage <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Real-time System Activity Log (1 Column) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-mono mb-4">
            <Activity className="w-4 h-4 text-cyan-400" />
            SYSTEM ACTIVITY LOG
          </h2>

          {recentActivity.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">No activity logged yet.</div>
          ) : (
            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {recentActivity.map((log) => (
                <div key={log._id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cyan-400 font-mono">{log.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{log.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
