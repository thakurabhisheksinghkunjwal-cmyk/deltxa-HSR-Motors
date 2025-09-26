import React, { useState } from 'react';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { LeadListing } from './components/LeadListing';
import { LeadDetails } from './components/LeadDetails';
import { LeadManagement } from './components/LeadManagement';
import { Dashboard } from './components/Dashboard';
import { BarChart3, Users, Plus, Home } from 'lucide-react';

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  platform: 'Facebook' | 'Google' | 'Website' | 'Referral' | 'LinkedIn';
  status: 'New' | 'Contacted' | 'Interested' | 'Not Interested' | 'Qualified' | 'Closed';
  assignedTo: string;
  lastContacted: string;
  dateReceived: string;
  budget: string;
  model: string;
  timeline: string;
  notes: string;
  score: 'Hot' | 'Warm' | 'Cold';
  intent: 'High' | 'Medium' | 'Low';
};

export type Screen = 'listing' | 'details' | 'management' | 'dashboard';

// Mock data for leads
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    platform: 'Facebook',
    status: 'Interested',
    assignedTo: 'Priya Singh',
    lastContacted: '2024-01-15',
    dateReceived: '2024-01-10',
    budget: '₹15-20 Lakhs',
    model: 'BMW X3',
    timeline: '2-3 months',
    notes: 'Looking for luxury SUV with good fuel efficiency. Interested in test drive.',
    score: 'Hot',
    intent: 'High'
  },
  {
    id: '2',
    name: 'Anita Desai',
    email: 'anita.desai@email.com',
    phone: '+91 87654 32109',
    platform: 'Google',
    status: 'New',
    assignedTo: 'Vikash Kumar',
    lastContacted: '2024-01-14',
    dateReceived: '2024-01-14',
    budget: '₹8-12 Lakhs',
    model: 'Honda City',
    timeline: '1 month',
    notes: 'First-time buyer, needs financing options.',
    score: 'Warm',
    intent: 'Medium'
  },
  {
    id: '3',
    name: 'Suresh Patel',
    email: 'suresh.patel@email.com',
    phone: '+91 76543 21098',
    platform: 'Website',
    status: 'Contacted',
    assignedTo: 'Priya Singh',
    lastContacted: '2024-01-13',
    dateReceived: '2024-01-12',
    budget: '₹25-30 Lakhs',
    model: 'Mercedes C-Class',
    timeline: '6 months',
    notes: 'Comparing with Audi A4. Very specific about features.',
    score: 'Warm',
    intent: 'High'
  },
  {
    id: '4',
    name: 'Deepika Rao',
    email: 'deepika.rao@email.com',
    phone: '+91 65432 10987',
    platform: 'LinkedIn',
    status: 'Qualified',
    assignedTo: 'Vikash Kumar',
    lastContacted: '2024-01-16',
    dateReceived: '2024-01-08',
    budget: '₹5-8 Lakhs',
    model: 'Maruti Swift',
    timeline: '2 weeks',
    notes: 'Ready to buy, just needs final financing approval.',
    score: 'Hot',
    intent: 'High'
  },
  {
    id: '5',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@email.com',
    phone: '+91 54321 09876',
    platform: 'Referral',
    status: 'Not Interested',
    assignedTo: 'Priya Singh',
    lastContacted: '2024-01-11',
    dateReceived: '2024-01-09',
    budget: '₹12-15 Lakhs',
    model: 'Hyundai Creta',
    timeline: 'Indefinite',
    notes: 'Decided to postpone purchase due to personal reasons.',
    score: 'Cold',
    intent: 'Low'
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('listing');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  const selectedLead = selectedLeadId ? leads.find(lead => lead.id === selectedLeadId) : null;

  const handleViewDetails = (leadId: string) => {
    setSelectedLeadId(leadId);
    setCurrentScreen('details');
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
  };

  const handleAddLead = (newLead: Omit<Lead, 'id'>) => {
    const lead: Lead = {
      ...newLead,
      id: Date.now().toString(),
    };
    setLeads(prev => [lead, ...prev]);
    setCurrentScreen('listing');
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Interested': return 'bg-green-100 text-green-800';
      case 'Not Interested': return 'bg-red-100 text-red-800';
      case 'Qualified': return 'bg-purple-100 text-purple-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform: Lead['platform']) => {
    switch (platform) {
      case 'Facebook': return 'bg-blue-50 text-blue-700';
      case 'Google': return 'bg-red-50 text-red-700';
      case 'Website': return 'bg-green-50 text-green-700';
      case 'LinkedIn': return 'bg-blue-50 text-blue-600';
      case 'Referral': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">LeadSync</h1>
              </div>
              <Badge variant="secondary" className="text-xs">
                Real-time Collaboration
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={currentScreen === 'listing' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentScreen('listing')}
                className="flex items-center space-x-1"
              >
                <Users className="w-4 h-4" />
                <span>Leads</span>
              </Button>
              <Button
                variant={currentScreen === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentScreen('dashboard')}
                className="flex items-center space-x-1"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
              <Button
                variant={currentScreen === 'management' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentScreen('management')}
                className="flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Lead</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentScreen === 'listing' && (
          <LeadListing
            leads={leads}
            onViewDetails={handleViewDetails}
            onUpdateLead={handleUpdateLead}
            getStatusColor={getStatusColor}
            getPlatformColor={getPlatformColor}
          />
        )}
        
        {currentScreen === 'details' && selectedLead && (
          <LeadDetails
            lead={selectedLead}
            onUpdateLead={handleUpdateLead}
            onBack={() => setCurrentScreen('listing')}
            getStatusColor={getStatusColor}
            getPlatformColor={getPlatformColor}
          />
        )}
        
        {currentScreen === 'management' && (
          <LeadManagement
            onAddLead={handleAddLead}
            onCancel={() => setCurrentScreen('listing')}
          />
        )}
        
        {currentScreen === 'dashboard' && (
          <Dashboard
            leads={leads}
            getStatusColor={getStatusColor}
            getPlatformColor={getPlatformColor}
          />
        )}
      </main>
    </div>
  );
}