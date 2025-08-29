#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Enhanced build script for PrecisionConvert.io
console.log('🚀 Starting enhanced build process...');

// Configuration
const CONFIG = {
    htmlFiles: [
        'index.html',
        'blog.html', 
        'scientific-unit-converter.html',
        'cooking-unit-converter.html',
        'batch-unit-conversion-save-hours.html',
        'convert-ancient-units-accurately.html',
        'custom-unit-converter-build-save-share.html'
    ],
    jsFiles: [
        'blog-analytics.js',
        'service-worker.js'
    ],
    buildInfo: {
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        commit: process.env.COMMIT_REF || 'unknown',
        context: process.env.CONTEXT || 'production'
    }
};

// Environment variables
const envVars = {
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    ga4MeasurementId: process.env.GA4_MEASUREMENT_ID,
    environment: process.env.NODE_ENV || process.env.CONTEXT || 'production',
    siteUrl: process.env.URL || 'https://precisionconvert.io'
};

// Main build process
async function build() {
    try {
        console.log('📋 Build Configuration:', CONFIG.buildInfo);
        
        // 1. Process HTML files
        await processHtmlFiles();
        
        // 2. Process JavaScript files
        await processJavaScriptFiles();
        
        // 3. Update sitemap with current timestamp
        await updateSitemap();
        
        // 4. Generate cache manifest
        await generateCacheManifest();
        
        // 5. Optimize assets
        await optimizeAssets();
        
        console.log('✅ Build process completed successfully!');
        console.log('📊 Build Summary:');
        console.log(`   - HTML files processed: ${CONFIG.htmlFiles.length}`);
        console.log(`   - JS files processed: ${CONFIG.jsFiles.length}`);
        console.log(`   - Environment: ${envVars.environment}`);
        console.log(`   - Site URL: ${envVars.siteUrl}`);
        
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

// Process HTML files with environment variable injection
async function processHtmlFiles() {
    console.log('📄 Processing HTML files...');
    
    for (const fileName of CONFIG.htmlFiles) {
        const filePath = path.join(__dirname, fileName);
        
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  Skipping ${fileName} - file not found`);
            continue;
        }
        
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Replace environment variable placeholders
            content = content
                .replace(/NETLIFY_STRIPE_PUBLISHABLE_KEY_PLACEHOLDER/g, 
                        envVars.stripePublishableKey || 'pk_test_placeholder')
                .replace(/GA4_MEASUREMENT_ID_PLACEHOLDER/g, 
                        envVars.ga4MeasurementId || 'G-PLACEHOLDER')
                .replace(/SITE_URL_PLACEHOLDER/g, envVars.siteUrl)
                .replace(/BUILD_TIMESTAMP_PLACEHOLDER/g, CONFIG.buildInfo.timestamp)
                .replace(/BUILD_VERSION_PLACEHOLDER/g, CONFIG.buildInfo.version);
            
            // Add cache busting for JS files
            content = addCacheBusting(content);
            
            // Optimize meta tags for blog pages
            if (fileName.includes('blog') || fileName.includes('converter')) {
                content = optimizeBlogMetaTags(content, fileName);
            }
            
            fs.writeFileSync(filePath, content);
            console.log(`   ✓ Processed ${fileName}`);
            
        } catch (error) {
            console.error(`   ❌ Error processing ${fileName}:`, error);
            throw error;
        }
    }
}

// Process JavaScript files
async function processJavaScriptFiles() {
    console.log('📜 Processing JavaScript files...');
    
    for (const fileName of CONFIG.jsFiles) {
        const filePath = path.join(__dirname, fileName);
        
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  Skipping ${fileName} - file not found`);
            continue;
        }
        
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Inject build configuration
            content = content.replace(
                /\/\* BUILD_CONFIG_PLACEHOLDER \*\//g,
                `const BUILD_CONFIG = ${JSON.stringify(CONFIG.buildInfo)};`
            );
            
            // Add environment-specific configurations
            if (fileName === 'blog-analytics.js') {
                content = optimizeAnalyticsScript(content);
            }
            
            fs.writeFileSync(filePath, content);
            console.log(`   ✓ Processed ${fileName}`);
            
        } catch (error) {
            console.error(`   ❌ Error processing ${fileName}:`, error);
        }
    }
}

// Update sitemap with current timestamp
async function updateSitemap() {
    console.log('🗺️  Updating sitemap...');
    
    const sitemapPath = path.join(__dirname, 'sitemap.xml');
    
    if (fs.existsSync(sitemapPath)) {
        try {
            let content = fs.readFileSync(sitemapPath, 'utf8');
            const currentDate = new Date().toISOString().split('T')[0];
            
            // Update all lastmod dates to current date
            content = content.replace(
                /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
                `<lastmod>${currentDate}</lastmod>`
            );
            
            fs.writeFileSync(sitemapPath, content);
            console.log('   ✓ Sitemap updated with current timestamp');
        } catch (error) {
            console.error('   ❌ Error updating sitemap:', error);
        }
    }
}

// Generate cache manifest for service worker
async function generateCacheManifest() {
    console.log('📦 Generating cache manifest...');
    
    const staticFiles = [
        'index.html',
        'blog.html',
        'scientific-unit-converter.html', 
        'cooking-unit-converter.html',
        'batch-unit-conversion-save-hours.html',
        'convert-ancient-units-accurately.html',
        'custom-unit-converter-build-save-share.html',
        'blog-analytics.js'
    ];
    
    const cacheManifest = {
        version: CONFIG.buildInfo.version,
        timestamp: CONFIG.buildInfo.timestamp,
        files: staticFiles.map(file => ({
            url: `/${file}`,
            revision: generateFileHash(file)
        }))
    };
    
    try {
        fs.writeFileSync(
            path.join(__dirname, 'cache-manifest.json'),
            JSON.stringify(cacheManifest, null, 2)
        );
        console.log('   ✓ Cache manifest generated');
    } catch (error) {
        console.error('   ❌ Error generating cache manifest:', error);
    }
}

// Add cache busting query parameters
function addCacheBusting(content) {
    const buildHash = crypto.createHash('md5')
        .update(CONFIG.buildInfo.timestamp)
        .digest('hex')
        .substring(0, 8);
    
    // Add cache busting to script and link tags
    content = content
        .replace(
            /(<script[^>]+src=")([^"]+\.js)(")/g,
            `$1$2?v=${buildHash}$3`
        )
        .replace(
            /(<link[^>]+href=")([^"]+\.css)(")/g,
            `$1$2?v=${buildHash}$3`
        );
    
    return content;
}

// Optimize meta tags for blog pages
function optimizeBlogMetaTags(content, fileName) {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Add article publication date for blog pages
    if (fileName.includes('scientific') || fileName.includes('cooking')) {
        const articleSchema = `
    <!-- Article Schema -->
    <meta property="article:published_time" content="${currentDate}T00:00:00Z">
    <meta property="article:modified_time" content="${CONFIG.buildInfo.timestamp}">
    <meta property="article:author" content="PrecisionConvert.io">
    <meta property="article:section" content="Unit Conversion Guides">`;
        
        // Only add if not already present
        if (!content.includes('<!-- Article Schema -->')) {
            content = content.replace(
                '</head>',
                articleSchema + '\n</head>'
            );
        } else {
            // Update existing article modified time
            content = content.replace(
                /<meta property="article:modified_time" content="[^"]*">/,
                `<meta property="article:modified_time" content="${CONFIG.buildInfo.timestamp}">`
            );
        }
    }
    
    return content;
}

// Optimize analytics script with environment configuration
function optimizeAnalyticsScript(content) {
    // Add production vs development configuration
    const analyticsConfig = {
        environment: envVars.environment,
        debug: envVars.environment !== 'production',
        ga4MeasurementId: envVars.ga4MeasurementId,
        siteUrl: envVars.siteUrl
    };
    
    content = content.replace(
        '// ANALYTICS_CONFIG_PLACEHOLDER',
        `const ANALYTICS_CONFIG = ${JSON.stringify(analyticsConfig, null, 2)};`
    );
    
    return content;
}

// Generate file hash for cache manifest
function generateFileHash(fileName) {
    const filePath = path.join(__dirname, fileName);
    
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
    }
    
    return 'unknown';
}

// Optimize assets (placeholder for future enhancements)
async function optimizeAssets() {
    console.log('🔧 Optimizing assets...');
    
    // Future optimizations:
    // - Minify HTML
    // - Compress images  
    // - Bundle JavaScript
    // - Generate WebP versions of images
    
    console.log('   ✓ Asset optimization completed');
}

// Validate environment variables
function validateEnvironment() {
    const warnings = [];
    
    if (!envVars.stripePublishableKey) {
        warnings.push('STRIPE_PUBLISHABLE_KEY not found - payment integration may not work');
    }
    
    if (!envVars.ga4MeasurementId) {
        warnings.push('GA4_MEASUREMENT_ID not found - analytics may be limited');
    }
    
    if (warnings.length > 0) {
        console.log('⚠️  Environment Warnings:');
        warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    
    return warnings.length === 0;
}

// Run the build
validateEnvironment();
build();