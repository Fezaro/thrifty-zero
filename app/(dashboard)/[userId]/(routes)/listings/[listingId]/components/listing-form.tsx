"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Listing, Seller, updateListing, updateSeller } from "@/firebase/db";
import { storage } from "@/firebase/firebaseApp";
import { useAuthProvider } from "@/hooks/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";


const formSchema = z.object({
    title: z.string().nonempty({ message: "Title is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    price: z.coerce.number().min(1),
    images:z.string().min(1),
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

// export const ListingsForm: React.FC<ListingsFormProps> = (
//     { initialData }
// ) => {
//     const [loading, setLoading] = useState(false);
//     const { user } = useAuthProvider();
//     const [selectedImage, setSelectedImage] = useState<File | null>(null);
//     const userID = user?.uid;

//     const form = useForm<ListingsFormValues>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             title: initialData?.title,
//             description: initialData?.description,
//             price: initialData?.price,
//             images: initialData?.imageURLs,
//             isActive: initialData?.isActive,
//             listingURL: initialData?.listingURL,
//             contactPhoneNumber: initialData?.contactPhoneNumber,
//             reasonForSelling: initialData?.reasonForSelling,
//             durationUsed: initialData?.durationUsed,
//             pickUpLocation: initialData?.pickUpLocation,
//         },
//     });

//     // handle image upload
//     const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setSelectedImage(file);
//         } else {
//             console.log("No file selected-hanupl");
//         }
//     };

//     // // handle seller update
//     // const updateSellerDetails = async (sellerValues:Partial<Seller>) => {
//     //     try {
//     //         setLoading(true);
//     //         const updateSellerRes = await updateSeller(initialData.userID, sellerValues);
//     //         console.log(updateSellerRes);

//     //     } catch (error) {
//     //         console.log(error);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // }
//     //handle listings submit
    // const updateListingDetails = async (listingValues: Partial<Listing>) => {
    //     try {
    //         setLoading(true);
    //         const updateListingRes = await updateListing(userID, listingValues);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setLoading(false);
    //     }

//     const onSubmit = async (values: ListingsFormValues) => {
//         try {
//             setLoading(true);


//             if (selectedImage) {
//                 const filename = `${Date.now()}-${selectedImage.name}`;
//                 const storageRef = ref(storage, `listing/${userID}/${filename}`);
//                 const snapshot = await uploadBytes(storageRef, selectedImage);
//                 const downloadURL = await getDownloadURL(snapshot.ref);
//                 const imageURLs = [downloadURL];
//                 const updatedAt = serverTimestamp();
//                 const createdAt = serverTimestamp();

                
//                 const ListingPayload: Partial<Listing> = { ...values, updatedAt, createdAt, imageURLs, sellerID:userID };
//                 console.log(ListingPayload);
//             }
//             // await updateSellerDetails(sellerPayload);
//             console.log("Listings details updated successfully");


//         } catch (error) {
//             console.log(error);
//         } finally {
//             setLoading(false);
//         }
//     }


export const ListingsForm: React.FC<ListingsFormProps> = ({ initialData }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuthProvider();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const userID = user?.uid || "";
  
    const form = useForm<ListingsFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: initialData?.title || "",
        description: initialData?.description || "",
        price: initialData?.price || 0,
        images: initialData?.imageURLs || "",
        isActive: initialData?.isActive || false,
        listingURL: initialData?.listingURL || "",
        contactPhoneNumber: initialData?.contactPhoneNumber || "",
        reasonForSelling: initialData?.reasonForSelling || "",
        durationUsed: initialData?.durationUsed || "",
        pickUpLocation: initialData?.pickUpLocation || "",
      },
    });
  
    // handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedImage(file);
      } else {
        console.log("No file selected-hanupl");
      }
    };
  
    // handle listings submit
    const onSubmit = async (values: ListingsFormValues) => {
      try {
        setLoading(true);
  
        if (selectedImage) {
          const filename = `${Date.now()}-${selectedImage.name}`;
          const storageRef = ref(storage, `listing/${userID}/${filename}`);
          const snapshot = await uploadBytes(storageRef, selectedImage);
          const downloadURL = await getDownloadURL(snapshot.ref);
          const imageURLs = downloadURL;
          const updatedAt = serverTimestamp();
          const createdAt = serverTimestamp();
  
          const listingPayload: Partial<Listing> = { ...values, updatedAt, createdAt, imageURLs, sellerID: userID };
          console.log(listingPayload);
  
          // Update the listing using the updateListing function
          await updateListing(userID, listingPayload);
          console.log("Listing details updated successfully");
        }
  
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
                    title="Listing Details"
                    description="Manage listing details" />

            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
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
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Listings Images </FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} type="file" onChange={(e) => {
                                            // Handle image upload when the input value changes
                                            handleImageUpload(e);
                                            field.onChange(e);
                                        }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Form>


        </>
    );
}