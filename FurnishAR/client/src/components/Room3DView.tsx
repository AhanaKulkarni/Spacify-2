import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Box, Text } from "@react-three/drei";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ZoomIn, ZoomOut, Home, Maximize } from "lucide-react";
import * as THREE from "three";

// Room component that renders the 3D room based on 2D shape
function Room() {
  const { roomShape, currentProject } = useAppStore();
  const meshRef = useRef<THREE.Mesh>(null);

  // Convert 2D room shape to 3D walls
  const createRoomGeometry = () => {
    if (roomShape.length < 3) return null;

    // Create floor
    const shape = new THREE.Shape();
    shape.moveTo(roomShape[0].x / 20, roomShape[0].y / 20); // Scale down for 3D
    
    roomShape.slice(1).forEach(point => {
      shape.lineTo(point.x / 20, point.y / 20);
    });
    
    const floorGeometry = new THREE.ShapeGeometry(shape);
    
    return floorGeometry;
  };

  const floorGeometry = createRoomGeometry();
  const roomHeight = currentProject?.dimensions?.height || 10;

  return (
    <group>
      {/* Floor */}
      {floorGeometry && (
        <mesh geometry={floorGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <meshLambertMaterial color="#f8f9fa" />
        </mesh>
      )}
      
      {/* Walls */}
      {roomShape.map((point, index) => {
        const nextPoint = roomShape[(index + 1) % roomShape.length];
        const wallLength = Math.sqrt(
          Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.y - point.y, 2)
        ) / 20;
        
        const wallAngle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
        const wallX = (point.x + nextPoint.x) / 40;
        const wallZ = (point.y + nextPoint.y) / 40;
        
        return (
          <Box
            key={index}
            args={[wallLength, roomHeight / 10, 0.2]}
            position={[wallX, roomHeight / 20, wallZ]}
            rotation={[0, wallAngle, 0]}
          >
            <meshLambertMaterial color="#e9ecef" />
          </Box>
        );
      })}
    </group>
  );
}

// Furniture component that renders 3D furniture items
function FurnitureItems() {
  const { currentProject, placedFurniture } = useAppStore();

  if (!currentProject || !Array.isArray(placedFurniture)) {
    return null;
  }

  return (
    <group>
      {placedFurniture.map((item: any, index) => {
        const isSelected = false; // For now, we'll handle selection later
        
        return (
          <group
            key={item.id}
            position={[
              item.position?.x || index * 2,
              item.position?.y || 0.5,
              item.position?.z || index * 2
            ]}
            rotation={[
              item.rotation?.x || 0,
              item.rotation?.y || 0,
              item.rotation?.z || 0
            ]}
            scale={[
              item.scale?.x || 1,
              item.scale?.y || 1,
              item.scale?.z || 1
            ]}
          >
            {/* Placeholder furniture box */}
            <Box args={[1, 0.5, 0.6]}>
              <meshLambertMaterial 
                color={isSelected ? "#3b82f6" : "#22c55e"} 
                transparent
                opacity={0.8}
              />
            </Box>
            
            {/* Furniture label */}
            <Text
              position={[0, 1, 0]}
              fontSize={0.2}
              color="#374151"
              anchorX="center"
              anchorY="middle"
            >
              Item {item.id}
            </Text>
            
            {/* Selection indicator */}
            {isSelected && (
              <Box args={[1.2, 0.7, 0.8]} position={[0, 0, 0]}>
                <meshBasicMaterial 
                  color="#3b82f6" 
                  wireframe 
                  transparent 
                  opacity={0.5} 
                />
              </Box>
            )}
          </group>
        );
      })}
    </group>
  );
}

// Lighting setup
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
    </>
  );
}

// Camera controls component
function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const zoomIn = () => {
    camera.zoom = Math.min(camera.zoom * 1.2, 5);
    camera.updateProjectionMatrix();
  };

  const zoomOut = () => {
    camera.zoom = Math.max(camera.zoom / 1.2, 0.1);
    camera.updateProjectionMatrix();
  };

  useEffect(() => {
    // Set initial camera position
    camera.position.set(10, 8, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-midnight-600 dark:text-midnight-400">Loading 3D scene...</p>
      </div>
    </div>
  );
}

export function Room3DView() {
  const { currentProject, placedFurniture } = useAppStore();
  const vastuMode = false; // We'll add this to the store later
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleResetView = () => {
    // This would be implemented with a ref to OrbitControls
    console.log("Reset camera view");
  };

  const handleScreenshot = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `${currentProject?.name || 'room'}-3d-view.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div className="glassmorphism rounded-xl border shadow-lg overflow-hidden h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-midnight-200 dark:border-midnight-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-midnight-800 dark:text-white">
              3D Room View
            </h3>
            {vastuMode && (
              <Badge className="bg-gradient-to-r from-red-600 to-yellow-600 text-white">
                Vastu Mode
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetView}
              className="p-2"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleScreenshot}
              className="p-2"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="p-2"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative h-[calc(100%-80px)]">
        <Canvas
          ref={canvasRef}
          camera={{ position: [10, 8, 10], fov: 50 }}
          shadows
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <CameraController />
            <Lighting />
            
            {/* Grid helper */}
            <Grid 
              args={[20, 20]} 
              position={[0, 0, 0]}
              cellColor="#e5e7eb"
              sectionColor="#9ca3af"
            />
            
            {/* Room geometry */}
            <Room />
            
            {/* Furniture items */}
            <FurnitureItems />
          </Suspense>
        </Canvas>

        {/* Loading overlay */}
        <Suspense fallback={<LoadingFallback />}>
          <div />
        </Suspense>

        {/* 3D Controls Overlay */}
        <div className="absolute bottom-4 left-4 flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetView}
            className="bg-white dark:bg-midnight-700 shadow-sm border border-midnight-200 dark:border-midnight-600"
          >
            <Home className="w-4 h-4 mr-2" />
            Reset View
          </Button>
        </div>

        {/* View Info */}
        <div className="absolute top-4 left-4 bg-white dark:bg-midnight-700 px-3 py-2 rounded-lg shadow-sm border border-midnight-200 dark:border-midnight-600">
          <p className="text-xs text-midnight-600 dark:text-midnight-300">
            Drag to rotate • Scroll to zoom • Right-click to pan
          </p>
        </div>

        {/* Compass (for Vastu mode) */}
        {vastuMode && (
          <div className="absolute top-4 right-4 bg-gradient-to-br from-red-600 to-yellow-600 p-3 rounded-lg shadow-lg text-white">
            <div className="w-12 h-12 relative">
              <div className="absolute inset-0 border-2 border-yellow-300 rounded-full"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-red-400"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-yellow-300"></div>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold">N</div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t border-midnight-200 dark:border-midnight-600 bg-midnight-50 dark:bg-midnight-800">
        <div className="flex items-center justify-between text-xs text-midnight-600 dark:text-midnight-400">
          <span>
            Room: {currentProject?.dimensions?.length || 20}' × {currentProject?.dimensions?.width || 15}' × {currentProject?.dimensions?.height || 10}'
          </span>
          <span>
            Furniture: {Array.isArray(placedFurniture) ? placedFurniture.length : 0} items
          </span>
        </div>
      </div>
    </div>
  );
}
