import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({ activeJobs: 0, totalApplicants: 0, shortlisted: 0 });
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/recruiter', {
          withCredentials: true,
        });
        setStatsData(res.data.stats || { activeJobs: 0, totalApplicants: 0, shortlisted: 0 });
        setRecentJobs(res.data.recentJobs || []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => ([
    { title: 'Active Jobs', value: statsData.activeJobs, icon: Briefcase, color: 'text-secondary', bgColor: 'bg-secondary/10' },
    { title: 'Total Applicants', value: statsData.totalApplicants, icon: Users, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Shortlisted', value: statsData.shortlisted, icon: TrendingUp, color: 'text-success', bgColor: 'bg-success/10' },
    { title: 'This Month', value: new Date().getMonth() + 1, icon: Plus, color: 'text-accent', bgColor: 'bg-accent/10' },
  ]), [statsData]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Recruiter Dashboard 💼</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's your hiring overview.
          </p>
        </div>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate('/recruiter/jobs')}
        >
          <Plus className="mr-2 h-5 w-5" />
          Post New Job
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="gradient-card hover:shadow-lg transition-smooth"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and workflows</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate('/recruiter/jobs')}
          >
            <Plus className="h-6 w-6 text-secondary" />
            <span className="font-semibold">Post a Job</span>
            <span className="text-xs text-muted-foreground">
              Create new job listing
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate('/recruiter/search')}
          >
            <Users className="h-6 w-6 text-primary" />
            <span className="font-semibold">Find Candidates</span>
            <span className="text-xs text-muted-foreground">
              Search talent pool
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate('/recruiter/jobs')}
          >
            <Briefcase className="h-6 w-6 text-accent" />
            <span className="font-semibold">View Applicants</span>
            <span className="text-xs text-muted-foreground">
              Review applications
            </span>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Your Recent Job Postings</CardTitle>
          <CardDescription>Latest positions you've listed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div
                key={job._id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
              >
                <div>
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {job.location} • {job.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {job.applicantCount} Applicants
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => navigate('/recruiter/jobs')}
                  >
                    View →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
