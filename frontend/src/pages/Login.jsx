import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Zap, UserCheck, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, demoLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoClick = async (role) => {
    setError('');
    setSubmitting(true);
    try {
      await demoLogin(role);
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login failed. Make sure backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 shadow-xl shadow-cyan-500/20 mb-4 border border-cyan-400/30">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white font-mono">
          OpsPilot <span className="text-cyan-400">AI</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-mono">
          OPERATIONAL COMMAND & AI DISPATCH PLATFORM
        </p>
      </div>

      {/* Login Card */}
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        <h2 className="text-xl font-bold text-slate-100 mb-2">Access Command Center</h2>
        <p className="text-xs text-slate-400 mb-6">Enter your authorized operational credentials to continue.</p>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
              Operational Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@opspilot.ai"
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In to Command Center'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Section */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-xs font-mono text-slate-400 font-semibold mb-3 text-center uppercase tracking-wider">
            ⚡ Quick Hackathon Reviewer Access
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleDemoClick('Operations Manager')}
              disabled={submitting}
              className="px-3 py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-300 text-xs font-medium transition-all flex items-center justify-center gap-1.5 text-center"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Demo Manager
            </button>

            <button
              onClick={() => handleDemoClick('Field Officer')}
              disabled={submitting}
              className="px-3 py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/80 text-indigo-300 text-xs font-medium transition-all flex items-center justify-center gap-1.5 text-center"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              Demo Officer
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:underline font-semibold">
              Register Officer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
