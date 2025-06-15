
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyTicketsStateProps {
  type: 'upcoming' | 'pending' | 'past';
}

export const EmptyTicketsState = ({ type }: EmptyTicketsStateProps) => {
  const navigate = useNavigate();

  const content = {
    upcoming: {
      title: 'No upcoming tickets',
      description: "You don't have any confirmed tickets for upcoming events.",
      showButton: true
    },
    pending: {
      title: 'No pending tickets',
      description: 'All your ticket purchases have been completed.',
      showButton: false
    },
    past: {
      title: 'No past events',
      description: "You haven't attended any events yet.",
      showButton: false
    }
  };

  const { title, description, showButton } = content[type];

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {showButton && (
          <Button onClick={() => navigate('/')}>
            Browse Events
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
