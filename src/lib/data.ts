export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'HR Recruiter' | 'Intern';
  status: 'active' | 'inactive';
  avatar: string;
};

export type ActivityLog = {
    log_id: number;
    action: string;
    performed_by: string;
    target: string;
    details: string;
    timestamp: string;
};

export const users: User[] = [
  {
    id: 101,
    name: 'Ritika Mehra',
    email: 'ritika@hyresense.com',
    phone: '9876543210',
    role: 'HR Recruiter',
    status: 'active',
    avatar: 'https://placehold.co/40x40',
  },
  {
    id: 102,
    name: 'Manoj Verma',
    email: 'manoj@hyresense.com',
    phone: '9876543211',
    role: 'Intern',
    status: 'active',
    avatar: 'https://placehold.co/40x40',
  },
  {
    id: 103,
    name: 'Admin User',
    email: 'admin@hyresense.com',
    phone: '9876543212',
    role: 'Admin',
    status: 'active',
    avatar: 'https://placehold.co/40x40',
  },
  {
    id: 104,
    name: 'Inactive User',
    email: 'inactive@hyresense.com',
    phone: '9876543213',
    role: 'HR Recruiter',
    status: 'inactive',
    avatar: 'https://placehold.co/40x40',
  }
];

export const activityLogs: ActivityLog[] = [
    {
        log_id: 201,
        action: 'Job posted',
        performed_by: 'ritika@hyresense.com',
        target: 'Job #123 - Senior Frontend Developer',
        details: 'Created a new job posting for a senior frontend developer.',
        timestamp: '2025-06-26 10:00:00',
    },
    {
        log_id: 202,
        action: 'Edited applicant status',
        performed_by: 'ritika@hyresense.com',
        target: 'Applicant #345 - Rohan Sharma',
        details: "Changed status from 'Interviewed' to 'Selected'",
        timestamp: '2025-06-26 11:04:20',
    },
    {
        log_id: 203,
        action: 'User created',
        performed_by: 'admin@hyresense.com',
        target: 'User #102 - Manoj Verma',
        details: 'Created a new user with the role of Intern.',
        timestamp: '2025-06-26 09:30:00',
    },
    {
        log_id: 204,
        action: 'Role changed',
        performed_by: 'admin@hyresense.com',
        target: 'User #102 - Manoj Verma',
        details: "Changed role from 'Intern' to 'HR Recruiter'",
        timestamp: '2025-06-27 14:00:00',
    },
    {
        log_id: 205,
        action: 'User deactivated',
        performed_by: 'admin@hyresense.com',
        target: 'User #104 - Inactive User',
        details: 'Deactivated user account.',
        timestamp: '2025-06-27 15:12:00',
    }
]

export type NewsPost = {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  externalLink?: string;
  category: "Hiring Announcements" | "Company Culture" | "Industry News" | "Job Fairs / Events";
  visibility: "Public" | "Internal";
  author: string;
  timestamp: string;
}

export const newsPosts: NewsPost[] = [
    {
        id: 1,
        title: "New Senior Product Designer Role Open!",
        content: "We are excited to announce a new opening for a Senior Product Designer to join our growing team. We are looking for a creative and passionate individual to help shape the future of Hyresense. Apply now through our careers page!",
        imageUrl: "https://placehold.co/800x400",
        externalLink: "#",
        category: "Hiring Announcements",
        visibility: "Public",
        author: "Ritika Mehra",
        timestamp: "2025-07-20T10:00:00Z"
    },
    {
        id: 2,
        title: "Our Annual Team Retreat in the Mountains",
        content: "This year's team retreat was a huge success! We spent three days in the serene mountains, focusing on team-building, brainstorming for the upcoming quarter, and of course, having a lot of fun. Check out some of the highlights!",
        imageUrl: "https://placehold.co/800x400",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        category: "Company Culture",
        visibility: "Internal",
        author: "Admin User",
        timestamp: "2025-07-18T15:30:00Z"
    },
    {
        id: 3,
        title: "Meet Us at the National Tech Job Fair 2025",
        content: "Hyresense will be at the National Tech Job Fair next month! Visit our booth (#24B) to learn about our open roles and what it's like to work with us. We can't wait to meet you.",
        externalLink: "#",
        category: "Job Fairs / Events",
        visibility: "Public",
        author: "Ritika Mehra",
        timestamp: "2025-07-15T09:00:00Z"
    }
];
