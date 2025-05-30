import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Camera, 
  Video, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Share2,
  Download,
  Maximize,
  Eye
} from 'lucide-react';

export function ARViewer() {
  const { 
    showARModal, 
    setShowARModal, 
    currentProject, 
    placedFurniture 
  } = useAppStore();

  const [isARActive, setIsARActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [arQuality, setArQuality] = useState<'high' | 'medium' | 'low'>('high');

  if (!showARModal) return null;

  const handleStartAR = async () => {
    try {
      // Check for WebXR support
      if ('xr' in navigator) {
        const isSupported = await (navigator as any).xr.isSessionSupported('immersive-ar');
        if (isSupported) {
          setIsARActive(true);
          // In a real implementation, you would start the WebXR session here
          console.log('Starting AR session...');
        } else {
          console.log('AR not supported on this device');
        }
      } else {
        console.log('WebXR not available');
      }
    } catch (error) {
      console.error('Error starting AR:', error);
    }
  };

  const handleStopAR = () => {
    setIsARActive(false);
    setIsRecording(false);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    console.log(isRecording ? 'Stopping recording' : 'Starting recording');
  };

  const handleCapture = () => {
    console.log('Capturing AR screenshot');
  };

  const handleShare = () => {
    console.log('Sharing AR view');
  };

  const closeModal = () => {
    setShowARModal(false);
    handleStopAR();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <Card className="bg-white dark:bg-midnight-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-midnight-200 dark:border-midnight-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-midnight-800 dark:text-white">
                AR Viewer
              </h3>
              <p className="text-sm text-midnight-600 dark:text-midnight-400 mt-1">
                {currentProject?.name} - {placedFurniture.length} items
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeModal}
              className="text-midnight-400 hover:text-midnight-600 dark:text-midnight-500 dark:hover:text-midnight-300"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-6">
          {!isARActive ? (
            // AR Setup Screen
            <>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-midnight-700 dark:to-midnight-600 rounded-xl p-8 text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-midnight-800 dark:text-white mb-2">
                  Ready for AR
                </h4>
                <p className="text-midnight-600 dark:text-midnight-400 text-sm mb-4">
                  Point your device at a flat surface to place the room
                </p>
                
                {/* AR Requirements */}
                <div className="space-y-2 text-xs text-midnight-500 dark:text-midnight-400">
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>WebXR Compatible Device</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Camera Permission Required</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Good Lighting Recommended</span>
                  </div>
                </div>
              </div>

              {/* Quality Settings */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-midnight-800 dark:text-white mb-2">
                  AR Quality
                </label>
                <div className="flex space-x-2">
                  {(['high', 'medium', 'low'] as const).map((quality) => (
                    <Button
                      key={quality}
                      size="sm"
                      variant={arQuality === quality ? 'default' : 'outline'}
                      onClick={() => setArQuality(quality)}
                      className="capitalize"
                    >
                      {quality}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Start AR Button */}
              <Button
                onClick={handleStartAR}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 text-lg font-medium hover:from-blue-700 hover:to-blue-800"
              >
                Start AR Experience
              </Button>
            </>
          ) : (
            // AR Active Screen
            <>
              {/* AR Status */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 dark:text-green-300 font-medium">AR Session Active</span>
                  {isRecording && (
                    <Badge className="bg-red-500 text-white ml-2">
                      REC
                    </Badge>
                  )}
                </div>
                <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                  Room is placed in your environment. Move around to explore!
                </p>
              </div>

              {/* AR Furniture List */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-midnight-800 dark:text-white mb-3">
                  Furniture in AR ({placedFurniture.length} items)
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {placedFurniture.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-midnight-50 dark:bg-midnight-700 rounded">
                      <span className="text-sm text-midnight-700 dark:text-midnight-300">
                        Furniture Item
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Visible
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* AR Controls */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  variant="outline"
                  onClick={handleRecord}
                  className={`${isRecording ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {isRecording ? 'Stop Recording' : 'Record'}
                </Button>
                
                <Button variant="outline" onClick={handleCapture}>
                  <Camera className="w-4 h-4 mr-2" />
                  Capture
                </Button>

                <Button variant="outline">
                  <ZoomIn className="w-4 h-4 mr-2" />
                  Zoom In
                </Button>

                <Button variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset View
                </Button>
              </div>

              {/* AR Actions */}
              <div className="space-y-3">
                <Button variant="outline" onClick={handleShare} className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share AR View
                </Button>

                <Button 
                  variant="destructive" 
                  onClick={handleStopAR}
                  className="w-full"
                >
                  Exit AR Mode
                </Button>
              </div>
            </>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-midnight-50 dark:bg-midnight-700 rounded-lg">
            <h5 className="text-sm font-medium text-midnight-800 dark:text-white mb-2">
              AR Tips
            </h5>
            <ul className="text-xs text-midnight-600 dark:text-midnight-400 space-y-1">
              <li>• Move slowly for better tracking</li>
              <li>• Ensure good lighting conditions</li>
              <li>• Tap furniture to customize in AR</li>
              <li>• Use pinch gestures to scale items</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
