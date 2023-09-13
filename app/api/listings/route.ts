import { addListing, getAllListings } from "@/firebase/db";
import { NextResponse } from "next/server";
import { toast } from "react-hot-toast";

export async function POST(
    req: Request,

) {
    try {
        // get listing data from body
        const body = await req.json();
        // unpack body
        console.log("POST:Listing create");
        console.log(body);
        console.log("POST:Listing create params");


        const { title, description, price, category, pickUpLocation, imageURLs, contactPhoneNumber, sellerID, listingURL } = body;

        if (!sellerID) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!title) {
            return new NextResponse("Title is Required", { status: 400 });
        }

        if (!description) {
            return new NextResponse("Description is Required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is Required", { status: 400 });
        }

        if (!category) {
            return new NextResponse("Category is Required", { status: 400 });
        }

        if (!listingURL) {
            return new NextResponse("Listing URL is Required", { status: 400 });
        }

        if (!pickUpLocation) {
            return new NextResponse("Location is Required", { status: 400 });
        }

        if (!contactPhoneNumber) {
            return new NextResponse("Contact Phone Number is Required", { status: 400 });
        }

        if (!imageURLs || !imageURLs.length) {
            return new NextResponse("Listing Images is Required", { status: 400 });
        }

        // call the addListing function from firebase/db.ts
        const regListing = addListing(body, sellerID);

        console.log("POST:Listing create data:", regListing);
        

        return NextResponse.json(regListing);


    }
    catch (error) {
        console.log('[LISTING_CR_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    try {// get all listings from firebase/db.ts
        const allListings = await getAllListings();
        console.log("GET:Listings data:", allListings);
        return NextResponse.json(allListings);
    }
    catch (error) {
        console.log('[LISTING_CR_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}