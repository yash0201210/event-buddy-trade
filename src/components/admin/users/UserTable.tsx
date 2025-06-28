
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { User, Mail, Trash2 } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  university: string;
  is_verified: boolean;
  created_at: string;
  total_transactions: number;
  total_spent: number;
  total_earned: number;
}

interface UserTableProps {
  users: UserData[];
  loading: boolean;
  onViewUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserTable = ({ users, loading, onViewUser, onDeleteUser }: UserTableProps) => {
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const handleDeleteUser = async (userId: string) => {
    setDeletingUserId(userId);
    try {
      await onDeleteUser(userId);
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Transactions</TableHead>
            <TableHead>Spent</TableHead>
            <TableHead>Earned</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium">{user.full_name || 'No name'}</div>
                    <div className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{user.email}</span>
                </div>
              </TableCell>
              <TableCell>{user.university || 'Not specified'}</TableCell>
              <TableCell>
                <Badge variant={user.is_verified ? "default" : "secondary"}>
                  {user.is_verified ? 'Verified' : 'Unverified'}
                </Badge>
              </TableCell>
              <TableCell>{user.total_transactions}</TableCell>
              <TableCell>£{user.total_spent.toFixed(2)}</TableCell>
              <TableCell>£{user.total_earned.toFixed(2)}</TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewUser(user.id)}
                  >
                    View Details
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={deletingUserId === user.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this user? This action will permanently remove:
                          <br />
                          <br />
                          <strong>{user.full_name || 'No name'}</strong> ({user.email})
                          <br />
                          <br />
                          This action cannot be undone and will delete all associated data including tickets, transactions, and messages.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete User
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
