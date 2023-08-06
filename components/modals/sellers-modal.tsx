import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAuthProvider } from "@/hooks/AuthProvider";
import { toast } from "react-hot-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firebaseApp";

import { Seller } from "@/firebase/db";

// zod validation schema for the form
const formSchema = z.object({
    shopName: z.string().min(3, { message: "Shop Name must be at least 3 characters long" }),
    shopProfileImageURL: z.string(),

    location: z.string().min(3, { message: "Location must be at least 3 characters long" }),
    bio: z.string().min(10, { message: "Bio must be at least 10 characters long" }),
    instagramURL: z.string().url({ message: "Invalid URL format" }),
    instagramUsername: z.string().min(3, { message: "Instagram Username must be at least 3 characters long" }),
});

type SellerFormValues = z.infer<typeof formSchema>;

interface SellerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFormSubmit: (values: Partial<Seller>) => Promise<void>;
    sellerInfoProvided: boolean; // Add sellerInfoProvided prop
}


export const SellerModal: React.FC<SellerModalProps> = ({ isOpen, onClose, onFormSubmit, sellerInfoProvided }) => {
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const { user } = useAuthProvider();
  
    const form = useForm<SellerFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        shopName: "",
        shopProfileImageURL: "",
        location: "",
        bio: "",
        instagramURL: "",
        instagramUsername: "",
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
  
    const onSubmit = async (values: SellerFormValues) => {
      try {
        setLoading(true);
  
        const userID = user?.uid;
        const createdAt = serverTimestamp();
  
        if (selectedImage) {
          const filename = `${Date.now()}-${selectedImage.name}`;
          const storageRef = ref(storage, `shopProfile/${userID}/${filename}`);
          const snapshot = await uploadBytes(storageRef, selectedImage);
          const downloadURL = await getDownloadURL(snapshot.ref);
  
          values.shopProfileImageURL = downloadURL;
        }
  
        const sellerPayload: Partial<Seller> = { ...values, userID, createdAt };
        await onFormSubmit(sellerPayload);
        // Update the sellerInfoProvided state after the seller data is successfully submitted
        // sellerInfoProvided = true;
        console.log("sellerInfoProvided sell-modal", sellerInfoProvided);
  
        toast.success("Seller information saved successfully!");
      } catch (error) {
        toast.error("Something went wrong while saving seller information");
      } finally {
        setLoading(false);
        onClose();
      }
    };

    

    return (
        <Modal title="Seller Information" description="Enter your seller information"
            isOpen={isOpen} onClose={onClose}>
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-rows-3 space-y-2">
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
                                        name="shopProfileImageURL"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Shop Profile Image </FormLabel>
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


                                </div>


                                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
