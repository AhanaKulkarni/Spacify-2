import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, MapPin, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import { getVastuRulesForRoom, calculateVastuScore, generateVastuTips, DIRECTIONS } from '@/lib/vastu-data';

export function VastuPanel() {
  const { currentProject, placedFurniture } = useAppStore();

  if (!currentProject) return null;

  const vastuRules = getVastuRulesForRoom(currentProject.roomType);
  const vastuScore = calculateVastuScore(currentProject.roomType, placedFurniture);
  const vastuTips = generateVastuTips(currentProject.roomType, placedFurniture);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'bad':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="vastu-mode rounded-xl text-white shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-royal-gold rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-royal-maroon" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Vastu Guidance</h3>
            <p className="text-sm opacity-90">
              Score: <span className={getScoreColor(vastuScore)}>{vastuScore}/100</span>
            </p>
          </div>
        </div>

        {/* Compass */}
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-royal-gold rounded-full"></div>
            
            {/* Cardinal directions */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-red-500"></div>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-royal-gold"></div>
            <div className="absolute top-1/2 left-1 transform -translate-y-1/2 w-6 h-1 bg-royal-gold"></div>
            <div className="absolute top-1/2 right-1 transform -translate-y-1/2 w-6 h-1 bg-royal-gold"></div>
            
            {/* Direction labels */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold">N</div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">S</div>
            <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 text-xs">W</div>
            <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 text-xs">E</div>
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-royal-gold rounded-full"></div>
          </div>
          <p className="text-center text-sm mt-2 opacity-90">Room Orientation</p>
        </div>

        {/* Vastu Rules */}
        <div className="space-y-3 mb-4">
          <h4 className="text-sm font-semibold opacity-90">Room Guidelines</h4>
          {vastuRules.slice(0, 3).map((rule) => (
            <div key={rule.id} className="bg-white/10 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                {getSeverityIcon(rule.severity)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-royal-gold">{rule.title}</p>
                  <p className="text-xs opacity-90 mt-1">{rule.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vastu Tips */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold opacity-90">Recommendations</h4>
          {vastuTips.slice(0, 3).map((tip, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-3">
              <p className="text-xs opacity-90">{tip}</p>
            </div>
          ))}
        </div>

        {/* Energy Flow Indicator */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Energy Flow</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-2 h-4 rounded-sm ${
                    level <= Math.floor(vastuScore / 20)
                      ? 'bg-royal-gold'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
