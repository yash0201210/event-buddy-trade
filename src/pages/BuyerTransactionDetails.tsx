
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { BuyerTransactionDetailsView } from '@/components/tickets/BuyerTransactionDetailsView';
import { usePurchasedTickets } from '@/hooks/usePurchasedTickets';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BuyerTransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tickets = [], isLoading } = usePurchasedTickets();

  const ticket = tickets.find(t => t.id === id);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">Loading transaction details...</div>
        </div>
      </Layout>
    );
  }

  if (!ticket) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h1 className="text-xl font-semibold mb-4">Transaction Not Found</h1>
              <p className="text-gray-600 mb-4">The transaction you're looking for doesn't exist.</p>
              <Button onClick={() => navigate('/my-tickets')}>Back to My Tickets</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <BuyerTransactionDetailsView 
          ticket={ticket}
          onBack={() => navigate('/my-tickets')}
        />
      </div>
    </Layout>
  );
};

export default BuyerTransactionDetails;
