import React, { useState } from 'react';
import { Languages, Sparkles, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageUpload from './ImageUpload';
import TranslationOutput from './TranslationOutput';
import LoadingSpinner from './LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

const GreekTranslator: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [translatedText, setTranslatedText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [groundTruth, setGroundTruth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setShowTranslation(false);
    setTranslatedText('');
    setOriginalText('');
    setGroundTruth('');
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setShowTranslation(false);
    setTranslatedText('');
    setOriginalText('');
    setGroundTruth('');
  };

  const handleTranslate = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image with Greek text first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('http://localhost:8081/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const data = await response.json();
      setOriginalText(data.originalText);
      setGroundTruth(data.groundTruth);
      setTranslatedText(data.translation);
      setShowTranslation(true);
      
      toast({
        title: "Processing complete!",
        description: "Your Greek text has been successfully processed.",
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-greek-blue rounded-xl">
            <Languages className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Greek to English
          </h1>
          <Sparkles className="w-6 h-6 text-greek-gold animate-pulse-soft" />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload an image containing Greek text and get an instant English translation. 
          Our advanced OCR technology accurately reads and translates classical Greek characters.
        </p>
      </div>

      {/* Upload Section */}
      <div className="space-y-6">
        <ImageUpload
          onImageSelect={handleImageSelect}
          selectedImage={selectedImage}
          onClearImage={handleClearImage}
        />

        {/* Translate Button */}
        {selectedImage && (
          <div className="flex justify-center animate-fade-in">
            <Button
              onClick={handleTranslate}
              disabled={isLoading}
              size="lg"
              className="greek-gradient hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-3 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Languages className="w-5 h-5 mr-2" />
                  Process Image
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <LoadingSpinner message="Processing your Greek text image..." />
      )}

      {/* Translation Output */}
      {showTranslation && (
        <div className="space-y-6">
          {/* Original Text */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-card-foreground mb-4">OCR Result</h3>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-black leading-relaxed whitespace-pre-wrap">
                {originalText}
              </p>
            </div>
          </div>

          {/* Ground Truth */}
          {groundTruth && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-card-foreground mb-4">Ground Truth</h3>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-black leading-relaxed whitespace-pre-wrap">
                  {groundTruth}
                </p>
              </div>
            </div>
          )}

          {/* Translation */}
          <TranslationOutput
            translatedText={translatedText}
            isVisible={true}
          />
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Powered by advanced OCR and translation technology • 
          <span className="text-greek-blue font-medium"> Preserving classical Greek heritage through technology</span>
        </p>
      </div>
    </div>
  );
};

export default GreekTranslator;
