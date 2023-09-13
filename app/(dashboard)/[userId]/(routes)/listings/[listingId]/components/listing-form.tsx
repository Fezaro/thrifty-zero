"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Category, Listing, Seller, addListing, getAllCategories, updateListing, updateSeller } from "@/firebase/db";
import { storage } from "@/firebase/firebaseApp";
import { useAuthProvider } from "@/hooks/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValue, arrayUnion, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, list, ref, uploadBytes } from "firebase/storage";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import ImageUpload from "@/components/ui/image-upload";
import axios from "axios";
import { useOrigin } from "@/hooks/use-origin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    title: z.string().nonempty({ message: "Title is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    price: z.coerce.number().min(1),
    // images: z.array(z.object({ url: z.string() })),
    images: z.array(z.object({ url: z.string() })),
    category: z.string().nonempty({ message: "Category is required" }),
    isActive: z.boolean(),
    listingURL: z.string(),
    contactPhoneNumber: z.string().nonempty({ message: "Contact phone number is required" }),
    reasonForSelling: z.string().nonempty({ message: "Reason for selling is required" }),
    durationUsed: z.string().nonempty({ message: "Duration used is required" }),
    pickUpLocation: z.string().nonempty({ message: "Pick up location is required" }),
});

type ListingsFormValues = z.infer<typeof formSchema>;

interface ListingsFormProps {
    initialData: Listing | null;
}

export const ListingsForm: React.FC<ListingsFormProps> = ({ initialData }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuthProvider();
    const router = useRouter();
    const origin = useOrigin();
    // const [selectedImages, setSelectedImages] = useState<File[] | null>(null);
    // const [selectedImages, setSelectedImages] = useState<File[]>([]); // Set the initial state to an empty array
    // const [selectedImages, setSelectedImages] = useState<FileList | null>(null);

    // const [uploadedImageURLs, setUploadedImageURLs] = useState<string[]>([]);
    const userID = user?.uid || "";
    const Params = useParams();
    console.log("Params", Params.listingId);
    const title = initialData ? "Listing Form" : "Create a new listing";
    const description = initialData ? "Update your listing" : "Add a new listing";
    const toastMessage = initialData ? "Listing updated successfully" : "Listing created successfully";
    const action = initialData ? "Update" : "Create";

    // console.log(`${origin}/${Params.userId}/listing/${Params.listingId}`)

    const form = useForm<ListingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
            images: initialData?.imageURLs || [],
        } : {
            title: '',
            price: 0,
            description: '',
            category: '',
            isActive: false,
            listingURL: '',
            contactPhoneNumber: '',
            reasonForSelling: '',
            durationUsed: '',
            pickUpLocation: '',
            images: []

        }

    });

    //  get the category data for all categories
    const [categoriesData, setCategoriesData] = useState<Category[] | null>(null);

    useEffect(() => {
        const getCurrentCategoriesData = async () => {
            console.log("fetching data in listing page for categories");
            const data = await getAllCategories();
            // console.log("categories data", data);
            // set the categories data
            setCategoriesData(data);
            return data;
        };

        getCurrentCategoriesData()
    }, []);

    console.log(categoriesData);




    const onSubmit = async (values: ListingsFormValues) => {
        try {
            setLoading(true);


            console.log("values");
            console.log(values.images);
            // const imageObjects = values.images.map(url => ({ url }));
            console.log("image objects");
            // console.log(imageObjects)
            // Create a new Listing object with all the properties
            const listingPayload: Listing = {
                title: values.title,
                description: values.description,
                price: values.price,
                category: values.category,
                imageURLs: values.images,
                sellerID: userID,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                isActive: values.isActive,
                listingURL: `${origin}/${Params.userId}/listings/${Params.listingId}`,
                contactPhoneNumber: values.contactPhoneNumber,
                reasonForSelling: values.reasonForSelling,
                durationUsed: values.durationUsed,
                pickUpLocation: values.pickUpLocation,
                listingId: Params.listingId,
            };
            if (initialData) {
                // Update the existing listing
                // await updateListing(Params.listingId, listingPayload);
                await axios.patch(`/api/listings/${Params.listingId}`, listingPayload);
            } else {

                // await addListing(listingPayload, userID);
                await axios.post(`/api/listings`, listingPayload);
            }

            console.log(listingPayload);

            // console.log("submit image urls!!!!")
            // console.log(values.images)

            console.log("Listing details updated successfully");
            router.refresh();
            router.push(`/${userID}/listings`);
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
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (


                            <FormItem>
                                <FormLabel>Listing Images</FormLabel>
                                <FormControl>


                                    <ImageUpload
                                        value={field.value.map((image) => image.url)}
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...field.value, { url }])}
                                        onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}


                                    // value={field.value.map((image) => console.log(image) )}
                                    // value={console.log(field.value)}


                                    // onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}

                                    // value={field.value ? field.value.map((url) => url) : []}
                                    // disabled={!field || loading}
                                    // onChange={(url) => field.onChange([...field.value, { url }])}
                                    // onRemove={(url) => field.onChange(field.value.filter((item) => item !== url))}
                                    />


                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )

                        }
                    />
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
                                        <Input disabled={loading}  placeholder="100.00" {...field} />
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
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Slect Category">

                                                </SelectValue>
                                            </SelectTrigger>

                                        </FormControl>
                                        <SelectContent>
                                            {categoriesData?.map((category) => (
                                                <SelectItem
                                                    key={category.categoryId}
                                                    value={category.name}
                                                >
                                                    {category.name}

                                                </SelectItem>
                                            ))}

                                        </SelectContent>

                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="pickUpLocation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pick-up Location</FormLabel>
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
                        <FormField
                            control={form.control}
                            name="listingURL"
                            render={({ field }) => (
                                <FormItem className="lg:col-span-2 col-span-1">
                                    <FormLabel>Listing URL</FormLabel>
                                    <FormControl>
                                        {/* <Input disabled={true} placeholder="Listing URL"
                                        value={`${origin}/${Params.userId}/listings/${Params.listingId}`} {...field} />
                                         */}
                                        {initialData ? (
                                            <Input disabled={true} value={initialData.listingURL} />
                                        ) : (
                                            <Input disabled={true} placeholder="Enter listing URL" value={`${origin}/${Params.userId}/listings/${Params.listingId}`} />
                                        )}
                                    </FormControl>
                                    <FormMessage />
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