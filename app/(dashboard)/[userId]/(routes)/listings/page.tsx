"use client";

import { Listing, getListingByID } from "@/firebase/db";


import { useEffect, useState } from "react";
import { ListingClient } from "./components/client";
import { Separator } from "@/components/ui/separator";


const ListingsPage = ({ params }: { params: { userId: string } }) => {

    const [listingData, setListingData] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    

    console.log("Listing Page");
    console.log(params.userId)

    useEffect(() => {
        const getCurrentListingData = async () => {
            console.log("fetching data in listing page");
            const data = await getListingByID(params.userId);
            console.log(data)
            return data;
        };

        getCurrentListingData()
            .then((data) => {
                setListingData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching listing data:", error);
                setLoading(false);
            });
    }, [params.userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // if (!listingData) {
    //     return (
    //         <div>
    //             <p>Could not find listings from seller ID: {params.userId}</p>
    //         </div>
    //     )
    // }


    return (<div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ListingClient  />
            <Separator/>
        </div>
    </div>);
}

export default ListingsPage;