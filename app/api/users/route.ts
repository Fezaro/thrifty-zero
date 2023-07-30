import { User, addUser } from '@/firebase/db';
import { useAuthProvider } from '@/hooks/AuthProvider';
import { NextResponse } from 'next/server';


export async function POST(
    req: Request,
) {
    try{
        // const {user, loading, error} = useAuthProvider();
        //body contains User data from User Interface db.ts
        const body = await req.json();
        // unpack body
        console.log("postbody");
        console.log(body);
        const {userID, name, email, isSeller,createdAt, updatedAt, isActive,phoneNumber } = body;

        // check if userID is present in the body

        if(!userID){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!name){
            return new NextResponse("Name is Required", {status: 400});
        }

        if(!phoneNumber){
            return new NextResponse("Phone Number is Required", {status: 400});
        }

        // call the addUser function from firebase/db.ts

        const regUser = addUser(isSeller, name, phoneNumber, userID, email);
        return NextResponse.json(regUser);
        
    }
    catch(error){
        console.log('[USER_CR_POST]',error);
        return new NextResponse("Internal Error", {status: 500});
    }
}