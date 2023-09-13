"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getAllCategories, getAllListingsBySellerID } from "@/firebase/db";
import { useAuthProvider } from "@/hooks/AuthProvider";
import { CreditCard, DollarSign, Package } from "lucide-react";
import { useEffect, useState } from "react";

const DashboardPage = () => {
    const [categoriesCount, setCategoriesCount] = useState(0);
    const [listingsCount, setListingsCount] = useState(0);
    const {user} = useAuthProvider();
    if (!user) return (
        <div className="flex-col">
            not logged in
        </div>
    )

    useEffect(() => {
        // Fetch categories and set the count
        getAllCategories()
            .then(categories => setCategoriesCount(categories.length))
            .catch(error => console.error('Error fetching categories:', error));

        // Fetch listings by seller ID and set the count
        const sellerID = "your-seller-id"; // Replace with the actual seller ID
        getAllListingsBySellerID(user?.uid)
            .then(listings => setListingsCount(listings.length))
            .catch(error => console.error('Error fetching listings:', error));
    }, []);
    
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="Dashboard" description="Overview of your store" />
                <Separator />
                <div className="grid gap-4 grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{ }
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Categories</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{ categoriesCount}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Listings Available</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{listingsCount}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;