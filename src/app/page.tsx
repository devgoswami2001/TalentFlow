

"use client";
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fingerprint } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { TypingEffect } from '@/components/typing-effect';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const setCookie = (name: string, value: string, days: number) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const checkProfileAndRedirect = async (accessToken: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/check-profile/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            // If the check fails, assume profile needs to be created or another error occurred.
            // For simplicity, we'll redirect to create profile.
            // A more robust implementation would handle different error statuses.
            router.push('/onboarding/create-profile');
            return;
        }

        const data = await response.json();

        if (data.has_employer_profile) {
            router.push('/dashboard');
        } else {
            router.push('/onboarding/create-profile');
        }

    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Profile Check Failed',
            description: 'Could not verify your profile status. Please try logging in again.',
        });
        // Clear tokens if check fails catastrophically
        setCookie('accessToken', '', -1);
        setCookie('refreshToken', '', -1);
    }
  }


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed. Please check your credentials.');
      }

      const data = await response.json();

      if (data.access && data.refresh) {
        setCookie('accessToken', data.access, 7); // Store for 7 days
        setCookie('refreshToken', data.refresh, 30); // Store for 30 days
        
        toast({
          title: "Authentication Successful",
          description: "Welcome back! Checking your profile status.",
        });
        
        await checkProfileAndRedirect(data.access);

      } else {
        throw new Error('Tokens not found in login response.');
      }

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 bg-background">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/20 via-accent/10 to-transparent"></div>
        <div className="mx-auto w-full max-w-md rounded-2xl border border-primary/30 bg-background/50 p-8 shadow-2xl shadow-primary/20 backdrop-blur-xl">
          <div className="grid gap-2 text-center">
             <div className="flex items-center justify-center gap-3 mb-4 group">
              <Image src="/logo.png" alt="HyreSense Logo" width={60} height={45} className="transition-transform group-hover:scale-105 duration-300" />
              <h1 className="text-4xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-shine [background-size:200%_auto] transition-all group-hover:brightness-110 duration-300">hyreSENSE</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Unlock the future of recruitment. Authenticate to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="grid gap-6 mt-8">
            <div className="grid gap-2">
              <Label htmlFor="email">Identity Signature</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-transparent focus:bg-background/80 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Passkey</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm text-primary hover:underline"
                >
                  Forgot passkey?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                className="bg-transparent focus:bg-background/80 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/50 transition-shadow" disabled={isLoading}>
                {isLoading ? 'Authenticating...' : 'Authenticate'}
                <Fingerprint className="w-4 h-4 ml-2 group-hover:animate-pulse transition-transform"/>
            </Button>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/80 px-2 text-muted-foreground backdrop-blur-sm">
                  Or continue with
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent hover:bg-primary/10 hover:border-primary/30 transition-colors" disabled={isLoading}>
              Login with Google
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline font-semibold text-primary">
              Request Access Node
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative overflow-hidden bg-background">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent"></div>

        {/* Animated nodes */}
        <div className="absolute inset-0">
          <div className="absolute top-[10%] left-[20%] h-2 w-2 rounded-full bg-primary animate-pulse"></div>
          <div className="absolute top-[50%] left-[50%] h-3 w-3 rounded-full bg-accent animate-pulse [animation-delay:-0.5s]"></div>
          <div className="absolute top-[80%] left-[10%] h-1.5 w-1.5 rounded-full bg-primary/50 animate-pulse [animation-delay:-1s]"></div>
          <div className="absolute top-[30%] left-[85%] h-2.5 w-2.5 rounded-full bg-accent/70 animate-pulse [animation-delay:-0.7s]"></div>
          <div className="absolute top-[65%] left-[70%] h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:-0.3s]"></div>
          <div className="absolute bottom-[5%] right-[30%] h-2 w-2 rounded-full bg-primary/80 animate-pulse [animation-delay:-1.2s]"></div>
        </div>

        {/* Content Box */}
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="p-8 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 shadow-2xl shadow-primary/20 max-w-2xl text-center">
              <h2 className="text-4xl font-bold text-white font-headline h-12 flex items-center justify-center">
                <TypingEffect text="The Future of Talent Acquisition." />
                <span className="animate-pulse text-2xl ml-1">_</span>
              </h2>
              <p className="text-primary-foreground/80 mt-4 text-lg text-white">
                  Intelligent insights for a smarter recruitment pipeline that helps you find the best talent, faster.
              </p>
          </div>
        </div>
      </div>
    </div>
  );
}
