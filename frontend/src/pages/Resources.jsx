import React, { useState, useEffect } from 'react';
import API from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Truck, Radio, Wrench, ShieldCheck, RefreshCw, Plus, CheckCircle, AlertCircle } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // New resource modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Ground Response');

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await API.get('/resources');
      setResources(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch resources:', err);
      setError('Could not connect to resource fleet database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleStatusToggle = async (resource, newStatus) => {
    try {
      setUpdatingId(resource._id);
      await API.put(`/resources/${resource._id}/status`, { status: newStatus });
      await fetchResources();
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    if (!newName) return;
    try {
      await API.post('/resources', { name: newName, type: newType, status: 'Available' });
      setNewName('');
      setShowAddModal(false);
      fetchResources();
    } catch (err) {
      console.error('Failed to create resource:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 font-mono">
            RESOURCE FLEET MANAGEMENT
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tactical Asset Inventory, Fleet Readiness & Operational Status Control
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Register New Resource
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex justify-between items-center">
          <span>{error}</span>
          <button onClick={fetchResources} className="underline font-bold">Retry</button>
        </div>
      )}

      {/* Grid of Operational Assets */}
      {loading ? (
        <div className="py-16 text-center text-cyan-400 font-mono text-xs">
          Loading resource fleet inventory...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <div
              key={res._id}
              className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between glass-panel-hover relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <StatusBadge status={res.status} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight font-mono">{res.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Category: {res.type}</p>
                </div>

                {res.assignedIncident && (
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono space-y-1">
                    <span className="text-slate-500 block">Assigned Incident:</span>
                    <span className="text-cyan-400 font-semibold line-clamp-1">
                      {res.assignedIncident.title || 'Incident #' + res.assignedIncident.slice(-6)}
                    </span>
                  </div>
                )}
              </div>

              {/* Interactive Status Controls */}
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 block mb-2">
                  Override Status State:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    disabled={updatingId === res._id || res.status === 'Available'}
                    onClick={() => handleStatusToggle(res, 'Available')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-semibold border transition-all ${
                      res.status === 'Available'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800 opacity-60 cursor-default'
                        : 'bg-slate-900 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border-slate-800'
                    }`}
                  >
                    Available
                  </button>

                  <button
                    disabled={updatingId === res._id || res.status === 'Assigned'}
                    onClick={() => handleStatusToggle(res, 'Assigned')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-semibold border transition-all ${
                      res.status === 'Assigned'
                        ? 'bg-indigo-950 text-indigo-400 border-indigo-800 opacity-60 cursor-default'
                        : 'bg-slate-900 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border-slate-800'
                    }`}
                  >
                    Assigned
                  </button>

                  <button
                    disabled={updatingId === res._id || res.status === 'Maintenance'}
                    onClick={() => handleStatusToggle(res, 'Maintenance')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-semibold border transition-all ${
                      res.status === 'Maintenance'
                        ? 'bg-rose-950 text-rose-400 border-rose-800 opacity-60 cursor-default'
                        : 'bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border-slate-800'
                    }`}
                  >
                    Maint.
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-mono">Register New Fleet Resource</h3>

            <form onSubmit={handleCreateResource} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Resource Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Rescue Helicopter Unit 2"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Category Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono"
                >
                  <option value="Ground Response">Ground Response</option>
                  <option value="Medical">Medical</option>
                  <option value="Transport">Transport</option>
                  <option value="Telecom">Telecom</option>
                  <option value="Rescue">Rescue</option>
                  <option value="Surveillance">Surveillance</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
