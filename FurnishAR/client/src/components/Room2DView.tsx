import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Grid } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface DragState {
  isDragging: boolean;
  nodeIndex: number;
  offset: Point;
}

export default function Room2DView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { 
    roomShape, 
    setRoomShape, 
    isEditingRoom, 
    setIsEditingRoom,
    currentProject,
    selectedFurniture
  } = useAppStore();

  const [snapToGrid, setSnapToGrid] = useState(true);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    nodeIndex: -1,
    offset: { x: 0, y: 0 }
  });
  const [hoveredNode, setHoveredNode] = useState(-1);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const GRID_SIZE = 20;
  const NODE_RADIUS = 8;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 300;

  const snapPoint = useCallback((point: Point): Point => {
    if (!snapToGrid) return point;
    return {
      x: Math.round(point.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(point.y / GRID_SIZE) * GRID_SIZE
    };
  }, [snapToGrid]);

  const getCanvasPoint = useCallback((clientX: number, clientY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }, []);

  const isPointInNode = useCallback((point: Point, nodePoint: Point): boolean => {
    const distance = Math.sqrt(
      Math.pow(point.x - nodePoint.x, 2) + Math.pow(point.y - nodePoint.y, 2)
    );
    return distance <= NODE_RADIUS;
  }, []);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
  }, []);

  const drawRoom = useCallback((ctx: CanvasRenderingContext2D) => {
    if (roomShape.length < 3) return;

    // Fill room area
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.beginPath();
    ctx.moveTo(roomShape[0].x, roomShape[0].y);
    roomShape.slice(1).forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fill();

    // Draw room outline
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [roomShape]);

  const drawNodes = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!isEditingRoom) return;

    roomShape.forEach((point, index) => {
      const isHovered = hoveredNode === index;
      const isDraggingThis = dragState.isDragging && dragState.nodeIndex === index;

      // Node circle
      ctx.fillStyle = isDraggingThis ? '#1D4ED8' : isHovered ? '#2563EB' : '#3B82F6';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(point.x, point.y, NODE_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Node number
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((index + 1).toString(), point.x, point.y);
    });
  }, [roomShape, isEditingRoom, hoveredNode, dragState]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    if (snapToGrid) {
      drawGrid(ctx);
    }

    // Draw room
    drawRoom(ctx);

    // Draw nodes
    drawNodes(ctx);
  }, [drawGrid, drawRoom, drawNodes, snapToGrid]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEditingRoom) return;

    const point = getCanvasPoint(e.clientX, e.clientY);

    // Check if clicking on a node
    for (let i = 0; i < roomShape.length; i++) {
      if (isPointInNode(point, roomShape[i])) {
        setDragState({
          isDragging: true,
          nodeIndex: i,
          offset: {
            x: point.x - roomShape[i].x,
            y: point.y - roomShape[i].y
          }
        });
        return;
      }
    }
  }, [isEditingRoom, getCanvasPoint, roomShape, isPointInNode]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e.clientX, e.clientY);

    if (dragState.isDragging) {
      // Update dragged node position
      const newX = point.x - dragState.offset.x;
      const newY = point.y - dragState.offset.y;
      const snappedPoint = snapPoint({ x: newX, y: newY });

      // Ensure point stays within canvas bounds
      const clampedPoint = {
        x: Math.max(NODE_RADIUS, Math.min(CANVAS_WIDTH - NODE_RADIUS, snappedPoint.x)),
        y: Math.max(NODE_RADIUS, Math.min(CANVAS_HEIGHT - NODE_RADIUS, snappedPoint.y))
      };

      const newRoomShape = [...roomShape];
      newRoomShape[dragState.nodeIndex] = clampedPoint;
      setRoomShape(newRoomShape);
    } else if (isEditingRoom) {
      // Check for hover state
      let hoveredIndex = -1;
      for (let i = 0; i < roomShape.length; i++) {
        if (isPointInNode(point, roomShape[i])) {
          hoveredIndex = i;
          break;
        }
      }
      setHoveredNode(hoveredIndex);
    }
  }, [dragState, getCanvasPoint, snapPoint, roomShape, setRoomShape, isEditingRoom, isPointInNode]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      nodeIndex: -1,
      offset: { x: 0, y: 0 }
    });
  }, []);

  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEditingRoom) return;

    const point = getCanvasPoint(e.clientX, e.clientY);
    const snappedPoint = snapPoint(point);

    // Add new node at click position
    const newRoomShape = [...roomShape, snappedPoint];
    setRoomShape(newRoomShape);
  }, [isEditingRoom, getCanvasPoint, snapPoint, roomShape, setRoomShape]);

  const addNode = useCallback(() => {
    if (!isEditingRoom) return;

    // Add node at center of canvas
    const centerPoint = snapPoint({ 
      x: CANVAS_WIDTH / 2, 
      y: CANVAS_HEIGHT / 2 
    });

    const newRoomShape = [...roomShape, centerPoint];
    setRoomShape(newRoomShape);
  }, [isEditingRoom, snapPoint, roomShape, setRoomShape]);

  const removeLastNode = useCallback(() => {
    if (!isEditingRoom || roomShape.length <= 3) return;

    const newRoomShape = roomShape.slice(0, -1);
    setRoomShape(newRoomShape);
  }, [isEditingRoom, roomShape, setRoomShape]);

  // Set up canvas event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging) {
        const point = getCanvasPoint(e.clientX, e.clientY);
        const newX = point.x - dragState.offset.x;
        const newY = point.y - dragState.offset.y;
        const snappedPoint = snapPoint({ x: newX, y: newY });

        const clampedPoint = {
          x: Math.max(NODE_RADIUS, Math.min(CANVAS_WIDTH - NODE_RADIUS, snappedPoint.x)),
          y: Math.max(NODE_RADIUS, Math.min(CANVAS_HEIGHT - NODE_RADIUS, snappedPoint.y))
        };

        const newRoomShape = [...roomShape];
        newRoomShape[dragState.nodeIndex] = clampedPoint;
        setRoomShape(newRoomShape);
      }
    };

    const handleGlobalMouseUp = () => {
      setDragState({
        isDragging: false,
        nodeIndex: -1,
        offset: { x: 0, y: 0 }
      });
    };

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [dragState, getCanvasPoint, snapPoint, roomShape, setRoomShape]);

  // Render canvas
  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className="glassmorphism rounded-xl border shadow-lg overflow-hidden h-[500px]" ref={containerRef}>
      {/* Header */}
      <div className="p-4 border-b border-midnight-200 dark:border-midnight-600">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-midnight-800 dark:text-white">
            2D Room Editor
          </h3>
          <Button
            onClick={() => setIsEditingRoom(!isEditingRoom)}
            variant={isEditingRoom ? "default" : "outline"}
            size="sm"
          >
            {isEditingRoom ? "Finish Editing" : "Edit Room"}
          </Button>
        </div>

        {isEditingRoom && (
          <div className="mt-3 text-xs text-midnight-500 dark:text-midnight-400">
            Double-click to add nodes • Drag nodes to reshape • {roomShape.length} nodes
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="relative h-[calc(100%-160px)]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          style={{ cursor: dragState.isDragging ? 'grabbing' : 'crosshair' }}
        />

        {/* Mode Indicator */}
        {isEditingRoom && (
          <div className="absolute top-4 left-4">
            <Badge variant="default" className="bg-blue-500">
              Edit Mode
            </Badge>
          </div>
        )}
      </div>

      {/* Canvas Tools */}
      <div className="p-4 border-t border-midnight-200 dark:border-midnight-600 bg-midnight-50 dark:bg-midnight-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={addNode}
              disabled={!isEditingRoom}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Node</span>
            </Button>
            <Button
              onClick={removeLastNode}
              disabled={!isEditingRoom || roomShape.length <= 3}
              variant="outline"
              className="flex items-center space-x-2 px-3 py-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-midnight-600 dark:text-midnight-400">
            <Grid className="w-4 h-4" />
            <span>Snap to Grid</span>
            <Switch 
              checked={snapToGrid} 
              onCheckedChange={setSnapToGrid}
              className="ml-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Room2DView };