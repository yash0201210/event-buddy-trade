
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Calendar, Star, User } from 'lucide-react';

const eventData = {
  id: 1,
  title: 'Taylor Swift - Eras Tour',
  venue: 'Wembley Stadium',
  location: 'London, UK',
  date: '2024-08-15',
  time: '19:30',
  image: '/placeholder.svg',
  category: 'Concert',
  description: 'Join Taylor Swift on her highly anticipated Eras Tour at the iconic Wembley Stadium. Experience all her musical eras in one unforgettable night.',
  rating: 4.8,
  totalReviews: 2847
};

const tickets = [
  {
    id: 1,
    section: 'Lower Tier',
    row: 'M',
    seats: '12-13',
    price: 89,
    seller: 'Sarah M.',
    sellerRating: 4.9,
    sellerReviews: 45,
    quantity: 2,
    isInstant: true
  },
  {
    id: 2,
    section: 'Upper Tier',
    row: 'BB',
    seats: '8-9',
    price: 65,
    seller: 'John D.',
    sellerRating: 4.7,
    sellerReviews: 23,
    quantity: 2,
    isInstant: false
  },
  {
    id: 3,
    section: 'Floor Standing',
    row: 'GA',
    seats: 'General Admission',
    price: 120,
    seller: 'Emma L.',
    sellerRating: 5.0,
    sellerReviews: 67,
    quantity: 1,
    isInstant: true
  }
];

const Event = () => {
  const [isFavourite, setIsFavourite] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img 
                src={eventData.image} 
                alt={eventData.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <div className="md:w-2/3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="mb-2 bg-red-100 text-red-700">
                    {eventData.category}
                  </Badge>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {eventData.title}
                  </h1>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsFavourite(!isFavourite)}
                  className={isFavourite ? 'text-red-600' : 'text-gray-400'}
                >
                  <Heart className={`h-5 w-5 ${isFavourite ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              <div className="space-y-3 text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3" />
                  <span>{eventData.venue}, {eventData.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-3" />
                  <span>{new Date(eventData.date).toLocaleDateString('en-GB', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })} at {eventData.time}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-3 fill-yellow-400 text-yellow-400" />
                  <span>{eventData.rating} rating ({eventData.totalReviews} reviews)</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                {eventData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Available Tickets */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Tickets</h2>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {ticket.section} - Row {ticket.row}
                        </h3>
                        {ticket.isInstant && (
                          <Badge className="bg-green-100 text-green-700">
                            Instant Download
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        Seats: {ticket.seats} • Quantity: {ticket.quantity}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        <span>Sold by {ticket.seller}</span>
                        <Star className="h-3 w-3 ml-2 mr-1 fill-yellow-400 text-yellow-400" />
                        <span>{ticket.sellerRating} ({ticket.sellerReviews} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        £{ticket.price}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        per ticket
                      </div>
                      <Button className="bg-red-600 hover:bg-red-700">
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Event;
