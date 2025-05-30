import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  MessageSquare, 
  MapPin, 
  Eye, 
  EyeOff 
} from "lucide-react";
// Define Note type locally if not exported from @shared/schema
type Note = {
  id: number;
  content: string;
  zone?: string;
  isPublic: boolean;
  createdAt: string;
};

const noteZones = [
  { value: "general", label: "General" },
  { value: "bed-area", label: "Bed Area" },
  { value: "wall-decor", label: "Wall Decor" },
  { value: "furniture", label: "Furniture" },
  { value: "lighting", label: "Lighting" },
  { value: "flooring", label: "Flooring" },
  { value: "storage", label: "Storage" },
];

export default function NotesDrawer() {
  const { selectedProject } = useStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteZone, setNewNoteZone] = useState("general");
  const [newNotePublic, setNewNotePublic] = useState(false);
  const [editingNote, setEditingNote] = useState<number | null>(null);

  // Fetch notes
  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: [`/api/projects/${selectedProject?.id}/notes`],
    enabled: !!selectedProject?.id,
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (noteData: { content: string; zone?: string; isPublic: boolean }) => {
      const response = await fetch(`/api/projects/${selectedProject?.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) throw new Error("Failed to add note");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${selectedProject?.id}/notes`] });
      setNewNoteContent("");
      setNewNoteZone("general");
      setNewNotePublic(false);
      toast({ title: "Note added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add note", variant: "destructive" });
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: number) => {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete note");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${selectedProject?.id}/notes`] });
      toast({ title: "Note deleted" });
    },
  });

  const handleAddNote = () => {
    if (!newNoteContent.trim()) {
      toast({ 
        title: "Note content required", 
        variant: "destructive" 
      });
      return;
    }

    addNoteMutation.mutate({
      content: newNoteContent.trim(),
      zone: newNoteZone === "general" ? undefined : newNoteZone,
      isPublic: newNotePublic,
    });
  };

  const getZoneColor = (zone?: string) => {
    const zoneColors: { [key: string]: string } = {
      "bed-area": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "wall-decor": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "furniture": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "lighting": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "flooring": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "storage": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    };
    
    return zoneColors[zone || "general"] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const getZoneLabel = (zone?: string) => {
    const zoneData = noteZones.find(z => z.value === zone);
    return zoneData?.label || "General";
  };

  if (!selectedProject) {
    return (
      <div className="glassmorphism rounded-xl p-6 border shadow-lg">
        <h3 className="text-lg font-semibold text-midnight-800 dark:text-white mb-4">Project Notes</h3>
        <p className="text-midnight-600 dark:text-midnight-400 text-sm">
          Select a project to view its notes
        </p>
      </div>
    );
  }

  return (
    <div className="glassmorphism rounded-xl p-6 border shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-midnight-800 dark:text-white">Project Notes</h3>
        <Badge variant="secondary" className="text-xs">
          {notes.length} notes
        </Badge>
      </div>
      
      {/* Notes List */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-midnight-700 p-3 rounded-lg border border-midnight-200 dark:border-midnight-600">
              <div className="h-4 bg-midnight-200 dark:bg-midnight-600 rounded mb-2"></div>
              <div className="h-3 bg-midnight-200 dark:bg-midnight-600 rounded w-2/3"></div>
            </div>
          ))
        ) : notes.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-midnight-400 mx-auto mb-2" />
            <p className="text-midnight-600 dark:text-midnight-400 text-sm">
              No notes yet. Add your first note below.
            </p>
          </div>
        ) : (
          notes.map((note: Note) => (
            <div key={note.id} className="bg-white dark:bg-midnight-700 p-3 rounded-lg border border-midnight-200 dark:border-midnight-600 group hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getZoneColor(note.zone)}`}>
                    <MapPin className="w-3 h-3 mr-1" />
                    {getZoneLabel(note.zone)}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {note.isPublic ? (
                      <>
                        <Eye className="w-3 h-3 text-green-600" />
                        <span className="sr-only">Public note</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 text-gray-500" />
                        <span className="sr-only">Private note</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 text-midnight-400 hover:text-blue-600"
                    onClick={() => setEditingNote(note.id)}
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 text-midnight-400 hover:text-red-600"
                    onClick={() => deleteNoteMutation.mutate(note.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-midnight-700 dark:text-midnight-300 mb-2">
                {note.content}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-midnight-500 dark:text-midnight-400">
                  {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Note Form */}
      <div className="space-y-3 pt-3 border-t border-midnight-200 dark:border-midnight-600">
        <Textarea 
          placeholder="Add a note..."
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          className="min-h-[80px] bg-white dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
        />
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 flex-1">
            <Select value={newNoteZone} onValueChange={setNewNoteZone}>
              <SelectTrigger className="w-32 h-8 text-xs bg-white dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {noteZones.map((zone) => (
                  <SelectItem key={zone.value} value={zone.value} className="text-xs">
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewNotePublic(!newNotePublic)}
              className={`h-8 text-xs ${newNotePublic ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
            >
              {newNotePublic ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
              {newNotePublic ? 'Public' : 'Private'}
            </Button>
          </div>
          
          <Button 
            onClick={handleAddNote}
            disabled={addNoteMutation.isPending || !newNoteContent.trim()}
            className="h-8 px-3 bg-blue-500 text-white text-xs hover:bg-blue-600"
          >
            {addNoteMutation.isPending ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
            ) : (
              <Plus className="w-3 h-3 mr-1" />
            )}
            Add Note
          </Button>
        </div>
        
        {/* Note Instructions */}
        <p className="text-xs text-midnight-500 dark:text-midnight-400">
          Public notes are visible to clients. Use zones to organize notes by room areas.
        </p>
      </div>
    </div>
  );
}

export { NotesDrawer };
