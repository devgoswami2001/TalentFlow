"use client";
import Image from 'next/image';
import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Fingerprint } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const registerFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters."),
  companyEmail: z.string().email("Please enter a valid company email."),
  fullName: z.string().min(2, "Please enter your full name."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  profilePicture: z.instanceof(File).optional(),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      companyName: "",
      companyEmail: "",
      fullName: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log("Registration data submitted:", data);
    // In a real app, you would send this data to your backend.
    setIsSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative w-full max-w-lg">
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/20 via-accent/10 to-transparent"></div>
        
        {isSubmitted ? (
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
        ) : (
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

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 mt-8">
                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Your Company Inc." {...field} className="bg-transparent focus:bg-background/80 transition-colors" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Ritika Mehra" {...field} className="bg-transparent focus:bg-background/80 transition-colors" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="companyEmail"
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
                        control={form.control}
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
                     <FormField
                        control={form.control}
                        name="profilePicture"
                        render={({ field: { onChange, value, ...rest }}) => (
                            <FormItem>
                                <FormLabel>Profile Picture</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="file" 
                                        accept="image/png, image/jpeg"
                                        onChange={(e) => onChange(e.target.files?.[0])}
                                        {...rest}
                                        className="bg-transparent focus:bg-background/80 transition-colors file:text-primary file:font-semibold"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/50 transition-shadow mt-4">
                        Request Access <Fingerprint className="w-4 h-4 ml-2 group-hover:animate-pulse transition-transform"/>
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
        )}
      </div>
    </div>
  );
}
