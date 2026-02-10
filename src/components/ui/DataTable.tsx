/**
 * Data Table Component
 * Clean, responsive table for displaying structured data
 */

import React from 'react';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  compact?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id' as keyof T,
  emptyMessage = 'No data available',
  onRowClick,
  compact = false
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">No Data</div>
          <div className="empty-state-subtitle">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: compact ? '12px' : '24px', overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
            {columns.map((column, idx) => (
              <th
                key={String(column.key) + idx}
                style={{
                  padding: compact ? '8px' : '12px',
                  textAlign: column.align || 'left',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  width: column.width
                }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={String(row[keyField]) || rowIdx}
              onClick={() => onRowClick?.(row)}
              style={{
                borderBottom: '1px solid var(--border-primary)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (onRowClick) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {columns.map((column, colIdx) => (
                <td
                  key={String(column.key) + colIdx}
                  style={{
                    padding: compact ? '8px' : '12px',
                    textAlign: column.align || 'left',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {column.render
                    ? column.render(row[column.key as keyof T], row)
                    : String(row[column.key as keyof T] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
