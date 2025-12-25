import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-mono">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin-login" replace />;
    }

    if (adminOnly && !isAdmin()) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <h1 className="text-6xl font-heading font-black text-primary mb-4">403</h1>
                    <h2 className="text-2xl font-heading font-bold text-white mb-4">Access Denied</h2>
                    <p className="text-gray-400 mb-8">
                        You don't have permission to access this page. Admin access required.
                    </p>
                    <a
                        href="/"
                        className="inline-block bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
