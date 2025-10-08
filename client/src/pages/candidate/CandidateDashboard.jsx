import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, FileText, TrendingUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({ appliedJobs: 0, shortlisted: 0, availableJobs: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/candidate', {
          withCredentials: true,
        });
        setStatsData(res.data.stats || { appliedJobs: 0, shortlisted: 0, availableJobs: 0 });
        setRecent(res.data.recentApplications || []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => ([
    { title: 'Applied Jobs', value: statsData.appliedJobs, icon: FileText, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Shortlisted', value: statsData.shortlisted, icon: TrendingUp, color: 'text-success', bgColor: 'bg-success/10' },
    { title: 'Available Jobs', value: statsData.availableJobs, icon: Briefcase, color: 'text-accent', bgColor: 'bg-accent/10' },
    { title: 'Profile Views', value: Math.floor(Math.random() * 100) + 20, icon: Eye, color: 'text-secondary', bgColor: 'bg-secondary/10' },
  ]), [statsData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-muted-foreground">Here's what's happening with your job search today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="gradient-card hover:shadow-lg transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
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
          <CardDescription>Jump to the most important tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate('/candidate/jobs')}
          >
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-semibold">Browse Jobs</span>
            <span className="text-xs text-muted-foreground">Find your next opportunity</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate('/candidate/profile')}
          >
            <FileText className="h-6 w-6 text-accent" />
            <span className="font-semibold">Update Profile</span>
            <span className="text-xs text-muted-foreground">Keep your profile current</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate('/candidate/applications')}
          >
            <TrendingUp className="h-6 w-6 text-success" />
            <span className="font-semibold">View Applications</span>
            <span className="text-xs text-muted-foreground">Track your progress</span>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Your latest job applications</CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length > 0 ? (
            <div className="space-y-4">
              {recent.map((app) => {
                return (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <div>
                      <h4 className="font-semibold">{app.job?.title}</h4>
                      <p className="text-sm text-muted-foreground">{app.job?.company}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          app.status === 'Shortlisted'
                            ? 'bg-success/10 text-success'
                            : app.status === 'Interview'
                            ? 'bg-accent/10 text-accent'
                            : app.status === 'Rejected'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {app.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">Applied {new Date(app.appliedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
              <Button variant="link" onClick={() => navigate('/candidate/applications')} className="w-full">
                View All Applications →
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>You haven't applied to any jobs yet.</p>
              <Button variant="link" onClick={() => navigate('/candidate/jobs')} className="mt-2">
                Browse Jobs →
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
