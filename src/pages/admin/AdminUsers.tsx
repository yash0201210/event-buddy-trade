
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserTable } from '@/components/admin/users/UserTable';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { Users, Search } from 'lucide-react';

const AdminUsers = () => {
  const { data: users = [], isLoading } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (userId: string) => {
    setSelectedUser(userId);
    // Here you could open a modal or navigate to a detailed user page
    console.log('Viewing user:', userId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage user accounts and view transaction history</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Users className="h-5 w-5" />
          <span className="font-medium">{users.length} Total Users</span>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by email, name, or university..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-sm text-gray-600">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {users.filter(u => u.is_verified).length}
            </div>
            <p className="text-sm text-gray-600">Verified Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {users.reduce((sum, u) => sum + u.total_transactions, 0)}
            </div>
            <p className="text-sm text-gray-600">Total Transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              £{users.reduce((sum, u) => sum + u.total_earned + u.total_spent, 0).toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Total Volume</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable 
            users={filteredUsers}
            loading={isLoading}
            onViewUser={handleViewUser}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
