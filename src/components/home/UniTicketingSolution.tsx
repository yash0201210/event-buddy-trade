
import React from 'react';
import { GraduationCap, Ticket, Users, Shield, Star, Heart } from 'lucide-react';

export const UniTicketingSolution = () => {
  const features = [
    {
      icon: <GraduationCap className="h-12 w-12 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=200&h=200&fit=crop",
      alt: "University building"
    },
    {
      icon: <Ticket className="h-12 w-12 text-purple-600" />,
      image: "https://images.unsplash.com/photo-1594736797933-d0c92e5e7b1d?w=200&h=200&fit=crop",
      alt: "Event tickets"
    },
    {
      icon: <Users className="h-12 w-12 text-green-600" />,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&h=200&fit=crop",
      alt: "Students socializing"
    },
    {
      icon: <Shield className="h-12 w-12 text-red-600" />,
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=200&fit=crop",
      alt: "Secure transactions"
    },
    {
      icon: <Star className="h-12 w-12 text-yellow-600" />,
      image: "https://images.unsplash.com/photo-1551818255-e6e10975cd27?w=200&h=200&fit=crop",
      alt: "Premium experience"
    },
    {
      icon: <Heart className="h-12 w-12 text-pink-600" />,
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=200&h=200&fit=crop",
      alt: "Community events"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            The Go-To Uni Ticketing Solution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting students across universities with the events they love. 
            From campus societies to major festivals - we've got you covered!
          </p>
        </div>
        
        {/* Floating elements with images and icons */}
        <div className="relative">
          {/* Central circle with stats */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-8 shadow-lg border-4 border-blue-200 relative z-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">15,900,000+</div>
                <div className="text-gray-600 font-medium">Happy Students</div>
                <div className="text-2xl font-bold text-purple-600 mt-2">42</div>
                <div className="text-gray-600 font-medium">Universities</div>
              </div>
            </div>
          </div>
          
          {/* Floating feature bubbles */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`flex flex-col items-center space-y-3 transform hover:scale-105 transition-transform duration-300 ${
                  index % 2 === 0 ? 'animate-bounce' : ''
                }`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: '3s'
                }}
              >
                {/* Image bubble */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-white">
                    <img 
                      src={feature.image} 
                      alt={feature.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const iconWrapper = target.parentElement?.nextElementSibling as HTMLElement;
                        if (iconWrapper) iconWrapper.style.display = 'flex';
                      }}
                    />
                  </div>
                  {/* Fallback icon */}
                  <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center hidden">
                    {feature.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            {/* Floating shapes */}
            <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-yellow-400 rounded-full opacity-20 animate-ping"></div>
            <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-pink-400 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-blue-400 rounded-full opacity-25 animate-bounce"></div>
            <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-green-400 rounded-full opacity-20 animate-ping"></div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-lg">
            <span className="text-gray-700 font-medium">Join thousands of students already using our platform</span>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-pink-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
