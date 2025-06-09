import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TranslationOutputProps {
  translatedText: string;
  isVisible: boolean;
}

const TranslationOutput: React.FC<TranslationOutputProps> = ({ translatedText, isVisible }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "The translated text has been copied successfully.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the text manually.",
        variant: "destructive",
      });
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-latin-red" />
          <h3 className="font-semibold text-card-foreground">English Translation</h3>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-latin-red hover:text-primary-foreground transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </Button>
      </div>
      
      <div className="bg-muted rounded-lg p-4 min-h-[120px]">
        <p className="text-black leading-relaxed whitespace-pre-wrap">
          {translatedText || 'Translation will appear here...'}
        </p>
      </div>
    </div>
  );
};

export default TranslationOutput;
