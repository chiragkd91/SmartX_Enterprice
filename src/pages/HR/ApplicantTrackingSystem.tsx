/**
 * Applicant Tracking System (ATS) Module
 * Comprehensive recruitment and hiring management system
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Progress } from '../../components/ui/progress';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { CalendarIcon, Plus, Search, Filter, Download, Upload, Eye, Edit, Trash2, Mail, Phone, MapPin, Clock, Users, Target, CheckCircle, XCircle, AlertCircle, Star, FileText, UserPlus, CalendarDays, BarChart3, TrendingUp, Building, GraduationCap, Briefcase, DollarSign, Globe, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  salary: string;
  status: 'Active' | 'Draft' | 'Closed' | 'On Hold';
  postedDate: Date;
  deadline: Date;
  applications: number;
  views: number;
  description: string;
  requirements: string[];
  benefits: string[];
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Technical' | 'Final' | 'Hired' | 'Rejected';
  appliedDate: Date;
  experience: string;
  skills: string[];
  resume: string;
  coverLetter: string;
  rating: number;
  notes: string;
  interviewScheduled?: Date;
  interviewer?: string;
}

interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  type: 'Phone' | 'Video' | 'On-site' | 'Technical';
  scheduledDate: Date;
  duration: number;
  interviewer: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  notes: string;
  feedback: string;
  rating: number;
}

const ApplicantTrackingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isCandidateDialogOpen, setIsCandidateDialogOpen] = useState(false);
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  useEffect(() => {
    const mockJobPostings: JobPosting[] = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        department: 'Engineering',
        location: 'Mumbai, India',
        type: 'Full-time',
        experience: '5-8 years',
        salary: '₹15-25 LPA',
        status: 'Active',
        postedDate: new Date('2024-01-15'),
        deadline: new Date('2024-02-15'),
        applications: 45,
        views: 234,
        description: 'We are looking for a Senior Software Engineer to join our dynamic team...',
        requirements: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
        benefits: ['Health Insurance', 'Flexible Hours', 'Remote Work', 'Learning Budget']
      },
      {
        id: '2',
        title: 'Product Manager',
        department: 'Product',
        location: 'Bangalore, India',
        type: 'Full-time',
        experience: '3-6 years',
        salary: '₹12-20 LPA',
        status: 'Active',
        postedDate: new Date('2024-01-20'),
        deadline: new Date('2024-02-20'),
        applications: 32,
        views: 189,
        description: 'Join our product team to drive innovation and user experience...',
        requirements: ['Product Strategy', 'User Research', 'Agile', 'Analytics'],
        benefits: ['Health Insurance', 'Stock Options', 'Professional Development']
      }
    ];

    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@email.com',
        phone: '+91 98765 43210',
        position: 'Senior Software Engineer',
        status: 'Interview',
        appliedDate: new Date('2024-01-25'),
        experience: '6 years',
        skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
        resume: 'rahul_sharma_resume.pdf',
        coverLetter: 'I am excited to apply for the Senior Software Engineer position...',
        rating: 4.5,
        notes: 'Strong technical background, good communication skills',
        interviewScheduled: new Date('2024-02-05'),
        interviewer: 'Priya Patel'
      },
      {
        id: '2',
        name: 'Anjali Desai',
        email: 'anjali.desai@email.com',
        phone: '+91 87654 32109',
        position: 'Product Manager',
        status: 'Screening',
        appliedDate: new Date('2024-01-28'),
        experience: '4 years',
        skills: ['Product Strategy', 'User Research', 'Agile'],
        resume: 'anjali_desai_resume.pdf',
        coverLetter: 'I am passionate about creating user-centric products...',
        rating: 4.2,
        notes: 'Good product sense, needs technical background review'
      }
    ];

    const mockInterviews: Interview[] = [
      {
        id: '1',
        candidateId: '1',
        candidateName: 'Rahul Sharma',
        position: 'Senior Software Engineer',
        type: 'Technical',
        scheduledDate: new Date('2024-02-05'),
        duration: 60,
        interviewer: 'Priya Patel',
        status: 'Scheduled',
        notes: 'Focus on system design and coding challenges',
        feedback: '',
        rating: 0
      }
    ];

    setJobPostings(mockJobPostings);
    setCandidates(mockCandidates);
    setInterviews(mockInterviews);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCandidateStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Screening': return 'bg-yellow-100 text-yellow-800';
      case 'Interview': return 'bg-purple-100 text-purple-800';
      case 'Technical': return 'bg-orange-100 text-orange-800';
      case 'Final': return 'bg-indigo-100 text-indigo-800';
      case 'Hired': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInterviewStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalJobs: jobPostings.length,
    activeJobs: jobPostings.filter(job => job.status === 'Active').length,
    totalCandidates: candidates.length,
    hiredCandidates: candidates.filter(c => c.status === 'Hired').length,
    pendingInterviews: interviews.filter(i => i.status === 'Scheduled').length,
    averageTimeToHire: 25 // days
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applicant Tracking System</h1>
          <p className="text-gray-600 mt-2">Manage job postings, candidates, and hiring workflows</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsJobDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Job Posting
          </Button>
          <Button variant="outline" onClick={() => setIsCandidateDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold">{stats.totalJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold">{stats.activeJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Candidates</p>
                <p className="text-2xl font-bold">{stats.totalCandidates}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Hired</p>
                <p className="text-2xl font-bold">{stats.hiredCandidates}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Interviews</p>
                <p className="text-2xl font-bold">{stats.pendingInterviews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Avg. Time to Hire</p>
                <p className="text-2xl font-bold">{stats.averageTimeToHire}d</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Job Postings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Recent Job Postings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobPostings.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                          <span className="text-xs text-gray-500">{job.applications} applications</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Candidates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Candidates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidates.slice(0, 5).map((candidate) => (
                    <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{candidate.name}</h4>
                        <p className="text-sm text-gray-600">{candidate.position}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCandidateStatusColor(candidate.status)}>{candidate.status}</Badge>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={cn("w-3 h-3", i < candidate.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Interviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Upcoming Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Interviewer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interviews.filter(i => i.status === 'Scheduled').map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell className="font-medium">{interview.candidateName}</TableCell>
                      <TableCell>{interview.position}</TableCell>
                      <TableCell>{interview.type}</TableCell>
                      <TableCell>{format(interview.scheduledDate, 'MMM dd, yyyy HH:mm')}</TableCell>
                      <TableCell>{interview.interviewer}</TableCell>
                      <TableCell>
                        <Badge className={getInterviewStatusColor(interview.status)}>
                          {interview.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Postings Tab */}
        <TabsContent value="jobs" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-10 w-64"
                />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobPostings.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{job.applications}</span>
                          <span className="text-xs text-gray-500">({job.views} views)</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(job.postedDate, 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Candidates Tab */}
        <TabsContent value="candidates" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Screening">Screening</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
                  <SelectItem value="Hired">Hired</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsCandidateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-sm text-gray-500">{candidate.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{candidate.position}</TableCell>
                      <TableCell>
                        <Badge className={getCandidateStatusColor(candidate.status)}>
                          {candidate.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(candidate.appliedDate, 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{candidate.experience}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-3 h-3", i < candidate.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
                          ))}
                          <span className="text-sm ml-1">({candidate.rating})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interviews Tab */}
        <TabsContent value="interviews" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsInterviewDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Interviewer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell className="font-medium">{interview.candidateName}</TableCell>
                      <TableCell>{interview.position}</TableCell>
                      <TableCell>{interview.type}</TableCell>
                      <TableCell>{format(interview.scheduledDate, 'MMM dd, yyyy HH:mm')}</TableCell>
                      <TableCell>{interview.interviewer}</TableCell>
                      <TableCell>
                        <Badge className={getInterviewStatusColor(interview.status)}>
                          {interview.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hiring Funnel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Hiring Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Applications</span>
                    <span className="font-medium">156</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Screening</span>
                    <span className="font-medium">89</span>
                  </div>
                  <Progress value={57} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Interviews</span>
                    <span className="font-medium">45</span>
                  </div>
                  <Progress value={29} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Offers</span>
                    <span className="font-medium">12</span>
                  </div>
                  <Progress value={8} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Hired</span>
                    <span className="font-medium">8</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Time to Hire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Time to Hire Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Time to Hire</span>
                    <span className="font-medium text-green-600">25 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fastest Hire</span>
                    <span className="font-medium">12 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Slowest Hire</span>
                    <span className="font-medium">45 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Industry Average</span>
                    <span className="font-medium text-gray-600">30 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Source Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Candidate Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">45%</div>
                  <div className="text-sm text-gray-600">Job Boards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">30%</div>
                  <div className="text-sm text-gray-600">Referrals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">25%</div>
                  <div className="text-sm text-gray-600">Direct Applications</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Job Posting Dialog */}
      <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Job Posting</DialogTitle>
            <DialogDescription>
              Add a new job posting to attract qualified candidates
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" placeholder="e.g., Senior Software Engineer" />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., Mumbai, India" />
              </div>
              <div>
                <Label htmlFor="type">Job Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <Input id="experience" placeholder="e.g., 5-8 years" />
              </div>
              <div>
                <Label htmlFor="salary">Salary Range</Label>
                <Input id="salary" placeholder="e.g., ₹15-25 LPA" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea id="description" placeholder="Enter detailed job description..." rows={4} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsJobDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Create Job Posting</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Candidate Dialog */}
      <Dialog open={isCandidateDialogOpen} onOpenChange={setIsCandidateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Candidate</DialogTitle>
            <DialogDescription>
              Add a new candidate to the recruitment pipeline
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="candidate-name">Full Name</Label>
                <Input id="candidate-name" placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="candidate-email">Email</Label>
                <Input id="candidate-email" type="email" placeholder="Enter email address" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="candidate-phone">Phone</Label>
                <Input id="candidate-phone" placeholder="Enter phone number" />
              </div>
              <div>
                <Label htmlFor="candidate-position">Position</Label>
                <Input id="candidate-position" placeholder="Applied position" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="candidate-experience">Experience</Label>
                <Input id="candidate-experience" placeholder="e.g., 5 years" />
              </div>
              <div>
                <Label htmlFor="candidate-status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="candidate-notes">Notes</Label>
              <Textarea id="candidate-notes" placeholder="Add any notes about the candidate..." rows={3} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCandidateDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Add Candidate</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interview Dialog */}
      <Dialog open={isInterviewDialogOpen} onOpenChange={setIsInterviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Schedule an interview with a candidate
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="interview-candidate">Candidate</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((candidate) => (
                    <SelectItem key={candidate.id} value={candidate.id}>
                      {candidate.name} - {candidate.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interview-type">Interview Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="on-site">On-site</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="interview-duration">Duration (minutes)</Label>
                <Input id="interview-duration" type="number" placeholder="60" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interview-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Pick a date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="interview-time">Time</Label>
                <Input id="interview-time" type="time" />
              </div>
            </div>
            <div>
              <Label htmlFor="interview-interviewer">Interviewer</Label>
              <Input id="interview-interviewer" placeholder="Enter interviewer name" />
            </div>
            <div>
              <Label htmlFor="interview-notes">Notes</Label>
              <Textarea id="interview-notes" placeholder="Add interview notes..." rows={3} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsInterviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Schedule Interview</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicantTrackingSystem; 