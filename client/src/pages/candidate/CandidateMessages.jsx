import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MailOpen, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function CandidateMessages() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/messages", {
        withCredentials: true,
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load messages");
    }
  };

  const handleMessageClick = async (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      try {
        await axios.put(
          `http://localhost:5000/api/messages/read/${message._id}`,
          {},
          { withCredentials: true }
        );
        loadMessages(); // Refresh to update read status
      } catch (err) {
        console.error(err);
        toast.error("Failed to mark message as read");
      }
    }
  };

  const handleReplyViaEmail = (message) => {
    const subject = encodeURIComponent(`Re: ${message.subject}`);
    const body = encodeURIComponent(
      `\n\n---\nOriginal message from ${message.fromName}:\n${message.message}`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${message.fromEmail}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
    toast.success("Opening Gmail to reply");
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">
          View messages from recruiters {unreadCount > 0 && `• ${unreadCount} unread`}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-3">
          {messages.length === 0 ? (
            <Card className="p-8 text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No messages yet</p>
            </Card>
          ) : (
            messages.map((message) => (
              <Card
                key={message._id}
                className={`cursor-pointer transition-smooth hover:shadow-md ${
                  selectedMessage?._id === message._id ? "ring-2 ring-primary" : ""
                } ${!message.read ? "bg-primary/5 font-medium" : ""}`}
                onClick={() => handleMessageClick(message)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {message.read ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-primary" />
                      )}
                      <CardTitle className="text-base">{message.fromName}</CardTitle>
                    </div>
                    {!message.read && <Badge variant="default" className="text-xs">New</Badge>}
                  </div>
                  <CardDescription className="text-sm font-medium">
                    {message.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(message.sentAt)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="gradient-card">
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{selectedMessage.subject}</CardTitle>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">From: {selectedMessage.fromName}</p>
                        <p>{selectedMessage.fromEmail}</p>
                        <p className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(selectedMessage.sentAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {selectedMessage.jobTitle && (
                      <Badge variant="secondary" className="text-sm">
                        {selectedMessage.jobTitle}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="pt-4 border-t flex gap-3">
                  <Button onClick={() => handleReplyViaEmail(selectedMessage)} className="flex-1">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Reply via Gmail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-12 text-center h-full flex items-center justify-center">
              <div>
                <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Select a message to read</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
