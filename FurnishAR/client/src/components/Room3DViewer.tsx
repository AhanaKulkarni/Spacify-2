import React, { Suspense, useRef, useEffect, useState, MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store';
import { saveProjectToLocal, exportProjectAsJSON } from '@/lib/projectUtils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Move, RotateCw, Maximize, Save, Download } from 'lucide-react';

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

// Fallback component for WebGL errors
function WebGLFallback(): JSX.Element {
  return (
    <div className="flex items-center justify-center h-full text-red-600">
      <p>WebGL context lost or not supported. Please reload the page.</p>
    </div>
  );
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
          <meshStandardMaterial color="#f8f8f8" transparent opacity={0.8} />
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

// Furniture model component
const FurnitureModel = React.forwardRef<THREE.Object3D, {
  modelPath: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}>(
  ({ modelPath, position, rotation, scale, isSelected, onClick }, ref) => {
    const group = useRef<THREE.Group>(null!);
    const { scene } = useGLTF(modelPath) as { scene: THREE.Group };

    useFrame(() => {
      if (group.current && isSelected) {
        group.current.rotation.y += 0.01;
      }
    });

    // Forward the ref to the group
    useEffect(() => {
      if (ref && typeof ref !== "function") {
        (ref as React.MutableRefObject<THREE.Object3D | null>).current = group.current;
      }
    }, [ref]);

    return (
      <primitive
        ref={group}
        object={scene}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={onClick}
      />
    );
  }
);
FurnitureModel.displayName = "FurnitureModel";

// Scene3D component (fixed and properly closed)
function Scene3D() {
  const { placedFurniture, selectedFurniture, setSelectedFurniture, transformMode } = useAppStore();
  const transformRef = useRef<THREE.Object3D>(null);
  const selectedObjectRef = useRef<THREE.Object3D>(null);

  // TransformControls integration
  useEffect(() => {
    if (!transformRef.current) return;

    // Access the actual TransformControls instance
    const controls = (transformRef.current as any)?.controls || (transformRef.current as any);

    const callback = (event: any) => {
      if (selectedFurniture && selectedObjectRef.current) {
        // Update furniture position/rotation/scale in store
        const updatedFurniture = { ...selectedFurniture };

        if (transformMode === 'move') {
          updatedFurniture.position = {
            x: selectedObjectRef.current.position.x,
            y: selectedObjectRef.current.position.y,
            z: selectedObjectRef.current.position.z,
          };
        } else if (transformMode === 'rotate') {
          updatedFurniture.rotation = {
            x: selectedObjectRef.current.rotation.x,
            y: selectedObjectRef.current.rotation.y,
            z: selectedObjectRef.current.rotation.z,
          };
        } else if (transformMode === 'scale') {
          updatedFurniture.scale = {
            x: selectedObjectRef.current.scale.x,
            y: selectedObjectRef.current.scale.y,
            z: selectedObjectRef.current.scale.z,
          };
        }

        // Ensure id is always a string and modelId is always a number
        if (updatedFurniture.id) {
          setSelectedFurniture({
            ...updatedFurniture,
            id: String(updatedFurniture.id),
            modelId: updatedFurniture.modelId ?? 0, // fallback to 0 or another valid default
            position: updatedFurniture.position ?? { x: 0, y: 0, z: 0 },
            rotation: updatedFurniture.rotation ?? { x: 0, y: 0, z: 0 },
            scale: updatedFurniture.scale ?? { x: 1, y: 1, z: 1 },
            color: updatedFurniture.color ?? "",
            texture: updatedFurniture.texture ?? "",
          });
        }
      }
    };

    if (controls && typeof controls.addEventListener === 'function') {
      controls.addEventListener('objectChange', callback);
    }

    return () => {
      if (controls && typeof controls.removeEventListener === 'function') {
        controls.removeEventListener('objectChange', callback);
      }
    };
  }, [transformMode, selectedFurniture, setSelectedFurniture]);

  return (
    <>
      <Lighting />
      <Room />

      {placedFurniture.map((item: any) => {
        const isSelected = selectedFurniture?.id === item.id;
        return (
          <React.Fragment key={item.id ?? ''}>
            <FurnitureModel
              modelPath={`/models/${item.modelId ?? 0}.glb`}
              position={[
                item.position?.x ?? 0,
                item.position?.y ?? 0,
                item.position?.z ?? 0,
              ]}
              rotation={[
                item.rotation?.x ?? 0,
                item.rotation?.y ?? 0,
                item.rotation?.z ?? 0,
              ]}
              scale={[
                item.scale?.x ?? 1,
                item.scale?.y ?? 1,
                item.scale?.z ?? 1,
              ]}
              isSelected={isSelected}
              onClick={() =>
                setSelectedFurniture(isSelected ? null : item)
              }
              ref={isSelected ? selectedObjectRef : undefined}
            />
            {isSelected && selectedObjectRef.current && (
              <TransformControls
                ref={transformRef as any}
                object={selectedObjectRef.current}
                mode={
                  transformMode === 'move'
                    ? 'translate'
                    : transformMode === 'rotate'
                    ? 'rotate'
                    : transformMode === 'scale'
                    ? 'scale'
                    : undefined
                }
                showX={true}
                showY={true}
                showZ={true}
                enabled={!!transformMode}
              />
            )}
          </React.Fragment>
        );
      })}

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
  const { transformMode, setTransformMode, currentProject } = useAppStore();

  const handleSave = () => {
    if (currentProject) {
      // Extract roomShape and placedFurniture for saving
      saveProjectToLocal({
        roomShape: currentProject.roomShape,
        placedFurniture: currentProject.furnitureItems ?? [],
      });
    } else {
      alert('No project to save.');
    }
  };

  const handleExport = () => {
    if (currentProject) {
      exportProjectAsJSON({
        roomShape: currentProject.roomShape,
        placedFurniture: currentProject.furnitureItems ?? [],
      });
    } else {
      alert('No project to export.');
    }
  };

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
              onClick={() =>
                setTransformMode(transformMode === 'move' ? null : 'move')
              }
            >
              <Move className="w-4 h-4" />
            </Button>
            <Button
              variant={transformMode === 'rotate' ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                setTransformMode(transformMode === 'rotate' ? null : 'rotate')
              }
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              variant={transformMode === 'scale' ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                setTransformMode(transformMode === 'scale' ? null : 'scale')
              }
            >
              <Maximize className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="text-green-600 hover:text-green-800"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="text-purple-600 hover:text-purple-800"
            >
              <Download className="w-4 h-4" />
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
              powerPreference: 'high-performance',
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
