// import { useForm } from 'react-hook-form'
// import { zodResolver } from "@hookform/resolvers/zod"

// import { Button } from "@/components/ui/button"
// import * as z from "zod"

// import {
//     Form,
//     FormControl,
//     FormDescription,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from '../ui/textarea'
// import { Label } from '../ui/label'
// import { useSignIn, useSignUp } from '@clerk/clerk-react'
// import axios from 'axios'

// interface ProfileFormProps {
//     givenName: string;
//     surname: string;
//     personalNumber: string;
//     name: string;
// }

// export default function ProfileForm({ collectResponse }: { collectResponse: ProfileFormProps }) {
//     const { isLoaded, signUp, setActive } = useSignUp();

//     const formSchema = z.object({
//         username: z.string().min(2, {
//             message: "Username must be at least 2 characters.",
//         }),
//         email: z.string().email({
//             message: "Please enter a valid email.",
//         }),
//         bio: z.string().min(2, {
//             message: "Bio must be at least 2 characters.",
//         }),
//         // its an image resource / file
//         profilePicture: z.unknown(),
//     })

//     const form = useForm<ProfileFormValues>({
//         resolver: zodResolver(formSchema),
//         mode: "onChange"
//     })

//     type ProfileFormValues = z.infer<typeof formSchema>

//     async function onSubmit(data: ProfileFormValues) {
//         if (!isLoaded) {
//             return;
//         }

//         try {
//             // Assuming collectResponse is correctly defined and accessible
//             // const clerkAuthResponse = await axios.post('http://localhost:3000/api/clerk-auth', {
//             //     firstName: collectResponse.givenName,
//             //     lastName: collectResponse.surname,
//             //     personalNumber: collectResponse.personalNumber,
//             //     username: data.username,
//             // });

//             // console.log(clerkAuthResponse);

//             const signInResponse = await signUp.create({
//                 firstName: collectResponse.givenName,
//                 lastName: collectResponse.surname,
//                 username: data.username,
//                 strategy: "ticket",
//             });

//             console.log(signInResponse);

//             if (signInResponse.status === "complete") {
//                 console.log(signInResponse);
//                 setActive({ session: signInResponse.createdSessionId });
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     }

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//                 <FormField
//                     control={form.control}
//                     name="username"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Username</FormLabel>
//                             <FormControl>
//                                 <Input placeholder="qrutz" {...field} />
//                             </FormControl>
//                             <FormDescription>
//                                 This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.

//                             </FormDescription>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Email</FormLabel>
//                             <FormControl>
//                                 <Input placeholder="Please enter an email" {...field} />
//                             </FormControl>
//                             <FormDescription>
//                                 You can manage verified email addresses in your email settings.

//                             </FormDescription>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     control={form.control}
//                     name="bio"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Bio</FormLabel>
//                             <FormControl>
//                                 <Textarea
//                                     placeholder="Tell us a little bit about yourself"
//                                     className="resize-none"
//                                     {...field}
//                                 />                            </FormControl>
//                             <FormDescription>
//                                 You can <span>@mention</span> other users and organizations to
//                                 link to them.

//                             </FormDescription>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     control={form.control}
//                     name="profilePicture"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Profile Picture</FormLabel>
//                             <FormControl>

//                                 <Input id="picture" type="file" />
//                             </FormControl>
//                             <FormDescription>
//                                 This will be your public profile picture. It can be changed at any time.

//                             </FormDescription>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <div className="w-full flex justify-center">
//                     <Button size={"lg"} className=' flex justify-end' type="submit">Continue</Button>
//                 </div>
//             </form>
//         </Form>
//     )
// }
