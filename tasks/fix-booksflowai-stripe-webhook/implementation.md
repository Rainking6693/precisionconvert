# Implementation: BooksFlowAI Stripe Webhook Fix

## Status: Ready for Implementation

Since I don't have direct access to the booksflowai.com repository, I'm providing the exact code changes needed to fix the deployment issue.

## The Fix

### Problem File: `src/app/api/stripe/webhook/route.ts`

The file currently contains a deprecated configuration that looks like this:

```typescript
// ❌ DEPRECATED - This causes the build error
export const config = {
  api: {
    bodyParser: false,
  },
}
```

### Solution: Replace with App Router Configuration

**Step 1: Remove the deprecated config**

Delete or comment out the entire `export const config = ...` block.

**Step 2: Add the new App Router configuration**

Add this line at the top of the file (after imports):

```typescript
// ✅ NEW - App Router configuration
export const dynamic = 'force-dynamic'
```

### Complete Example

Here's what the corrected file should look like:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// ✅ New App Router configuration - replaces the deprecated config
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use your preferred API version
})

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }
    
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    
    // Handle the webhook event
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object)
        // Add your payment success logic here
        break
        \n      case 'payment_intent.payment_failed':\n        console.log('Payment failed:', event.data.object)\n        // Add your payment failure logic here\n        break\n        \n      case 'customer.subscription.created':\n        console.log('Subscription created:', event.data.object)\n        // Add your subscription logic here\n        break\n        \n      case 'customer.subscription.updated':\n        console.log('Subscription updated:', event.data.object)\n        // Add your subscription update logic here\n        break\n        \n      case 'customer.subscription.deleted':\n        console.log('Subscription cancelled:', event.data.object)\n        // Add your subscription cancellation logic here\n        break\n        \n      default:\n        console.log(`Unhandled event type: ${event.type}`)\n    }\n    \n    return NextResponse.json({ received: true })\n  } catch (error) {\n    console.error('Webhook error:', error)\n    return NextResponse.json(\n      { error: 'Webhook handler failed' },\n      { status: 400 }\n    )\n  }\n}\n\n// ❌ REMOVE THIS DEPRECATED CONFIG:\n// export const config = {\n//   api: {\n//     bodyParser: false,\n//   },\n// }\n```\n\n## Alternative Configurations\n\nDepending on your specific needs, you might also want to add:\n\n```typescript\n// For edge runtime (faster cold starts, some limitations)\nexport const runtime = 'edge'\n\n// For Node.js runtime (default, more features)\nexport const runtime = 'nodejs'\n\n// For maximum performance\nexport const dynamic = 'force-dynamic'\nexport const revalidate = 0\n```\n\n## Quick Fix Summary\n\n**Minimum change needed:**\n\n1. Open `src/app/api/stripe/webhook/route.ts`\n2. Delete this block:\n   ```typescript\n   export const config = {\n     api: {\n       bodyParser: false,\n     },\n   }\n   ```\n3. Add this line after your imports:\n   ```typescript\n   export const dynamic = 'force-dynamic'\n   ```\n4. Save the file\n5. Commit and push to trigger a new Netlify deployment\n\n## Verification Steps\n\n1. **Local Build Test:**\n   ```bash\n   npm run build\n   ```\n   Should complete without the deprecated config error.\n\n2. **Netlify Deployment:**\n   Push the changes and verify the build succeeds.\n\n3. **Webhook Testing:**\n   Use Stripe CLI to test webhook delivery:\n   ```bash\n   stripe listen --forward-to localhost:3000/api/stripe/webhook\n   stripe trigger payment_intent.succeeded\n   ```\n\n## Environment Variables\n\nEnsure these are set in your Netlify environment:\n- `STRIPE_SECRET_KEY`\n- `STRIPE_WEBHOOK_SECRET`\n- `STRIPE_PUBLISHABLE_KEY` (if used in frontend)\n\n## Expected Result\n\n✅ Netlify build will complete successfully  \n✅ Stripe webhooks will continue to work as before  \n✅ No functionality changes, only configuration syntax updated  \n\nThis fix addresses the exact error message you received and follows the current Next.js App Router best practices.