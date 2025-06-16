'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Users, Heart, Share, Eye } from 'lucide-react';

export default function AnalyticsPage() {
  const analyticsData = {
    overview: {
      totalViews: 15420,
      totalEngagement: 2840,
      totalReach: 8650,
      engagementRate: 18.4
    },
    platformPerformance: [
      { platform: 'Instagram', posts: 12, engagement: 890, reach: 3200 },
      { platform: 'LinkedIn', posts: 8, engagement: 650, reach: 2800 },
      { platform: 'Twitter', posts: 15, engagement: 420, reach: 1900 },
      { platform: 'YouTube', posts: 3, engagement: 880, reach: 750 }
    ],
    contentTypes: [
      { type: 'Posts', count: 25, performance: '+12%' },
      { type: 'Videos', count: 8, performance: '+24%' },
      { type: 'Stories', count: 18, performance: '+8%' },
      { type: 'Podcasts', count: 5, performance: '+45%' }
    ]
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your content performance and engagement metrics
            </p>
          </div>
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalViews.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
              <Heart className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalEngagement.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalReach.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.3% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.engagementRate}%</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>
              Compare engagement across different social media platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.platformPerformance.map((platform) => (
                <div key={platform.platform} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Share className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">{platform.platform}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {platform.posts} posts published
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-lg font-bold">{platform.engagement}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{platform.reach}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Reach</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Type Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Content Type Performance</CardTitle>
            <CardDescription>
              See which types of content perform best for your audience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsData.contentTypes.map((content) => (
                <div key={content.type} className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold mb-2">{content.count}</div>
                  <div className="text-sm font-medium mb-1">{content.type}</div>
                  <div className="text-xs text-green-600">{content.performance}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Content */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>
              Your most successful content pieces this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Summer Marketing Tips for Small Businesses', platform: 'LinkedIn', engagement: 450, views: 2300 },
                { title: '5-Minute Breakfast Ideas', platform: 'Instagram', engagement: 320, views: 1800 },
                { title: 'Tech Trends 2024 Podcast', platform: 'Spotify', engagement: 280, views: 950 },
                { title: 'Quick Productivity Hacks', platform: 'Twitter', engagement: 180, views: 750 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.platform}</p>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{item.views}</div>
                      <div className="text-gray-600 dark:text-gray-400">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{item.engagement}</div>
                      <div className="text-gray-600 dark:text-gray-400">Engagement</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
