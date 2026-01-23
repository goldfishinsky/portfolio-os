import React, { useEffect, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useMoodStore } from '../../../lib/moodStore';
import { ConfirmDialog } from './ConfirmDialog';

interface PasteOverlayProps {
  dayIndex: number;
  onClose: () => void;
}

export const PasteOverlay: React.FC<PasteOverlayProps> = ({ dayIndex, onClose }) => {
  const { uploadImage, addImage } = useMoodStore();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [alertState, setAlertState] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: '',
    message: ''
  });

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setAlertState({
        isOpen: true,
        title: 'Invalid File',
        message: 'Please upload a valid image file (PNG, JPG, WEBP).'
      });
      return;
    }

    setIsUploading(true);
    try {
      const { publicUrl, path } = await uploadImage(file);
      await addImage(dayIndex, publicUrl, path);
      onClose();
    } catch (error) {
      console.error(error);
      setAlertState({
        isOpen: true,
        title: 'Upload Failed',
        message: 'Failed to upload image. Please verify your connection or Supabase configuration.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) handleFile(file);
        break;
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Removed local paste listener to avoid conflicts with global app paste
  // useEffect(() => {
  //   document.addEventListener('paste', handlePaste);
  //   return () => document.removeEventListener('paste', handlePaste);
  // }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative flex flex-col items-center gap-4 text-center border-2 transition-colors ${dragActive ? 'border-amber-400 bg-amber-50' : 'border-dashed border-stone-300'}`}
        onClick={e => e.stopPropagation()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100"
        >
          <X size={20} />
        </button>

        {isUploading ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="animate-spin text-amber-500" size={48} />
            <p className="text-stone-500 font-medium">Uploading & Analyzing...</p>
          </div>
        ) : (
          <>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${dragActive ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-400'}`}>
              <Upload size={32} />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-700">Add to Mood Board</h3>
              <p className="text-stone-500">
                Paste an image (Ctrl+V) or drag and drop here
              </p>
            </div>

            <div className="w-full h-px bg-stone-200 my-2" />

             {/* Hidden file input invoked by label could go here if we wanted click-to-upload */}
             <label className="text-sm text-stone-400">
               Accepts PNG, JPG, WEBP
             </label>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={alertState.isOpen}
        onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
        title={alertState.title}
        description={alertState.message}
        variant="alert"
      />
    </div>
  );
};
