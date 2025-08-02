

export type User = {
  id: number;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  full_name: string;
  role: string;
  status: 'active' | 'inactive'; // Derived from is_active if available
  avatar: string; // Mocked
  can_post_jobs: boolean;
  can_view_applicants: boolean;
  can_edit_profile: boolean;
  can_post_feed: boolean;
  can_manage_team: boolean;
};

export type ScreeningQuestion = {
  question: string;
  type: 'text' | 'boolean';
};

// This type now reflects the API response structure for both list and detail views
export type Job = {
    id: number;
    title: string;
    description: string;
    requiredSkills: string[]; // maps to required_skills
    experienceLevel: 'Entry-level' | 'Mid-level' | 'Senior-level' | 'Lead' | 'Internship'; // maps to experience_level
    workingMode: 'Remote' | 'On-site' | 'Hybrid'; // maps to working_mode
    location: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    employmentType: 'Full-time' | 'Part-time' | 'Contract'; // maps to employment_type
    applicationDeadline: Date | string; // maps to deadline
    status: 'Active' | 'Draft' | 'Closed';
    is_active?: boolean;
    datePosted: Date | string; // maps to created_at
    screeningQuestions: ScreeningQuestion[];
    applications_count?: number; 
};


export type Note = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
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
  notes?: Note[];
};

export type CompanyProfile = {
  id: number;
  company_name: string;
  description: string;
  website: string;
  logo: string; // Mapped from logo_url
  banner: string | null; // Mapped from banner_url
  designation: string;
  active_jobs_count: number;
  total_applications_count: number;
  followers_count: number;
};


// This mock data is no longer used by the JobManagement component but is kept for other parts of the app.
export const jobs: Job[] = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        description: `We are looking for an experienced Senior Frontend Developer to join our team. Responsibilities include developing new user-facing features, building reusable components, and optimizing applications for maximum speed and scalability. Required skills: React, TypeScript, Next.js, Tailwind CSS, and strong understanding of web performance.`,
        requiredSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Web Performance'],
        experienceLevel: 'Senior-level',
        workingMode: 'Remote',
        location: 'Global',
        salaryMin: 120000,
        salaryMax: 150000,
        employmentType: 'Full-time',
        applicationDeadline: new Date('2025-08-30'),
        status: 'Active',
        is_active: true,
        datePosted: new Date('2025-07-01'),
        screeningQuestions: [
            { question: 'Describe a challenging project you worked on with Next.js.', type: 'text'},
            { question: 'How do you approach web performance optimization?', type: 'text'}
        ]
    },
    {
        id: 2,
        title: 'Product Manager',
        description: `We are seeking a talented Product Manager to lead the development of our core products. You will be responsible for the product planning and execution throughout the Product Lifecycle, including gathering and prioritizing product and customer requirements. Required skills: Product strategy, roadmap planning, user research, agile methodologies, and excellent communication skills.`,
        requiredSkills: ['Product Strategy', 'Roadmap Planning', 'User Research', 'Agile Methodologies', 'Communication'],
        experienceLevel: 'Mid-level',
        workingMode: 'On-site',
        location: 'San Francisco, USA',
        employmentType: 'Full-time',
        applicationDeadline: new Date('2025-08-15'),
        status: 'Active',
        is_active: true,
        datePosted: new Date('2025-06-25'),
        screeningQuestions: []
    },
    {
        id: 3,
        title: 'UX Designer',
        description: `We're hiring a UX Designer to create satisfying and compelling experiences for the users of our products. You'll be working on user flows, wireframes, prototypes, and conducting user research. Required skills: Figma, Sketch, user-centered design principles, prototyping, and collaboration with product and engineering teams.`,
        requiredSkills: ['Figma', 'Sketch', 'User-Centered Design', 'Prototyping'],
        experienceLevel: 'Mid-level',
        workingMode: 'Hybrid',
        location: 'New York, USA',
        employmentType: 'Contract',
        applicationDeadline: new Date('2025-08-10'),
        status: 'Closed',
        is_active: false,
        datePosted: new Date('2025-06-10'),
        screeningQuestions: [{ question: 'Please provide a link to your portfolio.', type: 'text' }]
    },
    {
        id: 4,
        title: 'Marketing Intern',
        description: 'Join our marketing team as an intern and gain hands-on experience in digital marketing, content creation, and social media management.',
        requiredSkills: ['Social Media', 'Content Writing', 'SEO Basics'],
        experienceLevel: 'Internship',
        workingMode: 'Remote',
        location: 'Global',
        employmentType: 'Part-time',
        applicationDeadline: new Date('2025-09-01'),
        status: 'Draft',
        is_active: false,
        datePosted: new Date('2025-07-25'),
        screeningQuestions: [{ question: 'What are your favorite marketing campaigns and why?', type: 'text'}]
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
    Skills: React, TypeScript, Next.js, Tailwind CSS, Web Performance, JavaScript, HTML, CSS`,
    notes: [
      {
        id: 1,
        author: 'Ritika Mehra',
        content: 'Strong technical skills in the phone screen. Seems like a great culture fit. Proceeding to technical interview.',
        timestamp: '2025-07-16T14:30:00Z'
      }
    ]
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
    Skills: Product Strategy, Roadmap Planning, User Research, Agile Methodologies, JIRA, Communication`,
    notes: []
  },
  {
    id: 3,
    name: 'Noah Williams',
    email: 'noah@example.com',
    phone: '123-456-7892',
    avatar: 'https://placehold.co/40x40',
    jobId: 3,
    jobTitle: 'UX Designer',
    status: 'Hired',
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
    status: 'Rejected',
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

export type NewsPost = {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  video_url?: string | null;
  external_link?: string | null;
  created_at: string;
  updated_at: string;
  company_name: string;
  category: "Hiring Announcements" | "Company Culture" | "Industry News" | "Job Fairs / Events";
  visibility: "public" | "internal";
};


export const newsPosts: NewsPost[] = [
    {
        id: 1,
        title: "We're excited to announce our new funding round!",
        content: "We have successfully closed a new funding round, which will help us accelerate our growth and continue to build the future of recruitment. We're grateful to our investors and our amazing team for making this possible. This new capital will be used to expand our engineering team, invest in new AI capabilities, and grow our market presence.",
        image: "https://placehold.co/800x450",
        created_at: "2025-07-28T10:00:00Z",
        updated_at: "2025-07-28T10:00:00Z",
        category: "Company Culture",
        visibility: "public",
        company_name: "Hyresense"
    },
    {
        id: 2,
        title: "Meet the new members of our team",
        content: "We're thrilled to welcome three new members to the Hyresense family! Say hello to Alice (Product), Bob (Engineering), and Charlie (Marketing). They bring a wealth of experience and new perspectives to our team. We're excited to see the amazing things they'll accomplish.",
        image: "https://placehold.co/800x450",
        created_at: "2025-07-25T09:00:00Z",
        updated_at: "2025-07-25T09:00:00Z",
        category: "Hiring Announcements",
        visibility: "internal",
        company_name: "Hyresense"
    },
];
    
