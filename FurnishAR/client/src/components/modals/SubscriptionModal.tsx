import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Check, Star, Zap, Crown } from 'lucide-react';

export function SubscriptionModal() {
  const { 
    showSubscriptionModal, 
    setShowSubscriptionModal, 
    currentUser,
    uploadsUsed,
    uploadLimit 
  } = useAppStore();

  if (!showSubscriptionModal) return null;

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9,
      period: 'month',
      icon: <Zap className="w-6 h-6" />,
      color: 'border-gray-200 dark:border-gray-600',
      buttonColor: 'bg-gray-500 hover:bg-gray-600',
      features: [
        '150 model uploads/month',
        'Unlimited projects',
        'Client collaboration',
        'Invoice generation',
        'Moodboard creation',
        'Email support'
      ],
      current: currentUser?.subscription === 'basic'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      period: 'month',
      icon: <Star className="w-6 h-6" />,
      color: 'border-blue-500',
      buttonColor: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
      popular: true,
      features: [
        '400 model uploads/month',
        'Unlimited projects',
        'Advanced collaboration',
        'Priority support',
        'Vastu compliance',
        'AR visualization',
        'Custom templates',
        'Team workspace'
      ],
      current: currentUser?.subscription === 'pro'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 39,
      period: 'month',
      icon: <Crown className="w-6 h-6" />,
      color: 'border-purple-500',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      features: [
        'Unlimited uploads',
        'Unlimited projects',
        'White-label branding',
        'Dedicated support',
        'API access',
        'Custom integrations',
        'Advanced analytics',
        'Multi-team management',
        'SLA guarantee'
      ],
      current: currentUser?.subscription === 'enterprise'
    }
  ];

  const handleUpgrade = (planId: string) => {
    console.log(`Upgrading to ${planId} plan`);
    // Simulate upgrade process
    setShowSubscriptionModal(false);
  };

  const handleClose = () => {
    setShowSubscriptionModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <Card className="bg-white dark:bg-midnight-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-midnight-200 dark:border-midnight-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-midnight-800 dark:text-white">
                Upgrade Your Plan
              </h2>
              <p className="text-midnight-600 dark:text-midnight-400 mt-2">
                You've used {uploadsUsed}/{uploadLimit} uploads. Upgrade to continue designing.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-6 h-6 text-midnight-400" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-6">
          {/* Current Usage Alert */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-700 dark:text-yellow-300 font-medium">
                Upload Limit Reached
              </span>
            </div>
            <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-1">
              You've reached your monthly upload limit of {uploadLimit} models. 
              Upgrade your plan to continue uploading custom furniture models.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.color} ${plan.popular ? 'border-2' : 'border'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1 font-medium">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        plan.id === 'basic' ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' :
                        plan.id === 'pro' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' :
                        'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                      }`}>
                        {plan.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-midnight-800 dark:text-white">
                      {plan.name}
                    </h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-midnight-800 dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-midnight-600 dark:text-midnight-400">
                        /{plan.period}
                      </span>
                    </div>
                    {plan.current && (
                      <Badge variant="outline" className="mt-2">
                        Current Plan
                      </Badge>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-midnight-700 dark:text-midnight-300 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={plan.current}
                    className={`w-full py-3 font-medium ${
                      plan.current 
                        ? 'bg-midnight-200 dark:bg-midnight-600 text-midnight-500 dark:text-midnight-400 cursor-not-allowed'
                        : `${plan.buttonColor} text-white`
                    }`}
                  >
                    {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-midnight-800 dark:text-white mb-6 text-center">
              What's included in each plan?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-4">
                <h4 className="font-medium text-midnight-800 dark:text-white">Core Features</h4>
                <ul className="space-y-2 text-midnight-600 dark:text-midnight-400">
                  <li>• 2D/3D room design</li>
                  <li>• Furniture placement</li>
                  <li>• Client collaboration</li>
                  <li>• Project management</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-midnight-800 dark:text-white">Advanced Tools</h4>
                <ul className="space-y-2 text-midnight-600 dark:text-midnight-400">
                  <li>• AR visualization</li>
                  <li>• Vastu compliance</li>
                  <li>• Custom uploads</li>
                  <li>• Template creation</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-midnight-800 dark:text-white">Business Features</h4>
                <ul className="space-y-2 text-midnight-600 dark:text-midnight-400">
                  <li>• Invoice generation</li>
                  <li>• Team management</li>
                  <li>• White-label branding</li>
                  <li>• API integration</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-700 dark:text-green-300 font-medium">
                30-Day Money Back Guarantee
              </span>
            </div>
            <p className="text-green-600 dark:text-green-400 text-sm">
              Try FURNISH-AR risk-free. If you're not satisfied, get a full refund within 30 days.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
