
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';

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
    <Card className="h-full">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg text-gray-900">Messages</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
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
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">
                    {conversation.ticket_title}
                  </h3>
                  <Badge variant="outline" className="text-xs border-red-200 text-red-700">
                    €{conversation.ticket_price}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">
                  {isUserBuyer ? 'Seller' : 'Buyer'}: {otherPartyName}
                </p>
                
                {lastMessage && (
                  <p className="text-xs text-gray-500 truncate">
                    {lastMessage.message_type === 'purchase_request' ? 'Purchase request sent' :
                     lastMessage.message_type === 'order_confirmed' ? 'Order confirmed' :
                     lastMessage.message_type === 'transfer_confirmation' ? 'Transfer confirmed' :
                     lastMessage.message_type === 'funds_received' ? 'Transaction complete' :
                     lastMessage.content}
                  </p>
                )}
                
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(conversation.created_at).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
