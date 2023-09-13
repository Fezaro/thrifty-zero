"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Seller, updateSeller } from "@/firebase/db";
import { storage } from "@/firebase/firebaseApp";
import { useAuthProvider } from "@/hooks/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface sellerFormProps {
    initialSellerData: Seller;
}

const formSchema = z.object({
    shopName: z.string().min(3, { message: "Shop Name must be at least 3 characters long" }),
    shopProfileImageURL: z.string().min(1),
    isActive: z.boolean(),
    location: z.string().min(3, { message: "Location must be at least 3 characters long" }),
    bio: z.string().min(10, { message: "Bio must be at least 10 characters long" }),
    instagramURL: z.string().url({ message: "Invalid URL format" }),
    instagramUsername: z.string().min(3, { message: "Instagram Username must be at least 3 characters long" }),


});

type sellerFormValues = z.infer<typeof formSchema>;


export const SellerForm: React.FC<sellerFormProps> = (
    { initialSellerData }
) => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuthProvider();
    // const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const userID = user?.uid;

    const form = useForm<sellerFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            shopName: initialSellerData.shopName ,
            shopProfileImageURL: initialSellerData.shopProfileImageURL || "",
            location: initialSellerData.location ,
            bio: initialSellerData.bio ,
            instagramURL: initialSellerData.instagramURL ,
            instagramUsername: initialSellerData.instagramUsername ,
            isActive: initialSellerData.isActive,
        },
    });

    // handle image upload
    // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         setSelectedImage(file);
    //     } else {
    //         console.log("No file selected-hanupl");
    //     }
    // };

    // handle seller update
    const updateSellerDetails = async (sellerValues:Partial<Seller>) => {
        try {
            setLoading(true);
            // const updateSellerRes = await updateSeller(initialSellerData.userID, sellerValues);
            const updateSellerRes = await axios.patch(`/api/sellers/${userID}`, sellerValues);
            console.log(updateSellerRes);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const onSubmit = async (values: sellerFormValues) => {
        try {
            setLoading(true);


            // if (selectedImage) {
            //     const filename = `${Date.now()}-${selectedImage.name}`;
            //     const storageRef = ref(storage, `shopProfile/${userID}/${filename}`);
            //     const snapshot = await uploadBytes(storageRef, selectedImage);
            //     const downloadURL = await getDownloadURL(snapshot.ref);

            //     values.shopProfileImageURL = downloadURL;

            // }
            const updatedAt = serverTimestamp();
            const sellerPayload: Partial<Seller> = { ...values, updatedAt, userID:userID, instagramImported:false };
            console.log(sellerPayload);
            await updateSellerDetails(sellerPayload);
            console.log("Seller details updated successfully");


        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }



    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Seller details"
                    description="Manage seller details" />

            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    
                <FormField
                            control={form.control}
                            name="shopProfileImageURL"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Shop Profile Image </FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            disabled={loading}
                                            value={field.value ? [field.value] : []}
                                            onChange={(url) => field.onChange(url)}
                                            onRemove={() => field.onChange("")}
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    <div className="grid grid-col-1 lg:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="shopName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Shop Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Enter display Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Enter location" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Enter bio" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="instagramURL"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instagram URL</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Enter Instagram URL" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="instagramUsername"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instagram Username</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Enter Instagram Username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isActive"
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
                                            Enable/Disable Seller Account
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                        {/* <Button disabled={loading} variant="outline" onClick={() => {}}>
                            Cancel
                        </Button> */}
                        <Button disabled={loading} type="submit" className="ml-auto ">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Form>


        </>
    );
}