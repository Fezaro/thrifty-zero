import { addSeller } from "@/firebase/db";
import { NextResponse } from "next/server";


export async function POST(
    req: Request,
) {
    try {
        //  Seller data from body
        const body = await req.json();

        // unpack body
        console.log("POST:Sellers create");
        console.log(body);

        const { userID, shopName, location } = body;

        // check for userID of Seller
        if (!userID) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // check for shopName of Seller
        if (!shopName) {
            return new NextResponse("Shop Name is Required", { status: 400 });
        }

        // check for location of Seller
        if (!location) {
            return new NextResponse("Location is Required", { status: 400 });
        }

        // call the addSeller function from firebase/db.ts
        const regSeller = addSeller(userID, body);

        console.log("POST:Sellers create data:", regSeller);

        
    }
    catch (err) {
        console.log("[SELLERAPI_CR_POST]:", err);

        return new NextResponse("Internal Error", { status: 500 });

    }
}

