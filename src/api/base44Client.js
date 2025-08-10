import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "689434d6111e7a25fcb19f0e", 
  requiresAuth: true // Ensure authentication is required for all operations
});
