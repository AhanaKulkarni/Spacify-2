import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";
import { MoodboardImage } from "@shared/schema";

export default function Moodboard() {
  const { selectedProject } = useStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Fetch moodboard images
  const { data: moodboardImages = [], isLoading } = useQuery<MoodboardImage[]>({
    queryKey: [`/api/projects/${selectedProject?.id}/moodboard`],
    enabled: !!selectedProject?.id,
  });

  // Upload image mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`/api/projects/${selectedProject?.id}/moodboard`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload image");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${selectedProject?.id}/moodboard`] });
      toast({ title: "Image added to moodboard!" });
    },
    onError: () => {
      toast({ title: "Failed to upload image", variant: "destructive" });
    },
  });

  // Delete image mutation
  const deleteMutation = useMutation({
    mutationFn: async (imageId: number) => {
      const response = await fetch(`/api/moodboard-images/${imageId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete image");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${selectedProject?.id}/moodboard`] });
      toast({ title: "Image removed from moodboard" });
    },
  });

  const handleFileUpload = (files: FileList | null) => {
    if (!files || !selectedProject) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast({ 
          title: "Invalid file type", 
          description: "Please upload image files only",
          variant: "destructive" 
        });
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append('image', file);
      formData.append('caption', file.name);
      
      uploadMutation.mutate(formData);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  // Sample inspiration images for demo
  const inspirationImages = [
    {
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop",
      caption: "Minimalist living room"
    },
    {
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop",
      caption: "Scandinavian bedroom"
    },
    {
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=150&fit=crop",
      caption: "Modern kitchen"
    },
    {
      url: "https://images.unsplash.com/photo-1549497538-303791108f95?w=200&h=150&fit=crop",
      caption: "Contemporary dining"
    }
  ];

  if (!selectedProject) {
    return (
      <div className="glassmorphism rounded-xl p-6 border shadow-lg">
        <h3 className="text-lg font-semibold text-midnight-800 dark:text-white mb-4">Moodboard</h3>
        <p className="text-midnight-600 dark:text-midnight-400 text-sm">
          Select a project to view its moodboard
        </p>
      </div>
    );
  }

  return (
    <div className="glassmorphism rounded-xl p-6 border shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-midnight-800 dark:text-white">Moodboard</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>
      
      {/* Inspiration Images Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-midnight-200 dark:bg-midnight-600 h-20 rounded-lg"></div>
          ))
        ) : (
          <>
            {/* Uploaded images from API */}
            {moodboardImages.map((image: MoodboardImage) => (
              <div key={image.id} className="relative group">
                <img 
                  src={image.imageUrl} 
                  alt={image.caption || "Moodboard image"}
                  className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity" 
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteMutation.mutate(image.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            
            {/* Sample inspiration images for demo */}
            {inspirationImages.map((image, index) => (
              <div key={`inspiration-${index}`} className="relative group">
                <img 
                  src={image.url} 
                  alt={image.caption}
                  className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity" 
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.caption}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
          dragOver 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
            : "border-midnight-300 dark:border-midnight-600 hover:border-blue-500"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 bg-midnight-100 dark:bg-midnight-700 rounded-full flex items-center justify-center">
            {uploadMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ImageIcon className="w-4 h-4 text-midnight-400" />
            )}
          </div>
          <div>
            <p className="text-sm text-midnight-600 dark:text-midnight-400 font-medium">
              Add inspiration images
            </p>
            <p className="text-xs text-midnight-500 dark:text-midnight-500">
              Drag & drop or click to browse
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadMutation.isPending && (
        <div className="mt-3 text-xs text-midnight-600 dark:text-midnight-400 text-center">
          Uploading image...
        </div>
      )}

      {/* Image Count */}
      <div className="mt-3 text-xs text-midnight-500 dark:text-midnight-400 text-center">
        {moodboardImages.length + inspirationImages.length} images in moodboard
      </div>
    </div>
  );
}

export { Moodboard };
