
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminSettings = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <p className="text-gray-600">Configure platform settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Settings configuration coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
