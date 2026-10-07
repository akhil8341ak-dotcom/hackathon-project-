import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield } from 'lucide-react';

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060913] flex flex-col items-center justify-center gap-4 text-cyan-400 font-mono">
        <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center animate-spin">
          <Shield className="w-6 h-6" />
        </div>
        <p className="text-sm tracking-widest uppercase animate-pulse">Initializing OpsPilot Command System...</p>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
