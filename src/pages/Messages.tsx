
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { BankDetailsDialog } from '@/components/messages/BankDetailsDialog';
import { CounterOfferDialog } from '@/components/messages/CounterOfferDialog';
import { ConversationList } from '@/components/messages/ConversationList';
import { ChatArea } from '@/components/messages/ChatArea';
import { useConversations } from '@/hooks/useConversations';

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showCounterOffer, setShowCounterOffer] = useState(false);
  const [pendingAcceptConversation, setPendingAcceptConversation] = useState<string | null>(null);

  const { conversations, isLoading, sendMessageMutation, markTicketAsSold } = useConversations(user?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h1 className="text-xl font-semibold mb-4">Authentication Required</h1>
              <p className="text-gray-600 mb-4">Please sign in to view your messages</p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!selectedConversation || !newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      conversationId: selectedConversation,
      content: newMessage.trim(),
    });
    setNewMessage('');
  };

  const handleAcceptPurchaseRequest = (conversationId: string) => {
    setPendingAcceptConversation(conversationId);
    setShowBankDetails(true);
  };

  const handleRejectPurchaseRequest = (conversationId: string) => {
    setShowCounterOffer(true);
    setPendingAcceptConversation(conversationId);
  };

  const handleBankDetailsSubmitted = () => {
    if (pendingAcceptConversation) {
      sendMessageMutation.mutate({
        conversationId: pendingAcceptConversation,
        content: "Order Confirmed!\n\nThe order has now been confirmed. Transfer €9.73 to the seller once they share their bank details!\n\nHi, please send me €9.73 on the following bank details:\n\nFull Name: Yash Agrawal\nSort Code: XX - XX - XX\nAccount Number: 12736892\n\nRemember to confirm here once you have sent this money across!",
        messageType: 'order_confirmed',
      });
    }
    setShowBankDetails(false);
    setPendingAcceptConversation(null);
  };

  const handleCounterOfferSubmitted = (amount: number) => {
    if (pendingAcceptConversation) {
      sendMessageMutation.mutate({
        conversationId: pendingAcceptConversation,
        content: `I appreciate your interest, but I'd like to counter with €${amount}. Let me know if this works for you!`,
        messageType: 'counter_offer',
      });
    }
    setShowCounterOffer(false);
    setPendingAcceptConversation(null);
  };

  const handleConfirmTransfer = (conversationId: string) => {
    sendMessageMutation.mutate({
      conversationId,
      content: "Funds Transferred!\n\nNow that you have sent this money across, Once the seller confirms they have received the funds, you will be able to view your ticket. Click below to view your tickets now!",
      messageType: 'transfer_confirmation',
    });
  };

  const handleFundsReceived = async (conversationId: string) => {
    await markTicketAsSold(conversationId);
    
    sendMessageMutation.mutate({
      conversationId,
      content: "Funds Received!\n\nThis transaction is now complete, thank you!\n\nYou can view all your selling activity in your Selling Hub.",
      messageType: 'funds_received',
    });
  };

  const handleViewTransactionDetails = (conversationId: string) => {
    navigate(`/my-tickets?conversation=${conversationId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
            currentUserId={user.id}
          />

          <ChatArea
            selectedConv={selectedConv}
            currentUserId={user.id}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={handleSendMessage}
            isSending={sendMessageMutation.isPending}
            onBack={() => setSelectedConversation(null)}
            onAcceptPurchaseRequest={handleAcceptPurchaseRequest}
            onRejectPurchaseRequest={handleRejectPurchaseRequest}
            onConfirmTransfer={handleConfirmTransfer}
            onViewTransactionDetails={handleViewTransactionDetails}
            onFundsReceived={handleFundsReceived}
            onNavigateToSellingHub={() => navigate('/selling-hub')}
          />
        </div>
      </main>

      <BankDetailsDialog
        isOpen={showBankDetails}
        onClose={() => setShowBankDetails(false)}
        onSubmit={handleBankDetailsSubmitted}
      />

      <CounterOfferDialog
        isOpen={showCounterOffer}
        onClose={() => setShowCounterOffer(false)}
        onSubmit={handleCounterOfferSubmitted}
        originalPrice={selectedConv?.ticket_price || 0}
      />
    </div>
  );
};

export default Messages;
