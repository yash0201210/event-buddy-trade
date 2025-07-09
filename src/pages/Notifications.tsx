
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, Ticket, Clock } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const Notifications = () => {
  const { notifications, isLoading, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'offer':
        return <Ticket className="h-5 w-5 text-green-600" />;
      case 'offer_accepted':
        return <Ticket className="h-5 w-5 text-green-600" />;
      case 'offer_rejected':
        return <Ticket className="h-5 w-5 text-red-600" />;
      case 'ticket_alert':
        return <Bell className="h-5 w-5 text-orange-600" />;
      case 'system':
        return <Bell className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleNotificationClick = async (notification: any) => {
    try {
      // Mark as read if not already read
      if (!notification.is_read) {
        await markAsRead([notification.id]);
      }

      // Navigate based on notification type
      if (notification.type === 'message' && notification.related_id) {
        navigate('/messages');
      } else if (notification.type === 'offer' || notification.type === 'offer_accepted' || notification.type === 'offer_rejected') {
        navigate('/selling-hub');
      } else if (notification.type === 'ticket_alert' && notification.related_id) {
        navigate(`/event/${notification.related_id}`);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">Loading notifications...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated with your latest activity</p>
        </div>

        {notifications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  !notification.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          {!notification.is_read && (
                            <Badge variant="default" className="text-xs bg-blue-600">
                              New
                            </Badge>
                          )}
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(notification.created_at), 'MMM d, HH:mm')}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{notification.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
