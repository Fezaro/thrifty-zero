"use client";

import { Listing, findFirstListingForSeller, getListingByListingID, getListingIdsBySellerId } from "@/firebase/db";
// import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ListingsForm } from "./components/listing-form";

const ListingPage = (
    { params }: {
        params: { listingId: string }
    }) => {
    console.log("Listing unique det Page.....");
    console.log(params.listingId);

    // const [ListingFetchedData, setListingFetchedData] = useState<{ listingID: string; listingData: Listing } | null>(null);
    const [loading, setLoading] = useState(true);
    const [listingIdsData, setListingIdsData] = useState<Listing | null>(null);


    useEffect(() => {
        const getCurrentListingData = async () => {
            console.log("fetching data in listing page");
            try {
                const data = await getListingByListingID(params.listingId);
                if (data) {
                    console.log("Listing data:", data);
                    // setListingFetchedData(data);
                    setListingIdsData(data);
                    // console.log("Listing data afta:", ListingFetchedData);

                    setLoading(false);
                }
                else {
                    console.log("[listingId]No listing data found");
                    setLoading(false);
                }

            } catch (error) {
                console.error("Error fetching listing data:", error);
                setLoading(false);
            }
        };

        getCurrentListingData();

    }, [params.listingId]);


    // convert servertimestamp to date
    const convertServerTimestampToDate = (timestamp: any) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString("en-GB");
    }

    if (listingIdsData) {
        listingIdsData.createdAt = convertServerTimestampToDate(listingIdsData?.createdAt);
        listingIdsData.updatedAt = convertServerTimestampToDate(listingIdsData?.updatedAt);
        console.log("Listing data afta:", listingIdsData);
    }

    if (loading) {
        return <div>Loading listings...</div>;
    }

    // if (!ListingFetchedData) {
    //     return (
    //         <div>
    //             <p>[listingId]Could not find listings from seller ID: {params.listingId}</p>
    //         </div>
    //     )
    // }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div>Listing Page form for: { }</div>
                <ListingsForm initialData={listingIdsData} />
            </div>
        </div>
    );
};

export default ListingPage;