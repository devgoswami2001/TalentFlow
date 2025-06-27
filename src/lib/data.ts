
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

export type Job = {
    id: number;
    title: string;
    description: string;
    requiredSkills: string[];
    experienceLevel: 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead' | 'Internship';
    location: 'Remote' | 'On-site' | 'Hybrid';
    salaryMin?: number;
    salaryMax?: number;
    employmentType: 'Full-time' | 'Part-time' | 'Contract';
    applicationDeadline: Date;
    status: 'Active' | 'Draft' | 'Closed';
    datePosted: Date;
    screeningQuestions: string[];
};

export type Applicant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  jobId: number;
  jobTitle: string;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  appliedDate: string;
  resumeText: string;
  matchPercentage?: number;
};

export const jobs: Job[] = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        description: `We are looking for an experienced Senior Frontend Developer to join our team. Responsibilities include developing new user-facing features, building reusable components, and optimizing applications for maximum speed and scalability. Required skills: React, TypeScript, Next.js, Tailwind CSS, and strong understanding of web performance.`,
        requiredSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Web Performance'],
        experienceLevel: 'Senior',
        location: 'Remote',
        salaryMin: 120000,
        salaryMax: 150000,
        employmentType: 'Full-time',
        applicationDeadline: new Date('2025-08-30'),
        status: 'Active',
        datePosted: new Date('2025-07-01'),
        screeningQuestions: [
            'Describe a challenging project you worked on with Next.js.',
            'How do you approach web performance optimization?'
        ]
    },
    {
        id: 2,
        title: 'Product Manager',
        description: `We are seeking a talented Product Manager to lead the development of our core products. You will be responsible for the product planning and execution throughout the Product Lifecycle, including gathering and prioritizing product and customer requirements. Required skills: Product strategy, roadmap planning, user research, agile methodologies, and excellent communication skills.`,
        requiredSkills: ['Product Strategy', 'Roadmap Planning', 'User Research', 'Agile Methodologies', 'Communication'],
        experienceLevel: 'Mid-level',
        location: 'On-site',
        employmentType: 'Full-time',
        applicationDeadline: new Date('2025-08-15'),
        status: 'Active',
        datePosted: new Date('2025-06-25'),
        screeningQuestions: []
    },
    {
        id: 3,
        title: 'UX Designer',
        description: `We're hiring a UX Designer to create satisfying and compelling experiences for the users of our products. You'll be working on user flows, wireframes, prototypes, and conducting user research. Required skills: Figma, Sketch, user-centered design principles, prototyping, and collaboration with product and engineering teams.`,
        requiredSkills: ['Figma', 'Sketch', 'User-Centered Design', 'Prototyping'],
        experienceLevel: 'Mid-level',
        location: 'Hybrid',
        employmentType: 'Contract',
        applicationDeadline: new Date('2025-08-10'),
        status: 'Closed',
        datePosted: new Date('2025-06-10'),
        screeningQuestions: ['Please provide a link to your portfolio.']
    },
    {
        id: 4,
        title: 'Marketing Intern',
        description: 'Join our marketing team as an intern and gain hands-on experience in digital marketing, content creation, and social media management.',
        requiredSkills: ['Social Media', 'Content Writing', 'SEO Basics'],
        experienceLevel: 'Internship',
        location: 'Remote',
        employmentType: 'Part-time',
        applicationDeadline: new Date('2025-09-01'),
        status: 'Draft',
        datePosted: new Date('2025-07-25'),
        screeningQuestions: ['What are your favorite marketing campaigns and why?']
    }
];

export const applicants: Applicant[] = [
  {
    id: 1,
    name: 'Liam Johnson',
    email: 'liam@example.com',
    phone: '123-456-7890',
    avatar: 'https://placehold.co/40x40',
    jobId: 1,
    jobTitle: 'Senior Frontend Developer',
    status: 'Interview',
    appliedDate: '2025-07-15T00:00:00Z',
    matchPercentage: 92,
    resumeText: `Liam Johnson - Senior Frontend Developer
    ---
    Experience:
    - 5+ years of experience in frontend development.
    - Proficient in React, TypeScript, and Next.js.
    - Extensive experience with Tailwind CSS for rapid UI development.
    - Focused on web performance and building scalable applications.
    - Built and maintained component libraries for design systems.
    ---
    Skills: React, TypeScript, Next.js, Tailwind CSS, Web Performance, JavaScript, HTML, CSS`
  },
  {
    id: 2,
    name: 'Olivia Smith',
    email: 'olivia@example.com',
    phone: '123-456-7891',
    avatar: 'https://placehold.co/40x40',
    jobId: 2,
    jobTitle: 'Product Manager',
    status: 'Shortlisted',
    appliedDate: '2025-07-12T00:00:00Z',
    matchPercentage: 85,
    resumeText: `Olivia Smith - Product Manager
    ---
    Summary:
    A data-driven Product Manager with a knack for user-centric design.
    ---
    Experience:
    - Led product strategy and roadmap planning for B2B SaaS products.
    - Conducted extensive user research to validate hypotheses.
    - Worked closely with engineering teams in an agile environment.
    - Strong communicator and team collaborator.
    ---
    Skills: Product Strategy, Roadmap Planning, User Research, Agile Methodologies, JIRA, Communication`
  },
  {
    id: 3,
    name: 'Noah Williams',
    email: 'noah@example.com',
    phone: '123-456-7892',
    avatar: 'https://placehold.co/40x40',
    jobId: 3,
    jobTitle: 'UX Designer',
    status: 'Applied',
    appliedDate: '2025-07-20T00:00:00Z',
    matchPercentage: 78,
    resumeText: `Noah Williams - UX Designer
    ---
    Portfolio: noahwilliams.design
    ---
    Experience:
    - Designed user flows and wireframes for mobile and web applications.
    - Created high-fidelity prototypes using Figma and Sketch.
    - Collaborated with product and engineering teams to deliver intuitive user interfaces.
    ---
    Skills: Figma, Prototyping, User-Centered Design, Wireframing, User Flows, Collaboration`
  },
  {
    id: 4,
    name: 'Emma Brown',
    email: 'emma@example.com',
    phone: '123-456-7893',
    avatar: 'https://placehold.co/40x40',
    jobId: 1,
    jobTitle: 'Senior Frontend Developer',
    status: 'Applied',
    appliedDate: '2025-07-18T00:00:00Z',
    resumeText: `Emma Brown - Frontend Developer
    ---
    Experience:
    - 3 years of experience with React and JavaScript.
    - Some experience with TypeScript.
    - Built responsive websites using CSS and HTML.
    ---
    Skills: React, JavaScript, HTML, CSS`
  },
  {
    id: 5,
    name: 'James Wilson',
    email: 'james@example.com',
    phone: '123-456-7894',
    avatar: 'https://placehold.co/40x40',
    jobId: 1,
    jobTitle: 'Senior Frontend Developer',
    status: 'Applied',
    appliedDate: '2025-07-22T00:00:00Z',
    resumeText: `James Wilson - Frontend Engineer
    ---
    Experience:
    - Developed and maintained responsive web applications using React and Redux.
    - Collaborated with designers to implement UI features.
    ---
    Skills: React, Redux, JavaScript, HTML, CSS, Git`
  }
];


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
        target: 'Job #1 - Senior Frontend Developer',
        details: 'Created a new job posting for a senior frontend developer.',
        timestamp: '2025-06-26 10:00:00',
    },
    {
        log_id: 202,
        action: 'Edited applicant status',
        performed_by: 'ritika@hyresense.com',
        target: 'Applicant #3 - Noah Williams',
        details: "Changed status from 'Applied' to 'Shortlisted'",
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
