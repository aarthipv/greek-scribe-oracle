
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
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setShowTranslation(false);
    setTranslatedText('');
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setShowTranslation(false);
    setTranslatedText('');
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
    
    // Simulate API call - replace with actual backend integration
    try {
      // Mock delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock translation result
      const mockTranslation = `This is a sample English translation of the Greek text from your image. 

The translation process involved:
1. Optical Character Recognition (OCR) to extract Greek text
2. Advanced language processing to understand context
3. Accurate translation to English while preserving meaning

Your actual backend integration would replace this mock text with the real translated content from your Greek OCR and translation model.`;

      setTranslatedText(mockTranslation);
      setShowTranslation(true);
      
      toast({
        title: "Translation complete!",
        description: "Your Greek text has been successfully translated to English.",
      });
    } catch (error) {
      toast({
        title: "Translation failed",
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
          Our advanced OCR technology accurately reads and translates Greek characters.
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
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="w-5 h-5 mr-2" />
                  Translate to English
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
      <TranslationOutput
        translatedText={translatedText}
        isVisible={showTranslation}
      />

      {/* Footer */}
      <div className="text-center pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Powered by advanced OCR and translation technology • 
          <span className="text-greek-blue font-medium"> Supporting Greek heritage through technology</span>
        </p>
      </div>
    </div>
  );
};

export default GreekTranslator;
