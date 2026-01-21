import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Shield, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [loginType, setLoginType] = useState<'tenant' | 'admin'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  
  // Validate form
  if (!email || !password) {
    setError("Please enter both email and password");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("Please enter a valid email address");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  setLoading(true);

  try {
    console.log("📝 LoginPage: Calling contextLogin with email:", email);
    // Call the login from context
    const success = await contextLogin(email, password, loginType);
    console.log("📝 LoginPage: Login result:", success);

    if (success) {
      toast.success(`Welcome to BMC Portal`);
      // Redirect based on login type selected
      navigate(loginType === 'tenant' ? '/tenant/dashboard' : '/admin/dashboard');
    } else {
      setError("Invalid email or password");
    }

  } catch (error: any) {
    console.error("📝 LoginPage: Caught error");
    console.error("📝 Error type:", typeof error);
    console.error("📝 Error name:", error.name);
    console.error("📝 Error message:", error.message);
    console.error("📝 Error code:", error.code);
    console.error("📝 Response status:", error.response?.status);
    console.error("📝 Response data:", error.response?.data);

    // Handle different error scenarios
    const errorMessage = error.response?.data?.message || error.message;
    
    if (error.response?.status === 401) {
      setError("Invalid email or password");
    } else if (error.response?.status === 403) {
      setError("Access denied. Please contact administrator.");
    } else if (error.response?.status === 400) {
      setError(errorMessage || "Invalid request. Please check your credentials.");
    } else if (error.response?.status === 500) {
      setError(`Server error: ${errorMessage || "Please try again later or contact support."}`);
    } else if (error.message === 'Network Error') {
      setError("Network error. Please check your connection and API endpoint.");
    } else if (errorMessage) {
      setError(errorMessage);
    } else {
      setError("Login failed. Please try again.");
    }
  } finally {
      setLoading(false);
    }
};




  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/30" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
              <Building2 className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold">Bhopal Municipal Corporation</h1>
              <p className="text-primary-foreground/80">भोपाल नगर निगम</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-heading font-bold mb-4">
            Rent & Lease<br />Management Portal
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-md">
            Streamlined property management with integrated e-NACH payment system for hassle-free rent & lease collection.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Secure e-NACH Integration</p>
                <p className="text-sm text-primary-foreground/70">Automated rent/lease collection via NPCI</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Tenant & Lessee Portal</p>
                <p className="text-sm text-primary-foreground/70">Complete rent & lease management ecosystem</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full -mr-48 -mb-48" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary-foreground/5 rounded-full" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-xl font-heading font-bold text-foreground">Bhopal Municipal Corporation</h1>
            <p className="text-sm text-muted-foreground">Rent & Lease Management Portal</p>
          </div>

          {/* Login Type Toggle */}
          <div className="flex bg-muted rounded-lg p-1 mb-8">
            <button
              onClick={() => setLoginType('tenant')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all",
                loginType === 'tenant' 
                  ? "bg-card shadow text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Users className="w-4 h-4" />
              Tenant / Lessee
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all",
                loginType === 'admin' 
                  ? "bg-card shadow text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Shield className="w-4 h-4" />
              Admin Login
            </button>
          </div>

          {/* Login Form */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">
                {loginType === 'tenant' ? 'Tenant / Lessee Portal' : 'Admin Portal'}
              </h2>
              <p className="text-muted-foreground mt-1">
                {loginType === 'tenant' 
                  ? 'Access your property, rent/lease and payment details' 
                  : 'Manage tenants, lessees, properties and collections'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {loginType === 'tenant' ? 'Email Address' : 'Admin Email'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={loginType === 'tenant' ? 'Enter your email' : 'admin@bmc.gov.in'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-input" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:underline">Forgot password?</a>
              </div>

              <Button type="submit" variant="gov" size="xl" className="w-full">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {loginType === 'tenant' && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  New tenant/lessee? Contact BMC office for registration
                </p>
              </div>
            )}
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Demo Credentials</p>
            </div>
            <div className="space-y-2">
              <button 
                type="button"
                onClick={() => {
                  setEmail('rajesh.kumar@email.com');
                  setPassword('tenant123');
                }}
                className="w-full text-left p-2 rounded bg-card hover:bg-accent/10 transition-colors text-sm"
              >
                <span className="font-medium text-foreground">Tenant (e-NACH Not Registered)</span>
                <br />
                <span className="text-muted-foreground text-xs">rajesh.kumar@email.com / tenant123</span>
              </button>
              <button 
                type="button"
                onClick={() => {
                  setEmail('priya.patel@email.com');
                  setPassword('lessee456');
                }}
                className="w-full text-left p-2 rounded bg-card hover:bg-accent/10 transition-colors text-sm"
              >
                <span className="font-medium text-foreground">Lessee (e-NACH Active)</span>
                <br />
                <span className="text-muted-foreground text-xs">priya.patel@email.com / lessee456</span>
              </button>
              <button 
                type="button"
                onClick={() => {
                  setEmail('admin@bmc.gov.in');
                  setPassword('admin123');
                }}
                className="w-full text-left p-2 rounded bg-card hover:bg-accent/10 transition-colors text-sm"
              >
                <span className="font-medium text-foreground">Admin Portal</span>
                <br />
                <span className="text-muted-foreground text-xs">admin@bmc.gov.in / admin123</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            © 2024 Bhopal Municipal Corporation. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
