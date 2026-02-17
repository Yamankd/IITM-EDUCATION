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
        const baseUrl = process.env.CLIENT_URL || 'https://www.digitaliitm.com';

        // Static Routes
        const staticRoutes = [
            '/',
            '/about',
            '/contact',
            '/gallery',
            '/portal',
            '/course'
        ];

        let xmlContent = '';

        // Add Static Routes
        staticRoutes.forEach(route => {
            xmlContent += `
    <url>
        <loc>${baseUrl}${route}</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>`;
        });

        // Add Dynamic Course Routes
        const courses = await Course.find({ isActive: true }).select('slug updatedAt');

        courses.forEach(course => {
            // Use slug if available, otherwise fallback to ID (though frontend should support slug)
            // Assuming frontend uses /course/:id or /course/:slug
            // Based on CourseDetail.jsx using useParams().id, it likely expects ID currently.
            // If you have slug support, use course.slug. 
            // For now, I'll use ID to be safe based on previous code reading, 
            // BUT Course model has 'slug', let's try to use slug if widely supported, 
            // or just ID if that's what the app uses.
            // Re-reading CourseDetail.jsx: `const { id } = useParams(); ... api.get(/courses/${id})`
            // So it currently depends on ID.
            // However, to make it SEO friendly, we SHOULD use slugs.
            // For the sitemap, I'll put the URL that actually works. 
            // If the app only supports ID, use ID.

            // TODO: Ideally refactor to use Slugs for better SEO, but for now map to what works.
            // checking CourseDetail.jsx again... it uses `id`.
            // checking App.jsx... `<Route path="/course/:id" element={<CourseDetail />} />` (inferred)
            // Let's assume ID for now to ensure links don't 404.

            // Wait, Course model HAS a slug field.
            // If the router supports slug, we should use it.
            // Let's stick to ID to maintain current functionality guarantee, 
            // or maybe the ID param CAN handle slugs if the backend lookup handles it?
            // Safe bet: ID.

            xmlContent += `
    <url>
        <loc>${baseUrl}/course/${course._id}</loc>
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
    const baseUrl = process.env.CLIENT_URL || 'https://www.digitaliitm.com';
    const content = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

    res.header('Content-Type', 'text/plain');
    res.send(content);
});

module.exports = router;
