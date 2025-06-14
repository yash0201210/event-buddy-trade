
import React from 'react';
import { GraduationCap, Ticket, Users, Shield, Star, Heart } from 'lucide-react';

export const UniTicketingSolution = () => {
  const features = [
    {
      icon: <GraduationCap className="h-8 w-8 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=120&h=120&fit=crop",
      alt: "University building"
    },
    {
      icon: <Ticket className="h-8 w-8 text-purple-600" />,
      image: "https://images.unsplash.com/photo-1594736797933-d0c92e5e7b1d?w=120&h=120&fit=crop",
      alt: "Event tickets"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&h=120&fit=crop",
      alt: "Students socializing"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&h=120&fit=crop",
      alt: "Secure transactions"
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      image: "https://images.unsplash.com/photo-1551818255-e6e10975cd27?w=120&h=120&fit=crop",
      alt: "Premium experience"
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-600" />,
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=120&h=120&fit=crop",
      alt: "Community events"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            The Go-To Uni Ticketing Solution
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connecting students across universities with the events they love. 
            From campus societies to major festivals - we've got you covered!
          </p>
        </div>
        
        {/* Floating feature bubbles */}
        <div className="flex flex-wrap justify-center items-center gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center space-y-2 transform hover:scale-110 transition-transform duration-300"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Image bubble */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-md border-3 border-white">
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
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center hidden">
                  {feature.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-3 bg-gray-50 px-6 py-3 rounded-full">
            <span className="text-gray-700 font-medium">Join thousands of students already using our platform</span>
            <div className="flex -space-x-1">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
              <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
              <div className="w-6 h-6 bg-pink-500 rounded-full border-2 border-white"></div>
              <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
