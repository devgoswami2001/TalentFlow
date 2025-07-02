import Image from 'next/image';
import Link from 'next/link';
import { Fingerprint } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { TypingEffect } from '@/components/typing-effect';

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 bg-background">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/10 via-accent/5 to-transparent"></div>
        <div className="mx-auto w-full max-w-md rounded-2xl border border-primary/20 bg-black/20 p-8 shadow-2xl shadow-primary/10 backdrop-blur-xl">
          <div className="grid gap-2 text-center">
             <div className="flex items-center justify-center gap-3 mb-4">
              <Icons.logo className="w-10 h-10" />
              <h1 className="text-4xl font-bold font-headline text-foreground">Hyresense</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Unlock the future of recruitment. Authenticate to continue.
            </p>
          </div>

          <div className="grid gap-6 mt-8">
            <div className="grid gap-2">
              <Label htmlFor="email">Identity Signature</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-transparent focus:bg-black/20 transition-colors"
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
              <Input id="password" type="password" required className="bg-transparent focus:bg-black/20 transition-colors"/>
            </div>
            <Button type="submit" className="w-full group shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow" asChild>
              <Link href="/dashboard">
                Authenticate <Fingerprint className="w-4 h-4 ml-2 group-hover:animate-pulse transition-transform"/>
              </Link>
            </Button>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/0 px-2 text-muted-foreground backdrop-blur-sm">
                  Or use biometric
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent hover:bg-black/20 transition-colors">
              Login with Google Biometrics
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="#" className="underline font-semibold text-primary">
              Request Access Node
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative overflow-hidden group">
        <Image
          src="https://placehold.co/1200x1200"
          alt="Abstract background of a futuristic data network"
          width="1920"
          height="1080"
          data-ai-hint="futuristic data network"
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/20 to-background/50"></div>
        <div className="absolute bottom-12 left-12 p-8 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl">
            <h2 className="text-4xl font-bold text-white font-headline h-12 flex items-center">
              <TypingEffect text="The Future of Talent Acquisition." />
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
