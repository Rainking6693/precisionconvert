/**
 * Analytics Collection Function
 * Handles blog analytics data collection for PrecisionConvert.io
 * Processes events from blog-analytics.js
 */

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    // Only accept POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const eventData = JSON.parse(event.body);
        
        // Validate required fields
        if (!eventData.event || !eventData.timestamp) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Add server-side metadata
        const enrichedData = {
            ...eventData,
            server_timestamp: Date.now(),
            ip_address: event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown',
            user_agent: event.headers['user-agent'] || 'unknown',
            netlify_function: 'analytics',
            environment: process.env.CONTEXT || 'unknown'
        };

        // Log analytics data (in production, you'd send this to your analytics service)
        console.log('Analytics Event:', JSON.stringify(enrichedData, null, 2));

        // Here you would typically:
        // 1. Send to Google Analytics 4
        // 2. Send to your database
        // 3. Send to third-party analytics services
        // 4. Process for real-time dashboards

        // Example: Send to Google Analytics 4 Measurement Protocol
        await sendToGoogleAnalytics(enrichedData);
        
        // Example: Store in database (implement based on your needs)
        // await storeInDatabase(enrichedData);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                message: 'Event tracked successfully',
                event_id: enrichedData.session_id + '_' + enrichedData.timestamp
            })
        };

    } catch (error) {
        console.error('Analytics function error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};

/**
 * Send event to Google Analytics 4 Measurement Protocol
 */
async function sendToGoogleAnalytics(eventData) {
    // This would require your GA4 Measurement ID and API Secret
    // const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID;
    // const GA4_API_SECRET = process.env.GA4_API_SECRET;
    
    // if (!GA4_MEASUREMENT_ID || !GA4_API_SECRET) {
    //     console.warn('GA4 credentials not configured');
    //     return;
    // }

    try {
        // Example payload for GA4 Measurement Protocol
        const ga4Payload = {
            client_id: eventData.session_id || 'anonymous',
            events: [{
                name: mapEventNameForGA4(eventData.event),
                params: {
                    page_type: eventData.page_type,
                    custom_timestamp: eventData.timestamp,
                    scroll_depth: eventData.scroll_depth,
                    page_location: eventData.url,
                    session_id: eventData.session_id,
                    engagement_time_msec: eventData.time_on_page || 0
                }
            }]
        };

        // Uncomment and configure when ready to use
        // const response = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`, {
        //     method: 'POST',
        //     body: JSON.stringify(ga4Payload)
        // });

        console.log('GA4 payload prepared:', JSON.stringify(ga4Payload, null, 2));
        
    } catch (error) {
        console.error('Error sending to Google Analytics:', error);
    }
}

/**
 * Map custom event names to GA4 compatible names
 */
function mapEventNameForGA4(eventName) {
    const eventMap = {
        'blog_page_view': 'page_view',
        'modal_interaction': 'engagement',
        'scroll_milestone': 'scroll',
        'conversion_step': 'conversion',
        'blog_navigation': 'navigation',
        'heatmap_click': 'click',
        'page_exit': 'session_end',
        'engagement_heartbeat': 'user_engagement'
    };
    
    return eventMap[eventName] || eventName;
}

/**
 * Store in database (example implementation)
 */
async function storeInDatabase(eventData) {
    // Example: Store in a database
    // This could be MongoDB, PostgreSQL, or any other database
    
    try {
        // Example database insert
        // await database.collection('analytics').insertOne({
        //     ...eventData,
        //     created_at: new Date(),
        //     processed: false
        // });
        
        console.log('Would store in database:', eventData.event);
        
    } catch (error) {
        console.error('Database storage error:', error);
    }
}

/**
 * Process conversion events for attribution
 */
function processConversionAttribution(eventData) {
    if (eventData.event === 'conversion_step') {
        // Track conversion funnel
        console.log('Conversion funnel step:', {
            step: eventData.step,
            session: eventData.session_id,
            source: eventData.source_page,
            timestamp: eventData.timestamp
        });
        
        // Here you could:
        // 1. Update conversion funnel analytics
        // 2. Trigger marketing attribution analysis
        // 3. Update user journey mapping
        // 4. Calculate conversion rates
    }
}

/**
 * Real-time processing for dashboards
 */
function processRealTimeAnalytics(eventData) {
    // Process events for real-time dashboards
    const realTimeMetrics = {
        event_type: eventData.event,
        page_type: eventData.page_type,
        timestamp: eventData.timestamp,
        session_id: eventData.session_id
    };
    
    // Send to real-time analytics service
    console.log('Real-time metrics:', realTimeMetrics);
    
    // Examples:
    // - Update current active users count
    // - Track popular blog pages in real-time
    // - Monitor conversion rates
    // - Track modal interaction rates
}