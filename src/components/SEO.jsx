import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
    const [defaultSEO, setDefaultSEO] = useState({
        siteTitle: 'LuxThrift',
        siteDescription: 'Premium Luxury Thrift Store',
        keywords: 'luxury, thrift, vintage, fashion, sustainable',
        socialImage: '',
        facebook: '',
        twitter: '',
        instagram: ''
    });

    useEffect(() => {
        const savedSettings = localStorage.getItem('luxthrift_seo_settings');
        if (savedSettings) {
            setDefaultSEO(JSON.parse(savedSettings));
        }
    }, []);

    const metaTitle = title ? `${title} | ${defaultSEO.siteTitle}` : defaultSEO.siteTitle;
    const metaDesc = description || defaultSEO.siteDescription;
    const metaKeywords = keywords || defaultSEO.keywords;
    const metaImage = image || defaultSEO.socialImage;
    const metaUrl = url || window.location.href;

    return (
        <Helmet>
            {/* Standard Metrics */}
            <title>{metaTitle}</title>
            <meta name="description" content={metaDesc} />
            <meta name="keywords" content={metaKeywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDesc} />
            {metaImage && <meta property="og:image" content={metaImage} />}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={metaUrl} />
            <meta property="twitter:title" content={metaTitle} />
            <meta property="twitter:description" content={metaDesc} />
            {metaImage && <meta property="twitter:image" content={metaImage} />}
        </Helmet>
    );
};

export default SEO;
