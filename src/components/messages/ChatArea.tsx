
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { MessageBubble } from './MessageBubble';

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

interface ChatAreaProps {
  selectedConv: Conversation | null;
  currentUserId: string;
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  isSending: boolean;
  onBack: () => void;
  onAcceptPurchaseRequest: (conversationId: string) => void;
  onRejectPurchaseRequest: (conversationId: string) => void;
  onConfirmTransfer: (conversationId: string) => void;
  onViewTransactionDetails: (conversationId: string) => void;
  onFundsReceived: (conversationId: string) => void;
  onNavigateToSellingHub: () => void;
}

export const ChatArea = ({
  selectedConv,
  currentUserId,
  newMessage,
  setNewMessage,
  onSendMessage,
  isSending,
  onBack,
  onAcceptPurchaseRequest,
  onRejectPurchaseRequest,
  onConfirmTransfer,
  onViewTransactionDetails,
  onFundsReceived,
  onNavigateToSellingHub
}: ChatAreaProps) => {
  if (!selectedConv) {
    return (
      <Card className="lg:col-span-2 h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a conversation to start messaging</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isUserBuyer = selectedConv.buyer_id === currentUserId;

  return (
    <Card className="lg:col-span-2 h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b border-gray-200 flex-shrink-0 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-lg text-gray-900">
              {selectedConv.ticket_title}
            </CardTitle>
            <p className="text-sm text-gray-600">
              €{selectedConv.ticket_price} • {
                isUserBuyer 
                  ? selectedConv.seller_name
                  : selectedConv.buyer_name
              }
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-0 min-h-0 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedConv.messages?.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender_id === currentUserId}
              isUserBuyer={isUserBuyer}
              selectedConv={selectedConv}
              onAcceptPurchaseRequest={onAcceptPurchaseRequest}
              onRejectPurchaseRequest={onRejectPurchaseRequest}
              onConfirmTransfer={onConfirmTransfer}
              onViewTransactionDetails={onViewTransactionDetails}
              onFundsReceived={onFundsReceived}
              onNavigateToSellingHub={onNavigateToSellingHub}
            />
          ))}
        </div>

        {/* Transaction Instructions - Thinner and less prominent */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-t border-red-100 p-2 mx-4 rounded-md mb-2 flex-shrink-0">
          <h4 className="font-medium text-xs text-red-800 mb-1">Transaction Steps</h4>
          <div className="text-xs text-red-600 opacity-80">
            {isUserBuyer ? (
              <p>1. Wait for seller acceptance • 2. Transfer payment • 3. Confirm transfer • 4. Receive tickets</p>
            ) : (
              <p>1. Accept/counter offers • 2. Share bank details • 3. Confirm payment • 4. Transfer tickets</p>
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex gap-2 p-4 border-t border-gray-200 flex-shrink-0">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            className="border-gray-300 focus:border-red-500 focus:ring-red-500"
          />
          <Button 
            onClick={onSendMessage}
            disabled={!newMessage.trim() || isSending}
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
