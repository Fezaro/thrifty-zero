import { updateUser } from "@/firebase/db";
import { serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { userId: string }}
) {
    try{
        // const {user, loading, error} = useAuthProvider();
        //body contains User data from User Interface db.ts
        const body = await req.json();
        // unpack body
        console.log("Patchbody***********");
        console.log(body);
        const {name, email, isSeller,createdAt, updatedAt, isActive,phoneNumber } = body;

        // check if userID is present in the body

        if(!params.userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!name){
            return new NextResponse("Name is Required", {status: 400});
        }

        if(!phoneNumber){
            return new NextResponse("Phone Number is Required", {status: 400});
        }

        const updateData = {
            name: name,
            phoneNumber: phoneNumber,
            isSeller: isSeller,
            updatedAt: serverTimestamp(),
            
        }

        // call the updateUser func from firebase/db.ts
        const updateUserCol = await updateUser(params.userId, updateData);
        console.log("updateUserCol Done!");


        return NextResponse.json(updateUserCol);
    }
    catch(error){
        console.log('[USER_CR_PATCH]',error);
        return new NextResponse("Internal Error", {status: 500});
    }
}