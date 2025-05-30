import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Package } from 'lucide-react';
import { FURNITURE_CATEGORIES, getFurnitureByCategory } from '@/lib/furniture-data';
import { PlacedFurniture } from '@shared/schema';

export function FurniturePanel() {
  const {
    selectedFurniture,
    setSelectedFurniture,
    addFurniture,
    uploadsUsed,
    uploadLimit,
    incrementUploads,
    setShowSubscriptionModal
  } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState('beds');

  const furnitureItems = getFurnitureByCategory(selectedCategory);

  const handleFurnitureSelect = (furnitureModel: any) => {
    // Create a new placed furniture item
    const newFurniture: PlacedFurniture = {
      id: `furniture_${Date.now()}`,
      modelId: furnitureModel.id,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      color: '#8B7355', // Default warm grey
      texture: 'wood',
    };

    addFurniture(newFurniture);
    setSelectedFurniture(newFurniture);
  };

  const handleUpload = () => {
    if (uploadsUsed >= uploadLimit) {
      setShowSubscriptionModal(true);
      return;
    }
    
    // Simulate file upload
    incrementUploads();
    console.log('File upload simulated');
  };

  const getUploadProgress = () => {
    return (uploadsUsed / uploadLimit) * 100;
  };

  return (
    <Card className="glassmorphism border shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-midnight-800 dark:text-white mb-4">
          Furniture Library
        </h3>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {FURNITURE_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="text-xs"
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* Furniture Items */}
        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
          {furnitureItems.map((item) => (
            <div
              key={item.id}
              className="furniture-item bg-white dark:bg-midnight-700 p-3 rounded-lg border border-midnight-200 dark:border-midnight-600 cursor-pointer transition-all"
              onClick={() => handleFurnitureSelect(item)}
            >
              <div className="flex items-center space-x-3">
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-midnight-800 dark:text-white text-sm">
                    {item.name}
                  </p>
                  <p className="text-midnight-600 dark:text-midnight-400 text-xs capitalize">
                    {item.category.replace('_', ' ')}
                  </p>
                </div>
                {!item.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    Custom
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Upload Section */}
        <div className="pt-4 border-t border-midnight-200 dark:border-midnight-600">
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm text-midnight-600 dark:text-midnight-400 mb-1">
              <span>Uploads Used</span>
              <span>{uploadsUsed}/{uploadLimit}</span>
            </div>
            <div className="w-full bg-midnight-200 dark:bg-midnight-600 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${getUploadProgress()}%` }}
              />
            </div>
          </div>
          
          <Button
            onClick={handleUpload}
            className="w-full border-2 border-dashed border-midnight-300 dark:border-midnight-600 bg-transparent hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-midnight-700 text-midnight-600 dark:text-midnight-400 hover:text-blue-500"
            variant="outline"
          >
            <Upload className="w-5 h-5 mr-2" />
            <div className="text-center">
              <p className="text-sm font-medium">Upload GLTF/GLB</p>
              <p className="text-xs mt-1">{uploadsUsed}/{uploadLimit} uploads used</p>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
