import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import { 
  X, 
  Check, 
  Crown, 
  Star, 
  Zap, 
  Shield, 
  Upload, 
  Users, 
  FileText,
  Palette,
  Smartphone
} from "lucide-react";

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    period: "month",
    description: "Perfect for individual designers getting started",
    popular: false,
    features: [
      { icon: Upload, text: "150 model uploads/month", included: true },
      { icon: FileText, text: "Unlimited projects", included: true },
      { icon: Users, text: "Client collaboration", included: true },
      { icon: FileText, text: "Invoice generation", included: true },
      { icon: Palette, text: "Moodboard support", included: true },
      { icon: Star, text: "Basic support", included: true },
      { icon: Smartphone, text: "Mobile AR", included: true },
      { icon: Crown, text: "Vastu mode", included: false },
      { icon: Shield, text: "White-label branding", included: false },
      { icon: Zap, text: "Priority support", included: false }
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "month",
    description: "Advanced features for professional designers",
    popular: true,
    features: [
      { icon: Upload, text: "400 model uploads/month", included: true },
      { icon: FileText, text: "Unlimited projects", included: true },
      { icon: Users, text: "Advanced collaboration", included: true },
      { icon: FileText, text: "Invoice generation", included: true },
      { icon: Palette, text: "Moodboard support", included: true },
      { icon: Crown, text: "Vastu mode", included: true },
      { icon: Smartphone, text: "Mobile & Desktop AR", included: true },
      { icon: Zap, text: "Priority support", included: true },
      { icon: Star, text: "Template library", included: true },
      { icon: Shield, text: "White-label branding", included: false }
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 39,
    period: "month",
    description: "Complete solution for design firms",
    popular: false,
    features: [
      { icon: Upload, text: "Unlimited uploads", included: true },
      { icon: FileText, text: "Unlimited projects", included: true },
      { icon: Users, text: "Team collaboration", included: true },
      { icon: FileText, text: "Advanced invoicing", included: true },
      { icon: Palette, text: "Unlimited moodboards", included: true },
      { icon: Crown, text: "Vastu mode", included: true },
      { icon: Smartphone, text: "Full AR suite", included: true },
      { icon: Shield, text: "White-label branding", included: true },
      { icon: Zap, text: "Dedicated support", included: true },
      { icon: Star, text: "Custom integrations", included: true }
    ]
  }
];

export function SubscriptionModal() {
  const { setShowSubscriptionModal, userStats } = useStore();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = () => {
    setShowSubscriptionModal(false);
  };

  const handleUpgrade = async (planId: string) => {
    setIsProcessing(true);
    setSelectedPlan(planId);

    try {
      // Simulate upgrade process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({ 
        title: "Upgrade successful!", 
        description: `Welcome to FURNISH-AR ${planId.charAt(0).toUpperCase() + planId.slice(1)}!`
      });
      
      setShowSubscriptionModal(false);
    } catch (error) {
      toast({ 
        title: "Upgrade failed", 
        description: "Please try again or contact support.",
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  const handleContactSales = () => {
    toast({ 
      title: "Sales contact", 
      description: "Our sales team will reach out to you within 24 hours." 
    });
  };

  const currentPlan = userStats?.subscription || "basic";

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-midnight-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-midnight-200 dark:border-midnight-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-midnight-800 dark:text-white flex items-center">
                <Crown className="w-6 h-6 mr-2 text-blue-600" />
                Upgrade Your Plan
              </h2>
              <p className="text-midnight-600 dark:text-midnight-400 mt-2">
                {(userStats?.modelsUploaded ?? 0) >= (userStats?.maxUploads ?? 0)
                  ? "You've reached your upload limit. Upgrade to continue designing."
                  : "Unlock advanced features and increase your limits."
                }
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="text-midnight-400 hover:text-midnight-600 dark:text-midnight-500 dark:hover:text-midnight-300"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Current Usage */}
          {userStats && (
            <div className="mt-4 p-4 bg-midnight-50 dark:bg-midnight-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-midnight-800 dark:text-white">
                    Current Plan: <span className="capitalize">{currentPlan}</span>
                  </p>
                  <p className="text-xs text-midnight-600 dark:text-midnight-400">
                    {userStats.modelsUploaded}/{userStats.maxUploads === 999999 ? "∞" : userStats.maxUploads} uploads used this month
                  </p>
                </div>
                <div className="w-32 bg-midnight-200 dark:bg-midnight-600 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ 
                      width: userStats.maxUploads === 999999 
                        ? "100%" 
                        : `${Math.min((userStats.modelsUploaded / userStats.maxUploads) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Pricing Plans */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative transition-all hover:shadow-lg ${
                  plan.popular 
                    ? 'border-2 border-blue-500 shadow-lg' 
                    : 'border border-midnight-200 dark:border-midnight-600'
                } ${currentPlan === plan.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1 font-medium">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Current Plan Badge */}
                {currentPlan === plan.id && (
                  <div className="absolute -top-4 right-4">
                    <Badge className="bg-green-500 text-white px-3 py-1 font-medium">
                      Current
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
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
                    <p className="text-sm text-midnight-600 dark:text-midnight-400 mt-2">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included 
                            ? 'bg-green-100 dark:bg-green-900' 
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          {feature.included ? (
                            <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                          ) : (
                            <X className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          feature.included 
                            ? 'text-midnight-700 dark:text-midnight-300' 
                            : 'text-midnight-400 dark:text-midnight-500 line-through'
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <Button
                    onClick={() => plan.id === "enterprise" ? handleContactSales() : handleUpgrade(plan.id)}
                    disabled={isProcessing || currentPlan === plan.id}
                    className={`w-full py-3 font-medium transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                        : currentPlan === plan.id
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 cursor-default'
                        : plan.id === "enterprise"
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-midnight-200 dark:bg-midnight-600 text-midnight-700 dark:text-midnight-300 hover:bg-midnight-300 dark:hover:bg-midnight-500'
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {isProcessing && selectedPlan === plan.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : currentPlan === plan.id ? (
                      "Current Plan"
                    ) : plan.id === "enterprise" ? (
                      "Contact Sales"
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator className="my-8" />

          {/* FAQ Section */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-midnight-800 dark:text-white mb-4">
              Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-medium text-midnight-800 dark:text-white mb-2">
                  Can I change my plan later?
                </h4>
                <p className="text-sm text-midnight-600 dark:text-midnight-400">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-midnight-800 dark:text-white mb-2">
                  What happens to my projects if I downgrade?
                </h4>
                <p className="text-sm text-midnight-600 dark:text-midnight-400">
                  All your projects remain safe. You'll keep access to everything, but new uploads will follow the new plan limits.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-midnight-800 dark:text-white mb-2">
                  Is there a free trial?
                </h4>
                <p className="text-sm text-midnight-600 dark:text-midnight-400">
                  Yes! All new accounts get a 14-day free trial of Pro features. No credit card required.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-midnight-800 dark:text-white mb-2">
                  Do you offer team discounts?
                </h4>
                <p className="text-sm text-midnight-600 dark:text-midnight-400">
                  Enterprise plans include team collaboration. Contact sales for custom pricing for larger teams.
                </p>
              </div>
            </div>
          </div>

          {/* Support Notice */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Need help choosing a plan? Our team is here to help!{" "}
              <Button variant="link" className="text-blue-700 dark:text-blue-300 p-0 h-auto font-medium">
                Contact support
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
