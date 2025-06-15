
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Upload, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

interface PdfUploadProps {
  onUploadComplete: (pdfUrl: string, qrCodeHash: string) => void;
  eventName: string;
}

export const PdfUpload = ({ onUploadComplete, eventName }: PdfUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'rejected' | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      setUploadedFile(file);
    }
  };

  const uploadPdf = async () => {
    if (!uploadedFile || !user) return;

    setUploading(true);
    setVerificationStatus('pending');

    try {
      // Upload to Supabase Storage
      const fileExt = 'pdf';
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ticket-pdfs')
        .upload(fileName, uploadedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ticket-pdfs')
        .getPublicUrl(fileName);

      // Call verification edge function
      const { data: verificationData, error: verificationError } = await supabase.functions
        .invoke('verify-ticket-pdf', {
          body: {
            pdfUrl: publicUrl,
            eventName: eventName,
            fileName: fileName
          }
        });

      if (verificationError) throw verificationError;

      if (verificationData.success) {
        setVerificationStatus('verified');
        onUploadComplete(publicUrl, verificationData.qrCodeHash);
        toast({
          title: "Ticket verified successfully!",
          description: "Your ticket has been uploaded and verified.",
        });
      } else {
        setVerificationStatus('rejected');
        toast({
          title: "Ticket verification failed",
          description: verificationData.message || "Unable to verify your ticket. Please check the PDF and try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error uploading PDF:', error);
      setVerificationStatus('rejected');
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (verificationStatus) {
      case 'pending':
        return 'Verifying ticket...';
      case 'verified':
        return 'Ticket verified successfully!';
      case 'rejected':
        return 'Ticket verification failed';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="pdf-upload" className="text-sm font-medium">
          Upload Ticket PDF*
        </Label>
        <p className="text-xs text-gray-500 mb-2">
          Upload your ticket PDF for verification. We'll check for QR codes and event details.
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Label htmlFor="pdf-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  {uploadedFile ? uploadedFile.name : 'Click to upload PDF'}
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  PDF files up to 10MB
                </span>
              </Label>
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="sr-only"
              />
            </div>
          </div>
        </div>
      </div>

      {uploadedFile && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-900">{uploadedFile.name}</span>
            {getStatusIcon()}
          </div>
          {verificationStatus !== 'verified' && (
            <Button
              onClick={uploadPdf}
              disabled={uploading}
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              {uploading ? 'Uploading...' : 'Upload & Verify'}
            </Button>
          )}
        </div>
      )}

      {verificationStatus && (
        <div className={`p-3 rounded-lg flex items-center space-x-2 ${
          verificationStatus === 'verified' ? 'bg-green-50 text-green-800' :
          verificationStatus === 'rejected' ? 'bg-red-50 text-red-800' :
          'bg-yellow-50 text-yellow-800'
        }`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
      )}
    </div>
  );
};
