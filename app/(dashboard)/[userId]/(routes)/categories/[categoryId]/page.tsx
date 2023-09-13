"use client";

import { Category,getCategoryByID} from "@/firebase/db";
import { useEffect, useState } from "react";
import { CategoryForm } from "./components/category-form";

const CategoryPage = (
    { params }: {
        params: { categoryId: string }
    }) => {
    console.log("Category unique det Page.....");
    console.log(params.categoryId);

    const [loading, setLoading] = useState(true);
    const [categoriesData, setCategoriesData] = useState<Category| null>(null);


    useEffect(() => {
        const getCurrentCategoryData = async () => {
            console.log("fetching data in Category page");
            try {
                const data = await getCategoryByID(params.categoryId);
                if (data) {
                    console.log("Category data:", data);
                    setCategoriesData(data);
                    

                    setLoading(false);
                }
                else {
                    console.log("[Category Id] No Category data found");
                    setLoading(false);
                }

            } catch (error) {
                console.error("Error fetching Category data:", error);
                setLoading(false);
            }
        };

        getCurrentCategoryData();

    }, [params.categoryId]);



    if (loading) {
        return <div>Loading Category details...</div>;
    }



    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div>Category Page form for: { }</div>
                <CategoryForm initialData={categoriesData} />
            </div>
        </div>
    );
};

export default CategoryPage;