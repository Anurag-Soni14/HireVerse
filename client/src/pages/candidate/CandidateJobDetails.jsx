import { useParams, useNavigate } from "react-router-dom";
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
  ArrowLeft,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CandidateJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hasApplied, setHasApplied] = useState(false);
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState();
  

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`, {
          withCredentials: true,
        });
        setJob(res.data.job);
        setStatus(res.data.status || '');
        setHasApplied(!!res.data.status);
      } catch {
        setJob(null);
      }
    })();
  }, [id]);

  if (!job) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Job not found</p>
        </Card>
      </div>
    );
  }

  const handleApply = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/applications/apply",
        {
          jobId: job._id,
        },
        {
          withCredentials: true,
        }
      );
      setHasApplied(true);
      setStatus('Applied');
      toast.success(`Applied to ${job.title}`);
    } catch {
      toast.error("Failed to apply");
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Jobs
      </Button>

      <Card className="gradient-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-3xl">{job.title}</CardTitle>
              <CardDescription className="text-lg font-medium text-foreground flex items-center gap-2">
                <Building className="h-5 w-5" />
                {job.company}
              </CardDescription>
            </div>
            <Badge
              variant={job.type === "Remote" ? "default" : "secondary"}
              className="text-base px-4 py-2"
            >
              {job.type}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Job Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <div>
                <p className="text-xs">Location</p>
                <p className="text-sm font-medium text-foreground">
                  {job.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-5 w-5" />
              <div>
                <p className="text-xs">Experience</p>
                <p className="text-sm font-medium text-foreground">
                  {job.experience}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-5 w-5" />
              <div>
                <p className="text-xs">Salary</p>
                <p className="text-sm font-medium text-foreground">
                  {job.salary}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <div>
                <p className="text-xs">Posted</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(job.postedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(job.skills) &&
                job.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-sm px-3 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {job.shortDescription}
            </p>
            <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: job.longDescription }}/>
          </div>


          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleApply}
              disabled={!!status}
              variant={status ? "outline" : "default"}
              size="lg"
              className="flex-1 md:flex-initial md:px-12"
            >
              {status ? status : "Apply Now"}
            </Button>

            <Button variant="outline" size="lg">
              Save for Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
