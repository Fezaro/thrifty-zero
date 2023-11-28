import { deleteListing, getListingByListingID, updateListing } from "@/firebase/db";
import { NextResponse } from "next/server";


export async function PATCH(
    req: Request,
    { params }: { params: { listingId: string } }
) {
    try{
        // get seller data body
        const body = await req.json();
        // unpack body
        console.log("Patchbody LISTING***********");
        console.log(body);
        const { title, description, 
            price, category, pickUpLocation, 
            imageURLs, contactPhoneNumber, sellerID, listingURL,
        durationUsed, reasonForSelling,
    isActive } = body;

        // check for userID of Seller
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
            return new NextResponse("pickUpLocation is Required", { status: 400 });
        }

        if (!contactPhoneNumber) {
            return new NextResponse("Contact Phone Number is Required", { status: 400 });
        }

        if (!imageURLs || !imageURLs.length) {
            return new NextResponse("Listing Images is Required", { status: 400 });
        }

        if(!durationUsed){
            return new NextResponse("Duration Used is Required", { status: 400 });
        }

        if(!reasonForSelling){
            return new NextResponse("Reason For Selling is Required", { status: 400 });
        }


        const updateData = {
            title: title,
            description: description,
            price: price,
            category: category,
            pickUpLocation: pickUpLocation,
            imageURLs: imageURLs,
            contactPhoneNumber: contactPhoneNumber,
            sellerID: sellerID,
            listingURL: listingURL,
            durationUsed: durationUsed,
            reasonForSelling: reasonForSelling,
            isActive: isActive,

        }

        // call the updateSeller func from firebase/db.ts
        const updateListingCol = await updateListing(params.listingId, updateData);
        console.log("updateListingCol Done!");
        return NextResponse.json(updateListingCol);


    }
    catch(error){
        return new NextResponse("Unauthorized", { status: 401 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { listingId: string } }
) {
    try{
        // TODO: cLEAN UP THIS CODE
        // check logged in user
        // check for userID of Seller
        // const {user} = useAuthProvider();

        // if (!user) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        if (!params.listingId) {
            return new NextResponse("Unauthorized:", { status: 401 });
        }

        // call the delete listiing func from firebase/db.ts
        const deleteListingEntry = await deleteListing(params.listingId);
        console.log("deleteListingEntry Done!", deleteListingEntry);
        return NextResponse.json(deleteListingEntry);


    }catch (error){
        console.log("DELETE:Listing error:", error);
        return new NextResponse("Internal server err", { status: 500 });
    }}


export async function GET(
    req: Request,
    { params }: { params: { listingId: string } }
) {
    try{
        // TODO: cLEAN UP THIS CODE
        // check logged in user
        // check for userID of Seller
        // const {user} = useAuthProvider();

        // if (!user) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          };

        if (!params.listingId) {
            return new NextResponse("Unauthorized:", { status: 401 });
        }

        // call the get listing by listing id func from firebase/db.ts
        const getListingEntry = await getListingByListingID(params.listingId);
        console.log("getListingEntry Done!", getListingEntry);
        
        return NextResponse.json(getListingEntry, {headers});


    }catch (error){
        console.log("GET:Listing error:", error);
        return new Response("Internal server err", { status: 500 });
    }
    }