
import React from 'react';
import { Ticket, University, Calendar, MapPin } from 'lucide-react';

export const SellTicketsHeader = () => {
  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8 mb-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <Ticket className="h-8 w-8" />
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <University className="h-8 w-8" />
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <Calendar className="h-8 w-8" />
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <MapPin className="h-8 w-8" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-2">Sell Your Tickets</h1>
          <p className="text-red-100 text-lg max-w-2xl mx-auto">
            Turn your unused event tickets into cash. Select your event below and list your tickets to reach thousands of potential buyers.
          </p>
          
          <div className="flex justify-center items-center space-x-8 mt-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Secure Transactions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>University Focused</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>No Hidden Fees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
