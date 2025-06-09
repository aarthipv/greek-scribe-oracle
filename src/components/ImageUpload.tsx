
import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClearImage: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, selectedImage, onClearImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {selectedImage ? (
        <div className="relative bg-card border border-border rounded-lg p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-greek-blue" />
              <span className="font-medium text-card-foreground">{selectedImage.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearImage}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="bg-muted rounded-lg p-2">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="max-w-full max-h-64 mx-auto rounded object-contain"
            />
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-300 ease-in-out
            ${isDragging 
              ? 'border-greek-blue bg-accent/50 scale-[1.02]' 
              : 'border-border hover:border-greek-blue hover:bg-accent/30'
            }
            group
          `}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={`
              p-4 rounded-full transition-all duration-300
              ${isDragging 
                ? 'bg-greek-blue text-primary-foreground scale-110' 
                : 'bg-accent text-accent-foreground group-hover:bg-greek-blue group-hover:text-primary-foreground group-hover:scale-110'
              }
            `}>
              <Upload className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                {isDragging ? 'Drop your image here' : 'Upload Greek text image'}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to select • JPG, PNG supported
              </p>
            </div>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
