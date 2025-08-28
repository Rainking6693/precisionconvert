#!/usr/bin/env node

/**
 * Backend Configuration Validation Script
 * Validates all backend optimizations for PrecisionConvert.io blog integration
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

class BackendValidator {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
            errors: []
        };
    }

    async validate() {
        console.log('🔍 Starting backend configuration validation...\n');

        // 1. Validate netlify.toml configuration
        await this.validateNetlifyConfig();

        // 2. Validate sitemap.xml
        await this.validateSitemap();

        // 3. Validate blog files
        await this.validateBlogFiles();

        // 4. Validate analytics configuration
        await this.validateAnalytics();

        // 5. Validate build process
        await this.validateBuildProcess();

        // 6. Validate Netlify functions
        await this.validateNetlifyFunctions();

        // 7. Test redirects configuration
        await this.validateRedirects();

        // 8. Validate security headers
        await this.validateSecurityHeaders();

        this.printSummary();
        return this.results.failed === 0;
    }

    async validateNetlifyConfig() {
        console.log('📋 Validating netlify.toml configuration...');
        
        const configPath = path.join(process.cwd(), 'netlify.toml');
        
        if (!fs.existsSync(configPath)) {
            this.fail('netlify.toml file not found');
            return;
        }

        try {
            const content = fs.readFileSync(configPath, 'utf8');
            
            // Check for required sections
            const requiredSections = [
                '[build]',
                '[functions]',
                '[[redirects]]',
                '[[headers]]'
            ];

            for (const section of requiredSections) {
                if (!content.includes(section)) {
                    this.fail(`Missing required section: ${section}`);
                } else {
                    this.pass(`Found required section: ${section}`);
                }
            }

            // Check for clean URL redirects
            const cleanUrlRedirects = [
                'from = "/blog"',
                'from = "/scientific-unit-converter"', 
                'from = "/cooking-unit-converter"'
            ];

            for (const redirect of cleanUrlRedirects) {
                if (!content.includes(redirect)) {
                    this.fail(`Missing clean URL redirect: ${redirect}`);
                } else {
                    this.pass(`Found clean URL redirect: ${redirect}`);
                }
            }

            // Check for security headers
            const securityHeaders = [
                'Content-Security-Policy',
                'Strict-Transport-Security',
                'X-Frame-Options',
                'X-Content-Type-Options'
            ];

            for (const header of securityHeaders) {
                if (!content.includes(header)) {
                    this.fail(`Missing security header: ${header}`);
                } else {
                    this.pass(`Found security header: ${header}`);
                }
            }

            // Check for cache headers
            if (!content.includes('Cache-Control')) {
                this.fail('Missing cache control headers');
            } else {
                this.pass('Found cache control headers');
            }

        } catch (error) {
            this.fail(`Error reading netlify.toml: ${error.message}`);
        }
    }

    async validateSitemap() {
        console.log('\n🗺️  Validating sitemap.xml...');
        
        const sitemapPath = path.join(process.cwd(), 'sitemap.xml');
        
        if (!fs.existsSync(sitemapPath)) {
            this.fail('sitemap.xml file not found');
            return;
        }

        try {
            const content = fs.readFileSync(sitemapPath, 'utf8');
            
            // Check for required URLs
            const requiredUrls = [
                'https://precisionconvert.io/',
                'https://precisionconvert.io/blog.html',
                'https://precisionconvert.io/scientific-unit-converter.html',
                'https://precisionconvert.io/cooking-unit-converter.html'
            ];

            for (const url of requiredUrls) {
                if (!content.includes(url)) {
                    this.fail(`Missing URL in sitemap: ${url}`);
                } else {
                    this.pass(`Found URL in sitemap: ${url}`);
                }
            }

            // Check for clean URLs
            const cleanUrls = [
                'https://precisionconvert.io/blog',
                'https://precisionconvert.io/scientific-unit-converter',
                'https://precisionconvert.io/cooking-unit-converter'
            ];

            for (const url of cleanUrls) {
                if (!content.includes(url)) {
                    this.warn(`Missing clean URL in sitemap: ${url}`);
                } else {
                    this.pass(`Found clean URL in sitemap: ${url}`);
                }
            }

            // Check for image tags
            if (!content.includes('xmlns:image')) {
                this.warn('Missing image namespace in sitemap');
            } else {
                this.pass('Found image namespace in sitemap');
            }

        } catch (error) {
            this.fail(`Error reading sitemap.xml: ${error.message}`);
        }
    }

    async validateBlogFiles() {
        console.log('\n📄 Validating blog files...');
        
        const blogFiles = [
            'blog.html',
            'scientific-unit-converter.html', 
            'cooking-unit-converter.html'
        ];

        for (const file of blogFiles) {
            const filePath = path.join(process.cwd(), file);
            
            if (!fs.existsSync(filePath)) {
                this.fail(`Blog file not found: ${file}`);
                continue;
            }

            try {
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Check for required meta tags
                const requiredMeta = [
                    '<title>',
                    'meta name="description"',
                    'meta name="keywords"',
                    'meta property="og:title"',
                    'meta property="og:description"',
                    'link rel="canonical"'
                ];

                for (const meta of requiredMeta) {
                    if (!content.includes(meta)) {
                        this.fail(`Missing meta tag in ${file}: ${meta}`);
                    } else {
                        this.pass(`Found meta tag in ${file}: ${meta}`);
                    }
                }

                // Check for structured data
                if (!content.includes('application/ld+json')) {
                    this.warn(`Missing structured data in ${file}`);
                } else {
                    this.pass(`Found structured data in ${file}`);
                }

            } catch (error) {
                this.fail(`Error reading ${file}: ${error.message}`);
            }
        }
    }

    async validateAnalytics() {
        console.log('\n📊 Validating analytics configuration...');
        
        const analyticsPath = path.join(process.cwd(), 'blog-analytics.js');
        
        if (!fs.existsSync(analyticsPath)) {
            this.fail('blog-analytics.js file not found');
            return;
        }

        try {
            const content = fs.readFileSync(analyticsPath, 'utf8');
            
            // Check for required classes/functions
            const requiredComponents = [
                'class BlogAnalytics',
                'trackPageView',
                'setupScrollTracking',
                'setupModalTracking', 
                'setupConversionTracking',
                'sendEvent'
            ];

            for (const component of requiredComponents) {
                if (!content.includes(component)) {
                    this.fail(`Missing analytics component: ${component}`);
                } else {
                    this.pass(`Found analytics component: ${component}`);
                }
            }

            // Check for Google Analytics integration
            if (!content.includes('gtag')) {
                this.warn('Missing Google Analytics integration');
            } else {
                this.pass('Found Google Analytics integration');
            }

        } catch (error) {
            this.fail(`Error reading blog-analytics.js: ${error.message}`);
        }
    }

    async validateBuildProcess() {
        console.log('\n🔨 Validating build process...');
        
        const buildPath = path.join(process.cwd(), 'build.js');
        const packagePath = path.join(process.cwd(), 'package.json');
        
        if (!fs.existsSync(buildPath)) {
            this.fail('build.js file not found');
        } else {
            this.pass('build.js file found');
            
            try {
                const content = fs.readFileSync(buildPath, 'utf8');
                
                // Check for enhanced build features
                const buildFeatures = [
                    'processHtmlFiles',
                    'processJavaScriptFiles',
                    'updateSitemap',
                    'generateCacheManifest',
                    'addCacheBusting'
                ];

                for (const feature of buildFeatures) {
                    if (!content.includes(feature)) {
                        this.fail(`Missing build feature: ${feature}`);
                    } else {
                        this.pass(`Found build feature: ${feature}`);
                    }
                }

            } catch (error) {
                this.fail(`Error reading build.js: ${error.message}`);
            }
        }

        if (!fs.existsSync(packagePath)) {
            this.fail('package.json file not found');
        } else {
            this.pass('package.json file found');
            
            try {
                const content = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                
                if (!content.scripts || !content.scripts.build) {
                    this.fail('Missing build script in package.json');
                } else {
                    this.pass('Found build script in package.json');
                }

            } catch (error) {
                this.fail(`Error reading package.json: ${error.message}`);
            }
        }
    }

    async validateNetlifyFunctions() {
        console.log('\n⚡ Validating Netlify functions...');
        
        const functionsDir = path.join(process.cwd(), '.netlify', 'functions');
        const analyticsFunction = path.join(functionsDir, 'analytics.js');
        
        if (!fs.existsSync(functionsDir)) {
            this.fail('.netlify/functions directory not found');
            return;
        } else {
            this.pass('.netlify/functions directory found');
        }

        if (!fs.existsSync(analyticsFunction)) {
            this.fail('analytics.js function not found');
        } else {
            this.pass('analytics.js function found');
            
            try {
                const content = fs.readFileSync(analyticsFunction, 'utf8');
                
                // Check for required function structure
                const requiredElements = [
                    'exports.handler',
                    'Access-Control-Allow-Origin',
                    'JSON.parse(event.body)',
                    'sendToGoogleAnalytics'
                ];

                for (const element of requiredElements) {
                    if (!content.includes(element)) {
                        this.fail(`Missing function element: ${element}`);
                    } else {
                        this.pass(`Found function element: ${element}`);
                    }
                }

            } catch (error) {
                this.fail(`Error reading analytics function: ${error.message}`);
            }
        }
    }

    async validateRedirects() {
        console.log('\n🔄 Validating redirect configuration...');
        
        // This would typically test actual redirects, but for now we check the config
        const netlifyConfig = path.join(process.cwd(), 'netlify.toml');
        
        if (!fs.existsSync(netlifyConfig)) {
            this.fail('Cannot validate redirects - netlify.toml not found');
            return;
        }

        try {
            const content = fs.readFileSync(netlifyConfig, 'utf8');
            
            // Count redirect rules
            const redirectCount = (content.match(/\[\[redirects\]\]/g) || []).length;
            
            if (redirectCount < 5) {
                this.warn(`Only ${redirectCount} redirect rules found, expected at least 5`);
            } else {
                this.pass(`Found ${redirectCount} redirect rules`);
            }

            // Check for both 200 (rewrite) and 301 (redirect) status codes
            if (!content.includes('status = 200')) {
                this.fail('Missing URL rewrite rules (status 200)');
            } else {
                this.pass('Found URL rewrite rules (status 200)');
            }

            if (!content.includes('status = 301')) {
                this.fail('Missing permanent redirect rules (status 301)');
            } else {
                this.pass('Found permanent redirect rules (status 301)');
            }

        } catch (error) {
            this.fail(`Error validating redirects: ${error.message}`);
        }
    }

    async validateSecurityHeaders() {
        console.log('\n🔒 Validating security headers...');
        
        const netlifyConfig = path.join(process.cwd(), 'netlify.toml');
        
        if (!fs.existsSync(netlifyConfig)) {
            this.fail('Cannot validate security headers - netlify.toml not found');
            return;
        }

        try {
            const content = fs.readFileSync(netlifyConfig, 'utf8');
            
            // Essential security headers
            const securityHeaders = {
                'Content-Security-Policy': 'Protects against XSS attacks',
                'Strict-Transport-Security': 'Enforces HTTPS',
                'X-Frame-Options': 'Prevents clickjacking',
                'X-Content-Type-Options': 'Prevents MIME sniffing',
                'Referrer-Policy': 'Controls referrer information',
                'Permissions-Policy': 'Controls browser features'
            };

            for (const [header, description] of Object.entries(securityHeaders)) {
                if (!content.includes(header)) {
                    this.fail(`Missing security header: ${header} (${description})`);
                } else {
                    this.pass(`Found security header: ${header}`);
                }
            }

            // Check for comprehensive CSP
            if (content.includes('default-src') && content.includes('script-src')) {
                this.pass('Found comprehensive Content Security Policy');
            } else {
                this.warn('Content Security Policy may not be comprehensive');
            }

        } catch (error) {
            this.fail(`Error validating security headers: ${error.message}`);
        }
    }

    pass(message) {
        console.log(`   ✅ ${message}`);
        this.results.passed++;
    }

    fail(message) {
        console.log(`   ❌ ${message}`);
        this.results.failed++;
        this.results.errors.push(message);
    }

    warn(message) {
        console.log(`   ⚠️  ${message}`);
        this.results.warnings++;
    }

    printSummary() {
        console.log('\n📊 Validation Summary');
        console.log('========================');
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`⚠️  Warnings: ${this.results.warnings}`);

        if (this.results.failed > 0) {
            console.log('\n❌ Critical Issues Found:');
            this.results.errors.forEach(error => {
                console.log(`   - ${error}`);
            });
            console.log('\nPlease fix these issues before deploying.');
        } else if (this.results.warnings > 0) {
            console.log('\n⚠️  Some warnings found, but deployment should work.');
        } else {
            console.log('\n🎉 All validations passed! Ready for deployment.');
        }

        console.log('\n🚀 Backend optimization status:');
        console.log('   - Clean URLs configured');
        console.log('   - Security headers implemented');
        console.log('   - Caching optimized');
        console.log('   - Analytics tracking ready');
        console.log('   - Build process enhanced');
        console.log('   - Sitemap updated');
    }
}

// Run validation if this script is called directly
if (require.main === module) {
    const validator = new BackendValidator();
    validator.validate().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Validation failed with error:', error);
        process.exit(1);
    });
}

module.exports = BackendValidator;