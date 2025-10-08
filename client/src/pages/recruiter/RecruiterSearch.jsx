import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, Mail } from "lucide-react";
import { toast } from "sonner";
import MessageDialog from "@/components/MessageDialog";
import CandidateProfileDialog from "@/components/CandidateProfileDialog";
import axios from "axios";

const mockCandidates = [];

export default function RecruiterSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/candidates", {
        withCredentials: true,
        params: {
          q: searchQuery,
          page,
          limit: 10,
        },
      });
      setCandidates(res.data.candidates);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to fetch candidates");
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCandidates();
    }, 400);
    return () => clearTimeout(delay);
  }, [searchQuery, page]);

  const handleContact = (candidateName) => {
    toast.success(`Message sent to ${candidateName}!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Find Candidates</h1>
        <p className="text-muted-foreground">
          Search and connect with talented professionals
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, title, or skills..."
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
          Found{" "}
          <span className="font-medium text-foreground">
            {candidates.length}
          </span>{" "}
          candidate{candidates.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Candidate Cards */}
      <div className="grid gap-6">
        {Array.isArray(candidates) &&
          candidates.map((candidate) => (
            <Card
              key={candidate._id}
              className="gradient-card hover:shadow-lg transition-smooth"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{candidate.name}</CardTitle>
                    <CardDescription className="text-base font-medium text-foreground">
                      {candidate.title}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {candidate.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {candidate.experience} experience
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {candidate.email}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={ () => {
                      setSelectedCandidate(candidate);
                      setMessageDialogOpen(true);
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setProfileDialogOpen(true);
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {candidates.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No candidates found matching your search.
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

      {selectedCandidate && (
        <>
          <MessageDialog
            open={messageDialogOpen}
            onOpenChange={setMessageDialogOpen}
            recipientName={selectedCandidate.name}
            recipientEmail={selectedCandidate.email}
          />
          <CandidateProfileDialog
            open={profileDialogOpen}
            onOpenChange={setProfileDialogOpen}
            candidate={selectedCandidate}
          />
        </>
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
