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
import { ArrowLeft, Mail, User, Briefcase, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CandidateProfileDialog from "@/components/CandidateProfileDialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import MessageDialog from "@/components/MessageDialog";

export default function RecruiterJobApplicants() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicantStatuses, setApplicantStatuses] = useState({});
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // ✅ Fetch applicants dynamically
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/applications/get-applicants/${id}`,
          { withCredentials: true }
        );
        if (res.data && Array.isArray(res.data)) {
          setApplicants(res.data);
        } else {
          toast.error("No applicants found for this job");
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleStatusChange = async (applicantId, status) => {
    try {
      setApplicantStatuses((prev) => ({
        ...prev,
        [applicantId]: status,
      }));
      // Optionally update backend status here
      await axios.put(
        `http://localhost:5000/api/applications/${applicantId}/status`,
        { status },
        { withCredentials: true }
      );
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <p className="text-center py-10 text-muted-foreground">
        Loading applicants...
      </p>
    );
  }
  if (!applicants.length) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No applicants yet for this job.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Jobs
      </Button>

      <div>
        <h1 className="text-3xl font-bold mb-2">Applicants</h1>
        <p className="text-muted-foreground">
          {applicants.length} candidate{applicants.length !== 1 ? "s" : ""}{" "}
          applied
        </p>
      </div>

      <div className="grid gap-6">
        {applicants.map((app) => {
          const candidate = app || {};
          const status = app.status || "Applied";
          return (
            <Card
              key={app._id}
              className="gradient-card hover:shadow-lg transition-smooth"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {candidate.candidateName || "Unnamed Candidate"}
                    </CardTitle>
                    <CardDescription className="text-base">
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      status === "Shortlisted"
                        ? "default"
                        : status === "Rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {candidate.candidateEmail}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {candidate.experience || "N/A"}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {candidate.location || "Remote"}
                  </div>
                </div>

                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-2 pt-2 items-start md:items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Update status:
                    </span>
                    <Select
                      value={status}
                      onValueChange={(val) => handleStatusChange(app._id, val)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCandidate({
                          id: candidate._id,
                          name: candidate.candidateName,
                          title: app.job?.title || "",
                          location: candidate.location || "N/A",
                          experience: candidate.experience || "",
                          skills: candidate.skills || [],
                          email: candidate.candidateEmail,
                          resumeUrl: candidate.resumeUrl,
                        });
                        setProfileOpen(true);
                      }}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCandidate({
                          id: candidate._id,
                          name: candidate.candidateName,
                          title: app.job?.title || "",
                          location: candidate.location || "N/A",
                          experience: candidate.experience || "",
                          skills: candidate.skills || [],
                          email: candidate.candidateEmail,
                          resumeUrl: candidate.resumeUrl,
                          resumeOriginalName: candidate.resumeOriginalName,
                        });
                        setMessageDialogOpen(true);
                      }}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        window.open(`http://localhost:5000/${app.candidate.resumeUrl}`, "_blank");
                      }}
                    >
                      View Resume
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedCandidate && (
        <>
          <MessageDialog
            open={messageDialogOpen}
            onOpenChange={setMessageDialogOpen}
            recipientName={selectedCandidate.name}
            recipientEmail={selectedCandidate.email}
          />
          <CandidateProfileDialog
            open={profileOpen}
            onOpenChange={setProfileOpen}
            candidate={selectedCandidate}
          />
        </>
      )}
    </div>
  );
}
