"use client";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Seller, User, addSeller } from "@/firebase/db";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { SellerModal } from "@/components/modals/sellers-modal";




interface settingsFormProps {
    initialData: User;
}

const formSchema = z.object({

    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    isSeller: z.boolean(),
    phoneNumber: z.string().min(10, { message: "Phone Number must be at least 10 characters long" }),

});

type SettingsFormValues = z.infer<typeof formSchema>;


export const SettingsForm: React.FC<settingsFormProps> = (
    { initialData }
) => {

    const params = useParams();
    const router = useRouter();
    const [sellerInfoProvided, setSellerInfoProvided] = useState<boolean>(initialData.isSeller === true);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData.name,
            isSeller: initialData.isSeller,
            phoneNumber: initialData.phoneNumber,
        },
    });
    // console.log("Params: ", params.userId);
    const updateUserSettings = async (values: SettingsFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/users/${params.userId}`, values);
            router.refresh();
            // toast.success("User settings updated successfully from updfunc");
            console.log("User settings updated successfully from updfunc");
            console.log(values);
        } catch (error) {
            toast.error("Something ain't right...update api");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };




    const onSubmit = async (values: SettingsFormValues) => {
        try {
            console.log(sellerInfoProvided)
            console.log("isSeller: ", values.isSeller)
            setLoading(true);
            if (values.isSeller && !sellerInfoProvided) {
                // Open the seller modal only when isSeller is checked and sellerInfoProvided is false
                setOpen(true);
            } else {
                await updateUserSettings(values);
                toast.success("User settings updated successfully");
                console.log("User settings updated successfully");
                console.log(values);
            }
        } catch (error) {
            toast.error("Something ain't right...");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    // Function to handle the submission of seller information from the SellerModal
    const handleSellerFormSubmit = async (sellerData: Partial<Seller>) => {
        try {
            setLoading(true);

            // Call the API or function to submit the seller information
            // You may need to adjust this function based on your specific implementation
            //   await submitSellerInfo(sellerData);
            await addSeller(params.userId, sellerData)
            console.log("Seller Data kwa sett form: ", sellerData);

            // Update the sellerInfoProvided state to true after successfully submitting seller info
            //   setSellerInfoProvided(true);

            // Close the SellerModal
            setOpen(false);

            toast.success("Seller information saved successfully!");
        } catch (error) {
            toast.error("Something went wrong while saving seller information");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <SellerModal
                isOpen={open} // Pass the open state to the modal
                onClose={() => setOpen(false)} // Function to close the modal
                onFormSubmit={handleSellerFormSubmit} // Function to handle the seller form submission
                sellerInfoProvided={sellerInfoProvided} // Pass the sellerInfoProvided state
            />

            <div className="flex items-center justify-between">
                <Heading
                    title="User settings"
                    description="Manage user settings" />

            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="User name" {...field} />
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
                                        <Input disabled={loading} placeholder="Phone Number" {...field} />
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
                                            checked={field.value}
                                            // @ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Seller
                                        </FormLabel>
                                        <FormDescription>
                                            To become a seller on our platform.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                        {/* <Button disabled={loading} variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button> */}
                        <Button disabled={loading} type="submit" className="ml-auto ">
                            Save Changes
                        </Button>
                    </div>
                </form>

            </Form>
        </>
    )
}