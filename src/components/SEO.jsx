import { useEffect } from 'react';

const SEO = ({ title, description, keywords }) => {
    useEffect(() => {
        // Update document title
        if (title) {
            document.title = `${title} | LuxThrift`;
        } else {
            document.title = 'LuxThrift - Premium Luxury Thrift Store';
        }

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description || 'Premium Luxury Thrift Store');
        }

        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords || 'luxury, thrift, vintage, fashion, sustainable');
        }
    }, [title, description, keywords]);

    return null;
};

export default SEO;
