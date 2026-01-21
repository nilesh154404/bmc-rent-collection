# Login 500 Error - Troubleshooting Guide

## Error Details
```
Server responded with a status of 500
Request failed with status code 500
```

## What This Means
A **500 Internal Server Error** means the server is experiencing an issue while processing your request. This is NOT a client-side error - it's a problem on the API server side.

## Common Causes

### 1. **API Server Issues**
- API server is down or not responding properly
- Server is experiencing high load
- Database connection issues on the server

### 2. **Request Format Issues**
- Wrong parameter names (we're sending `username` but API expects `email`)
- Missing required fields
- Wrong data types being sent

### 3. **API Endpoint Issues**
- Wrong endpoint URL
- Endpoint doesn't exist
- Authentication headers required but not provided

## How to Debug This

### Step 1: Check Browser Console (F12)
Look for detailed logs with emoji indicators:
```
🔐 Login attempt started
📧 Email: your@email.com
🔑 Password length: 8
👤 Role: admin
🌐 API URL: https://dev.authentication.payplatter.in/auth/sign-in
📤 Sending payload: {"username":"your@email.com","password":"..."}
❌ Login error - Full Error Object: [Error details]
❌ Error response body: [Server response]
```

### Step 2: Check Network Tab
1. Open DevTools → Network tab
2. Try to login
3. Look for the POST request to `/auth/sign-in`
4. Check:
   - **Status**: Should be 200 (not 500)
   - **Request headers**: Should include Content-Type: application/json
   - **Request body**: Should show the payload being sent
   - **Response body**: Should show the server's error message

### Step 3: Verify API Endpoint
Current endpoint being used:
```
https://dev.authentication.payplatter.in/auth/sign-in
```

**Check if:**
- URL is correct and accessible
- Server is running
- Endpoint exists on the server

## Possible Fixes

### Option 1: Check with API Provider
Contact PayPlatter support with:
- Error: 500 Internal Server Error
- Endpoint: `https://dev.authentication.payplatter.in/auth/sign-in`
- Payload format: `{ "username": "email@example.com", "password": "pass" }`

### Option 2: Check API Documentation
Verify the API expects:
- Parameter names: Is it `username` or `email`?
- Payload structure: Exact format required?
- Headers: Any special headers needed?
- Authentication: API key or token required?

### Option 3: Try Alternative Parameter Names
If the API expects `email` instead of `username`:
```typescript
// Change this:
const payload = {
  username: email,
  password,
};

// To this:
const payload = {
  email: email,
  password,
};
```

### Option 4: Check Server Logs
If you have access to the API server:
1. Check server logs for detailed error message
2. Look for database errors, validation errors, etc.
3. Fix the server-side issue

## Next Steps

1. **Run the app** and try login again
2. **Open DevTools Console** (F12)
3. **Try to login** with test credentials
4. **Share the console logs** showing:
   - The full error response body
   - What parameters are being sent
   - The exact server error message

This will help identify the exact cause of the 500 error.

## Test Credentials
```
Email: admin@bmc.gov.in
Password: admin123

OR

Email: rajesh.kumar@email.com
Password: tenant123
```

---

**Note**: The 500 error is happening on the server side. Once you share the console logs showing what error the server is returning, we can fix it properly.
