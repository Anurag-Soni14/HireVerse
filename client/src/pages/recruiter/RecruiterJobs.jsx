import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import PostJobDialog from "@/components/PostJobDialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RecruiterJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [postJobOpen, setPostJobOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(undefined);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [jobApplicants, setJobApplicants] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await axios.get("http://localhost:5000/api/jobs/my", {
        withCredentials: true,
      });
      setJobs(res.data.jobs);
      setPagination(res.data.pagination);
      setJobApplicants(res.data.jobsApplicants);
    })();
  }, []);

  const handleDelete = async (jobId, jobTitle) => {
    await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
      withCredentials: true,
    });
    setJobs((prev) => prev.filter((job) => job._id !== jobId));
    toast.success(`Deleted "${jobTitle}"`);
  };

  const handlePostJob = async (job) => {
    const res = await axios.post("http://localhost:5000/api/jobs/", job, {
      withCredentials: true,
    });
    setJobs((prev) => [...prev, res.data]);
    toast.success("Job posted successfully!");
  };

  const handleEditJob = async (job) => {
    const res = await axios.put(
      `http://localhost:5000/api/jobs/${job._id}`,
      job,
      { withCredentials: true }
    );
    const updated = res.data;
    setJobs((prev) => prev.map((j) => (j._id === updated._id ? updated : j)));
    toast.success("Job updated successfully!");
    setEditingJob(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Jobs</h1>
          <p className="text-muted-foreground">
            Create and manage your job postings
          </p>
        </div>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setPostJobOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Post New Job
        </Button>
      </div>

      {/* Job Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Jobs</p>
            <p className="text-3xl font-bold">{jobs.length}</p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Active Posts</p>
            <p className="text-3xl font-bold text-success">{jobs.length}</p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Views</p>
            <p className="text-3xl font-bold text-primary">
              {Math.floor(Math.random() * 1000) + 500}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      {jobs.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No job posted yet...
          </p>
          <Button
            variant="link"
            onClick={() => setPostJobOpen(true)}
            className="mt-2"
          >
            Post a job
          </Button>
        </Card>
      )}
      <div className="space-y-4">
        {Array.isArray(jobs) &&
          jobs.map((job) => {
            return (
              <Card
                key={job._id}
                className="gradient-card hover:shadow-lg transition-smooth"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="text-base font-medium text-foreground">
                        {job.company}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.applicantCount} Applicants
                    </div>
                  </div>

                  <p className="text-muted-foreground">
                    {job.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() =>
                        navigate(`/recruiter/jobs/${job._id}/applicants`)
                      }
                    >
                      <Users className="mr-2 h-4 w-4" />
                      View Applicants ({job.applicantCount})
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingJob(job);
                        setPostJobOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(job._id, job.title)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <PostJobDialog
        open={postJobOpen}
        onOpenChange={(open) => {
          setPostJobOpen(open);
          if (!open) setEditingJob(undefined);
        }}
        onSubmit={editingJob ? handleEditJob : handlePostJob}
        initialData={editingJob}
        mode={editingJob ? "edit" : "create"}
      />
    </div>
  );
}
