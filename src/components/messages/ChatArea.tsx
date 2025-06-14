
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
      <Card className="lg:col-span-2">
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
    <Card className="lg:col-span-2">
      <CardHeader className="border-b">
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
            <CardTitle className="text-lg">
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

      <CardContent className="flex flex-col h-[400px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
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

        {/* Transaction Instructions */}
        <div className="border-t bg-blue-50 p-3 rounded-lg mb-4">
          <h4 className="font-semibold text-sm mb-2">Transaction Instructions</h4>
          <div className="text-xs text-gray-700 space-y-1">
            {isUserBuyer ? (
              <>
                <p>1. Wait for seller to accept your purchase request</p>
                <p>2. Transfer payment using the provided bank details</p>
                <p>3. Confirm transfer in the chat</p>
                <p>4. Receive tickets after seller confirms payment</p>
              </>
            ) : (
              <>
                <p>1. Accept or counter purchase requests</p>
                <p>2. Share your bank details for payment</p>
                <p>3. Wait for payment confirmation from buyer</p>
                <p>4. Transfer tickets after confirming payment received</p>
              </>
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          />
          <Button 
            onClick={onSendMessage}
            disabled={!newMessage.trim() || isSending}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
