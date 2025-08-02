
"use client";import Image from 'next/image';
import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Fingerprint } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const registerFormSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  username: z.string().min(3, "Username must be at least 3 characters."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
});

const otpFormSchema = z.object({
    otp: z.string().min(6, "OTP must be 6 characters.").max(6, "OTP must be 6 characters."),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;
type OtpFormValues = z.infer<typeof otpFormSchema>;

export default function RegisterPage() {
  const [registrationStep, setRegistrationStep] = React.useState<'details' | 'otp' | 'success'>('details');
  const [userEmail, setUserEmail] = React.useState('');
  const { toast } = useToast();

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
        otp: "",
    },
  });

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      // Step 1: Register the user
      const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/register/employer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.message || "An unknown registration error occurred.");
      }
      
      setUserEmail(data.email);

      // Step 2: Generate OTP
      const otpResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/otp/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email }),
      });

      if (!otpResponse.ok) {
          const errorData = await otpResponse.json();
          throw new Error(errorData.message || "Failed to generate OTP.");
      }

      toast({
        title: "OTP Sent",
        description: "An OTP has been sent to your email address.",
      });

      setRegistrationStep('otp');

    } catch (error: any) {
       toast({
            variant: "destructive",
            title: "Registration Failed",
            description: error.message || "Could not connect to the server. Please check your connection and try again.",
        });
    }
  };
  
   const onOtpSubmit = async (data: OtpFormValues) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/otp/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, otp_code: data.otp }),
        });

        if (response.ok) {
            setRegistrationStep('success');
        } else {
            const errorData = await response.json();
            toast({
                variant: "destructive",
                title: "Verification Failed",
                description: errorData.message || "Invalid OTP. Please try again.",
            });
        }
    } catch (error) {
       toast({
            variant: "destructive",
            title: "Verification Failed",
            description: "Could not connect to the server. Please check your connection and try again.",
        });
    }
  };

  const renderFormContent = () => {
    switch (registrationStep) {
        case 'details':
            return (
                 <div className="mx-auto w-full max-w-md rounded-2xl border border-primary/30 bg-background/50 p-8 shadow-2xl shadow-primary/20 backdrop-blur-xl">
                    <div className="grid gap-2 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4 group">
                        <Image src="/logo.png" alt="HyreSense Logo" width={60} height={45} className="transition-transform group-hover:scale-105 duration-300" />
                        <h1 className="text-4xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-shine [background-size:200%_auto] transition-all group-hover:brightness-110 duration-300">hyreSENSE</h1>
                        </div>
                        <CardDescription className="text-balance text-muted-foreground">
                        Request access to the future of recruitment.
                        </CardDescription>
                    </div>

                    <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="grid gap-4 mt-8">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={registerForm.control}
                                    name="first_name"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                        <Input placeholder="Ritika" {...field} className="bg-transparent focus:bg-background/80 transition-colors" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="last_name"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                        <Input placeholder="Mehra" {...field} className="bg-transparent focus:bg-background/80 transition-colors" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={registerForm.control}
                                name="username"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                    <Input placeholder="ritika.m" {...field} className="bg-transparent focus:bg-background/80 transition-colors" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Email</FormLabel>
                                    <FormControl>
                                    <Input type="email" placeholder="you@company.com" {...field} className="bg-transparent focus:bg-background/80 transition-colors" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="password"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                    <Input type="password" {...field} className="bg-transparent focus:bg-background/80 transition-colors" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            
                            <Button type="submit" className="w-full group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/50 transition-shadow mt-4" disabled={registerForm.formState.isSubmitting}>
                                {registerForm.formState.isSubmitting ? "Submitting..." : "Request Access"}
                                <Fingerprint className="w-4 h-4 ml-2 group-hover:animate-pulse transition-transform"/>
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center text-sm">
                        Already have an account?{' '}
                        <Link href="/" className="underline font-semibold text-primary">
                        Login
                        </Link>
                    </div>
                </div>
            )
        case 'otp':
             return (
                <Card className="w-full rounded-2xl border border-primary/30 bg-background/50 p-8 shadow-2xl shadow-primary/20 backdrop-blur-xl">
                    <CardHeader className="items-center text-center">
                        <CardTitle className="font-headline text-2xl">Email Verification</CardTitle>
                        <CardDescription>
                            Please enter the 6-digit OTP sent to {userEmail}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...otpForm}>
                            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                                <FormField
                                    control={otpForm.control}
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>One-Time Password</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="text-center text-lg tracking-[0.5em]" maxLength={6} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={otpForm.formState.isSubmitting}>
                                    {otpForm.formState.isSubmitting ? "Verifying..." : "Verify"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex-col text-sm text-center">
                        <p className="text-muted-foreground">
                            Didn't receive an OTP?
                        </p>
                        <Button variant="link" size="sm" onClick={() => onRegisterSubmit(registerForm.getValues())} disabled={registerForm.formState.isSubmitting}>
                            Resend OTP
                        </Button>
                    </CardFooter>
                </Card>
            );
        case 'success':
            return (
                 <Card className="w-full rounded-2xl border border-primary/30 bg-background/50 p-8 shadow-2xl shadow-primary/20 backdrop-blur-xl">
                     <CardHeader className="items-center text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <CardTitle className="font-headline text-2xl">Registration Request Received</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-center text-muted-foreground">
                            Thank you for your interest in Hyresense. Your request has been submitted successfully. Our company associate will contact you shortly to complete the verification process.
                        </p>
                     </CardContent>
                     <CardFooter className="flex justify-center">
                        <Button asChild>
                            <Link href="/">Back to Login</Link>
                        </Button>
                     </CardFooter>
                 </Card>
            )
    }
  }


  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative w-full max-w-lg">
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/20 via-accent/10 to-transparent"></div>
        {renderFormContent()}
      </div>
    </div>
  );
}

    