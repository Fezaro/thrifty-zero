"use client"; 
import { Separator } from "@/components/ui/separator";
import { Category, getAllCategories } from "@/firebase/db";
import { useEffect, useState } from "react";
import { CategoriesClient } from "./components/client";

const CategoryPage =  (
    {params} : {params: {userId: string}}
) =>
{
    const [loading, setLoading] = useState(true);
    const [categoriesData, setCategoriesData] = useState<Category[] | null>(null);
    
    console.log("Category Page");

    useEffect(() => {
        const getCurrentCategoriesData = async () => {
            console.log("fetching data in category page");
            const data = await getAllCategories();
            return data;
        };

        getCurrentCategoriesData()
            .then((data) => {
                setCategoriesData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching category data:", error);
                setLoading(false);
            });
    }, []);

    console.log("Category data afta:", categoriesData);

    if (loading) {
        return <div>Loading...</div>;
    }   


    return (
        <>
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoriesClient data={categoriesData} tableData={null}/>
                <Separator />
            </div>
        </div>
            
        </>
    )
}

export default CategoryPage;