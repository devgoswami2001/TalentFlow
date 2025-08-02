
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Briefcase,
  Users,
  Newspaper,
  Star,
  AreaChart,
  Bell,
  Bot,
  Building,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/jobs', label: 'Post Job', icon: Briefcase },
  { href: '/dashboard/applicants', label: 'Applicants', icon: Users },
  { href: '/dashboard/analyzer', label: 'AI Resume Analyzer', icon: Bot },
  { href: '/dashboard/news', label: 'News Feed', icon: Newspaper },
  { href: '/dashboard/team', label: 'HR Team', icon: Users },
  // { href: '/dashboard/talent-pool', label: 'Talent Pool', icon: Star },
  // { href: '/dashboard/reports', label: 'Reports', icon: AreaChart },
  { href: '/company', label: 'Company Profile', icon: Building },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            pathname === item.href && 'bg-muted text-primary'
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
      {/* <Link
        href="/dashboard/notifications"
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
          pathname === '/dashboard/notifications' && 'bg-muted text-primary'
        )}
      >
        <Bell className="h-4 w-4" />
        Notifications
        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
          3
        </Badge>
      </Link> */}
    </nav>
  );
}
