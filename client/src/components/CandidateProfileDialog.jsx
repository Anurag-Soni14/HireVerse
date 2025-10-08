import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Briefcase, Download } from "lucide-react";
import { useState } from "react";
import MessageDialog from "./MessageDialog";

export default function CandidateProfileDialog({
  open,
  onOpenChange,
  candidate,
}) {
  if (!candidate) return null;
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const selectedCandidate = candidate;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{candidate.name}</DialogTitle>
          <DialogDescription className="text-lg">
            {candidate.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {candidate.email}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {candidate.location}
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {candidate.experience} experience
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-muted-foreground">
              Experienced professional with a strong background in modern
              technologies and a passion for building innovative solutions.
              Proven track record of delivering high-quality work in fast-paced
              environments.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Experience Highlights
            </h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                Led multiple successful projects from conception to deployment
              </li>
              <li>
                Collaborated with cross-functional teams to deliver innovative
                solutions
              </li>
              <li>Mentored junior developers and contributed to team growth</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="default"
              className="flex-1"
              onClick={() => setMessageDialogOpen(true)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Message
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.open(
                  `http://localhost:5000/${candidate.resumeUrl}`,
                  "_blank"
                );
              }}
            >
              View Resume
            </Button>
          </div>
        </div>
      </DialogContent>
      {selectedCandidate && (
        <MessageDialog
          open={messageDialogOpen}
          onOpenChange={setMessageDialogOpen}
          recipientName={selectedCandidate.name}
          recipientEmail={selectedCandidate.email}
        />
      )}
    </Dialog>
  );
}
