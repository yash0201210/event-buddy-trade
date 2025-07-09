import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { useNotifications } from '@/hooks/useNotifications';

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
  onAcceptCounterOffer: (conversationId: string) => void;
  onRejectCounterOffer: (conversationId: string, newAmount: number) => void;
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
  onAcceptCounterOffer,
  onRejectCounterOffer,
  onConfirmTransfer,
  onViewTransactionDetails,
  onFundsReceived,
  onNavigateToSellingHub
}: ChatAreaProps) => {
  const { markMessagesAsRead } = useNotifications();
  
  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (selectedConv?.id) {
      markMessagesAsRead(selectedConv.id);
    }
  }, [selectedConv?.id, markMessagesAsRead]);
  
  if (!selectedConv) {
    return (
      <Card className="lg:col-span-2 h-full border border-gray-200 shadow-sm">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-gray-600">Select a conversation to start messaging</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isUserBuyer = selectedConv.buyer_id === currentUserId;

  return (
    <div className="h-full flex flex-col">
      <Card className="h-full flex flex-col border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 flex-shrink-0 py-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="lg:hidden hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-lg text-gray-900 font-semibold">
                {selectedConv.ticket_title}
              </CardTitle>
              <p className="text-sm text-gray-600 font-medium">
                £{selectedConv.ticket_price} • {
                  isUserBuyer 
                    ? selectedConv.seller_name
                    : selectedConv.buyer_name
                }
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 p-0 min-h-0">
          {/* Messages - Scrollable area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {selectedConv.messages?.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_id === currentUserId}
                isUserBuyer={isUserBuyer}
                selectedConv={selectedConv}
                onAcceptPurchaseRequest={onAcceptPurchaseRequest}
                onRejectPurchaseRequest={onRejectPurchaseRequest}
                onAcceptCounterOffer={onAcceptCounterOffer}
                onRejectCounterOffer={onRejectCounterOffer}
                onConfirmTransfer={onConfirmTransfer}
                onViewTransactionDetails={onViewTransactionDetails}
                onFundsReceived={onFundsReceived}
                onNavigateToSellingHub={onNavigateToSellingHub}
              />
            ))}
          </div>

          {/* Transaction Instructions - Fixed */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 p-3 mx-4 rounded-lg mb-3 flex-shrink-0">
            <h4 className="font-semibold text-sm text-blue-800 mb-1">Transaction Steps</h4>
            <div className="text-xs text-blue-700">
              {isUserBuyer ? (
                <p>1. Wait for seller acceptance • 2. Transfer payment • 3. Confirm transfer • 4. Receive tickets</p>
              ) : (
                <p>1. Accept/counter offers • 2. Share bank details • 3. Confirm payment • 4. Transfer tickets</p>
              )}
            </div>
          </div>

          {/* Message Input - Fixed at bottom */}
          <div className="flex gap-3 p-4 border-t border-gray-100 flex-shrink-0 bg-white">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
            />
            <Button 
              onClick={onSendMessage}
              disabled={!newMessage.trim() || isSending}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};