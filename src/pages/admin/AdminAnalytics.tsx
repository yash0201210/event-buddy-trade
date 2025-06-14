
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminAnalytics = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <p className="text-gray-600">View platform analytics and insights</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Analytics dashboard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
