
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
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  message_type: string;
  created_at: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  currentUserId: string;
}

export const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  currentUserId
}: ConversationListProps) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No messages yet
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => {
              const isCurrentUserBuyer = conversation.buyer_id === currentUserId;
              const otherPartyName = isCurrentUserBuyer 
                ? conversation.seller_name 
                : conversation.buyer_name;
              const lastMessage = conversation.messages?.[conversation.messages.length - 1];
              
              return (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                    selectedConversation === conversation.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">{otherPartyName}</h4>
                    <Badge variant={isCurrentUserBuyer ? "secondary" : "default"}>
                      {isCurrentUserBuyer ? 'Buying' : 'Selling'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-1">
                    {conversation.ticket_title}
                  </p>
                  {lastMessage && (
                    <p className="text-xs text-gray-500 truncate">
                      {lastMessage.content.split('\n')[0]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
