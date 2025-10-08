// Mock messages data
export const mockMessages = [
    {
      id: '1',
      fromName: 'Tech Corp',
      fromEmail: 'recruiter@techcorp.com',
      fromRole: 'recruiter',
      toEmail: 'candidate@example.com',
      subject: 'Interested in Your Profile',
      message: 'Hi! We came across your profile and are impressed with your skills in React and TypeScript. We have an exciting opportunity for a Senior Frontend Developer role. Would you be interested in discussing this further?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: '2',
      fromName: 'Innovation Labs',
      fromEmail: 'hr@innovationlabs.com',
      fromRole: 'recruiter',
      toEmail: 'candidate@example.com',
      subject: 'Application Update - Full Stack Engineer',
      message: 'Thank you for applying to our Full Stack Engineer position. We would like to schedule an interview with you. Please let us know your availability for next week.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      jobId: '2',
      jobTitle: 'Full Stack Engineer',
    },
    {
      id: '3',
      fromName: 'StartupXYZ',
      fromEmail: 'hiring@startupxyz.com',
      fromRole: 'recruiter',
      toEmail: 'candidate@example.com',
      subject: 'Exciting Opportunity',
      message: 'We are looking for talented developers to join our growing team. Your experience with Node.js and PostgreSQL caught our attention. Are you open to new opportunities?',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ];
  
  // Get messages for candidate (can be replaced with API call)
  export const getMessagesForCandidate = (candidateEmail) => {
    const stored = localStorage.getItem('candidate_messages');
    if (stored) {
      return JSON.parse(stored);
    }
    return mockMessages;
  };
  
  // Mark message as read
  export const markMessageAsRead = (messageId) => {
    const messages = getMessagesForCandidate('');
    const updated = messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    );
    localStorage.setItem('candidate_messages', JSON.stringify(updated));
  };
  
  // Save new message
  export const saveMessage = (message) => {
    const messages = getMessagesForCandidate('');
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    messages.unshift(newMessage);
    localStorage.setItem('candidate_messages', JSON.stringify(messages));
  };
  