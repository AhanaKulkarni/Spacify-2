import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FURNITURE_COLORS, FURNITURE_TEXTURES } from '@/lib/three-utils';
import { getFurnitureById } from '@/lib/furniture-data';
import { Move, RotateCcw, Scale } from 'lucide-react';

export function CustomizationPanel() {
  const {
    selectedFurniture,
    updateFurniture,
    transformMode,
    setTransformMode,
    removeFurniture
  } = useAppStore();

  if (!selectedFurniture) {
    return (
      <Card className="glassmorphism border shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-midnight-800 dark:text-white mb-4">
            Customize Selection
          </h3>
          <div className="text-center py-8">
            <p className="text-midnight-600 dark:text-midnight-400 text-sm">
              Select a furniture item to customize
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const furnitureModel = getFurnitureById(selectedFurniture.modelId);

  const handleColorChange = (color: string) => {
    updateFurniture(selectedFurniture.id, { color });
  };

  const handleTextureChange = (texture: string) => {
    updateFurniture(selectedFurniture.id, { texture });
  };

  const handleTransformModeChange = (mode: 'move' | 'rotate' | 'scale') => {
    setTransformMode(transformMode === mode ? null : mode);
  };

  const handleDelete = () => {
    removeFurniture(selectedFurniture.id);
  };

  return (
    <Card className="glassmorphism border shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-midnight-800 dark:text-white mb-4">
          Customize Selection
        </h3>
        
        {/* Selected Item Info */}
        <div className="bg-white dark:bg-midnight-700 p-3 rounded-lg border border-midnight-200 dark:border-midnight-600 mb-4">
          <div className="flex items-center space-x-3">
            {furnitureModel && (
              <img 
                src={furnitureModel.thumbnailUrl} 
                alt={furnitureModel.name}
                className="w-10 h-10 object-cover rounded"
              />
            )}
            <div>
              <p className="font-medium text-midnight-800 dark:text-white text-sm">
                {furnitureModel?.name || 'Selected Item'}
              </p>
              <Badge variant="outline" className="text-xs mt-1">
                Selected
              </Badge>
            </div>
          </div>
        </div>

        {/* Color Options */}
        <div className="mb-4">
          <p className="text-sm font-medium text-midnight-800 dark:text-white mb-2">
            Colors
          </p>
          <div className="flex flex-wrap gap-2">
            {FURNITURE_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedFurniture.color === color.value 
                    ? 'border-blue-500 scale-110' 
                    : 'border-midnight-200 dark:border-midnight-600 hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Texture Options */}
        <div className="mb-4">
          <p className="text-sm font-medium text-midnight-800 dark:text-white mb-2">
            Textures
          </p>
          <div className="grid grid-cols-2 gap-2">
            {FURNITURE_TEXTURES.map((texture) => (
              <Button
                key={texture.value}
                size="sm"
                variant={selectedFurniture.texture === texture.value ? 'default' : 'outline'}
                onClick={() => handleTextureChange(texture.value)}
                className="text-xs"
              >
                {texture.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Transform Controls */}
        <div className="mb-4">
          <p className="text-sm font-medium text-midnight-800 dark:text-white mb-2">
            Transform
          </p>
          <div className="space-y-2">
            <Button
              size="sm"
              variant={transformMode === 'move' ? 'default' : 'outline'}
              onClick={() => handleTransformModeChange('move')}
              className="w-full justify-start"
            >
              <Move className="w-4 h-4 mr-2" />
              Move
            </Button>
            <Button
              size="sm"
              variant={transformMode === 'rotate' ? 'default' : 'outline'}
              onClick={() => handleTransformModeChange('rotate')}
              className="w-full justify-start"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Rotate
            </Button>
            <Button
              size="sm"
              variant={transformMode === 'scale' ? 'default' : 'outline'}
              onClick={() => handleTransformModeChange('scale')}
              className="w-full justify-start"
            >
              <Scale className="w-4 h-4 mr-2" />
              Scale
            </Button>
          </div>
        </div>

        {/* Position Info */}
        <div className="mb-4 p-3 bg-midnight-50 dark:bg-midnight-700 rounded-lg">
          <p className="text-xs font-medium text-midnight-700 dark:text-midnight-300 mb-1">
            Position
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs text-midnight-600 dark:text-midnight-400">
            <div>X: {selectedFurniture.position.x.toFixed(1)}</div>
            <div>Y: {selectedFurniture.position.y.toFixed(1)}</div>
            <div>Z: {selectedFurniture.position.z.toFixed(1)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            Remove Furniture
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
