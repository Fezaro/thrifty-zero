"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../ui/modal";
import { useForm } from "react-hook-form";


import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormLabel, FormItem, FormControl, FormMessage, FormDescription,

} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import axios from "axios";
import { useAuthProvider } from "@/hooks/AuthProvider";
import { toast } from "react-hot-toast";

// zod validation schema for the form

const formSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    isSeller: z.boolean(),
    phoneNumber: z.string().min(10, { message: "Phone Number must be at least 10 characters long" }),
    
})

export const StoreModal = () => {
    const storeModal = useStoreModal();
    const [loading, setloading] = useState(false);
    const {user} = useAuthProvider();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            isSeller: false,
            phoneNumber: "",
             
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.log(values);
        // TODO: create user profile and send to firebase
        try {
            setloading(true);

            // api call
            // console.log(user)

            // get uid from user
            const userID= user?.uid;
            const email = user?.email;
            const userPayload = {...values, userID: userID, email: email};
            

            const response = await axios.post('/api/users', userPayload);

            //REDIRECT TO THE DASHBOARD
            // redirect(`/${userID}`);
            window.location.assign(`/${userID}`);
            
            toast.success("User Profile Created Successfully!");
            // console.log("API_USER_RESPONSE");
            // console.log(response.data);
           
        } catch (error) {
            toast.error("Something went wrong!")
        }
        finally{    
            setloading(false);
            
        }
    }


    return (
        <Modal
            title="Create User Profile"
            description="Complete your profile details to continue."
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}>
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid grid-rows-3 space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>User Name</FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder="Enter display Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"

                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder="Enter your phone number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                
                                <FormField
                                    control={form.control}
                                    name="isSeller"

                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">

                                            <FormControl>
                                                <Checkbox
                                                disabled={loading}
                                                    checked={field.value}
                                                    // @ts-ignore
                                                    onCheckedChange={field.onChange}
                                                />


                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Be a seller
                                                </FormLabel>
                                                <FormDescription>
                                                    You can sell your products on our platform
                                                </FormDescription>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                </div>
                                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                    <Button disabled={loading} variant="outline" onClick={storeModal.onClose}>
                                        Cancel
                                    </Button>
                                    <Button disabled={loading} type="submit">Continue</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>

       
        </Modal>
    )
};