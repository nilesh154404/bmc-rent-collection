import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockTenants, Tenant, demoUsers } from '@/lib/mockData';

type UserRole = 'tenant' | 'admin' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  currentTenant: Tenant | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  updateTenantENachStatus: (status: Tenant['eNachStatus']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

  const login = (email: string, password: string, role: UserRole): boolean => {
    if (role === 'admin') {
      // Admin login
      if (email === demoUsers.admin.email && password === demoUsers.admin.password) {
        setIsAuthenticated(true);
        setUserRole('admin');
        return true;
      }
      // Demo mode - allow any admin login
      if (!email && !password) {
        setIsAuthenticated(true);
        setUserRole('admin');
        return true;
      }
      return false;
    }

    // Tenant/Lessee login
    const tenant = mockTenants.find(t => t.email === email && t.password === password);
    if (tenant) {
      setIsAuthenticated(true);
      setUserRole('tenant');
      setCurrentTenant(tenant);
      return true;
    }

    // Demo mode - if no credentials, use first tenant (Rajesh Kumar - not registered)
    if (!email && !password) {
      const defaultTenant = mockTenants.find(t => t.id === '1');
      setIsAuthenticated(true);
      setUserRole('tenant');
      setCurrentTenant(defaultTenant || mockTenants[0]);
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentTenant(null);
  };

  const updateTenantENachStatus = (status: Tenant['eNachStatus']) => {
    if (currentTenant) {
      setCurrentTenant({ ...currentTenant, eNachStatus: status });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, currentTenant, login, logout, updateTenantENachStatus }}>
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
