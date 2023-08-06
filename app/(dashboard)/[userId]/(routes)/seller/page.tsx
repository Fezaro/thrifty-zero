"use client";

import { Seller, getSellerByID } from "@/firebase/db";
import { useEffect, useState } from "react";
import { SellerForm } from "./components/seller-form";

const SellerPage = ({params} : {params: {userId:string}}) => {
    const [sellerData, setSellerData] = useState<Seller | null>(null);
    const [loading, setLoading] = useState(true);

    console.log("Seller Page");
    console.log(params.userId)

    useEffect(() => {
        const getCurrentSellerData = async () => {
            console.log("fetching data in seller page");
            const data = await getSellerByID(params.userId);
            console.log(data)
            return data;
        };

        getCurrentSellerData()
            .then((data) => {
                setSellerData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching seller data:", error);
                setLoading(false);
            });
    }, [params.userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!sellerData) {
        return (
            <div>
                <p>Could not find seller with ID: {params.userId}</p>
            </div>
        )
    }


    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                
                <SellerForm initialSellerData={sellerData} />
            </div>
        </div>
    )
}

export default SellerPage;