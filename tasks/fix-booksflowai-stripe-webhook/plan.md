# Implementation Plan: Fix BooksFlowAI Stripe Webhook Deployment

## Overview

Fix the deprecated page config in the Stripe webhook route that's causing Netlify deployment failures for booksflowai.com.

## Current Issue

The file `src/app/api/stripe/webhook/route.ts` contains a deprecated `export const config = ...` statement that needs to be updated to use the new Next.js App Router conventions.

## Implementation Steps

### Step 1: Identify the Current Configuration
- Locate the file: `src/app/api/stripe/webhook/route.ts`
- Examine the current `export const config = ...` statement
- Understand what configuration options are being used

### Step 2: Convert to New App Router Format

Replace the deprecated config with appropriate route segment config exports:

#### Common Stripe Webhook Configurations:

**For Raw Body Access (most common for Stripe):**
```typescript
// Remove this deprecated pattern:
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

// Replace with:
export const dynamic = 'force-dynamic'
```

**For Edge Runtime (if needed):**
```typescript
export const runtime = 'edge'
```

**For Node.js Runtime (default, usually not needed to specify):**
```typescript
export const runtime = 'nodejs'
```

### Step 3: Ensure Webhook Functionality

Verify that the webhook handler still works correctly:

1. **Raw Body Access**: Ensure `request.text()` or `request.arrayBuffer()` still works for signature verification
2. **Stripe Signature Verification**: Confirm that `stripe.webhooks.constructEvent()` still functions
3. **Error Handling**: Maintain proper error responses

### Step 4: Example Implementation

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// New App Router configuration
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!
    
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        break
      // Add other event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`)
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}
```

### Step 5: Verification

1. **Build Test**: Run `npm run build` locally to ensure no build errors
2. **Type Check**: Run `npm run type-check` if available
3. **Deployment Test**: Deploy to Netlify and verify the build succeeds
4. **Webhook Test**: Test webhook functionality with Stripe CLI or test events

## Files to Modify

- `src/app/api/stripe/webhook/route.ts` - Main file requiring the fix

## Potential Additional Files

If there are other API routes with similar deprecated configs:
- Search for other files with `export const config =` pattern
- Apply the same fix to any other deprecated configurations

## Success Criteria

1. ✅ Netlify build completes without errors
2. ✅ Stripe webhook endpoint responds correctly
3. ✅ Webhook signature verification works
4. ✅ No TypeScript errors
5. ✅ Application functionality remains intact

## Rollback Plan

If issues arise:
1. Revert the changes to the original `export const config` format temporarily
2. Investigate specific configuration requirements
3. Apply a more targeted fix

## Notes

- This is a breaking change migration required by Next.js App Router
- The functionality should remain the same, only the configuration syntax changes
- Ensure all environment variables (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET) are properly configured in Netlify