import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, DollarSign, Calendar, Search } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CandidateJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs", {
        withCredentials: true,
        params: {
          q: searchQuery,
          page,
          limit: 10,
        },
      });
      setJobs(res.data.jobs);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchJobs();
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery, page]);

  const handleApply = async (jobId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/applications/apply",
        {
          jobId: jobId,
        },
        {
          withCredentials: true,
        }
      );
      setAppliedJobs((prev) => new Set(prev).add(res.data.job));
      toast.success("applied");
    } catch (e) {
      toast.error("Failed to apply");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Browse Jobs</h1>
        <p className="text-muted-foreground">
          Discover your next career opportunity
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by job title, company, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{jobs.length}</span> job
          {jobs.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Job Listings */}
      <div className="grid gap-6">
        {Array.isArray(jobs) &&
          jobs.map((job) => {
            const hasApplied = appliedJobs.has(job._id);
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
                    <Badge
                      variant={job.type === "Remote" ? "default" : "secondary"}
                    >
                      {job.type}
                    </Badge>
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
                      {job.experience}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-muted-foreground">{job.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleApply(job._id)}
                      disabled={hasApplied}
                      variant={hasApplied ? "outline" : "default"}
                      className="flex-1"
                    >
                      {hasApplied ? "Applied ✓" : "Apply Now"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(`/candidate/jobs/${job._id}`)
                      }
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
      

      {jobs.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No jobs found matching your search.
          </p>
          <Button
            variant="link"
            onClick={() => handleSearch("")}
            className="mt-2"
          >
            Clear search
          </Button>
        </Card>
      )}
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
  );
}
