import { getSellerByID, updateSeller } from "@/firebase/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { sellerId: string } }
) {
    try {
        //get logged in user
        // const { user, loading, error } = useAuthProvider();

        // get seller data body
        const body = await req.json();
        // unpack body
        console.log("Patchbody SELLER***********");
        console.log(body);
        const { userID,
            shopName,
            location,
            shopProfileImageURL,
            bio, instagramURL, instagramImported, isActive } = body;

        // check for userID of Seller
        if (!userID) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // check if userID matches the logged in user


        // check for shopName of Seller
        if (!shopName) {
            return new NextResponse("Shop Name is Required", { status: 400 });
        }

        // check for location of Seller
        if (!location) {
            return new NextResponse("Location is Required", { status: 400 });
        }

        const updateData = {
            
            shopName: shopName,
            location: location,
            shopProfileImageURL: shopProfileImageURL,
            bio: bio,
            instagramURL: instagramURL,
            instagramImported: instagramImported,
            isActive: isActive
        }

        // call the updateSeller func from firebase/db.ts
        const updateSellerCol = await updateSeller(params.sellerId, updateData);
        console.log("updateSellerCol Done!");
        
        return NextResponse.json(updateSellerCol);

    }

    catch (error) {
        console.log('[SELLER_CR_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { sellerId: string } }
) {
    try {
        // check for userID of Seller
        // check if user is logged in
        // const {user} = useAuthProvider();

        // if (!user) {
        //     return new NextResponse("Unauthenticated", { status: 401 });
        // }

        if (!params.sellerId) {
            return new NextResponse("Unauthorized:", { status: 401 });
        }

        // call the getSeller func from firebase/db.ts
        const sellerCol = await getSellerByID(params.sellerId);
        console.log("sellerCol Fetched!", sellerCol);
        return NextResponse.json(sellerCol);

    } catch (error) {
        console.log("GET:Seller error:", error);
        return new NextResponse("Internal server err", { status: 500 });
    }
}

