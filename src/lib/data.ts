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
