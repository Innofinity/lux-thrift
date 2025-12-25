import React, { useState, useEffect } from 'react';
import { Users, Activity, Target, Zap, TrendingUp, ShoppingBag, Eye, User as UserIcon, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const CRMManager = () => {
    const [stats, setStats] = useState({
        totalVisitors: 0,
        activeNow: 0,
        conversionRate: '0%',
        engagementScore: 0
    });

    const [recentActivity, setRecentActivity] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        // Load logs from localStorage
        const logs = JSON.parse(localStorage.getItem('lux_activity_logs') || '[]');

        if (logs.length > 0) {
            // Map logs to UI format
            const formattedLogs = logs.map((log, idx) => ({
                id: idx,
                user: log.user || log.guestId,
                action: log.action.replace('_', ' '),
                product: log.metadata?.productName || log.category || 'something',
                time: new Date(log.timestamp).toLocaleTimeString(),
                color: log.action === 'add_to_cart' ? 'text-green-400' : 'text-primary'
            })).slice(0, 10);

            setRecentActivity(formattedLogs);

            // Calculate stats
            const uniqueVisitors = new Set(logs.map(l => l.guestId)).size;
            const carts = logs.filter(l => l.action === 'add_to_cart').length;
            const conversion = uniqueVisitors > 0 ? ((carts / uniqueVisitors) * 100).toFixed(1) : 0;

            setStats({
                totalVisitors: uniqueVisitors * 12 + 100, // Simulation offset
                activeNow: Math.floor(Math.random() * 20) + 5,
                conversionRate: `${conversion}%`,
                engagementScore: Math.min(100, (logs.length / 50) * 100).toFixed(0)
            });

            // Calculate Category Trends
            const catCounts = {};
            logs.forEach(l => {
                if (l.category) catCounts[l.category] = (catCounts[l.category] || 0) + 1;
            });
            const sortedCats = Object.entries(catCounts)
                .map(([name, visits]) => ({ name, visits, trend: '+5%' }))
                .sort((a, b) => b.visits - a.visits);
            setTopCategories(sortedCats);
        } else {
            // Fallback mock data if no logs exist yet
            setRecentActivity([
                { id: 1, user: 'Admin', action: 'system', product: 'CRM Initialized', time: 'Just now', color: 'text-primary' }
            ]);
            setTopCategories([
                { name: 'Men - Accessories', visits: 12, trend: '+0%' },
                { name: 'Women - Dresses', visits: 8, trend: '+0%' },
            ]);
            setStats({
                totalVisitors: 124,
                activeNow: 1,
                conversionRate: '0%',
                engagementScore: 10
            });
        }
    }, []);

    return (
        <div className="space-y-8">
            {/* KPI Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KPICard title="Total Visitors" value={stats.totalVisitors} icon={Users} trend="+5.4%" />
                <KPICard title="Active Now" value={stats.activeNow} icon={Zap} trend="Live" color="text-yellow-400" />
                <KPICard title="Conv. Rate" value={stats.conversionRate} icon={Target} trend="+0.2%" />
                <KPICard title="Engagement" value={`${stats.engagementScore}/100`} icon={TrendingUp} trend="+12" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Activity Feed */}
                <div className="lg:col-span-2 glass border border-white/10 rounded-sm p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-heading font-bold text-white uppercase flex items-center gap-2">
                            <Activity size={20} className="text-primary" />
                            Live <span className="text-primary">Activity Feed</span>
                        </h3>
                        <span className="flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary text-[10px] font-mono rounded-full animate-pulse uppercase tracking-widest">
                            Real-time
                        </span>
                    </div>

                    <div className="space-y-4">
                        {recentActivity.map((act) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={act.id}
                                className="flex items-center justify-between p-4 border border-white/5 bg-white/5 rounded-sm hover:bg-white/10 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border border-white/10">
                                        <UserIcon size={16} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm group-hover:text-primary transition-colors">
                                            {act.user} <span className="text-gray-500 font-normal"> {act.action} </span>
                                            <span className={`font-bold ${act.color}`}>{act.product}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 font-mono mt-1 flex items-center gap-1">
                                            <Calendar size={10} /> {act.time}
                                        </p>
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-white transition-all">
                                    <Eye size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Performance Side Panel */}
                <div className="space-y-8">
                    {/* Top Segments */}
                    <div className="glass border border-white/10 rounded-sm p-6">
                        <h3 className="text-lg font-heading font-bold text-white uppercase mb-4 flex items-center gap-2">
                            <ShoppingBag size={18} className="text-primary" />
                            Top <span className="text-primary">Segments</span>
                        </h3>
                        <div className="space-y-4">
                            {topCategories.map((cat, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-gray-400">{cat.name}</span>
                                        <span className="text-primary font-bold">{cat.visits} visits</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(cat.visits / 450) * 100}%` }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Recommendations */}
                    <div className="glass border border-white/10 rounded-sm p-6 bg-primary/5">
                        <h3 className="text-lg font-heading font-bold text-white uppercase mb-4 flex items-center gap-2">
                            <Target size={18} className="text-primary" />
                            AI <span className="text-primary">Suggestions</span>
                        </h3>
                        <div className="space-y-3">
                            {recommendations.map((rec, idx) => (
                                <div key={idx} className="p-3 border border-primary/20 rounded-sm bg-black/40">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">Suggest to {rec.user}</span>
                                        <span className="text-[10px] font-mono text-primary font-black">{rec.confidence} Match</span>
                                    </div>
                                    <p className="text-white text-xs font-bold">{rec.suggested}</p>
                                    <p className="text-[10px] text-gray-500 mt-1">Based on previous interest in {rec.base}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, icon: Icon, trend, color = "text-primary" }) => (
    <div className="glass border border-white/10 rounded-sm p-6 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon size={120} />
        </div>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 bg-white/5 border border-white/10 rounded-sm ${color}`}>
                <Icon size={24} />
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-full ${trend.includes('-') ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                {trend}
            </span>
        </div>
        <p className="text-sm font-mono text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-heading font-black text-white mt-1">{value}</p>
    </div>
);

export default CRMManager;
