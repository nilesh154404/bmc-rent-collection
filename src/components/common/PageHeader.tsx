import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
}) => {
  return (
    <div className="page-header">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="w-4 h-4" />}
              {item.href ? (
                <a href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </a>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
