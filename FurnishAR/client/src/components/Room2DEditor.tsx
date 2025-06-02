import { useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Search, ZoomIn } from 'lucide-react';

export function Room2DEditor() {
  const {
    roomShape,
    setRoomShape,
    isEditingRoom,
    setIsEditingRoom,
    placedFurniture,
    currentProject
  } = useAppStore();

  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);

  const gridSize = 20;

  // Handle node dragging
  const handleMouseDown = (index: number, event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedNode(index);
    setIsDragging(true);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || selectedNode === null || !svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newX = snapToGrid ? Math.round(x / gridSize) * gridSize : x;
    const newY = snapToGrid ? Math.round(y / gridSize) * gridSize : y;

    const newPoints = [...roomShape];
    newPoints[selectedNode] = { x: newX, y: newY };
    setRoomShape(newPoints);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setSelectedNode(null);
  };

  // Add new node
  const addNode = () => {
    if (roomShape.length === 0) {
      setRoomShape([{ x: 100, y: 100 }]);
      return;
    }

    // Find the best position for new node (midpoint of longest edge)
    let longestEdgeIndex = 0;
    let longestDistance = 0;

    for (let i = 0; i < roomShape.length; i++) {
      const current = roomShape[i];
      const next = roomShape[(i + 1) % roomShape.length];
      const distance = Math.sqrt(
        Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2)
      );

      if (distance > longestDistance) {
        longestDistance = distance;
        longestEdgeIndex = i;
      }
    }

    const current = roomShape[longestEdgeIndex];
    const next = roomShape[(longestEdgeIndex + 1) % roomShape.length];
    const midPoint = {
      x: (current.x + next.x) / 2,
      y: (current.y + next.y) / 2,
    };

    const newPoints = [...roomShape];
    newPoints.splice(longestEdgeIndex + 1, 0, midPoint);
    setRoomShape(newPoints);
  };

  // Remove selected node
  const removeNode = () => {
    if (selectedNode !== null && roomShape.length > 3) {
      const newPoints = roomShape.filter((_, index) => index !== selectedNode);
      setRoomShape(newPoints);
      setSelectedNode(null);
    }
  };

  // Generate polygon path string
  const getPolygonPath = () => {
    if (roomShape.length < 3) return '';
    return roomShape.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';
  };

  // Render furniture items in 2D
  const renderFurniture = () => {
    return placedFurniture.map((item) => {
      // Convert 3D position to 2D canvas position
      const x = (item.position.x * 10) + 200; // Scale and offset
      const y = (item.position.z * 10) + 150; // Scale and offset
      const width = 40 * item.scale.x;
      const height = 30 * item.scale.z;

      return (
        <g key={item.id}>
          <rect
            x={x - width/2}
            y={y - height/2}
            width={width}
            height={height}
            fill="rgba(34, 197, 94, 0.3)"
            stroke="#22C55E"
            strokeWidth="1"
            rx="4"
            className="cursor-pointer hover:fill-opacity-50 transition-all"
          />
          <text
            x={x}
            y={y + 5}
            textAnchor="middle"
            fill="#22C55E"
            fontSize="10"
            fontFamily="Inter"
          >
            Furniture
          </text>
        </g>
      );
    });
  };

  return (
    <Card className="glassmorphism border shadow-lg overflow-hidden">
      <div className="p-4 border-b border-midnight-200 dark:border-midnight-600">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-midnight-800 dark:text-white">
            Room Editor
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={isEditingRoom ? 'default' : 'outline'}
              onClick={() => setIsEditingRoom(!isEditingRoom)}
            >
              {isEditingRoom ? 'Edit' : 'View'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* 2D Room Canvas */}
      <div className="h-96 bg-white dark:bg-midnight-800 relative overflow-hidden ar-grid">
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 300"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid pattern */}
          <defs>
            <pattern
              id="grid"
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke="rgba(59, 130, 246, 0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Room outline */}
          {roomShape.length >= 3 && (
            <path
              d={getPolygonPath()}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}

          {/* Draggable corner nodes */}
          {isEditingRoom && roomShape.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="6"
              fill={selectedNode === index ? "#1D4ED8" : "#3B82F6"}
              stroke="#ffffff"
              strokeWidth="2"
              className="room-node"
              onMouseDown={(e) => handleMouseDown(index, e)}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            />
          ))}

          {/* Furniture placement */}
          {renderFurniture()}

          {/* Window and door markers */}
          <rect
            x="340"
            y="100"
            width="10"
            height="40"
            fill="rgba(59, 130, 246, 0.5)"
            stroke="#3B82F6"
            strokeWidth="1"
          />
          <text x="360" y="125" fill="#3B82F6" fontSize="8" fontFamily="Inter">
            Window
          </text>

          <path
            d="M 150 250 Q 180 230 150 210"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
          />
          <text x="140" y="270" fill="#F59E0B" fontSize="8" fontFamily="Inter">
            Door
          </text>
        </svg>

        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-white dark:bg-midnight-700 shadow-sm"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-white dark:bg-midnight-700 shadow-sm"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Dimensions Display */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-midnight-700 px-3 py-2 rounded-lg shadow-sm border border-midnight-200 dark:border-midnight-600">
          <p className="text-sm text-midnight-600 dark:text-midnight-300">
            {typeof currentProject?.dimensions === 'object' && currentProject?.dimensions !== null && 'length' in currentProject.dimensions && 'width' in currentProject.dimensions
              ? `${(currentProject.dimensions as { length: number; width: number }).length}' × ${(currentProject.dimensions as { length: number; width: number }).width}'`
              : '--'}
          </p>
        </div>
      </div>
      
      {/* Canvas Tools */}
      <div className="p-4 border-t border-midnight-200 dark:border-midnight-600 bg-midnight-50 dark:bg-midnight-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              onClick={addNode}
              disabled={!isEditingRoom}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Node
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={removeNode}
              disabled={!isEditingRoom || selectedNode === null || roomShape.length <= 3}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-midnight-600 dark:text-midnight-400">
            <span>Snap to Grid</span>
            <Switch
              checked={snapToGrid}
              onCheckedChange={setSnapToGrid}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
