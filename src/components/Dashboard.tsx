import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Users, PhoneCall, Mail, Calendar, Download, Filter } from 'lucide-react';
import type { Lead } from '../App';

interface DashboardProps {
  leads: Lead[];
  getStatusColor: (status: Lead['status']) => string;
  getPlatformColor: (platform: Lead['platform']) => string;
}

export function Dashboard({ leads, getStatusColor, getPlatformColor }: DashboardProps) {
  // Calculate metrics
  const metrics = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter(l => l.status === 'New').length;
    const interestedLeads = leads.filter(l => l.status === 'Interested').length;
    const qualifiedLeads = leads.filter(l => l.status === 'Qualified').length;
    const closedLeads = leads.filter(l => l.status === 'Closed').length;
    const hotLeads = leads.filter(l => l.score === 'Hot').length;
    
    const conversionRate = total > 0 ? Math.round((qualifiedLeads / total) * 100) : 0;
    
    return {
      total,
      newLeads,
      interestedLeads,
      qualifiedLeads,
      closedLeads,
      hotLeads,
      conversionRate
    };
  }, [leads]);

  // Platform distribution
  const platformData = useMemo(() => {
    const platforms = leads.reduce((acc, lead) => {
      acc[lead.platform] = (acc[lead.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(platforms).map(([platform, count]) => ({
      platform,
      count,
      percentage: Math.round((count / leads.length) * 100)
    }));
  }, [leads]);

  // Status distribution
  const statusData = useMemo(() => {
    const statuses = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statuses).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / leads.length) * 100)
    }));
  }, [leads]);

  // Daily trend data (mock)
  const trendData = [
    { date: '2024-01-10', leads: 2, conversions: 0 },
    { date: '2024-01-11', leads: 1, conversions: 0 },
    { date: '2024-01-12', leads: 1, conversions: 0 },
    { date: '2024-01-13', leads: 0, conversions: 1 },
    { date: '2024-01-14', leads: 1, conversions: 0 },
    { date: '2024-01-15', leads: 0, conversions: 1 },
    { date: '2024-01-16', leads: 0, conversions: 1 }
  ];

  // Score distribution
  const scoreData = useMemo(() => {
    const scores = leads.reduce((acc, lead) => {
      acc[lead.score] = (acc[lead.score] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(scores).map(([score, count]) => ({
      score,
      count
    }));
  }, [leads]);

  // Colors for charts
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  const getPieColor = (index: number) => COLORS[index % COLORS.length];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Analytics and insights for your lead management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="7days">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold text-red-600">{metrics.hotLeads}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+5% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Qualified</p>
                <p className="text-2xl font-bold text-green-600">{metrics.qualifiedLeads}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <PhoneCall className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">Ready to close</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.conversionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-red-600">-2% from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>Distribution of leads by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ platform, percentage }) => `${platform} (${percentage}%)`}
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getPieColor(index)} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {platformData.map((item, index) => (
                <div key={item.platform} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getPieColor(index) }}
                  />
                  <span className="text-sm text-gray-600">{item.platform}: {item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Status</CardTitle>
            <CardDescription>Current status of all leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Trend</CardTitle>
            <CardDescription>Daily lead generation and conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="leads" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="conversions" 
                    stackId="1" 
                    stroke="#10b981" 
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm text-gray-600">New Leads</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-600">Conversions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead Scoring */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Scoring</CardTitle>
            <CardDescription>Distribution by lead temperature</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scoreData.map((item) => (
                <div key={item.score} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="outline"
                      className={
                        item.score === 'Hot' ? 'bg-red-100 text-red-700 border-red-200' :
                        item.score === 'Warm' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                        'bg-blue-100 text-blue-700 border-blue-200'
                      }
                    >
                      {item.score}
                    </Badge>
                    <span className="text-sm text-gray-600">{item.count} leads</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">
                      {Math.round((item.count / leads.length) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Quick Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Facebook generates the most leads</li>
                <li>• {metrics.hotLeads} hot leads need immediate attention</li>
                <li>• Best contact time: 10 AM - 12 PM</li>
                <li>• Average response time: 2.5 hours</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Individual sales team member statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Priya Singh', 'Vikash Kumar', 'Amit Sharma', 'Neha Gupta'].map((member) => {
              const memberLeads = leads.filter(l => l.assignedTo === member);
              const memberConversions = memberLeads.filter(l => l.status === 'Qualified' || l.status === 'Closed').length;
              
              return (
                <div key={member} className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900">{member}</h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Leads:</span>
                      <span className="font-medium">{memberLeads.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Conversions:</span>
                      <span className="font-medium text-green-600">{memberConversions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-medium">
                        {memberLeads.length > 0 ? Math.round((memberConversions / memberLeads.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}