import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Plus } from 'lucide-react';

interface MoodboardImage {
  id: string;
  url: string;
  caption?: string;
}

export function MoodboardPanel() {
  const { currentProject } = useAppStore();
  const [images, setImages] = useState<MoodboardImage[]>([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      caption: 'Modern living room inspiration'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      caption: 'Bedroom color palette'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      caption: 'Kitchen design ideas'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      caption: 'Furniture arrangement'
    }
  ]);

  const [selectedImage, setSelectedImage] = useState<MoodboardImage | null>(null);
  const [caption, setCaption] = useState('');

  const handleImageUpload = () => {
    // Simulate image upload
    const newImage: MoodboardImage = {
      id: Date.now().toString(),
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      caption: caption || 'New inspiration'
    };
    
    setImages([...images, newImage]);
    setCaption('');
  };

  const handleImageSelect = (image: MoodboardImage) => {
    setSelectedImage(selectedImage?.id === image.id ? null : image);
  };

  const handleImageDelete = (imageId: string) => {
    setImages(images.filter(img => img.id !== imageId));
    if (selectedImage?.id === imageId) {
      setSelectedImage(null);
    }
  };

  const handleCaptionUpdate = () => {
    if (!selectedImage) return;
    
    setImages(images.map(img => 
      img.id === selectedImage.id 
        ? { ...img, caption }
        : img
    ));
    setSelectedImage({ ...selectedImage, caption });
    setCaption('');
  };

  return (
    <Card className="glassmorphism border shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-midnight-800 dark:text-white mb-4">
          Moodboard
        </h3>
        
        {/* Inspiration Images Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                selectedImage?.id === image.id 
                  ? 'ring-2 ring-blue-500' 
                  : ''
              }`}
              onClick={() => handleImageSelect(image)}
            >
              <img 
                src={image.url} 
                alt={image.caption || 'Moodboard image'}
                className="w-full h-20 object-cover transition-transform group-hover:scale-105"
              />
              
              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageDelete(image.id);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Caption overlay */}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selected Image Details */}
        {selectedImage && (
          <div className="bg-midnight-50 dark:bg-midnight-700 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-midnight-800 dark:text-white mb-2">
              Edit Caption
            </p>
            <div className="flex space-x-2">
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={selectedImage.caption || 'Add caption...'}
                className="flex-1 text-sm"
              />
              <Button 
                size="sm" 
                onClick={handleCaptionUpdate}
                disabled={!caption}
              >
                Update
              </Button>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="space-y-3">
          <div className="border-2 border-dashed border-midnight-300 dark:border-midnight-600 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto text-midnight-400 mb-2" />
            <p className="text-sm text-midnight-600 dark:text-midnight-400 mb-2">
              Add inspiration images
            </p>
            <p className="text-xs text-midnight-500 dark:text-midnight-500">
              JPG, PNG up to 10MB
            </p>
          </div>

          {/* Quick Add with Caption */}
          <div className="flex space-x-2">
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption for new image..."
              className="flex-1 text-sm"
            />
            <Button 
              size="sm" 
              onClick={handleImageUpload}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Moodboard Stats */}
        <div className="mt-4 pt-4 border-t border-midnight-200 dark:border-midnight-600">
          <div className="flex items-center justify-between text-sm text-midnight-600 dark:text-midnight-400">
            <span>{images.length} images</span>
            <span>Project: {currentProject?.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
