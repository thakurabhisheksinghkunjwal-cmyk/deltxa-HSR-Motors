import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, Sparkles, Clock, Target, DollarSign } from 'lucide-react';
import type { Lead } from '../App';

interface LeadManagementProps {
  onAddLead: (lead: Omit<Lead, 'id'>) => void;
  onCancel: () => void;
}

export function LeadManagement({ onAddLead, onCancel }: LeadManagementProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    platform: '' as Lead['platform'] | '',
    status: 'New' as Lead['status'],
    assignedTo: '',
    budget: '',
    model: '',
    timeline: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Auto-generate smart suggestions
    const score: Lead['score'] = 
      formData.notes.toLowerCase().includes('urgent') || formData.timeline === 'Immediately' ? 'Hot' :
      formData.notes.toLowerCase().includes('interested') || formData.timeline === '1 month' ? 'Warm' : 'Cold';

    const intent: Lead['intent'] = 
      formData.budget && formData.model ? 'High' :
      formData.budget || formData.model ? 'Medium' : 'Low';

    const today = new Date().toISOString().split('T')[0];

    const newLead: Omit<Lead, 'id'> = {
      ...formData,
      platform: formData.platform as Lead['platform'],
      dateReceived: today,
      lastContacted: today,
      score,
      intent
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onAddLead(newLead);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const salesTeam = ['Priya Singh', 'Vikash Kumar', 'Amit Sharma', 'Neha Gupta'];
  const carModels = [
    'Maruti Swift', 'Maruti Baleno', 'Hyundai Creta', 'Hyundai i20',
    'Honda City', 'Honda Amaze', 'Tata Nexon', 'Tata Harrier',
    'Mahindra XUV700', 'BMW X3', 'Mercedes C-Class', 'Audi A4'
  ];

  const budgetRanges = [
    '₹3-5 Lakhs', '₹5-8 Lakhs', '₹8-12 Lakhs', '₹12-15 Lakhs',
    '₹15-20 Lakhs', '₹20-25 Lakhs', '₹25-30 Lakhs', '₹30+ Lakhs'
  ];

  const timelines = [
    'Immediately', '2 weeks', '1 month', '2-3 months', 
    '3-6 months', '6+ months', 'Undecided'
  ];

  // Smart suggestions based on input
  const getSmartSuggestions = () => {
    const suggestions = [];
    
    if (formData.notes.toLowerCase().includes('luxury')) {
      suggestions.push('High-end vehicle interest detected');
    }
    if (formData.notes.toLowerCase().includes('first') || formData.notes.toLowerCase().includes('new')) {
      suggestions.push('First-time buyer - may need financing info');
    }
    if (formData.timeline === 'Immediately' || formData.timeline === '2 weeks') {
      suggestions.push('Urgent buyer - prioritize follow-up');
    }
    if (formData.platform === 'Referral') {
      suggestions.push('Referral lead - higher conversion rate');
    }
    
    return suggestions;
  };

  const smartSuggestions = getSmartSuggestions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onCancel} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Leads</span>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Add New Lead</h1>
            <p className="text-gray-600">Capture lead information and let AI analyze intent</p>
          </div>
        </div>
        <Badge variant="outline" className="text-purple-700 border-purple-200">
          <Sparkles className="w-3 h-3 mr-1" />
          AI-Powered
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Basic details about the lead</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Lead Source *</Label>
                  <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Google">Google Ads</SelectItem>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assign To *</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesTeam.map(member => (
                        <SelectItem key={member} value={member}>{member}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interest Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Interest & Requirements</span>
              </CardTitle>
              <CardDescription>What is the customer looking for?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Interested Model</Label>
                  <Select value={formData.model} onValueChange={(value) => handleInputChange('model', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select car model" />
                    </SelectTrigger>
                    <SelectContent>
                      {carModels.map(model => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map(range => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Purchase Timeline</Label>
                <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="When are they planning to buy?" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelines.map(timeline => (
                      <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes & Comments</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add any additional information about the lead..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500">
                  Tip: Include details about features they mentioned, financing needs, trade-in, etc.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - AI Insights & Actions */}
        <div className="space-y-6">
          {/* AI Smart Suggestions */}
          {smartSuggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Smart Insights</span>
                </CardTitle>
                <CardDescription>AI-powered suggestions based on your input</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {smartSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-900">{suggestion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Scoring Preview</CardTitle>
              <CardDescription>Auto-calculated based on input</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lead Score</span>
                <Badge variant="outline" className={
                  formData.notes.toLowerCase().includes('urgent') || formData.timeline === 'Immediately' 
                    ? 'bg-red-100 text-red-700' 
                    : formData.notes.toLowerCase().includes('interested') 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-blue-100 text-blue-700'
                }>
                  {formData.notes.toLowerCase().includes('urgent') || formData.timeline === 'Immediately' 
                    ? 'Hot' 
                    : formData.notes.toLowerCase().includes('interested') 
                    ? 'Warm' 
                    : 'Cold'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Intent Level</span>
                <Badge variant="outline" className={
                  formData.budget && formData.model 
                    ? 'bg-green-100 text-green-700' 
                    : formData.budget || formData.model 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-gray-100 text-gray-700'
                }>
                  {formData.budget && formData.model 
                    ? 'High' 
                    : formData.budget || formData.model 
                    ? 'Medium' 
                    : 'Low'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Follow-up Priority</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span className="text-sm text-blue-600">
                    {formData.timeline === 'Immediately' || formData.timeline === '2 weeks' 
                      ? 'Within 4 hours' 
                      : 'Within 24 hours'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Automation Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>Configure follow-up reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">Auto-reminders enabled</p>
                <p className="text-xs text-green-700">Sales team will be notified for follow-ups</p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Lead scoring active</p>
                <p className="text-xs text-blue-700">Priority calculated automatically</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!formData.name || !formData.phone || !formData.platform || !formData.assignedTo || isSubmitting}
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lead
                  </>
                )}
              </Button>
              
              <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}