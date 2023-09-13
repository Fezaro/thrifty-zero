import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Category, addCategory } from "@/firebase/db";
import { useAuthProvider } from "@/hooks/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface CategoryFormProps {
    initialData: Category | null;
}

const formSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    isActive: z.boolean(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = (
    { initialData }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuthProvider();
    const userID = user?.uid;

    const title = initialData ? "Update Category" : "Create Category";
    const description = initialData ? "Update your category details" : "Create a new category";
    const toastMessage = initialData ? "Category updated successfully" : "Category created successfully";
    const action = initialData ? "Update" : "Create";

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
        } : {
            name: "",
            isActive: false,
        },
    });

    if (!userID) {
        router.push("/login");
        return (
            <div>
                <p>User not found... </p>
            </div>
        )
    }

    const onSubmit = async (values: CategoryFormValues) => {

        try {
            setLoading(true);
            console.log("Category Form Values: ", values);
            const newValues = {...values, userID};
            console.log("New Category Form Values: ", newValues)
            if (initialData) {
                const updatedCategoryDets ={...newValues, categoryId: initialData.categoryId};
                await axios.patch(`/api/categories/${initialData.categoryId}`, updatedCategoryDets);
                console.log("Category details updated successfully");
            } else {
                
                const newCategoryDets = await axios.post("/api/categories", newValues);
                // const newCategoryDets = await addCategory(values, userID);
                console.log("Category details created successfully");
                console.log("New Category details: ", newCategoryDets);

            }
            toast.success(toastMessage);
            router.push(`/${userID}/categories`);
            router.refresh();

        }
        catch (error) {
            console.error("Error updating Category details: ", error);
            toast.error("Error updating Category details");
            setLoading(false);

        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description} />

            </div>
            <Separator />
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid lg:grid-cols-2 gap-8 grid-cols-1 ">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (

                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Enter category name" {...field} />
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
                                            Category Availability
                                        </FormLabel>
                                        <FormDescription>
                                            Toggle to enable/disable Category Availability
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
    )
}
