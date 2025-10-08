import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FileUpload({ 
  onFileSelect, 
  acceptedTypes = '.pdf,.doc,.docx',
  maxSize = 5 * 1024 * 1024, // 5MB default
  currentFile 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  }, []);

  const handleFileChange = (file) => {
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-smooth cursor-pointer ${
          isDragging 
            ? 'border-primary bg-primary/10' 
            : 'border-border hover:border-primary'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">
          {isDragging ? 'Drop file here' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-muted-foreground">
          {acceptedTypes.toUpperCase()} (max. {maxSize / (1024 * 1024)}MB)
        </p>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept={acceptedTypes}
          onChange={handleFileInput}
        />
      </div>

      {(selectedFile || currentFile) && (
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
          <span className="text-sm truncate flex-1">
            {selectedFile?.name || currentFile}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
