import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import {
  AlertTriangle,
  Zap,
  MapPin,
  FileText,
  Layers,
  Sparkles,
  Bot,
  CheckCircle2,
  ArrowRight,
  Shield,
} from 'lucide-react';

const ReportIncident = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Environmental / Emergency');
  const [submitting, setSubmitting] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // Auto-fill official SIH Snowfall scenario
  const handleAutoFillSIH = () => {
    setTitle('Snowfall Blocking Patrol Route B');
    setDescription('Heavy snowfall has blocked Patrol Route B. Two personnel are stranded and the nearest available response team is 18 km away.');
    setLocation('Sector 4 - Patrol Route B');
    setType('Environmental / Emergency');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setProcessingStep('Transmitting operational telemetry to Gemini AI...');

    try {
      setTimeout(() => setProcessingStep('Parsing unstructured text into structured JSON response plan...'), 700);
      setTimeout(() => setProcessingStep('Auto-generating operational tasks & reserving response assets...'), 1400);

      const res = await API.post('/incidents', {
        title,
        description,
        location,
        type,
      });

      setTimeout(() => {
        navigate(`/incidents/${res.data._id}`);
      }, 2000);
    } catch (err) {
      console.error('Failed to submit incident:', err);
      alert('Error submitting incident. Please check server connection.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative">
      {/* Top Header */}
      <div className="border-b border-slate-800/60 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 font-mono">
              REPORT NEW INCIDENT
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Submit unstructured operational report for instant Gemini AI structuring & dispatch
            </p>
          </div>

          {/* Quick SIH Auto-fill Button */}
          <button
            type="button"
            onClick={handleAutoFillSIH}
            className="px-3.5 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-800/80 text-amber-300 text-xs font-bold transition-all shadow-lg shadow-amber-500/10 flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            ⚡ Auto-Fill SIH Demo Scenario
          </button>
        </div>
      </div>

      {/* Main Incident Intake Form */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Incident Title */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Incident Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Snowfall Blocking Patrol Route B"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Location / Grid Sector *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sector 4 - Patrol Route B"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono transition-all"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Incident Category Type
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-mono transition-all"
                >
                  <option value="Environmental / Emergency">Environmental / Emergency</option>
                  <option value="Infrastructure Failure">Infrastructure Failure</option>
                  <option value="Medical Evacuation">Medical Evacuation</option>
                  <option value="Security / Perimeter Breach">Security / Perimeter Breach</option>
                  <option value="Supply Chain Disruption">Supply Chain Disruption</option>
                  <option value="General Operational">General Operational</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Unstructured Operational Incident Report *
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide full narrative report detailing environmental hazards, personnel status, stranded units, medical threats, or route blockages..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all font-sans leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              💡 Gemini AI will extract key risk indicators, calculate severity, auto-reserve response assets, and generate action steps.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            Submit & Run AI Assessment
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Futuristic High-Tech Processing Overlay Modal */}
      {submitting && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="glass-panel p-8 max-w-md w-full rounded-3xl border border-cyan-500/50 text-center space-y-6 shadow-2xl glow-cyan relative overflow-hidden">
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyan-950 border border-cyan-500/80 shadow-lg shadow-cyan-500/30">
              <Bot className="w-10 h-10 text-cyan-400 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-white font-mono tracking-wide">
                OPSPILOT AI ENGINE PARSING
              </h3>
              <p className="text-xs text-cyan-400 font-mono animate-pulse font-semibold">
                {processingStep}
              </p>
            </div>

            <div className="space-y-2 text-left text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Incident Telemetry Ingested</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-300">
                <Shield className="w-4 h-4 animate-spin" />
                <span>Gemini Structured Reasoner Active</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Layers className="w-4 h-4" />
                <span>Auto Resource Reservation Pending</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportIncident;
