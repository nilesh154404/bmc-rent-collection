/**
 * API Response Format Analysis
 * 
 * Current Response from https://dev.authentication.payplatter.in/auth/sign-in:
 * 
 * {
 *   name: 'Payment-Authentication',
 *   summary: 'Payment Authentication Service',
 *   url: 'Payplatter....',
 *   results: {
 *     // The actual authentication data is here
 *   }
 * }
 * 
 * The issue: We were looking for data.accessToken directly,
 * but it's actually in data.results.accessToken
 */

export const API_RESPONSE_FORMATS = {
  PAYPLATTER: {
    description: 'PayPlatter API format with results wrapper',
    structure: {
      name: 'Payment-Authentication',
      summary: 'Payment Authentication Service',
      url: 'string',
      results: {
        accessToken: 'string',
        refreshToken: 'string | undefined',
        user: {
          id: 'string',
          email: 'string',
          name: 'string',
          role: 'tenant | admin'
        }
      }
    }
  },
  STANDARD: {
    description: 'Standard REST API format',
    structure: {
      accessToken: 'string',
      refreshToken: 'string | undefined',
      user: {
        id: 'string',
        email: 'string',
        name: 'string',
        role: 'tenant | admin'
      }
    }
  }
};

/**
 * Extract token from different API response formats
 */
export function extractAuthData(response: any) {
  // Check for standard format
  if (response.accessToken) {
    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user: response.user
    };
  }

  // Check for PayPlatter format with results.data wrapper
  // results.data.access_token (snake_case)
  if (response.results?.data?.access_token) {
    console.log("✅ Found PayPlatter format: results.data.access_token");
    const userData = response.results.data.user;
    return {
      accessToken: response.results.data.access_token,
      refreshToken: response.results.data.refresh_token,
      user: userData ? {
        id: userData.external_id,
        email: userData.user_email,
        name: userData.user_name,
        role: userData.type?.toLowerCase() === 'tenant' ? 'tenant' : 'admin'
      } : null
    };
  }

  // Check for PayPlatter format with results wrapper (camelCase)
  if (response.results?.accessToken) {
    console.log("✅ Found PayPlatter format: results.accessToken");
    return {
      accessToken: response.results.accessToken,
      refreshToken: response.results.refreshToken,
      user: response.results.user
    };
  }

  // Check for PayPlatter format with results wrapper (snake_case alternative)
  if (response.results?.access_token) {
    console.log("✅ Found PayPlatter format: results.access_token");
    return {
      accessToken: response.results.access_token,
      refreshToken: response.results.refresh_token,
      user: response.results.user
    };
  }

  // Check alternative field names at root level
  if (response.access_token) {
    console.log("✅ Found root level access_token");
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      user: response.user
    };
  }

  console.log("❌ No authentication data found in response");
  return null;
}
