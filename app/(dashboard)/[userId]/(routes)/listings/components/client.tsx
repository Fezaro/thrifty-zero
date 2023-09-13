"use client"
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Inter } from "next/font/google";
import React, { useEffect, useState } from "react";
import { Listing, SellerListing, getAllListingsForSeller } from "@/firebase/db";
import { ListingColumn, columns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { all } from "axios";



interface ListingClientProps {
    sellListdata: SellerListing[] | null;
    tableData: ListingColumn | null;
}

export const ListingClient: React.FC<ListingClientProps> = (
    { sellListdata }
) => {
    const [allListings, setAllListings] = useState<ListingColumn[]>([]);

    const router = useRouter();
    const params = useParams();

    console.log("Listing Client:");
    console.log(sellListdata);

    useEffect(() => {
        const getCurrentListingsData = async () => {
            console.log("fetching data in listing page");
            const data = await getAllListingsForSeller(params.userId);
            return data;

        };

        getCurrentListingsData()
            .then((data) => {
                setAllListings(data);

            })
            .catch((error) => {
                console.error("Error fetching listing data:", error);
            });
    }, [params.userId]);
    
    // add listingID to allListings
    


    console.log("All listings:", allListings);


    if (!sellListdata) {
        return (
            <div>
                <p>Could not find listings from seller ID: {params.userId}</p>
            </div>
        )
    }
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Listings (${sellListdata.length})`}
                    description="Manage your listings" />
                <Button onClick={() => router.push(`/${params.userId}/listings/new`)}>
                    <Plus className="mr-2 h-4 w-4" /> Add New
                </Button>
            </div>

            <Separator />

            <DataTable columns={columns} data={allListings} searchKey="title" />
        </>
    )
}

