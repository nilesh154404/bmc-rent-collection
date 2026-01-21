import axios from 'axios';

const APP_ID = 'PRMS.Mp9N3bRcT6FgYqZ';

export function setupAxios() {
  // Set default headers
  axios.defaults.headers.Accept = 'application/json';
  axios.defaults.headers.common['application_id'] = APP_ID;

  // Request interceptor - add auth token
  axios.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (err: any) => Promise.reject(err)
  );

  // Response interceptor - handle token refresh and auth errors
  axios.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized - token expired
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          return axios
            .post('https://dev.authentication.payplatter.in/auth/refresh-token', {
              refreshToken,
            })
            .then((response) => {
              const { accessToken } = response.data;
              localStorage.setItem('token', accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return axios(originalRequest);
            })
            .catch((err) => {
              // Refresh token failed, logout user
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
              return Promise.reject(err);
            });
        } else {
          // No refresh token, redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        console.error('Access denied:', error.response?.data?.message);
      }

      return Promise.reject(error);
    }
  );
}
