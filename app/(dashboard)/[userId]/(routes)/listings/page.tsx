"use client";

import { SellerListing, getAllListingsBySellerID, getListingByID, getAllListingsIdsBySellerID } from "@/firebase/db";


import { useEffect, useState } from "react";
import { ListingClient } from "./components/client";
import { Separator } from "@/components/ui/separator";


const ListingsPage = ({ params }: { params: { userId: string } }) => {

    const [listingsData, setListingsData] = useState<SellerListing[] | null>(null);
    const [loading, setLoading] = useState(true);


    console.log("Listing Page");
    console.log(params.userId)

    useEffect(() => {
        const getCurrentListingsData = async () => {
            console.log("fetching data in listing page");
            const data = await getAllListingsIdsBySellerID(params.userId);
            return data;
        };

        getCurrentListingsData()
            .then((data) => {


                setListingsData(data);

                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching listing data:", error);
                setLoading(false);
            });
    }, [params.userId]);
    console.log("Listing data afta:", listingsData);

    if (loading) {
        return <div>Loading...</div>;
    }

    console.log("Listing data:", listingsData);


    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ListingClient sellListdata={listingsData} tableData={null} />
                <Separator />
            </div>
        </div>);
}

export default ListingsPage;