'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth';
import { useSettingsStore } from '@/store/settings';
import { User, Bell, Palette, Zap, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const { 
    theme, 
    notifications, 
    generation, 
    setTheme, 
    updateNotifications, 
    updateGeneration 
  } = useSettingsStore();

  const handleSaveProfile = () => {
    toast.success('Profile settings saved!');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification settings saved!');
  };

  const handleSaveGeneration = () => {
    toast.success('Generation settings saved!');
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Settings</span>
            </CardTitle>
            <CardDescription>
              Update your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-lg">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline">Change Avatar</Button>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  JPG, GIF or PNG. 1MB max.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={user?.name || ''}
                  onChange={(e) => updateUser({ name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  onChange={(e) => updateUser({ email: e.target.value })}
                />
              </div>
            </div>

            <Button onClick={handleSaveProfile}>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Appearance</span>
            </CardTitle>
            <CardDescription>
              Customize how the interface looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Choose your preferred theme or sync with system
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Control how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive updates about your content and account via email
                  </p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => updateNotifications({ email: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get instant notifications in your browser
                  </p>
                </div>
                <Switch 
                  checked={notifications.push}
                  onCheckedChange={(checked) => updateNotifications({ push: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Communications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive tips, product updates, and special offers
                  </p>
                </div>
                <Switch 
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => updateNotifications({ marketing: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Product Updates</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stay informed about new features and improvements
                  </p>
                </div>
                <Switch 
                  checked={notifications.updates}
                  onCheckedChange={(checked) => updateNotifications({ updates: checked })}
                />
              </div>
            </div>

            <Button onClick={handleSaveNotifications}>
              <Save className="mr-2 h-4 w-4" />
              Save Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Content Generation Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Content Generation</span>
            </CardTitle>
            <CardDescription>
              Set your default preferences for AI content generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Default Tone</Label>
                <Select 
                  value={generation.defaultTone} 
                  onValueChange={(value: any) => updateGeneration({ defaultTone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default Length</Label>
                <Select 
                  value={generation.defaultLength} 
                  onValueChange={(value: any) => updateGeneration({ defaultLength: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Schedule Content</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically schedule generated content for optimal posting times
                </p>
              </div>
              <Switch 
                checked={generation.autoSchedule}
                onCheckedChange={(checked) => updateGeneration({ autoSchedule: checked })}
              />
            </div>

            {generation.autoSchedule && (
              <div className="space-y-2">
                <Label>Preferred Posting Time</Label>
                <Input
                  type="time"
                  value={generation.preferredTime}
                  onChange={(e) => updateGeneration({ preferredTime: e.target.value })}
                  className="w-48"
                />
              </div>
            )}

            <Button onClick={handleSaveGeneration}>
              <Save className="mr-2 h-4 w-4" />
              Save Generation Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
