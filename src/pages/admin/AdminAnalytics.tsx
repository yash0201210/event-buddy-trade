
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsOverview } from '@/components/admin/analytics/AnalyticsOverview';
import { TransactionTable } from '@/components/admin/analytics/TransactionTable';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';

const AdminAnalytics = () => {
  const { data: analytics, isLoading } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <AnalyticsOverview 
          totalTicketsSold={0}
          totalUsers={0}
          totalEvents={0}
          totalRevenue={0}
          loading={true}
        />
      </div>
    );
  }

  const { overview, cityStats, universityStats, transactions } = analytics || {};

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">View platform analytics and insights</p>
      </div>

      {/* Overview Stats */}
      <AnalyticsOverview 
        totalTicketsSold={overview?.totalTicketsSold || 0}
        totalUsers={overview?.totalUsers || 0}
        totalEvents={overview?.totalEvents || 0}
        totalRevenue={overview?.totalRevenue || 0}
        loading={isLoading}
      />

      {/* Sales by Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tickets Sold by City</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(cityStats || {}).map(([city, stats]: [string, any]) => (
                <div key={city} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{city}</div>
                    <div className="text-sm text-gray-600">{stats.count} tickets</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">£{stats.revenue.toFixed(2)}</div>
                  </div>
                </div>
              ))}
              {Object.keys(cityStats || {}).length === 0 && (
                <p className="text-gray-500 text-center py-4">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets Sold by University</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(universityStats || {}).map(([university, stats]: [string, any]) => (
                <div key={university} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{university}</div>
                    <div className="text-sm text-gray-600">{stats.count} tickets</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">£{stats.revenue.toFixed(2)}</div>
                  </div>
                </div>
              ))}
              {Object.keys(universityStats || {}).length === 0 && (
                <p className="text-gray-500 text-center py-4">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Details */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable 
            transactions={transactions || []}
            loading={isLoading}
          />
          {(!transactions || transactions.length === 0) && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
