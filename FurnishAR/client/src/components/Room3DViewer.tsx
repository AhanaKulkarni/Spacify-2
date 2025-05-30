
import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import * as THREE from 'three'
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Move, RotateCw, Maximize } from 'lucide-react';

// Error Boundary Component
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log('WebGL Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Context loss handler
function useWebGLContextLoss() {
  const { gl } = useThree();
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
      console.warn('WebGL context lost');
    };

    const handleContextRestored = () => {
      setContextLost(false);
      console.log('WebGL context restored');
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);

  return contextLost;
}

// Lighting component with error handling
function Lighting() {
  const contextLost = useWebGLContextLoss();
  
  if (contextLost) return null;

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.3} />
    </>
  );
}

// Room component with better error handling
function Room() {
  const { roomShape } = useAppStore();
  const contextLost = useWebGLContextLoss();

  if (contextLost || !roomShape || roomShape.length < 3) {
    return null;
  }

  try {
    // Create room shape from 2D points
    const shape = new THREE.Shape();
    
    // Scale down the 2D coordinates for 3D scene
    const scaleFactor = 0.02;
    
    shape.moveTo(roomShape[0].x * scaleFactor, roomShape[0].y * scaleFactor);
    for (let i = 1; i < roomShape.length; i++) {
      shape.lineTo(roomShape[i].x * scaleFactor, roomShape[i].y * scaleFactor);
    }
    shape.closePath();

    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: false,
    };

    return (
      <group>
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <shapeGeometry args={[shape]} />
          <meshStandardMaterial 
            color="#f8f8f8" 
            transparent 
            opacity={0.8}
          />
        </mesh>
        
        {/* Walls */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshStandardMaterial 
            color="#e2e8f0" 
            transparent 
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    );
  } catch (error) {
    console.error('Error creating room geometry:', error);
    return null;
  }
}

// Furniture piece component
function FurniturePiece({ 
  position, 
  isSelected, 
  onClick 
}: { 
  position: [number, number, number]; 
  isSelected: boolean; 
  onClick: () => void; 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const contextLost = useWebGLContextLoss();

  useFrame(() => {
    if (meshRef.current && isSelected && !contextLost) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  if (contextLost) return null;

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial 
        color={isSelected ? "#3b82f6" : "#8b5cf6"} 
        transparent 
        opacity={0.8}
      />
    </mesh>
  );
}

// Fallback component for when WebGL fails
function WebGLFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="text-center p-8">
        <div className="text-4xl mb-4">🎨</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          3D View Unavailable
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          WebGL context was lost. This can happen due to GPU issues or browser limitations.
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          size="sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reload Page
        </Button>
      </div>
    </div>
  );
}

// Main 3D Scene component
function Scene3D() {
  const { placedFurniture, selectedFurniture, setSelectedFurniture } = useAppStore();

  return (
    <>
      <Lighting />
      <Room />
      
      {/* Sample furniture pieces */}
      <FurniturePiece
        position={[1, 0.25, 1]}
        isSelected={selectedFurniture?.id === 'furniture1'}
        onClick={() => setSelectedFurniture(
                  selectedFurniture?.id === 'furniture1' ? null : {
                    id: 'furniture1',
                    modelId: 1,
                    position: { x: 1, y: 0.25, z: 1 },
                    rotation: { x: 0, y: 0, z: 0 },
                    scale: { x: 1, y: 1, z: 1 },
                    color: "#ffffff", // or any default color
                    texture: "" // or any default texture string
                  }
                )}
      />
      
      <FurniturePiece
        position={[-1, 0.25, -1]}
        isSelected={selectedFurniture?.id === 'furniture2'}
        onClick={() => setSelectedFurniture(
                  selectedFurniture?.id === 'furniture2' ? null : {
                    id: 'furniture2',
                    modelId: 2,
                    position: { x: -1, y: 0.25, z: -1 },
                    rotation: { x: 0, y: 0, z: 0 },
                    scale: { x: 1, y: 1, z: 1 },
                    color: "#ffffff", // or any default color
                    texture: "" // or any default texture string
                }
              )}
      />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={20}
      />
    </>
  );
}

// Main Room3DViewer component
function Room3DViewer() {
  const { transformMode, setTransformMode } = useAppStore();

  return (
    <Card className="glassmorphism rounded-xl border shadow-lg overflow-hidden h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-midnight-200 dark:border-midnight-600">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-midnight-800 dark:text-white">
            3D Room Viewer
          </h3>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={transformMode === 'move' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTransformMode(transformMode === 'move' ? null : 'move')}
            >
              <Move className="w-4 h-4" />
            </Button>
            <Button
              variant={transformMode === 'rotate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTransformMode(transformMode === 'rotate' ? null : 'rotate')}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              variant={transformMode === 'scale' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTransformMode(transformMode === 'scale' ? null : 'scale')}
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative h-[calc(100%-80px)]">
        <WebGLErrorBoundary fallback={<WebGLFallback />}>
          <Canvas
            camera={{ position: [5, 5, 5], fov: 50 }}
            shadows
            gl={{
              antialias: true,
              alpha: true,
              preserveDrawingBuffer: true,
              failIfMajorPerformanceCaveat: false,
              powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => {
              try {
                gl.setSize(gl.domElement.clientWidth, gl.domElement.clientHeight);
              } catch (error) {
                console.warn('WebGL setup error:', error);
              }
            }}
          >
            <Suspense fallback={null}>
              <Scene3D />
            </Suspense>
          </Canvas>
        </WebGLErrorBoundary>
      </div>
    </Card>
  );
}

export default Room3DViewer;
export { Room3DViewer };
