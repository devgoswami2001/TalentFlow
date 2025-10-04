import Link from 'next/link';
import { Menu, Search } from 'lucide-react';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { DashboardNav } from '@/components/dashboard-nav';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { UserNav } from '@/components/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';

type User = {
  name: string;
  email: string;
  logo_url: string;
  initials: string;
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  let user: User | null = null;

  if (accessToken) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/employer/me/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: 'no-store',
        }
      );
      if (response.ok) {
        const data = await response.json();

        const name = data.company_name || 'HR Admin';
        const initials = name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();

        user = {
          name: name,
          email: data.user_email || '', // fallback
          logo_url: data.company_logo || '', // ✅ take logo from API
          initials: initials,
        };
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // user remains null if API call fails
    }
  }

  const defaultUser: User = {
    name: 'HR Admin',
    email: '',
    logo_url: '',
    initials: 'HR',
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 group"
            >
              <Image src="/logo.png" alt="HyreSense Logo" width={40} height={28} className="transition-transform group-hover:scale-105 duration-300" />
              <span className="text-2xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-shine [background-size:200%_auto] transition-all group-hover:brightness-110 duration-300">
                hyreSense
              </span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <DashboardNav />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 group"
                >
                  <Icons.logo className="h-8 w-8 transition-transform group-hover:scale-105 duration-300" />
                  <span className="text-2xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-shine [background-size:200%_auto] transition-all group-hover:brightness-110 duration-300">
                    Hyresense
                  </span>
                </Link>
              </div>
              <nav className="grid gap-2 text-lg font-medium p-4">
                <DashboardNav />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
          </div>
          <ThemeToggle />
          <UserNav user={user || defaultUser} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
