#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Build script to inject environment variables into HTML
console.log('Starting build process...');

const indexPath = path.join(__dirname, 'index.html');
const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
    console.error('WARNING: STRIPE_PUBLISHABLE_KEY environment variable not found');
    console.log('Build will continue but Stripe integration may not work properly');
    process.exit(0); // Don't fail the build, just warn
}

console.log('STRIPE_PUBLISHABLE_KEY found:', publishableKey.substring(0, 20) + '...');

try {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Replace the placeholder with the actual environment variable
    content = content.replace(
        'NETLIFY_STRIPE_PUBLISHABLE_KEY_PLACEHOLDER',
        publishableKey
    );
    
    fs.writeFileSync(indexPath, content);
    console.log('Successfully injected Stripe publishable key into index.html');
} catch (error) {
    console.error('Error during build:', error);
    process.exit(1);
}

console.log('Build process completed successfully!');