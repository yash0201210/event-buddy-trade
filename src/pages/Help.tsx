
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, MessageCircle, Heart } from 'lucide-react';

const faqData = [
  {
    category: 'Buying Tickets',
    questions: [
      {
        question: 'How do I know if tickets are genuine?',
        answer: 'All tickets on socialdealr are verified by our team. We use advanced authentication technology and work directly with trusted sellers to ensure authenticity.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, PayPal, and Apple Pay. All payments are processed securely through our encrypted payment system.'
      },
      {
        question: 'When will I receive my tickets?',
        answer: 'Instant download tickets are available immediately after purchase. Physical tickets are sent via tracked delivery 3-5 days before the event.'
      }
    ]
  },
  {
    category: 'Selling Tickets',
    questions: [
      {
        question: 'How do I list my tickets?',
        answer: 'Click "Sell Tickets" in the header, search for your event, upload ticket photos, set your price, and publish your listing. It takes less than 5 minutes!'
      },
      {
        question: 'What fees do you charge sellers?',
        answer: 'We charge a 10% commission on successful sales plus a small payment processing fee. There are no upfront costs to list your tickets.'
      },
      {
        question: 'How do I get paid?',
        answer: 'Payments are processed within 24 hours of the event taking place and transferred to your chosen bank account or PayPal.'
      }
    ]
  },
  {
    category: 'Safety & Security',
    questions: [
      {
        question: 'What if my tickets are invalid?',
        answer: 'We offer a 100% guarantee. If your tickets are invalid, we will provide a full refund plus find you replacement tickets at no extra cost.'
      },
      {
        question: 'How do you verify sellers?',
        answer: 'All sellers must verify their identity and provide proof of ticket ownership. We also maintain detailed seller ratings and reviews.'
      }
    ]
  }
];

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-red-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-lg text-red-100 mb-8">
            Find answers to common questions or get in touch with our support team
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white text-gray-900"
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Get instant help from our support team
              </p>
              <Button className="bg-red-600 hover:bg-red-700">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Send us an email for detailed support
              </p>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                Email Support
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Search className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>User Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Learn how to use socialdealr effectively
              </p>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                View Guide
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          {filteredFAQ.length > 0 ? (
            <div className="space-y-8">
              {filteredFAQ.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {category.category}
                  </h3>
                  <Accordion type="single" collapsible className="bg-white rounded-lg">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger className="px-6 py-4 text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Help;
