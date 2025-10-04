// Define type directly
interface EmailContent {
  sender: {
    name: string;
    email: string;
    avatar: string;
  };
  subject: string;
  timestamp: string;
  body: {
    intro: string;
    quote: string;
    content: string;
    table: {
      headers: string[];
      rows: string[][];
    };
    list: string[];
    ctaText: string;
  };
  footer: {
    unsubscribeText: string;
    companyInfo: string;
  };
}

export const sampleEmailContent: EmailContent = {
  sender: {
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    avatar: 'SJ',
  },
  subject: 'Q4 Product Launch Update & Next Steps',
  timestamp: '2:30 PM',
  body: {
    intro: "Hi team! I wanted to share some exciting updates about our Q4 product launch. We've made significant progress over the past few weeks, and I'm thrilled with where we're headed.",
    quote: "Innovation distinguishes between a leader and a follower. Let's continue pushing boundaries and creating something truly remarkable.",
    content: "Based on our recent user testing, we've identified three key areas for improvement before launch. The feedback has been overwhelmingly positive, with 87% of testers indicating they would recommend our product to colleagues.",
    table: {
      headers: ['Feature', 'Status', 'Target Date'],
      rows: [
        ['User Dashboard', 'Complete', 'Oct 15'],
        ['Analytics Suite', 'In Progress', 'Oct 22'],
        ['Mobile App', 'Testing', 'Oct 29'],
      ],
    },
    list: [
      'Complete final round of user testing by October 18th',
      'Prepare marketing materials and launch campaign assets',
      'Schedule team training sessions for customer support',
      'Conduct security audit and performance optimization',
    ],
    ctaText: 'View Full Roadmap',
  },
  footer: {
    unsubscribeText: 'Unsubscribe from these updates',
    companyInfo: '© 2024 Company Inc. • 123 Innovation Drive, San Francisco, CA 94105',
  },
};
