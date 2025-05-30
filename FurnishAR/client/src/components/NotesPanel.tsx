import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Lock, Unlock, MapPin } from 'lucide-react';

interface ProjectNote {
  id: string;
  content: string;
  category: string;
  isPrivate: boolean;
  timestamp: Date;
  position?: { x: number; y: number };
}

export function NotesPanel() {
  const { currentProject } = useAppStore();
  const [notes, setNotes] = useState<ProjectNote[]>([
    {
      id: '1',
      content: 'Client prefers platform bed with built-in storage',
      category: 'bed_area',
      isPrivate: false,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      content: 'Add artwork above headboard, keep it minimal',
      category: 'wall_decor',
      isPrivate: false,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '3',
      content: 'Budget constraint: max $5000 for furniture',
      category: 'general',
      isPrivate: true,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    }
  ]);

  const [newNote, setNewNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [isPrivate, setIsPrivate] = useState(false);

  const categories = [
    { id: 'general', name: 'General', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' },
    { id: 'bed_area', name: 'Bed Area', color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' },
    { id: 'wall_decor', name: 'Wall Decor', color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' },
    { id: 'furniture', name: 'Furniture', color: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' },
    { id: 'lighting', name: 'Lighting', color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' }
  ];

  const getCategoryStyle = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || categories[0].color;
  };

  const getCategoryName = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.name || 'General';
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: ProjectNote = {
      id: Date.now().toString(),
      content: newNote.trim(),
      category: selectedCategory,
      isPrivate,
      timestamp: new Date(),
    };

    setNotes([note, ...notes]);
    setNewNote('');
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const toggleNotePrivacy = (noteId: string) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, isPrivate: !note.isPrivate }
        : note
    ));
  };

  return (
    <Card className="glassmorphism border shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="w-5 h-5 text-midnight-600 dark:text-midnight-300" />
          <h3 className="text-lg font-semibold text-midnight-800 dark:text-white">
            Project Notes
          </h3>
          <Badge variant="outline" className="text-xs">
            {notes.length}
          </Badge>
        </div>
        
        {/* Notes List */}
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {notes.map((note) => (
            <div 
              key={note.id}
              className="bg-white dark:bg-midnight-700 p-3 rounded-lg border border-midnight-200 dark:border-midnight-600 group"
            >
              <div className="flex items-start justify-between mb-2">
                <Badge className={`text-xs ${getCategoryStyle(note.category)}`}>
                  {getCategoryName(note.category)}
                </Badge>
                <div className="flex items-center space-x-1">
                  {note.position && (
                    <MapPin className="w-3 h-3 text-midnight-400" />
                  )}
                  <button
                    onClick={() => toggleNotePrivacy(note.id)}
                    className="text-midnight-400 hover:text-midnight-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {note.isPrivate ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Unlock className="w-3 h-3" />
                    )}
                  </button>
                  <span className="text-xs text-midnight-500 dark:text-midnight-400">
                    {getTimeAgo(note.timestamp)}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-midnight-700 dark:text-midnight-300 mb-2">
                {note.content}
              </p>

              {note.isPrivate && (
                <div className="flex items-center space-x-1 text-xs text-midnight-500 dark:text-midnight-400">
                  <Lock className="w-3 h-3" />
                  <span>Private note</span>
                </div>
              )}
            </div>
          ))}

          {notes.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-midnight-300 dark:text-midnight-600 mx-auto mb-3" />
              <p className="text-midnight-600 dark:text-midnight-400 text-sm">
                No notes yet. Add your first note below.
              </p>
            </div>
          )}
        </div>

        {/* Add Note Section */}
        <div className="space-y-3 border-t border-midnight-200 dark:border-midnight-600 pt-4">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note about this project..."
            className="resize-none text-sm"
            rows={3}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs bg-white dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-600 rounded px-2 py-1"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsPrivate(!isPrivate)}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                  isPrivate 
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
                    : 'bg-midnight-100 dark:bg-midnight-700 text-midnight-600 dark:text-midnight-400'
                }`}
              >
                {isPrivate ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                <span>{isPrivate ? 'Private' : 'Shared'}</span>
              </button>
            </div>

            <Button 
              size="sm"
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Note
            </Button>
          </div>
        </div>

        {/* Notes Summary */}
        <div className="mt-4 pt-3 border-t border-midnight-200 dark:border-midnight-600">
          <div className="flex items-center justify-between text-xs text-midnight-500 dark:text-midnight-400">
            <span>
              {notes.filter(n => !n.isPrivate).length} shared, {notes.filter(n => n.isPrivate).length} private
            </span>
            <span>Project: {currentProject?.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
