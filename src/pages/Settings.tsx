
import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Shield, Bell, Zap, Globe, Palette, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const settingsNavigation = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'users', name: 'User Management', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'integrations', name: 'Integrations', icon: Zap },
    { id: 'localization', name: 'Localization', icon: Globe },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'api', name: 'API Keys', icon: Key },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Settings Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              {settingsNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" placeholder="Enter company name" />
                    </div>
                    <div>
                      <Label htmlFor="company-email">Company Email</Label>
                      <Input id="company-email" type="email" placeholder="Enter company email" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="company-address">Company Address</Label>
                    <Input id="company-address" placeholder="Enter company address" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter phone number" />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC-8 (Pacific Time)</option>
                        <option>UTC+0 (GMT)</option>
                      </select>
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">User Roles</h3>
                      <Button size="sm">Add Role</Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Administrator</span>
                        <span className="text-sm text-gray-600">Full access</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>HR Manager</span>
                        <span className="text-sm text-gray-600">HR operations</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Employee</span>
                        <span className="text-sm text-gray-600">Basic access</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Password Policy</h3>
                        <p className="text-sm text-gray-600">Enforce strong passwords</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Session Timeout</h3>
                        <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                      </div>
                      <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                        <option>4 hours</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Push Notifications</h3>
                        <p className="text-sm text-gray-600">Browser notifications</p>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Text message alerts</p>
                      </div>
                      <input type="checkbox" className="toggle" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Slack</h3>
                        <p className="text-sm text-gray-600">Team communication</p>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Google Calendar</h3>
                        <p className="text-sm text-gray-600">Schedule integration</p>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Microsoft Teams</h3>
                        <p className="text-sm text-gray-600">Video conferencing</p>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="localization" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Localization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>JPY (¥)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date-format">Date Format</Label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="time-format">Time Format</Label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>12-hour</option>
                        <option>24-hour</option>
                      </select>
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Light</option>
                        <option>Dark</option>
                        <option>Auto</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="color-scheme">Color Scheme</Label>
                      <div className="flex space-x-2 mt-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full cursor-pointer border-2 border-blue-500"></div>
                        <div className="w-8 h-8 bg-green-500 rounded-full cursor-pointer border-2 border-transparent hover:border-green-500"></div>
                        <div className="w-8 h-8 bg-purple-500 rounded-full cursor-pointer border-2 border-transparent hover:border-purple-500"></div>
                        <div className="w-8 h-8 bg-red-500 rounded-full cursor-pointer border-2 border-transparent hover:border-red-500"></div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="sidebar">Sidebar</Label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Expanded</option>
                        <option>Collapsed</option>
                        <option>Auto</option>
                      </select>
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">API Access</h3>
                      <Button size="sm">Generate New Key</Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">Production Key</span>
                          <p className="text-sm text-gray-600">••••••••••••••••••••••••••••••••</p>
                        </div>
                        <Button variant="outline" size="sm">Regenerate</Button>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">Development Key</span>
                          <p className="text-sm text-gray-600">••••••••••••••••••••••••••••••••</p>
                        </div>
                        <Button variant="outline" size="sm">Regenerate</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
