/**
 * Page Header Component
 * Consistent header for all pages with title, subtitle, and actions
 */

import React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({ title, subtitle, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 'var(--space-xl)' }}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-md)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-tertiary)'
        }}>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>/</span>}
              {crumb.href ? (
                <a 
                  href={crumb.href}
                  style={{ 
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Title & Actions */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        gap: 'var(--space-lg)',
        flexWrap: 'wrap'
      }}>
        <div>
          <h1 style={{ 
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-extrabold)',
            marginBottom: subtitle ? 'var(--space-sm)' : 0,
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ 
              fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)',
              maxWidth: '600px'
            }}>
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
