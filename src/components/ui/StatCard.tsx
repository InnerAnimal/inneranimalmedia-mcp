/**
 * Stat Card Component
 * Beautiful metric cards with trends like the analytics mockup
 */

import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    percentage?: string | number;
    direction: 'up' | 'down' | 'neutral';
  };
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  sparkline?: number[];
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'error' | 'info';
  };
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  change,
  subtitle,
  icon,
  badge,
  onClick
}: StatCardProps) {
  return (
    <div 
      className="card hover-lift"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Header */}
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon && (
            <span style={{ fontSize: '20px', opacity: 0.7 }}>{icon}</span>
          )}
          <span className="card-title">{title}</span>
        </div>
        {badge && (
          <span className={`badge badge-${badge.variant}`}>
            {badge.text}
          </span>
        )}
      </div>

      {/* Main Value */}
      <div className="card-value">{value}</div>

      {/* Change Indicator */}
      {change && (
        <div 
          className={`card-metric ${change.direction === 'up' ? 'positive' : change.direction === 'down' ? 'negative' : ''}`}
          style={{ marginTop: '8px' }}
        >
          <span>{change.direction === 'up' ? '↗' : change.direction === 'down' ? '↘' : '→'}</span>
          <span>{change.value}</span>
          {change.percentage && (
            <span style={{ opacity: 0.7 }}>({change.percentage}%)</span>
          )}
        </div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <div className="card-subtitle" style={{ marginTop: '4px' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default StatCard;
