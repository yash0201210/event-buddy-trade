
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { PasswordSettings } from '@/components/settings/PasswordSettings';
import { BankDetailsSettings } from '@/components/settings/BankDetailsSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';

const AdminSettings = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <ProfileSettings />
        </TabsContent>
        
        <TabsContent value="password" className="mt-6">
          <PasswordSettings />
        </TabsContent>
        
        <TabsContent value="banking" className="mt-6">
          <BankDetailsSettings />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
