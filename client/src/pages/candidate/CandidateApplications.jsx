import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Calendar } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CandidateApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  // const [jobs, setJobs] = useState({});

  useEffect(() => {
    (async () => {
      const res = await axios.get("http://localhost:5000/api/applications/", {
        withCredentials: true,
      });
      setApplications(res.data);
    })();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-success/10 text-success border-success/20";
      case "Interview":
        return "bg-accent/10 text-accent border-accent/20";
      case "Rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleWithdraw = async (appId, jobTitle) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/applications/${appId}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setApplications(applications.filter((app) => app._id !== appId));
        toast.info(`Withdrawn application for ${jobTitle}`);
      }
    } catch (error) {
      console.error(
        "Error withdrawing application:",
        error.response?.data || error.message
      );
      toast.error("Failed to withdraw application. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">
          Track and manage your job applications
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="gradient-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{applications.length}</p>
            <p className="text-sm text-muted-foreground">Total Applied</p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">
              {Array.isArray(applications) &&
                applications.filter((a) => a.status === "Shortlisted").length}
            </p>
            <p className="text-sm text-muted-foreground">Shortlisted</p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-accent">
              {Array.isArray(applications) &&
                applications.filter((a) => a.status === "Interview").length}
            </p>
            <p className="text-sm text-muted-foreground">Interviews</p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">
              {Array.isArray(applications) &&
                applications.filter((a) => a.status === "Applied").length}
            </p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((app) => {
            return (
              <Card
                key={app._id}
                className="gradient-card hover:shadow-lg transition-smooth"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-xl">{app.job.title}</CardTitle>
                      <CardDescription className="text-base font-medium text-foreground">
                        {app.job.company}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {app.job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {app.job.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Applied on{" "}
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(`/candidate/jobs/${app.job._id}`)}
                    >
                      View Job
                    </Button>
                    {app.status === "Applied" && (
                      <Button
                        variant="ghost"
                        onClick={() => handleWithdraw(app._id, app.job.title)}
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              You haven't applied to any jobs yet.
            </p>
            <Button variant="link" className="mt-2">
              Browse Jobs →
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
