import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Lock, User, Chrome, Github, Apple } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState('choice'); // choice, email-login, email-register, phone-login
    const [authMethod, setAuthMethod] = useState(null); // 'email' or 'phone'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [generatedOTP, setGeneratedOTP] = useState(''); // For demo purposes

    const { loginWithEmail, loginWithPhone, loginWithProvider, register, sendOTP } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        otp: ''
    });

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSendOTP = async () => {
        if (!formData.phone || formData.phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await sendOTP(formData.phone);
            setOtpSent(true);
            setGeneratedOTP(result.otp); // For demo - remove in production
            setError(`OTP sent! (Demo: ${result.otp})`); // For demo
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await loginWithPhone(formData.phone, formData.otp);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await loginWithEmail(formData.email, formData.password);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setLoading(true);
        setError('');

        try {
            // Simulate OAuth flow
            const mockData = {
                google: { email: 'user@gmail.com', name: 'Google User', avatar: '' },
                github: { email: 'user@github.com', name: 'GitHub User', avatar: '' },
                apple: { email: 'user@icloud.com', name: 'Apple User', avatar: '' }
            };

            await loginWithProvider(provider, mockData[provider]);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', phone: '', password: '', otp: '' });
        setError('');
        setOtpSent(false);
        setGeneratedOTP('');
    };

    const handleBack = () => {
        resetForm();
        setMode('choice');
        setAuthMethod(null);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md glass border border-border rounded-sm p-8 max-h-[90vh] overflow-y-auto"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-text-muted hover:text-text-base transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-heading font-black text-text-base uppercase">
                            {mode === 'choice' && 'Welcome'}
                            {mode === 'email-login' && 'Email Login'}
                            {mode === 'email-register' && 'Create Account'}
                            {mode === 'phone-login' && 'Phone Login'}
                        </h2>
                        <p className="text-text-muted text-sm mt-2">
                            {mode === 'choice' && 'Choose your preferred login method'}
                            {mode === 'email-login' && 'Sign in with your email'}
                            {mode === 'email-register' && 'Create your account'}
                            {mode === 'phone-login' && 'Sign in with your phone number'}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Choice Screen */}
                    {mode === 'choice' && (
                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    setAuthMethod('email');
                                    setMode('email-login');
                                }}
                                className="w-full flex items-center justify-center gap-3 bg-surface hover:bg-surface/80 border border-border text-text-base px-6 py-4 rounded-sm font-bold uppercase tracking-wider transition-all"
                            >
                                <Mail size={20} />
                                Continue with Email
                            </button>

                            <button
                                onClick={() => {
                                    setAuthMethod('phone');
                                    setMode('phone-login');
                                }}
                                className="w-full flex items-center justify-center gap-3 bg-surface hover:bg-surface/80 border border-border text-text-base px-6 py-4 rounded-sm font-bold uppercase tracking-wider transition-all"
                            >
                                <Phone size={20} />
                                Continue with Phone
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-background text-text-muted font-mono uppercase">Or</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    onClick={() => handleSocialLogin('google')}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 bg-surface hover:bg-surface/80 border border-border text-text-base p-4 rounded-sm transition-all"
                                >
                                    <Chrome size={20} />
                                </button>
                                <button
                                    onClick={() => handleSocialLogin('github')}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 bg-surface hover:bg-surface/80 border border-border text-text-base p-4 rounded-sm transition-all"
                                >
                                    <Github size={20} />
                                </button>
                                <button
                                    onClick={() => handleSocialLogin('apple')}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 bg-surface hover:bg-surface/80 border border-border text-text-base p-4 rounded-sm transition-all"
                                >
                                    <Apple size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Email Login */}
                    {mode === 'email-login' && (
                        <form onSubmit={handleEmailLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-mono text-text-muted mb-2 uppercase">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-surface border border-border rounded-sm pl-12 pr-4 py-3 text-text-base focus:border-primary focus:outline-none transition-colors placeholder:text-text-muted/50"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-mono text-text-muted mb-2 uppercase">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-surface border border-border rounded-sm pl-12 pr-4 py-3 text-text-base focus:border-primary focus:outline-none transition-colors placeholder:text-text-muted/50"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setMode('email-register')}
                                    className="text-sm text-text-muted hover:text-primary transition-colors"
                                >
                                    Don't have an account? <span className="text-primary">Sign up</span>
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleBack}
                                className="w-full text-sm text-text-muted hover:text-text-base transition-colors"
                            >
                                ← Back to options
                            </button>
                        </form>
                    )}

                    {/* Email Register */}
                    {mode === 'email-register' && (
                        <form onSubmit={handleEmailRegister} className="space-y-6">
                            <div>
                                <label className="block text-sm font-mono text-text-muted mb-2 uppercase">Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-surface border border-border rounded-sm pl-12 pr-4 py-3 text-text-base focus:border-primary focus:outline-none transition-colors placeholder:text-text-muted/50"
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-mono text-text-muted mb-2 uppercase">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-surface border border-border rounded-sm pl-12 pr-4 py-3 text-text-base focus:border-primary focus:outline-none transition-colors placeholder:text-text-muted/50"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-mono text-gray-400 mb-2 uppercase">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        minLength={6}
                                        className="w-full bg-black/50 border border-white/10 rounded-sm pl-12 pr-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setMode('email-login')}
                                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                                >
                                    Already have an account? <span className="text-primary">Sign in</span>
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleBack}
                                className="w-full text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                ← Back to options
                            </button>
                        </form>
                    )}

                    {/* Phone Login */}
                    {mode === 'phone-login' && (
                        <form onSubmit={handlePhoneLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-mono text-text-muted mb-2 uppercase">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        disabled={otpSent}
                                        className="w-full bg-surface border border-border rounded-sm pl-12 pr-4 py-3 text-text-base focus:border-primary focus:outline-none transition-colors disabled:opacity-50 placeholder:text-text-muted/50"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            {!otpSent ? (
                                <button
                                    type="button"
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                    className="w-full bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-mono text-text-muted mb-2 uppercase">Enter OTP</label>
                                        <input
                                            type="text"
                                            name="otp"
                                            value={formData.otp}
                                            onChange={handleInputChange}
                                            required
                                            maxLength={6}
                                            className="w-full bg-surface border border-border rounded-sm px-4 py-3 text-text-base text-center text-2xl tracking-widest focus:border-primary focus:outline-none transition-colors font-mono placeholder:text-text-muted/50"
                                            placeholder="000000"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Verifying...' : 'Verify & Login'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOtpSent(false);
                                            setFormData(prev => ({ ...prev, otp: '' }));
                                        }}
                                        className="w-full text-sm text-text-muted hover:text-primary transition-colors"
                                    >
                                        Resend OTP
                                    </button>
                                </>
                            )}

                            <button
                                type="button"
                                onClick={handleBack}
                                className="w-full text-sm text-text-muted hover:text-text-base transition-colors"
                            >
                                ← Back to options
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
