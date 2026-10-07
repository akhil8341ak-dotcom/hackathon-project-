import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import {
  ArrowLeft,
  Bot,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  FileText,
  Truck,
  Activity,
  Layers,
  Sparkles,
  Download,
  X,
} from 'lucide-react';

const IncidentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportContent, setReportContent] = useState('');

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/incidents/${id}`);
      setData(res.data);
      if (res.data.incident?.aiReport) {
        setReportContent(res.data.incident.aiReport);
      }
    } catch (err) {
      console.error('Failed to load incident details:', err);
      setError('Could not load incident file from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await API.put(`/incidents/${id}/status`, { status: newStatus });
      await fetchDetails();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      const res = await API.post(`/incidents/${id}/report`);
      setReportContent(res.data.report);
      setShowReportModal(true);
      await fetchDetails();
    } catch (err) {
      console.error('Report generation error:', err);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh] text-cyan-400 font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <Activity className="w-8 h-8 animate-spin" />
          <p className="animate-pulse">Loading Operational Incident File #{id.slice(-6)}...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Incident File Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'Requested record does not exist.'}</p>
        <button
          onClick={() => navigate('/incidents')}
          className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 font-bold"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  const { incident, tasks, activityLogs, assignedResources } = data;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/incidents"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <span>INCIDENT RECORD</span>
              <span>&bull;</span>
              <span className="text-cyan-400">#{incident._id.slice(-6).toUpperCase()}</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">{incident.title}</h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Change Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono">
            <span className="text-slate-400 uppercase">Status:</span>
            <select
              value={incident.status}
              disabled={updatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-transparent text-slate-100 font-bold focus:outline-none cursor-pointer"
            >
              <option value="Open" className="bg-slate-900 text-cyan-400">Open</option>
              <option value="In Progress" className="bg-slate-900 text-amber-400">In Progress</option>
              <option value="Resolved" className="bg-slate-900 text-emerald-400">Resolved</option>
            </select>
          </div>

          {/* Command Report Button */}
          <button
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            {generatingReport ? 'Generating Report...' : 'Generate AI Command Report'}
          </button>
        </div>
      </div>

      {/* Side-by-Side View: Original Incident vs Gemini AI Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Original Incident Report */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              Original Incident Intake
            </h2>
            <StatusBadge status={incident.status} />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <p className="text-[10px] font-mono font-semibold uppercase text-slate-500">Location / Sector</p>
              <p className="text-slate-200 font-mono flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {incident.location}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-mono font-semibold uppercase text-slate-500">Reported Category & Type</p>
              <p className="text-slate-200 font-mono mt-0.5">{incident.type} &bull; {incident.category}</p>
            </div>

            <div>
              <p className="text-[10px] font-mono font-semibold uppercase text-slate-500">Full Description</p>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 leading-relaxed font-sans mt-1">
                {incident.description}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800/60">
              <span>Reported By: {incident.createdBy?.name || 'System Dispatch'}</span>
              <span>{new Date(incident.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Gemini AI Operational Assessment */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-900/40 bg-cyan-950/10 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Bot className="w-32 h-32 text-cyan-400" />
          </div>

          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              Gemini AI Structured Assessment
            </h2>
            <PriorityBadge level={incident.severity} />
          </div>

          <div className="space-y-4 text-xs">
            {/* Executive Summary */}
            <div>
              <p className="text-[10px] font-mono font-semibold uppercase text-cyan-400/80">Executive Summary</p>
              <p className="text-slate-200 mt-1 leading-relaxed font-semibold">
                {incident.summary || 'AI parsing complete.'}
              </p>
            </div>

            {/* Impact & Risk Analysis */}
            <div>
              <p className="text-[10px] font-mono font-semibold uppercase text-amber-400/80">Impact & Operational Risks</p>
              <p className="text-slate-300 mt-1 leading-relaxed bg-amber-950/20 border border-amber-900/40 p-3 rounded-xl">
                {incident.impact || 'Standard operational risk level.'}
              </p>
            </div>

            {/* Recommended Action Plan */}
            <div>
              <p className="text-[10px] font-mono font-semibold uppercase text-emerald-400/80">Recommended Response Action Plan</p>
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-200 whitespace-pre-line leading-relaxed font-mono text-[11px] mt-1">
                {incident.recommendedAction}
              </div>
            </div>

            {/* Required Resources Tags */}
            <div>
              <p className="text-[10px] font-mono font-semibold uppercase text-slate-400 mb-1.5">Required Resource Capabilities</p>
              <div className="flex flex-wrap gap-2">
                {incident.requiredResources && incident.requiredResources.length > 0 ? (
                  incident.requiredResources.map((res, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-800/60 text-cyan-300 font-mono text-[11px] flex items-center gap-1"
                    >
                      <Truck className="w-3 h-3 text-cyan-400" />
                      {res}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 font-mono">Standard Response Team</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Assigned Team:</span>
                <span className="text-cyan-300 font-bold text-xs">{incident.assignedTeam}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Est. Arrival Window:</span>
                <span className="text-amber-300 font-bold text-xs">{incident.estimatedResponseTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Generated Tasks & Assigned Resources Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automated Task Workflow Tracker */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Automated Task Dispatch Tracker ({tasks.length})
          </h2>

          {tasks.length === 0 ? (
            <p className="text-xs text-slate-500">No active tasks dispatched for this incident.</p>
          ) : (
            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-200">{task.title}</p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span>Team: <strong className="text-cyan-400">{task.assignedTeam}</strong></span>
                      <span>&bull;</span>
                      <span>Priority: <strong className="text-amber-400">{task.priority}</strong></span>
                    </div>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Operational Resources Fleet */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            Reserved Resource Allocations ({assignedResources.length})
          </h2>

          {assignedResources.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
              No specific resources currently reserved for this incident.
            </div>
          ) : (
            <div className="space-y-2.5">
              {assignedResources.map((res) => (
                <div
                  key={res._id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-white font-mono">{res.name}</p>
                    <p className="text-[10px] font-mono text-slate-400">Category: {res.type}</p>
                  </div>
                  <StatusBadge status={res.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Activity Audit Trail */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Incident Activity Audit Trail
        </h2>

        <div className="space-y-2 font-mono text-xs">
          {activityLogs.map((log) => (
            <div key={log._id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4">
              <div>
                <span className="font-semibold text-cyan-400">{log.action}</span>
                <p className="text-slate-300 text-[11px] mt-0.5">{log.description}</p>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Command Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-3xl w-full max-h-[85vh] rounded-3xl border border-cyan-500/40 p-6 flex flex-col shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                EXECUTIVE AI COMMAND REPORT
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
              {reportContent}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
              >
                Close Briefing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentDetails;
