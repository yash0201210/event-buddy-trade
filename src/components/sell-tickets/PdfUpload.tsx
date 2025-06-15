
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Upload, FileText, CheckCircle, XCircle, Clock, Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UploadedPdf {
  id: string;
  file: File;
  pdfUrl?: string;
  qrCodeHash?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  selectedPages: number;
  totalPages?: number;
  errorMessage?: string;
}

interface PdfUploadProps {
  onUploadComplete: (uploads: Array<{ pdfUrl: string; qrCodeHash: string; pages: number }>) => void;
  eventName: string;
  eventDate: string;
  requiredQuantity: number;
}

export const PdfUpload = ({
  onUploadComplete,
  eventName,
  eventDate,
  requiredQuantity
}: PdfUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploads, setUploads] = useState<UploadedPdf[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);

  // VERIFICATION TEMPORARILY DISABLED FOR TESTING
  const VERIFICATION_DISABLED = true;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF files only",
          variant: "destructive"
        });
        continue;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload files smaller than 10MB",
          variant: "destructive"
        });
        continue;
      }

      const newUpload: UploadedPdf = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        verificationStatus: 'pending',
        selectedPages: 1
      };

      setUploads(prev => [...prev, newUpload]);
    }
    
    // Reset the input
    event.target.value = '';
  };

  const uploadAndVerifyPdf = async (uploadId: string) => {
    if (!user) return;

    const upload = uploads.find(u => u.id === uploadId);
    if (!upload) return;

    setUploading(uploadId);

    try {
      // Upload to Supabase Storage
      const fileExt = 'pdf';
      const fileName = `${user.id}/${Date.now()}_${uploadId}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ticket-pdfs')
        .upload(fileName, upload.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ticket-pdfs')
        .getPublicUrl(fileName);

      if (VERIFICATION_DISABLED) {
        // Skip verification for testing - auto-approve with mock data
        const mockQrCodeHash = `mock_${uploadId}_${Date.now()}`;
        
        setUploads(prev => prev.map(u => 
          u.id === uploadId 
            ? { 
                ...u, 
                verificationStatus: 'verified', 
                pdfUrl: publicUrl, 
                qrCodeHash: mockQrCodeHash,
                totalPages: upload.selectedPages
              }
            : u
        ));
        
        toast({
          title: "Ticket uploaded successfully!",
          description: "Verification is disabled for testing - ticket auto-approved."
        });
        
        updateParentComponent();
      } else {
        // Original verification logic (commented out for testing)
        // Call verification edge function
        const { data: verificationData, error: verificationError } = await supabase.functions
          .invoke('verify-ticket-pdf', {
            body: {
              pdfUrl: publicUrl,
              eventName: eventName,
              eventDate: eventDate,
              fileName: fileName,
              selectedPages: upload.selectedPages
            }
          });

        if (verificationError) throw verificationError;

        if (verificationData.success) {
          setUploads(prev => prev.map(u => 
            u.id === uploadId 
              ? { 
                  ...u, 
                  verificationStatus: 'verified', 
                  pdfUrl: publicUrl, 
                  qrCodeHash: verificationData.qrCodeHash,
                  totalPages: verificationData.totalPages
                }
              : u
          ));
          
          toast({
            title: "Ticket verified successfully!",
            description: "Your ticket has been uploaded and verified."
          });
          
          updateParentComponent();
        } else {
          setUploads(prev => prev.map(u => 
            u.id === uploadId 
              ? { 
                  ...u, 
                  verificationStatus: 'rejected',
                  errorMessage: verificationData.message 
                }
              : u
          ));
          
          toast({
            title: "Ticket verification failed",
            description: verificationData.message || "Unable to verify your ticket. Please check the PDF and try again.",
            variant: "destructive"
          });
        }
      }
    } catch (error: any) {
      console.error('Error uploading PDF:', error);
      setUploads(prev => prev.map(u => 
        u.id === uploadId 
          ? { 
              ...u, 
              verificationStatus: 'rejected',
              errorMessage: error.message 
            }
          : u
      ));
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(null);
    }
  };

  const deletePdf = async (uploadId: string) => {
    const upload = uploads.find(u => u.id === uploadId);
    if (upload?.pdfUrl) {
      // Delete from storage if it was uploaded
      const fileName = upload.pdfUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('ticket-pdfs').remove([fileName]);
      }
    }
    
    setUploads(prev => prev.filter(u => u.id !== uploadId));
    updateParentComponent();
  };

  const updateSelectedPages = (uploadId: string, pages: number) => {
    setUploads(prev => prev.map(u => 
      u.id === uploadId ? { ...u, selectedPages: pages } : u
    ));
    updateParentComponent();
  };

  const updateParentComponent = () => {
    const verifiedUploads = uploads
      .filter(u => u.verificationStatus === 'verified' && u.pdfUrl && u.qrCodeHash)
      .map(u => ({
        pdfUrl: u.pdfUrl!,
        qrCodeHash: u.qrCodeHash!,
        pages: u.selectedPages
      }));
    
    onUploadComplete(verifiedUploads);
  };

  const getTotalSelectedPages = () => {
    return uploads
      .filter(u => u.verificationStatus === 'verified')
      .reduce((total, u) => total + u.selectedPages, 0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
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

  const totalSelected = getTotalSelectedPages();
  const isQuantityMatched = totalSelected === requiredQuantity;

  return (
    <div className="space-y-4">
      {VERIFICATION_DISABLED && (
        <div className="p-3 bg-yellow-50 text-yellow-800 rounded text-sm">
          ⚠️ Verification is temporarily disabled for testing purposes
        </div>
      )}
      
      <div>
        <Label htmlFor="pdf-upload" className="text-sm font-medium">
          Upload Ticket PDFs*
        </Label>
        <p className="text-xs text-gray-500 mb-2">
          Upload your ticket PDFs for verification. You need {requiredQuantity} ticket(s) total.
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Label htmlFor="pdf-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Click to upload PDFs
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  PDF files up to 10MB each. You can upload multiple files.
                </span>
              </Label>
              <Input 
                id="pdf-upload" 
                type="file" 
                accept=".pdf" 
                multiple
                onChange={handleFileSelect} 
                className="sr-only" 
              />
            </div>
          </div>
        </div>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Uploaded PDFs</h4>
            <span className={`text-xs px-2 py-1 rounded ${
              isQuantityMatched 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {totalSelected}/{requiredQuantity} tickets selected
            </span>
          </div>
          
          {uploads.map((upload) => (
            <div key={upload.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-900 truncate max-w-xs">
                    {upload.file.name}
                  </span>
                  {getStatusIcon(upload.verificationStatus)}
                </div>
                <Button
                  onClick={() => deletePdf(upload.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {upload.verificationStatus === 'pending' && (
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-600">
                      How many tickets from this PDF do you want to sell?
                    </Label>
                    <Select 
                      value={upload.selectedPages.toString()} 
                      onValueChange={(value) => updateSelectedPages(upload.id, parseInt(value))}
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} ticket{num > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => uploadAndVerifyPdf(upload.id)}
                    disabled={uploading === upload.id}
                    size="sm"
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {uploading === upload.id ? 'Uploading...' : VERIFICATION_DISABLED ? 'Upload' : 'Upload & Verify'}
                  </Button>
                </div>
              )}

              {upload.verificationStatus === 'verified' && (
                <div className="p-2 bg-green-50 text-green-800 rounded text-xs">
                  ✓ {VERIFICATION_DISABLED ? 'Uploaded' : 'Verified'} - {upload.selectedPages} ticket{upload.selectedPages > 1 ? 's' : ''} selected from this PDF
                </div>
              )}

              {upload.verificationStatus === 'rejected' && (
                <div className="p-2 bg-red-50 text-red-800 rounded text-xs">
                  ✗ {VERIFICATION_DISABLED ? 'Upload' : 'Verification'} failed: {upload.errorMessage || 'Unknown error'}
                </div>
              )}
            </div>
          ))}
          
          {!isQuantityMatched && (
            <div className="p-3 bg-yellow-50 text-yellow-800 rounded text-sm">
              You need to select exactly {requiredQuantity} ticket{requiredQuantity > 1 ? 's' : ''} total. 
              Currently selected: {totalSelected}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
