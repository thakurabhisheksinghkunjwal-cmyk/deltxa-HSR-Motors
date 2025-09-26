import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Phone, Mail, MessageCircle, Calendar, Clock, User, DollarSign, Car, MapPin, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import type { Lead } from '../App';

interface LeadDetailsProps {
  lead: Lead;
  onUpdateLead: (lead: Lead) => void;
  onBack: () => void;
  getStatusColor: (status: Lead['status']) => string;
  getPlatformColor: (platform: Lead['platform']) => string;
}

export function LeadDetails({ 
  lead, 
  onUpdateLead, 
  onBack,
  getStatusColor,
  getPlatformColor
}: LeadDetailsProps) {
  const [notes, setNotes] = useState(lead.notes);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const handleStatusChange = (newStatus: Lead['status']) => {
    onUpdateLead({
      ...lead,
      status: newStatus,
      lastContacted: new Date().toISOString().split('T')[0]
    });
  };

  const handleSaveNotes = () => {
    onUpdateLead({
      ...lead,
      notes
    });
    setIsEditingNotes(false);
  };

  const getScoreColor = (score: Lead['score']) => {
    switch (score) {
      case 'Hot': return 'bg-red-100 text-red-700 border-red-200';
      case 'Warm': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Cold': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getIntentColor = (intent: Lead['intent']) => {
    switch (intent) {
      case 'High': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Mock activity timeline
  const activities = [
    {
      id: 1,
      type: 'status_change',
      message: `Status changed to ${lead.status}`,
      timestamp: lead.lastContacted,
      user: lead.assignedTo
    },
    {
      id: 2,
      type: 'note',
      message: 'Added detailed notes about customer requirements',
      timestamp: '2024-01-14',
      user: lead.assignedTo
    },
    {
      id: 3,
      type: 'call',
      message: 'Phone call - Discussed pricing and features',
      timestamp: '2024-01-13',
      user: lead.assignedTo
    },
    {
      id: 4,
      type: 'email',
      message: 'Sent brochure and pricing information',
      timestamp: '2024-01-12',
      user: lead.assignedTo
    },
    {
      id: 5,
      type: 'created',
      message: 'Lead created from Facebook campaign',
      timestamp: lead.dateReceived,
      user: 'System'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Leads</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={getScoreColor(lead.score)}>
            {lead.score} Lead
          </Badge>
          <Badge variant="outline" className={getIntentColor(lead.intent)}>
            {lead.intent} Intent
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Lead Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{lead.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-4 mt-2">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Received: {lead.dateReceived}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Last Contact: {lead.lastContacted}</span>
                    </span>
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(lead.status)}>
                  {lead.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{lead.phone}</p>
                      <p className="text-sm text-gray-500">Phone</p>
                    </div>
                    <Button size="sm" variant="outline">Call</Button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{lead.email}</p>
                      <p className="text-sm text-gray-500">Email</p>
                    </div>
                    <Button size="sm" variant="outline">Email</Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <Badge variant="outline" className={getPlatformColor(lead.platform)}>
                        {lead.platform}
                      </Badge>
                      <p className="text-sm text-gray-500">Lead Source</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{lead.assignedTo}</p>
                      <p className="text-sm text-gray-500">Assigned To</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interest Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="w-5 h-5" />
                <span>Interest Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Interested Model</p>
                  <p className="font-medium">{lead.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Budget Range</p>
                  <p className="font-medium flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{lead.budget}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purchase Timeline</p>
                  <p className="font-medium">{lead.timeline}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notes & Comments</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => isEditingNotes ? handleSaveNotes() : setIsEditingNotes(true)}
                >
                  {isEditingNotes ? 'Save Notes' : 'Edit Notes'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about the lead..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Track all interactions and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'status_change' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                      {activity.type === 'note' && (
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        </div>
                      )}
                      {activity.type === 'call' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Phone className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                      {activity.type === 'email' && (
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Mail className="w-4 h-4 text-purple-600" />
                        </div>
                      )}
                      {activity.type === 'created' && (
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp} • by {activity.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Call Lead
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={lead.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Interested">Interested</SelectItem>
                  <SelectItem value="Not Interested">Not Interested</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Last updated: {lead.lastContacted}
              </p>
            </CardContent>
          </Card>

          {/* Smart Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Smart Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">High Intent Detected</p>
                <p className="text-xs text-blue-700">Lead mentions specific model and budget</p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-900">Follow-up Reminder</p>
                <p className="text-xs text-yellow-700">Recommended: Contact within 2 days</p>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">Best Contact Time</p>
                <p className="text-xs text-green-700">10 AM - 12 PM based on platform data</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}