import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginAdmin } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await loginAdmin(formData.email, formData.password);
            navigate('/admin');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary mb-6">
                        <Shield size={40} className="text-primary" />
                    </div>
                    <h1 className="text-4xl font-heading font-black text-white uppercase mb-2">
                        Admin <span className="text-primary">Login</span>
                    </h1>
                    <p className="text-gray-400 font-mono text-sm">
                        Secure access to content management
                    </p>
                </div>

                {/* Warning Banner */}
                <div className="glass border border-yellow-500/20 rounded-sm p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-yellow-500 text-sm font-bold mb-1">Admin Access Only</p>
                            <p className="text-gray-400 text-xs">
                                This area is restricted to authorized administrators. All access attempts are logged.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Login Form */}
                <div className="glass border border-white/10 rounded-sm p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                Admin Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-sm pl-12 pr-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                    placeholder="admin@luxthrift.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-sm pl-12 pr-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <Shield size={20} />
                                    Secure Login
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <a
                            href="/"
                            className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center justify-center gap-2"
                        >
                            ← Back to Store
                        </a>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default AdminLogin;
