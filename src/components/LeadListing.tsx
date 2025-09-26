import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Filter, Eye, Phone, Mail, MessageCircle, Calendar } from 'lucide-react';
import type { Lead } from '../App';

interface LeadListingProps {
  leads: Lead[];
  onViewDetails: (leadId: string) => void;
  onUpdateLead: (lead: Lead) => void;
  getStatusColor: (status: Lead['status']) => string;
  getPlatformColor: (platform: Lead['platform']) => string;
}

export function LeadListing({ 
  leads, 
  onViewDetails, 
  onUpdateLead,
  getStatusColor,
  getPlatformColor
}: LeadListingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  const assignees = useMemo(() => {
    const uniqueAssignees = [...new Set(leads.map(lead => lead.assignedTo))];
    return uniqueAssignees;
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesPlatform = platformFilter === 'all' || lead.platform === platformFilter;
      const matchesAssignee = assigneeFilter === 'all' || lead.assignedTo === assigneeFilter;

      return matchesSearch && matchesStatus && matchesPlatform && matchesAssignee;
    });
  }, [leads, searchTerm, statusFilter, platformFilter, assigneeFilter]);

  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      onUpdateLead({
        ...lead,
        status: newStatus,
        lastContacted: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleAssigneeChange = (leadId: string, newAssignee: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      onUpdateLead({
        ...lead,
        assignedTo: newAssignee
      });
    }
  };

  const getScoreColor = (score: Lead['score']) => {
    switch (score) {
      case 'Hot': return 'bg-red-100 text-red-700';
      case 'Warm': return 'bg-orange-100 text-orange-700';
      case 'Cold': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Lead Management</h1>
          <p className="text-gray-600">Manage and track all your leads in one place</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-700 border-green-200">
            {filteredLeads.length} leads found
          </Badge>
          <Badge variant="outline" className="text-blue-700 border-blue-200">
            {leads.filter(l => l.status === 'New').length} new
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters & Search</span>
          </CardTitle>
          <CardDescription>Filter leads by status, platform, assignee, or search by name/contact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Interested">Interested</SelectItem>
                <SelectItem value="Not Interested">Not Interested</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            {/* Platform Filter */}
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
              </SelectContent>
            </Select>

            {/* Assignee Filter */}
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {assignees.map(assignee => (
                  <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead Info</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.model} • {lead.budget}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[150px]">{lead.email}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={getPlatformColor(lead.platform)}>
                        {lead.platform}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value as Lead['status'])}
                      >
                        <SelectTrigger className="w-[130px]">
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
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
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={getScoreColor(lead.score)}>
                        {lead.score}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Select
                        value={lead.assignedTo}
                        onValueChange={(value) => handleAssigneeChange(lead.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {assignees.map(assignee => (
                            <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{lead.lastContacted}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(lead.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No leads found matching your criteria.</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}