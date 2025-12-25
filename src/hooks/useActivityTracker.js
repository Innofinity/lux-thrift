import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const useActivityTracker = () => {
    const { user } = useAuth();

    const logActivity = useCallback(async (activityData) => {
        try {
            // Get or create a guest ID
            let guestId = localStorage.getItem('luxthrift_guest_id');
            if (!guestId) {
                guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('luxthrift_guest_id', guestId);
            }

            const payload = {
                ...activityData,
                guestId,
                user: user?._id
            };

            // In a real app, this would be a fetch call:
            // await fetch('/api/activity', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload)
            // });

            // For now, let's also log it to localStorage so the admin panel can "see" it if needed
            const logs = JSON.parse(localStorage.getItem('lux_activity_logs') || '[]');
            logs.unshift({ ...payload, timestamp: new Date().toISOString() });
            localStorage.setItem('lux_activity_logs', JSON.stringify(logs.slice(0, 100)));

            console.log('Activity Logged:', payload);
        } catch (error) {
            console.error('Failed to log activity:', error);
        }
    }, [user]);

    const trackProductView = (product) => {
        logActivity({
            action: 'view_product',
            productId: product.id || product._id,
            category: product.category,
            brand: product.brand,
            metadata: { productName: product.name }
        });
    };

    const trackAddToCart = (product) => {
        logActivity({
            action: 'add_to_cart',
            productId: product.id || product._id,
            category: product.category,
            brand: product.brand,
            metadata: { productName: product.name }
        });
    };

    const trackSearch = (query) => {
        logActivity({
            action: 'search',
            metadata: { query }
        });
    };

    return { trackProductView, trackAddToCart, trackSearch };
};

export default useActivityTracker;
