import { addCategory, getAllCategories } from "@/firebase/db";
import { NextResponse } from "next/server";


export async function POST(
    req: Request,
) {
    try {
        // get Category body
        const body = await req.json();
        // unpack body
        console.log("POST:Category create");
        console.log(body);
        console.log("POST:Category create params");

        // check if user is logged in
        // const { user } = useAuthProvider();
        const { name, isActive, userID } = body;
        console.log("POST:Category create:",  {name, isActive, userID});

        if (!userID) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

// TODO: cLEAN UP THIS CODE
        // if (!categoryId) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        if (!name) {
            return new NextResponse("Entity unknown", { status: 400 });
        }
        const catDets = { name, isActive };

        // call the addCategory function from firebase/db.ts
        const regCategory = addCategory(catDets);

        console.log("POST:Category create data:", regCategory);

        return NextResponse.json(regCategory);
    }
    catch (err) {
        console.log("POST:Category create error:", err);
        return new NextResponse("Internal Server Error", { status: 500 });

    }
}


export async function GET() {
    try {
        console.log("GET:Categories");
        // get categories from firebase/db.ts
        const allCategories = await getAllCategories();
        console.log("GET:Categories data:", allCategories);
        
        return NextResponse.json(allCategories);
    }catch (err) {
        console.log("GET:Categories error:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

