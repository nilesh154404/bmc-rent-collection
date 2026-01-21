import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { mockTenants, Tenant, demoUsers } from '@/lib/mockData';
import { setupAxios } from '@/services/axiosConfig';
import { extractAuthData } from '@/services/apiResponseFormats';

type UserRole = 'tenant' | 'admin' | null;

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'tenant' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  currentTenant: Tenant | null;
  currentUser: AuthUser | null;
  accessToken: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateTenantENachStatus: (status: Tenant['eNachStatus']) => void;
  verifyToken: (token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "https://dev.authentication.payplatter.in/auth";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  // Initialize axios interceptors on mount
  React.useEffect(() => {
    setupAxios();
  }, []);

  // Verify token on mount
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token).then(isValid => {
        if (isValid) {
          setIsAuthenticated(true);
          const role = localStorage.getItem("userRole") as UserRole;
          setUserRole(role);
          setCurrentUser({
            id: localStorage.getItem("userId") || "",
            email: localStorage.getItem("userEmail") || "",
            name: localStorage.getItem("userName") || "",
            role: (role as 'tenant' | 'admin') || 'tenant'
          });
        }
      });
    }
  }, []);

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${API_URL}/verify_token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      console.log("🔐 Login attempt started");
      console.log("📧 Email:", email);
      console.log("🔑 Password length:", password.length);
      console.log("👤 Role:", role);
      console.log("🌐 API URL:", `${API_URL}/sign-in`);
      
      const payload = {
        username: email,
        password,
      };
      
      console.log("📤 Sending payload:", JSON.stringify(payload));

      const response = await axios.post(`${API_URL}/sign-in`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      console.log("✅ Login response status:", response.status);
      console.log("📦 Login response data:", response.data);
      const data = response.data;

      // Extract auth data from response using flexible parser
      const authData = extractAuthData(data);
      
      if (!authData) {
        console.log("⚠️ Could not extract auth data from response");
        console.log("📋 Response structure:", Object.keys(data));
        console.log("📋 Full response:", JSON.stringify(data, null, 2));
        return false;
      }

      const { accessToken, refreshToken, user } = authData;
      console.log("🔑 Extracted accessToken:", !!accessToken);
      console.log("👤 Extracted user:", user);

      if (accessToken) {
        setAccessToken(accessToken);
        setIsAuthenticated(true);
        setUserRole(role);

        // Store in localStorage
        localStorage.setItem("token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        if (user) {
          setCurrentUser(user);
          localStorage.setItem("userId", user.id);
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userName", user.name);
          localStorage.setItem("userRole", user.role);

          // For tenant role, create a tenant object for the dashboard
          if (role === 'tenant' || user.role === 'tenant') {
            const tenantData: Tenant = {
              id: user.id,
              name: user.name,
              email: user.email,
              password: '',
              phone: '+91 9999999999',
              propertyId: 'PROP-001',
              propertyNo: 'Property from API',
              propertyLocation: 'Location from API',
              rentAmount: 15000,
              outstandingAmount: 0,
              contractStartDate: new Date().toISOString(),
              contractEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              eNachStatus: 'pending',
              contractStatus: 'active',
              occupantType: 'tenant',
            };
            setCurrentTenant(tenantData);
            localStorage.setItem("tenantData", JSON.stringify(tenantData));
          }
        } else {
          // If user object not provided, use the email passed
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userRole", role || 'tenant');
        }

        console.log("🎉 Login successful");
        return true;
      }

      console.log("⚠️ No accessToken found in extracted auth data");
      return false;
    } catch (error: any) {
      console.error("❌ Login error - Full Error Object:", error);
      console.error("❌ Error response body:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error status text:", error.response?.statusText);
      console.error("❌ Error headers:", error.response?.headers);
      console.error("❌ Error message:", error.message);
      console.error("❌ Full error config:", {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        headers: error.config?.headers,
      });
      throw error; // Re-throw to let the component handle it
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentTenant(null);
    setCurrentUser(null);
    setAccessToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
  };

  const updateTenantENachStatus = (status: Tenant['eNachStatus']) => {
    if (currentTenant) {
      setCurrentTenant({ ...currentTenant, eNachStatus: status });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        userRole, 
        currentTenant, 
        currentUser,
        accessToken,
        login, 
        logout, 
        updateTenantENachStatus,
        verifyToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
