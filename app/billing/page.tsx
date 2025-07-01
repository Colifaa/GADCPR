'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/store/dashboard';
import { useAuthStore } from '@/store/auth';
import { useNotificationStore } from '@/store/notifications';
import { CreditCard, Zap, Calendar, Check, Star } from 'lucide-react';
import { format } from 'date-fns';

export default function BillingPage() {
  const { transactions } = useDashboardStore();
  const { user } = useAuthStore();
  const { notifyPaymentProcessed, notifySubscriptionExpiring } = useNotificationStore();

  const plans = [
    {
      name: 'Free',
      price: 0,
      credits: 50,
      features: [
        '50 credits per month',
        'Basic content generation',
        'Standard templates',
        'Email support'
      ],
      current: user?.plan === 'free'
    },
    {
      name: 'Pro',
      price: 29.99,
      credits: 500,
      features: [
        '500 credits per month',
        'Advanced AI generation',
        'Premium templates',
        'Priority support',
        'Analytics dashboard',
        'Team collaboration'
      ],
      current: user?.plan === 'pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 99.99,
      credits: 2000,
      features: [
        '2000 credits per month',
        'Custom AI models',
        'White-label solution',
        '24/7 dedicated support',
        'Advanced analytics',
        'API access',
        'Custom integrations'
      ],
      current: user?.plan === 'enterprise'
    }
  ];

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'subscription':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'credit_purchase':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'usage':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleUpgrade = (planName: string, price: number) => {
    // Simular procesamiento de pago
    setTimeout(() => {
      notifyPaymentProcessed(price, planName);
      
      // Simular notificación de vencimiento en el futuro (para demo)
      setTimeout(() => {
        notifySubscriptionExpiring(7);
      }, 5000);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Billing & Subscription
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your subscription and view billing history
            </p>
          </div>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Current Plan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold capitalize">{user?.plan} Plan</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.credits} credits remaining
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${plans.find(p => p.name.toLowerCase() === user?.plan)?.price}/month
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Next billing: {format(new Date(2024, 1, 1), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                  <CardDescription>
                    {plan.credits} credits per month
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.current ? 'secondary' : 'default'}
                    disabled={plan.current}
                    onClick={() => !plan.current && handleUpgrade(plan.name, plan.price)}
                  >
                    {plan.current ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Transaction History</span>
            </CardTitle>
            <CardDescription>
              Your recent billing transactions and credit usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No transactions yet
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        {transaction.type === 'usage' ? (
                          <Zap className="h-5 w-5 text-purple-600" />
                        ) : (
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {format(transaction.date, 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {transaction.credits && (
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {transaction.credits > 0 ? '+' : ''}{transaction.credits} credits
                          </p>
                        </div>
                      )}
                      
                      <div className="text-right">
                        <p className="font-medium">
                          {transaction.amount > 0 ? `$${transaction.amount}` : '-'}
                        </p>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
