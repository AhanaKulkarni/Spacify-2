import { useState } from 'react';
import { Settings, Palette, Move, RotateCw, Scale, Plus, Image, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import { colors, textures } from '@/lib/materials';
import { useToast } from '@/hooks/use-toast';

export function PropertiesPanel() {
  const {
    currentProject,
    selectedFurniture,
    updateFurniture,
  } = useAppStore();

  // Safely get store actions with fallback no-ops
  const addNote = useAppStore((state) => state.addNote) || (() => {});
  const addMoodboardImage = useAppStore((state) => state.addMoodboardImage) || (() => {});
  const removeMoodboardImage = useAppStore((state) => state.removeMoodboardImage) || (() => {});
  const deleteNote = useAppStore((state) => state.deleteNote) || (() => {});
  const { toast } = useToast();
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'public' | 'private'>('public');

  if (!currentProject) return null;

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: string) => {
    if (!selectedFurniture) return;
    
    const numValue = parseFloat(value) || 0;
    updateFurniture(selectedFurniture.id, {
      position: {
        ...selectedFurniture.position,
        [axis]: numValue,
      },
    });
  };

  const handleRotationChange = (value: number[]) => {
    if (!selectedFurniture) return;
    
    updateFurniture(selectedFurniture.id, {
      rotation: {
        ...selectedFurniture.rotation,
        y: (value[0] * Math.PI) / 180, // Convert degrees to radians
      },
    });
  };

  const handleScaleChange = (value: number[]) => {
    if (!selectedFurniture) return;
    
    const scale = value[0];
    updateFurniture(selectedFurniture.id, {
      scale: {
        x: scale,
        y: scale,
        z: scale,
      },
    });
  };

  const handleColorChange = (color: string) => {
    if (!selectedFurniture) return;
    
    updateFurniture(selectedFurniture.id, { color });
    toast({
      title: 'Color Updated',
      description: `Furniture (${selectedFurniture.id}) color changed successfully.`,
    });
  };

  const handleTextureChange = (texture: string) => {
    if (!selectedFurniture) return;
    
    updateFurniture(selectedFurniture.id, { texture });
    toast({
      title: 'Texture Updated',
      description: `Furniture (${selectedFurniture.id}) texture changed successfully.`,
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    addNote(newNote);
    
    setNewNote('');
    toast({
      title: 'Note Added',
      description: 'Your note has been saved to the project.',
    });
  };

  const handleAddMoodboardImage = () => {
    // Simulate image upload
    const imageUrls = [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&h=200',
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=300&h=200',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&h=200',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=300&h=200',
    ];
    
    const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    addMoodboardImage(randomImage);
    
    toast({
      title: 'Image Added',
      description: 'Image has been added to your moodboard.',
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Selected Item Properties */}
      <div>
  <div className="flex items-center space-x-2 mb-4">
    <Settings className="h-5 w-5 text-midnight-600 dark:text-white" />
    <h3 className="text-lg font-semibold text-midnight-800 dark:text-white">Properties</h3>
  </div>
  {selectedFurniture ? (
    // Transform Controls
    <div className="space-y-4">
      {/* Position */}
      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Move className="h-4 w-4 mr-1" />
          Position
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs text-gray-500">X</Label>
            <Input
              type="number"
              value={selectedFurniture ? selectedFurniture.position.x.toFixed(1) : ''}
              onChange={(e) => handlePositionChange('x', e.target.value)}
              className="text-xs h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Y</Label>
            <Input
              type="number"
              value={selectedFurniture ? selectedFurniture.position.y.toFixed(1) : ''}
              onChange={(e) => handlePositionChange('y', e.target.value)}
              className="text-xs h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Z</Label>
            <Input
              type="number"
              value={selectedFurniture ? selectedFurniture.position.z.toFixed(1) : ''}
              onChange={(e) => handlePositionChange('z', e.target.value)}
              className="text-xs h-8"
            />
          </div>
        </div>
      </div>
      
      {/* Rotation */}
      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <RotateCw className="h-4 w-4 mr-1" />
          Rotation
        </Label>
        <div className="space-y-2">
          <Slider
            value={selectedFurniture ? [(selectedFurniture.rotation.y * 180) / Math.PI] : [0]}
            onValueChange={handleRotationChange}
            max={360}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-center">
            {selectedFurniture ? Math.round((selectedFurniture.rotation.y * 180) / Math.PI) : 0}°
          </div>
        </div>
      </div>
      
      {/* Scale */}
      <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Scale className="h-4 w-4 mr-1" />
          Scale
        </Label>
        <div className="space-y-2">
          <Slider
            value={[selectedFurniture ? selectedFurniture.scale.x : 1]}
            onValueChange={handleScaleChange}
            max={2}
            min={0.5}
            step={0.1}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-center">
            {selectedFurniture ? selectedFurniture.scale.x.toFixed(1) : '1.0'}x
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-gray-50 dark:bg-midnight-800 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Select furniture to view properties
      </p>
    </div>
  )}
</div>

{/* Material Customization */}
      {selectedFurniture && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="h-5 w-5 text-midnight-600 dark:text-white" />
            <h3 className="text-lg font-semibold text-midnight-800 dark:text-white">Materials</h3>
          </div>
          
          <div className="bg-white dark:bg-midnight-800 rounded-lg p-4 shadow-sm space-y-4">
            {/* Colors */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Color
              </Label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color.value)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      selectedFurniture.color === color.value
                        ? 'border-blue-500 scale-110'
                        : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            {/* Textures */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Texture
              </Label>
              <Select
                value={selectedFurniture.texture}
                onValueChange={handleTextureChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {textures.map((texture) => (
                    <SelectItem key={texture.id} value={texture.id}>
                      {texture.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Moodboard */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Image className="h-5 w-5 text-midnight-600 dark:text-white" />
          <h3 className="text-lg font-semibold text-midnight-800 dark:text-white">Moodboard</h3>
        </div>
        
        <div className="space-y-3">
            {Array.isArray((currentProject as any).moodboard) && (currentProject as any).moodboard.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {(currentProject as any).moodboard.map((imageUrl: string, index: number) => (
              <div key={index} className="relative group">
                <img
                src={imageUrl}
                alt={`Moodboard ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg"
                />
                <button
                onClick={() => removeMoodboardImage(imageUrl)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                <Trash2 className="h-3 w-3" />
                </button>
              </div>
              ))}
            </div>
            )}
          
          <Button
            onClick={handleAddMoodboardImage}
            variant="outline"
            className="w-full bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
      </div>

      {/* Notes */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="h-5 w-5 text-midnight-600 dark:text-white" />
          <h3 className="text-lg font-semibold text-midnight-800 dark:text-white">Notes</h3>
        </div>
        
        <div className="space-y-3">
          {/* Existing Notes */}
          {Array.isArray((currentProject as any).notes) && (currentProject as any).notes.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {(currentProject as any).notes.map((note: {
                id: string;
                content: string;
                type: 'public' | 'private';
                timestamp: Date;
              }) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg border ${
                    note.type === 'public'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          note.type === 'public'
                            ? 'text-blue-800 dark:text-blue-200'
                            : 'text-yellow-800 dark:text-yellow-200'
                        }`}
                      >
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs ${
                            note.type === 'public'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-yellow-600 dark:text-yellow-400'
                          }`}
                        >
                          {formatTimeAgo(note.timestamp)} • {note.type}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                      className="p-1 h-auto text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Add New Note */}
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Select value={noteType} onValueChange={(value: 'public' | 'private') => setNoteType(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[60px] text-sm"
            />
            
            <Button
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="w-full bg-gray-100 dark:bg-midnight-700 border border-gray-300 dark:border-midnight-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-midnight-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
