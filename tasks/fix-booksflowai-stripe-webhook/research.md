# Research: BooksFlowAI Stripe Webhook Deployment Fix

## Problem Analysis

The Netlify deployment for booksflowai.com is failing due to a deprecated page config in the Stripe webhook route file. The specific error is:

```
Error: Page config in /opt/build/repo/src/app/api/stripe/webhook/route.ts is deprecated. Replace `export const config=…` with th
Visit https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config for more information.
```

## Root Cause

The issue is in the file `src/app/api/stripe/webhook/route.ts` where there's a deprecated `export const config = ...` statement. This was the old way to configure API routes in Next.js, but has been deprecated in favor of the new App Router conventions.

## Next.js App Router Changes

In Next.js 13+ with the App Router:

### Old (Deprecated) Pattern:
```typescript
export const config = {
  api: {
    bodyParser: false,
  },
}
```

### New Pattern:
The configuration should be moved to named exports directly in the route handler:

```typescript
// For disabling body parsing
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Or for edge runtime
export const runtime = 'edge'
```

## Common Stripe Webhook Configurations

Stripe webhooks typically need:
1. Raw body parsing disabled (to verify webhook signatures)
2. Specific runtime configuration
3. Proper error handling

## Solution Strategy

1. Locate the problematic file: `src/app/api/stripe/webhook/route.ts`
2. Remove the deprecated `export const config = ...` statement
3. Replace with appropriate route segment config exports
4. Ensure webhook signature verification still works
5. Test the deployment

## References

- [Next.js Route Segment Config Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
- [Stripe Webhook Handling in Next.js App Router](https://stripe.com/docs/webhooks/quickstart)