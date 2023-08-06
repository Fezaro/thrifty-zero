"use client";

import { Listing, findFirstListingForSeller } from "@/firebase/db";
// import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ListingsForm } from "./components/listing-form";

const ListingPage = (
    { params }: {
        params: { userId: string }
    }) => {
    console.log("Listing unique det Page");
    console.log(params.userId);

    const [ListingFetchedData, setListingFetchedData] =
        useState<{ listingID: string; listingData: Listing } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCurrentListingData = async () => {
            console.log("fetching data in listing page");
            try {
                const data = await findFirstListingForSeller(params.userId);
                console.log(data);
                setListingFetchedData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching listing data:", error);
                setLoading(false);
            }
        };


        getCurrentListingData();

    }, [params.userId]);

    if (loading) {
        return <div>Loading listings...</div>;
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div>Listing Page form for: {ListingFetchedData?.listingData.title}</div>
                <ListingsForm initialData={ListingFetchedData?.listingData}/>
            </div>
        </div>
    );
};

export default ListingPage;