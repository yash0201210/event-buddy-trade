
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, User } from 'lucide-react';

interface Conversation {
  id: string;
  ticket_id: string;
  buyer_id: string;
  seller_id: string;
  status: string;
  created_at: string;
  ticket_title?: string;
  ticket_price?: number;
  event_name?: string;
  event_venue?: string;
  event_date?: string;
  buyer_name?: string;
  seller_name?: string;
  messages: any[];
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
}

export const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  currentUserId
}: ConversationListProps) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (conversations.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b border-gray-200 flex-shrink-0">
        <CardTitle className="text-lg text-gray-900">Messages</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {conversations.map((conversation) => {
            const isUserBuyer = conversation.buyer_id === currentUserId;
            const otherPartyName = isUserBuyer ? conversation.seller_name : conversation.buyer_name;
            const lastMessage = conversation.messages?.[conversation.messages.length - 1];
            const isSelected = selectedConversation === conversation.id;
            
            return (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`p-4 cursor-pointer transition-colors hover:bg-red-50 ${
                  isSelected ? 'bg-red-50 border-l-4 border-red-600' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-red-100 text-red-700">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {conversation.ticket_title}
                      </h3>
                      <Badge variant="outline" className="text-xs border-red-200 text-red-700 ml-2">
                        €{conversation.ticket_price}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-1">
                      {isUserBuyer ? 'Seller' : 'Buyer'}: {otherPartyName}
                    </p>
                  </div>
                </div>
                
                {lastMessage && (
                  <p className="text-xs text-gray-500 truncate mb-1">
                    {lastMessage.message_type === 'purchase_request' ? 'Purchase request sent' :
                     lastMessage.message_type === 'order_confirmed' ? 'Order confirmed' :
                     lastMessage.message_type === 'transfer_confirmation' ? 'Transfer confirmed' :
                     lastMessage.message_type === 'funds_received' ? 'Transaction complete' :
                     lastMessage.content}
                  </p>
                )}
                
                <p className="text-xs text-gray-400">
                  {formatTime(lastMessage?.created_at || conversation.created_at)}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
