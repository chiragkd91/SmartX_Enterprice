/**
 * Training Management System - Complete learning and development platform
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { 
  GraduationCap, 
  FileText, 
  Users, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Star,
  Award,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  Play,
  Pause,
  Video,
  Link,
  Bookmark
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';

interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: 'Technical' | 'Soft Skills' | 'Leadership' | 'Compliance' | 'Product' | 'Sales';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: number; // in hours
  instructor: string;
  format: 'Online' | 'In-Person' | 'Hybrid' | 'Self-Paced';
  prerequisites: string[];
  materials: TrainingMaterial[];
  assessments: Assessment[];
  maxEnrollment: number;
  currentEnrollment: number;
  status: 'Active' | 'Draft' | 'Archived';
  rating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
}

interface TrainingMaterial {
  id: string;
  title: string;
  type: 'Video' | 'Document' | 'Link' | 'Quiz' | 'Assignment';
  url?: string;
  fileSize?: number;
  duration?: number; // for videos
  isRequired: boolean;
  order: number;
}

interface Assessment {
  id: string;
  title: string;
  type: 'Quiz' | 'Assignment' | 'Project' | 'Presentation';
  passingScore: number;
  maxScore: number;
  timeLimit?: number; // in minutes
  attempts: number;
}

interface EmployeeTraining {
  id: string;
  employeeId: string;
  employeeName: string;
  courseId: string;
  courseTitle: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'failed' | 'dropped';
  progress: number;
  startDate: string;
  completionDate?: string;
  certificate?: string;
  score?: number;
  attempts: number;
  lastAccessed: string;
}

interface TrainingSchedule {
  id: string;
  courseId: string;
  courseTitle: string;
  instructor: string;
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  maxParticipants: number;
  enrolledParticipants: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

const mockCourses: TrainingCourse[] = [
  {
    id: '1',
    title: 'React Development Fundamentals',
    description: 'Learn the basics of React development including components, state, and props.',
    category: 'Technical',
    level: 'Beginner',
    duration: 16,
    instructor: 'Dr. Sarah Johnson',
    format: 'Online',
    prerequisites: ['Basic JavaScript knowledge'],
    materials: [
      { id: '1', title: 'Introduction to React', type: 'Video', duration: 45, isRequired: true, order: 1 },
      { id: '2', title: 'React Components Guide', type: 'Document', fileSize: 2.5, isRequired: true, order: 2 },
      { id: '3', title: 'Practice Exercises', type: 'Assignment', isRequired: true, order: 3 }
    ],
    assessments: [
      { id: '1', title: 'React Basics Quiz', type: 'Quiz', passingScore: 70, maxScore: 100, timeLimit: 30, attempts: 3 }
    ],
    maxEnrollment: 50,
    currentEnrollment: 35,
    status: 'Active',
    rating: 4.5,
    totalRatings: 128,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Leadership Skills for Managers',
    description: 'Develop essential leadership skills including communication, delegation, and team building.',
    category: 'Leadership',
    level: 'Intermediate',
    duration: 20,
    instructor: 'Prof. Michael Chen',
    format: 'Hybrid',
    prerequisites: ['Management experience'],
    materials: [
      { id: '4', title: 'Leadership Principles', type: 'Video', duration: 60, isRequired: true, order: 1 },
      { id: '5', title: 'Case Studies', type: 'Document', fileSize: 1.8, isRequired: true, order: 2 }
    ],
    assessments: [
      { id: '2', title: 'Leadership Assessment', type: 'Project', passingScore: 80, maxScore: 100, attempts: 2 }
    ],
    maxEnrollment: 25,
    currentEnrollment: 18,
    status: 'Active',
    rating: 4.8,
    totalRatings: 89,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '3',
    title: 'Data Security Compliance',
    description: 'Understand data security regulations and best practices for compliance.',
    category: 'Compliance',
    level: 'Intermediate',
    duration: 8,
    instructor: 'Lisa Rodriguez',
    format: 'Self-Paced',
    prerequisites: [],
    materials: [
      { id: '6', title: 'Security Fundamentals', type: 'Video', duration: 30, isRequired: true, order: 1 },
      { id: '7', title: 'Compliance Checklist', type: 'Document', fileSize: 0.5, isRequired: true, order: 2 }
    ],
    assessments: [
      { id: '3', title: 'Compliance Quiz', type: 'Quiz', passingScore: 90, maxScore: 100, timeLimit: 45, attempts: 2 }
    ],
    maxEnrollment: 100,
    currentEnrollment: 67,
    status: 'Active',
    rating: 4.2,
    totalRatings: 156,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z'
  }
];

const mockEmployeeTrainings: EmployeeTraining[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'John Smith',
    courseId: '1',
    courseTitle: 'React Development Fundamentals',
    status: 'in_progress',
    progress: 65,
    startDate: '2024-01-15T00:00:00Z',
    attempts: 1,
    lastAccessed: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Sarah Johnson',
    courseId: '2',
    courseTitle: 'Leadership Skills for Managers',
    status: 'completed',
    progress: 100,
    startDate: '2024-01-10T00:00:00Z',
    completionDate: '2024-01-25T00:00:00Z',
    certificate: 'CERT-2024-001',
    score: 92,
    attempts: 1,
    lastAccessed: '2024-01-25T15:45:00Z'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'Mike Wilson',
    courseId: '3',
    courseTitle: 'Data Security Compliance',
    status: 'enrolled',
    progress: 0,
    startDate: '2024-01-20T00:00:00Z',
    attempts: 0,
    lastAccessed: '2024-01-20T09:15:00Z'
  }
];

const mockSchedules: TrainingSchedule[] = [
  {
    id: '1',
    courseId: '1',
    courseTitle: 'React Development Fundamentals',
    instructor: 'Dr. Sarah Johnson',
    startDate: '2024-02-01',
    endDate: '2024-02-15',
    time: '10:00 AM - 12:00 PM',
    location: 'Online (Zoom)',
    maxParticipants: 50,
    enrolledParticipants: 35,
    status: 'Scheduled'
  },
  {
    id: '2',
    courseId: '2',
    courseTitle: 'Leadership Skills for Managers',
    instructor: 'Prof. Michael Chen',
    startDate: '2024-02-05',
    endDate: '2024-02-20',
    time: '2:00 PM - 4:00 PM',
    location: 'Conference Room A',
    maxParticipants: 25,
    enrolledParticipants: 18,
    status: 'Scheduled'
  }
];

const analyticsData = {
  enrollmentTrends: [
    { month: 'Jan', enrollments: 45, completions: 32 },
    { month: 'Feb', enrollments: 52, completions: 38 },
    { month: 'Mar', enrollments: 48, completions: 41 },
    { month: 'Apr', enrollments: 61, completions: 45 },
    { month: 'May', enrollments: 55, completions: 49 },
    { month: 'Jun', enrollments: 67, completions: 52 }
  ],
  categoryDistribution: [
    { name: 'Technical', value: 35, color: '#3B82F6' },
    { name: 'Leadership', value: 25, color: '#10B981' },
    { name: 'Soft Skills', value: 20, color: '#F59E0B' },
    { name: 'Compliance', value: 15, color: '#EF4444' },
    { name: 'Product', value: 5, color: '#8B5CF6' }
  ],
  completionRates: [
    { category: 'Technical', rate: 78 },
    { category: 'Leadership', rate: 85 },
    { category: 'Soft Skills', rate: 82 },
    { category: 'Compliance', value: 95 },
    { category: 'Product', rate: 70 }
  ]
};

export default function TrainingManagement() {
  const [courses, setCourses] = useState<TrainingCourse[]>(mockCourses);
  const [employeeTrainings, setEmployeeTrainings] = useState<EmployeeTraining[]>(mockEmployeeTrainings);
  const [schedules, setSchedules] = useState<TrainingSchedule[]>(mockSchedules);
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-blue-100 text-blue-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const stats = {
    totalCourses: courses.length,
    activeCourses: courses.filter(c => c.status === 'Active').length,
    totalEnrollments: employeeTrainings.length,
    activeEnrollments: employeeTrainings.filter(e => e.status === 'in_progress').length,
    completedTrainings: employeeTrainings.filter(e => e.status === 'completed').length,
    averageRating: (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Training Management</h1>
          <p className="text-muted-foreground">Manage learning and development programs</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsScheduleOpen(true)}>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Training
          </Button>
          <Button onClick={() => setIsCreateCourseOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{stats.totalCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                <p className="text-2xl font-bold">{stats.activeCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
                <p className="text-2xl font-bold">{stats.totalEnrollments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Learners</p>
                <p className="text-2xl font-bold">{stats.activeEnrollments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedTrainings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">Course Catalog</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Course Catalog */}
        <TabsContent value="courses" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{course.rating}</span>
                      <span className="text-sm text-muted-foreground">({course.totalRatings})</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
                    <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                    <Badge variant="outline">{course.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span className="font-medium">{course.duration} hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Instructor:</span>
                      <span className="font-medium">{course.instructor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Format:</span>
                      <span className="font-medium">{course.format}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Enrollment:</span>
                      <span className="font-medium">{course.currentEnrollment}/{course.maxEnrollment}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(course.currentEnrollment / course.maxEnrollment) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Enrollments */}
        <TabsContent value="enrollments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Training Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Last Accessed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeTrainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell>
                        <div className="font-medium">{training.employeeName}</div>
                        <div className="text-sm text-muted-foreground">{training.employeeId}</div>
                      </TableCell>
                      <TableCell>{training.courseTitle}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(training.status)}>
                          {training.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={training.progress} className="w-20" />
                          <span className="text-sm font-medium">{training.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(training.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(training.lastAccessed).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedules */}
        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Schedules</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Enrollment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">{schedule.courseTitle}</TableCell>
                      <TableCell>{schedule.instructor}</TableCell>
                      <TableCell>
                        {new Date(schedule.startDate).toLocaleDateString()} - {new Date(schedule.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{schedule.time}</TableCell>
                      <TableCell>{schedule.location}</TableCell>
                      <TableCell>
                        {schedule.enrolledParticipants}/{schedule.maxParticipants}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(schedule.status)}>
                          {schedule.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.enrollmentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="enrollments" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                    <Area type="monotone" dataKey="completions" stackId="1" stroke="#10B981" fill="#10B981" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Course Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={analyticsData.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Completion Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Completion Rates by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.completionRates}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rate" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Overall Completion Rate</span>
                    <span className="font-bold text-green-600">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Course Rating</span>
                    <span className="font-bold text-blue-600">4.5/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Learners</span>
                    <span className="font-bold text-purple-600">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Certificates Issued</span>
                    <span className="font-bold text-orange-600">89</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Course Dialog */}
      <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input id="title" placeholder="Enter course title" />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Enter course description..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="level">Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input id="duration" type="number" placeholder="16" />
              </div>
              
              <div>
                <Label htmlFor="format">Format</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Self-Paced">Self-Paced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateCourseOpen(false)}>
                Cancel
              </Button>
              <Button>Create Course</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Training Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Training Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="course">Select Course</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" />
              </div>
              
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" placeholder="10:00 AM - 12:00 PM" />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Conference Room A" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="maxParticipants">Maximum Participants</Label>
              <Input id="maxParticipants" type="number" placeholder="25" />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
                Cancel
              </Button>
              <Button>Schedule Training</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 