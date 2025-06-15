
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Users, Calendar, Dollar } from 'lucide-react';

interface AnalyticsOverviewProps {
  totalTicketsSold: number;
  totalUsers: number;
  totalEvents: number;
  totalRevenue: number;
  loading?: boolean;
}

export const AnalyticsOverview = ({ 
  totalTicketsSold, 
  totalUsers, 
  totalEvents, 
  totalRevenue,
  loading = false 
}: AnalyticsOverviewProps) => {
  const stats = [
    {
      title: "Total Tickets Sold",
      value: totalTicketsSold,
      icon: Ticket,
      color: "text-blue-600"
    },
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Total Events",
      value: totalEvents,
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      title: "Total Revenue",
      value: `£${totalRevenue.toFixed(2)}`,
      icon: Dollar,
      color: "text-red-600"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
