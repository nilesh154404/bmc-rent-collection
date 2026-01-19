import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  CreditCard, 
  Banknote, 
  History, 
  Bell, 
  LogOut,
  FileText,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface TenantSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const TenantSidebar: React.FC<TenantSidebarProps> = ({ collapsed, onToggle }) => {
  const { logout, currentTenant } = useAuth();

  const navItems = [
    { to: '/tenant/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tenant/property', icon: Building2, label: 'Property & Contract' },
    { to: '/tenant/enach', icon: Banknote, label: 'e-NACH Registration' },
    { to: '/tenant/payments', icon: CreditCard, label: 'Pay Rent' },
    { to: '/tenant/history', icon: History, label: 'Payment History' },
    { to: '/tenant/notices', icon: Bell, label: 'Notices' },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-heading font-bold text-sm leading-tight">BMC Rent Portal</h1>
              <p className="text-xs text-sidebar-foreground/70">Tenant Login</p>
            </div>
          )}
        </div>
      </div>

      {/* Tenant Info */}
      {!collapsed && currentTenant && (
        <div className="px-4 py-3 border-b border-sidebar-border animate-fade-in">
          <p className="text-xs text-sidebar-foreground/70">Welcome,</p>
          <p className="font-medium text-sm truncate">{currentTenant.name}</p>
          <p className="text-xs text-sidebar-foreground/70 truncate">{currentTenant.propertyNo}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "nav-link",
                isActive && "active",
                collapsed && "justify-center px-2"
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="animate-fade-in">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={logout}
          className={cn(
            "nav-link w-full text-sidebar-foreground/80 hover:text-sidebar-foreground",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 bg-sidebar-primary text-sidebar-primary-foreground w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:bg-sidebar-ring transition-colors"
      >
        <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
      </button>
    </aside>
  );
};

export default TenantSidebar;
