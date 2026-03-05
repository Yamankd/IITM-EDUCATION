const express = require('express');
const router = express.Router();
const Course = require('../models/courseModal');

// Helper to wrap XML content
const withXML = (content) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${content}
</urlset>`;
};

// GET /sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
    try {
        // Always use the canonical production domain for sitemap URLs.
        // CLIENT_URL env var may point to a staging/subdomain — sitemap must use the real domain.
        const baseUrl = 'https://www.digitaliitm.com';

        // Static Routes (only indexable public pages — no noindex pages here)
        const staticRoutes = [
            { path: '/', priority: '1.0', changefreq: 'daily' },
            { path: '/course', priority: '0.9', changefreq: 'daily' },
            { path: '/contact', priority: '0.8', changefreq: 'monthly' },
            { path: '/gallery', priority: '0.7', changefreq: 'weekly' },
        ];

        let xmlContent = '';

        // Add Static Routes
        staticRoutes.forEach(route => {
            xmlContent += `
    <url>
        <loc>${baseUrl}${route.path}</loc>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`;
        });

        // Add Dynamic Course Routes
        const courses = await Course.find({ isActive: true }).select('slug updatedAt');

        courses.forEach(course => {
            // Use slug for SEO-friendly URLs (matches Courses.jsx link behaviour)
            // Backend getCourseById supports both slug and ObjectId lookup
            const courseIdentifier = course.slug || course._id;

            xmlContent += `
    <url>
        <loc>${baseUrl}/course/${courseIdentifier}</loc>
        <lastmod>${new Date(course.updatedAt).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`;
        });

        res.header('Content-Type', 'application/xml');
        res.send(withXML(xmlContent));

    } catch (error) {
        console.error("Sitemap generation error:", error);
        res.status(500).end();
    }
});

// GET /robots.txt
router.get('/robots.txt', (req, res) => {
    const baseUrl = 'https://www.digitaliitm.com';
    const content = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

    res.header('Content-Type', 'text/plain');
    res.send(content);
});

module.exports = router;
