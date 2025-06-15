
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  event_name: string;
  buyer_email: string;
  seller_email: string;
  amount: number;
  completed_at: string;
  ticket_type: string;
  status: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
}

export const TransactionTable = ({ transactions, loading }: TransactionTableProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
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
            <TableHead>Transaction ID</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Ticket Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Completed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-mono text-sm">
                {transaction.id.slice(0, 8)}...
              </TableCell>
              <TableCell className="font-medium">{transaction.event_name}</TableCell>
              <TableCell>{transaction.buyer_email}</TableCell>
              <TableCell>{transaction.seller_email}</TableCell>
              <TableCell>{transaction.ticket_type}</TableCell>
              <TableCell className="font-semibold">£{transaction.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                  {transaction.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(transaction.completed_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
