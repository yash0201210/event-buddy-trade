
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Upload, Camera } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const SellTickets = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    venue: '',
    date: '',
    section: '',
    row: '',
    seats: '',
    quantity: 1,
    originalPrice: '',
    sellingPrice: '',
    category: '',
    description: '',
    isNegotiable: true
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to list tickets",
      });
      navigate('/auth');
    }
  }, [user, authLoading, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // For now, we'll create a dummy event ID since we need one for the tickets table
      const eventId = '123e4567-e89b-12d3-a456-426614174000';
      
      const { error } = await supabase
        .from('tickets')
        .insert({
          seller_id: user.id,
          event_id: eventId,
          title: formData.eventName,
          section: formData.section || null,
          row_number: formData.row || null,
          seat_numbers: formData.seats || null,
          quantity: formData.quantity,
          original_price: parseFloat(formData.originalPrice),
          selling_price: parseFloat(formData.sellingPrice),
          description: formData.description || null,
          is_negotiable: formData.isNegotiable,
          status: 'available'
        });

      if (error) throw error;
      
      toast({
        title: "Ticket listed successfully!",
        description: "Your ticket is now live on the marketplace.",
      });
      
      // Reset form
      setFormData({
        eventName: '',
        venue: '',
        date: '',
        section: '',
        row: '',
        seats: '',
        quantity: 1,
        originalPrice: '',
        sellingPrice: '',
        category: '',
        description: '',
        isNegotiable: true
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to list your ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell Your Tickets</h1>
            <p className="text-gray-600">List your tickets safely and securely on socialdealr</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input
                      id="eventName"
                      value={formData.eventName}
                      onChange={(e) => handleInputChange('eventName', e.target.value)}
                      placeholder="e.g. Taylor Swift - Eras Tour"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => handleInputChange('venue', e.target.value)}
                      placeholder="e.g. Wembley Stadium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Event Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concerts">Concerts</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="theatre">Theatre</SelectItem>
                        <SelectItem value="comedy">Comedy</SelectItem>
                        <SelectItem value="festivals">Festivals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Ticket Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="section">Section</Label>
                      <Input
                        id="section"
                        value={formData.section}
                        onChange={(e) => handleInputChange('section', e.target.value)}
                        placeholder="e.g. Lower Tier"
                      />
                    </div>
                    <div>
                      <Label htmlFor="row">Row</Label>
                      <Input
                        id="row"
                        value={formData.row}
                        onChange={(e) => handleInputChange('row', e.target.value)}
                        placeholder="e.g. M"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seats">Seat Numbers</Label>
                      <Input
                        id="seats"
                        value={formData.seats}
                        onChange={(e) => handleInputChange('seats', e.target.value)}
                        placeholder="e.g. 12-13"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice">Original Price (£)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sellingPrice">Selling Price (£)</Label>
                      <Input
                        id="sellingPrice"
                        type="number"
                        step="0.01"
                        value={formData.sellingPrice}
                        onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Add any additional details about your tickets..."
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="negotiable"
                        checked={formData.isNegotiable}
                        onCheckedChange={(checked) => handleInputChange('isNegotiable', checked)}
                      />
                      <Label htmlFor="negotiable">Open to offers</Label>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Upload Ticket Images</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 mb-2">Upload clear photos of your tickets</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 5MB each</p>
                    <Button type="button" variant="outline" className="mt-2">
                      <Camera className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? 'Listing Ticket...' : 'List Ticket'}
                  </Button>
                  <Button type="button" variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SellTickets;
