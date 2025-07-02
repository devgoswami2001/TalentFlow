import Image from 'next/image';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { TypingEffect } from '@/components/typing-effect';

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 bg-background">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-accent/10 via-transparent to-transparent"></div>
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border/20 bg-background/60 p-8 shadow-2xl backdrop-blur-lg">
          <div className="grid gap-2 text-center">
             <div className="flex items-center justify-center gap-3 mb-4">
              <Icons.logo className="w-10 h-10" />
              <h1 className="text-4xl font-bold font-headline text-foreground">Hyresense</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Unlock the future of recruitment. Sign in to continue.
            </p>
          </div>

          <div className="grid gap-6 mt-8">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-background/70 focus:bg-background transition-colors"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" required className="bg-background/70 focus:bg-background transition-colors"/>
            </div>
            <Button type="submit" className="w-full group shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow" asChild>
              <Link href="/dashboard">
                Secure Login <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"/>
              </Link>
            </Button>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/0 px-2 text-muted-foreground backdrop-blur-sm">
                  Or continue with
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-background/70 hover:bg-background transition-colors">
              Login with Google
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="#" className="underline font-semibold text-primary">
              Request Access
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative overflow-hidden group">
        <Image
          src="https://placehold.co/1200x1200"
          alt="Futuristic abstract background"
          width="1920"
          height="1080"
          data-ai-hint="futuristic technology abstract"
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-background/50"></div>
        <div className="absolute bottom-12 left-12 p-8 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 shadow-2xl">
            <h2 className="text-4xl font-bold text-white font-headline h-12 flex items-center">
              <TypingEffect text="AI-Powered Hiring." />
              <span className="animate-pulse text-2xl ml-1">_</span>
            </h2>
            <p className="text-primary-foreground/80 mt-2 max-w-md">
                Intelligent insights for a smarter recruitment pipeline that helps you find the best talent, faster.
            </p>
        </div>
      </div>
    </div>
  );
}
