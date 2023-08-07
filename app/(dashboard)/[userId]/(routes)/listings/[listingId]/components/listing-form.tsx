"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Listing, Seller, addListing, updateListing, updateSeller } from "@/firebase/db";
import { storage } from "@/firebase/firebaseApp";
import { useAuthProvider } from "@/hooks/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { serverTimestamp } from "firebase/firestore";
import { getDownloadURL, list, ref, uploadBytes } from "firebase/storage";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";


const formSchema = z.object({
    title: z.string().nonempty({ message: "Title is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    price: z.coerce.number().min(1),
    category: z.string().nonempty({ message: "Category is required" }), 
    isActive: z.boolean(),
    listingURL: z.string().nonempty({ message: "Listing URL is required" }),
    contactPhoneNumber: z.string().nonempty({ message: "Contact phone number is required" }),
    reasonForSelling: z.string().nonempty({ message: "Reason for selling is required" }),
    durationUsed: z.string().nonempty({ message: "Duration used is required" }),
    pickUpLocation: z.string().nonempty({ message: "Pick up location is required" }),
});

type ListingsFormValues = z.infer<typeof formSchema>;

interface ListingsFormProps {
    initialData: Listing | undefined;
}

export const ListingsForm: React.FC<ListingsFormProps> = ({ initialData }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuthProvider();
    // const [selectedImages, setSelectedImages] = useState<File[] | null>(null);
    // const [selectedImages, setSelectedImages] = useState<File[]>([]); // Set the initial state to an empty array
    const [selectedImages, setSelectedImages] = useState<FileList | null>(null);

    const [uploadedImageURLs, setUploadedImageURLs] = useState<string[]>([]);
    const userID = user?.uid || "";
    // const Params = useParams(); 


    const title = initialData ? "Listing Form" : "Create a new listing";
    const description = initialData ? "Update your listing" : "Add a new listing";
    const toastMessage = initialData ? "Listing updated successfully" : "Listing created successfully";
    const action = initialData ? "Update" : "Create";



    const form = useForm<ListingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            price: initialData?.price || 0,
            category: initialData?.category || "",
            isActive: initialData?.isActive || false,
            listingURL: initialData?.listingURL || "",
            contactPhoneNumber: initialData?.contactPhoneNumber || "",
            reasonForSelling: initialData?.reasonForSelling || "",
            durationUsed: initialData?.durationUsed || "",
            pickUpLocation: initialData?.pickUpLocation || "",
        } || {},
    });

  
    // handle image upload
    // Modify the handleImageUpload function to store an array of Files
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            // Convert FileList to an array and store it in the state
            setSelectedImages(files);
            // console.log(Array.from(files));
            console.log(files);
            console.log(selectedImages)
        } else {
            console.log("No file selected-hanupl");
        }
    };

 
    const onSubmit = async (values: ListingsFormValues) => {
        try {
          setLoading(true);
    
          if (selectedImages && selectedImages.length > 0) {
            // Prepare an array to hold the URLs of the uploaded images
            const imageURLs: string[] = [];
    
            // Iterate through the selected images and upload each one
            for (let i = 0; i < selectedImages.length; i++) {
              const file = selectedImages[i];
              const filename = `${Date.now()}-${file.name}`;
              const storageRef = ref(storage, `listing/${userID}/${filename}`);
              const snapshot = await uploadBytes(storageRef, file);
              const downloadURL = await getDownloadURL(snapshot.ref);
              imageURLs.push(downloadURL); // Add the download URL to the array
            }
            console.log("submit image urls")

            console.log(imageURLs)
    
            // Set the form values to the URLs of the uploaded images
            // form.setValue("images", imageURLs);
            const listingPayload: Partial<Listing> = {
                ...values,
                updatedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
                sellerID: userID,
                imageURLs: imageURLs
            };
            await addListing( listingPayload, userID);
            console.log(listingPayload);
          }


            

    
          // At this point, the "images" field in the form values will contain the URLs of the uploaded images
          // You can now submit the form using your updateListing function or any other method you prefer
          // For example, if you are using updateListing:
    
          console.log("Listing details updated successfully");
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description} />

            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid lg:grid-cols-3 gap-8 grid-cols-1 ">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Listing Title</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Enter Listing title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Enter Listing description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Enter price" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="listingURL"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Listing URL</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Enter listing URL" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Enter listing category" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => ( */}
                                <FormItem>
                                    <FormLabel>Listings Images </FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} type="file"
                                            multiple
                                            onChange={(e) => {
                                                if (!e.target.files) return;
                                                // Handle image upload when the input value changes
                                                handleImageUpload(e);
                                                // field.onChange(e);
                                            }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            {/* )}
                        /> */}

                        <FormField
                            control={form.control}
                            name="pickUpLocation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pick -up Location</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Enter listing pick up location" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="durationUsed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration Used</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Enter the duration used" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="reasonForSelling"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason for Selling</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Reason for selling" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactPhoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Contact</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Enter your phone contact number" {...field} />
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
                                            Listing Availability
                                        </FormLabel>
                                        <FormDescription>
                                            Toggle to enable/disable listing Availability
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
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>


        </>
    );
}