
import { useToast } from '@/hooks/use-toast';
import { PurchasedTicket } from '@/hooks/usePurchasedTickets';

export const useTicketDownload = () => {
  const { toast } = useToast();

  const downloadTicket = async (ticket: PurchasedTicket) => {
    try {
      console.log('Downloading ticket for:', ticket.ticket_id);
      console.log('PDF URL from ticket data:', ticket.ticket.pdf_url);
      
      if (!ticket.ticket.pdf_url) {
        toast({
          title: "No PDF Available",
          description: "The seller hasn't uploaded a PDF for this ticket yet.",
          variant: "destructive"
        });
        return;
      }

      console.log('Attempting to download PDF from URL:', ticket.ticket.pdf_url);

      // Create a download link for the PDF
      const response = await fetch(ticket.ticket.pdf_url);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF file: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${ticket.ticket.title || 'ticket'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Ticket Downloaded",
        description: "Your ticket PDF has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error downloading ticket:', error);
      toast({
        title: "Download Error",
        description: "Failed to download ticket PDF. Please try again or contact the seller.",
        variant: "destructive"
      });
    }
  };

  return { downloadTicket };
};
