

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MoreHorizontal, PlusCircle, AlertTriangle, Loader2, User as UserIcon } from "lucide-react";
import { type User } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { createHrUser, getHrUsers, updateHrUser, deleteHrUser } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "./ui/switch";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";


const userFormSchema = z.object({
  id: z.number().optional(),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, "Password must be at least 8 characters.").optional().or(z.literal('')),
  first_name: z.string().min(2, "First name is required."),
  last_name: z.string().min(2, "Last name is required."),
  role: z.enum(['HR Manager', 'Recruiter', 'Interviewer'], {
    required_error: "You need to select a role.",
  }),
  can_post_jobs: z.boolean().default(false),
  can_view_applicants: z.boolean().default(true),
  can_edit_profile: z.boolean().default(false),
  can_post_feed: z.boolean().default(false),
  can_manage_team: z.boolean().default(false),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UserFormDialog = ({ 
    isOpen, 
    onOpenChange, 
    form, 
    onSubmit,
    editingUser,
}: { 
    isOpen: boolean, 
    onOpenChange: (isOpen: boolean) => void, 
    form: ReturnType<typeof useForm<UserFormValues>>, 
    onSubmit: (data: UserFormValues) => void,
    editingUser: User | null,
}) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit HR User' : 'Add New HR User'}</DialogTitle>
            <DialogDescription>
                {editingUser ? "Update the details for this user." : "Fill in the details to invite a new user to your team."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                        <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                        <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                            </FormControl>
                             <SelectContent>
                                <SelectItem value="HR Manager">HR Manager</SelectItem>
                                <SelectItem value="Recruiter">HR Recruiter</SelectItem>
                                <SelectItem value="Interviewer">Interviewer</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                        <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                         <FormDescription>{editingUser ? 'Leave blank to keep current password.' : 'A temporary password for the user.'}</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <div className="space-y-4 rounded-md border p-4">
                  <h4 className="text-sm font-medium">Permissions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <FormField
                          control={form.control}
                          name="can_post_jobs"
                          render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <FormLabel className="text-sm font-normal">Post Jobs</FormLabel>
                              <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                          </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name="can_view_applicants"
                          render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <FormLabel className="text-sm font-normal">View Applicants</FormLabel>
                              <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                          </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name="can_edit_profile"
                          render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <FormLabel className="text-sm font-normal">Edit Profile</FormLabel>
                              <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                          </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name="can_post_feed"
                          render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <FormLabel className="text-sm font-normal">Post to Feed</FormLabel>
                              <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                          </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name="can_manage_team"
                          render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <FormLabel className="text-sm font-normal">Manage Team</FormLabel>
                              <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                          </FormItem>
                          )}
                      />
                  </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {form.formState.isSubmitting ? "Saving..." : (editingUser ? "Save Changes" : "Create User")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
);

const mapApiToUiUser = (apiUser: any): User => {
    return {
        id: apiUser.id,
        full_name: apiUser.full_name,
        user_email: apiUser.user_email,
        user_first_name: apiUser.user_first_name || '',
        user_last_name: apiUser.user_last_name || '',
        username: apiUser.username,
        role: apiUser.role,
        status: 'active',
        avatar: apiUser.avatar, // API should provide an avatar URL
        can_post_jobs: apiUser.can_post_jobs,
        can_view_applicants: apiUser.can_view_applicants,
        can_edit_profile: apiUser.can_edit_profile,
        can_post_feed: apiUser.can_post_feed,
        can_manage_team: apiUser.can_manage_team,
    };
};

export function HRTeamManagement() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = React.useCallback(async () => {
    setIsLoading(true);
    const result = await getHrUsers();
    if (result.success && Array.isArray(result.data)) {
        setUsers(result.data.map(mapApiToUiUser));
    } else {
        setError(result.error || "Failed to load HR users.");
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
  });

  const handleOpenFormDialog = (user: User | null = null) => {
    setEditingUser(user);
    if (user) {
        form.reset({
            id: user.id,
            email: user.user_email,
            password: "",
            first_name: user.user_first_name || '',
            last_name: user.user_last_name || '',
            role: user.role as UserFormValues['role'],
            can_post_jobs: user.can_post_jobs,
            can_view_applicants: user.can_view_applicants,
            can_edit_profile: user.can_edit_profile,
            can_post_feed: user.can_post_feed,
            can_manage_team: user.can_manage_team,
        });
    } else {
        form.reset({
            id: undefined,
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            role: "Recruiter",
            can_post_jobs: true,
            can_view_applicants: true,
            can_edit_profile: false,
            can_post_feed: true,
            can_manage_team: false,
        });
    }
    setIsFormOpen(true);
  };

  const onSubmit = async (data: UserFormValues) => {
    form.clearErrors();
    const isUpdate = !!editingUser;
    const result = isUpdate && editingUser
      ? await updateHrUser(editingUser.id, data)
      : await createHrUser(data);

    if (result.success && result.data) {
        const resultMessage = result.message || (isUpdate ? "User updated successfully" : "User created successfully");
        toast({ title: resultMessage });
        setIsFormOpen(false);
        setEditingUser(null);
        await fetchUsers(); // Re-fetch the list to show changes
    } else {
        const resultMessage = result.message || (isUpdate ? "Update Failed" : "Creation Failed");
        toast({ variant: "destructive", title: resultMessage });
        if (result.errors) {
            for (const [field, messages] of Object.entries(result.errors)) {
                 if (field in userFormSchema.shape) {
                    form.setError(field as keyof UserFormValues, {
                        type: "manual",
                        message: (messages as string[]).join(", "),
                    });
                 }
            }
        }
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const result = await deleteHrUser(userId);
    if (result.success) {
      setUsers(users.filter(u => u.id !== userId));
      toast({ title: "User Deleted", description: result.message || "The user has been removed successfully." });
    } else {
      toast({ variant: "destructive", title: "Deletion Failed", description: result.error });
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="h-8 gap-1" onClick={() => handleOpenFormDialog()}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add HR User
            </span>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">HR Team Members</CardTitle>
          <CardDescription>
            Manage your team members and their roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
              <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-1/4" />
                              <Skeleton className="h-3 w-2/4" />
                          </div>
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-6 w-20" />
                      </div>
                  ))}
              </div>
          ) : error ? (
               <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error Loading Users</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
              </Alert>
          ) : (
              <Table>
              <TableHeader>
                  <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                      <span className="sr-only">Actions</span>
                  </TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {users.map((user) => (
                  <TableRow key={user.id}>
                      <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                              <Avatar>
                                  <AvatarImage src={user.avatar} alt={user.full_name} data-ai-hint="person portrait"/>
                                  <AvatarFallback>
                                      {user.avatar ? (user.full_name?.split(' ').map(n => n[0]).join('') || 'U') : <UserIcon className="h-5 w-5" />}
                                  </AvatarFallback>
                              </Avatar>
                              {user.full_name}
                          </div>
                      </TableCell>
                      <TableCell>{user.user_email}</TableCell>
                      <TableCell>
                      <Badge variant={user.role === 'HR Manager' ? 'default' : user.role === 'Recruiter' ? 'secondary' : 'outline'}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                      <Badge variant={user.status === 'active' ? 'secondary' : 'destructive'}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                          </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleOpenFormDialog(user)}>Edit</DropdownMenuItem>
                          <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button variant="ghost" className="w-full justify-start text-sm font-normal px-2 py-1.5 text-red-600 hover:text-red-600 focus-visible:ring-red-500">Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the user
                                      and remove their data from our servers.
                                  </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                          </DropdownMenuContent>
                      </DropdownMenu>
                      </TableCell>
                  </TableRow>
                  ))}
              </TableBody>
              </Table>
          )}
        </CardContent>
      </Card>
      <UserFormDialog 
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        form={form}
        onSubmit={onSubmit}
        editingUser={editingUser}
      />
    </div>
  );
}
