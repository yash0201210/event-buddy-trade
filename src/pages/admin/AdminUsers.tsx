
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminUsers = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">User management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
