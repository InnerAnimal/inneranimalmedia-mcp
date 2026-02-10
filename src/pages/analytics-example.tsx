/**
 * Analytics Page Example
 * Shows how to use design system components to build polished UI
 */

import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { DataTable } from '../components/ui/DataTable';

// Example of connecting to your D1 API
async function fetchDashboardData() {
  try {
    const [stats, builds, workers] = await Promise.all([
      fetch('https://mcp.inneranimalmedia.com/api/dashboard/stats').then(r => r.json()),
      fetch('https://mcp.inneranimalmedia.com/api/dashboard/pipelines').then(r => r.json()),
      fetch('https://mcp.inneranimalmedia.com/api/dashboard/deployments').then(r => r.json())
    ]);
    return { stats, builds, workers };
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    return null;
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div className="loading-spinner" style={{ margin: '40px auto' }}></div>
      </div>
    );
  }

  const stats = data?.stats?.data || {};
  const builds = data?.builds?.data || [];
  const workers = data?.workers?.data || [];

  return (
    <div style={{ 
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Page Header */}
      <PageHeader
        title="Analytics"
        subtitle="Real-time metrics, AI insights, and infrastructure management"
        actions={
          <>
            <select 
              className="btn btn-secondary"
              style={{ 
                padding: '10px 16px',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
            </select>
            <button className="btn btn-primary">
              ↻ Refresh
            </button>
          </>
        }
      />

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <StatCard
          title="Total Builds"
          value={stats.builds?.total_builds || 0}
          icon="📦"
          change={{
            value: stats.builds?.successful_builds || 0,
            direction: 'up'
          }}
          subtitle={`${stats.builds?.failed_builds || 0} failed`}
          badge={{
            text: 'Live',
            variant: 'success'
          }}
        />

        <StatCard
          title="Active Workers"
          value={stats.workers?.active_workers || 0}
          icon="⚡"
          change={{
            value: stats.workers?.total_requests_30d || 0,
            direction: 'up'
          }}
          subtitle="requests (30d)"
          badge={{
            text: `${stats.workers?.failed_workers || 0} offline`,
            variant: stats.workers?.failed_workers > 0 ? 'error' : 'success'
          }}
        />

        <StatCard
          title="AI Workflows"
          value={stats.workflows?.active_workflows || 0}
          icon="🤖"
          change={{
            value: stats.workflows?.total_successes || 0,
            direction: 'up'
          }}
          subtitle="successful executions"
          badge={{
            text: 'Automated',
            variant: 'info'
          }}
        />

        <StatCard
          title="Cost Today"
          value={`$${(stats.costs?.total_cost_today || 0).toFixed(2)}`}
          icon="💰"
          change={{
            value: stats.costs?.total_calls_today || 0,
            direction: 'neutral'
          }}
          subtitle="LLM calls"
          badge={{
            text: 'Tracked',
            variant: 'info'
          }}
        />
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Builds */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ 
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--text-primary)'
            }}>
              Recent Builds
            </h2>
            <button className="btn btn-ghost" style={{ padding: '6px 12px' }}>
              View All →
            </button>
          </div>

          <DataTable
            columns={[
              {
                key: 'name',
                title: 'Project',
                render: (value) => (
                  <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                    {value}
                  </span>
                )
              },
              {
                key: 'status',
                title: 'Status',
                render: (value) => {
                  const variant = value === 'success' || value === 'completed' || value === 'active' 
                    ? 'success' 
                    : value === 'failed' ? 'error' : 'warning';
                  return (
                    <span className={`badge badge-${variant}`}>
                      {value}
                    </span>
                  );
                }
              },
              {
                key: 'build_number',
                title: 'Build #',
                align: 'center'
              },
              {
                key: 'environment',
                title: 'Env',
                render: (value) => value || 'production'
              }
            ]}
            data={builds.slice(0, 5)}
            compact
            onRowClick={(row) => {
              console.log('Build clicked:', row);
              alert(`Opening build: ${row.name}`);
            }}
          />
        </div>

        {/* Active Workers */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ 
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--text-primary)'
            }}>
              Active Workers
            </h2>
            <span className="badge badge-info">
              {workers.length} total
            </span>
          </div>

          <DataTable
            columns={[
              {
                key: 'worker_name',
                title: 'Worker',
                render: (value) => (
                  <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                    {value}
                  </span>
                )
              },
              {
                key: 'status',
                title: 'Status',
                render: (value) => {
                  const variant = value === 'active' ? 'success' : 'error';
                  return (
                    <span className={`badge badge-${variant}`}>
                      {value}
                    </span>
                  );
                }
              },
              {
                key: 'requests_30d',
                title: 'Requests',
                align: 'right',
                render: (value) => {
                  const num = Number(value) || 0;
                  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
                  return num;
                }
              }
            ]}
            data={workers.slice(0, 5)}
            compact
            onRowClick={(row) => {
              console.log('Worker clicked:', row);
              const routes = JSON.parse(row.routes || '[]');
              if (routes[0]) {
                window.open(`https://${routes[0]}`, '_blank');
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
