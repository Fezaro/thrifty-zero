import { deleteCategoryByID, getCategoryByID, getListingsByCategory, updateCategoryByID } from "@/firebase/db";
import { NextResponse } from "next/server";

export async function PATCH(
req: Request,
{ params }: { params: { categoryId: string } }){

try{
    // get category data body
    const body = await req.json();
    // unpack body
    console.log("Patchbody CATEGORY***********");
    console.log(body);

    const { categoryId, name, isActive } = body;

    // check for userID of Seller
    // check if user is logged in
    // const {user} = useAuthProvider();

    // if (!user) {
    //     return new NextResponse("Unauthorized", { status: 401 });
    // }
    if (categoryId !== params.categoryId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!categoryId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
        return new NextResponse("Entity unknown", { status: 400 });
    }


    // call the updateCategory function from firebase/db.ts
    const regCategory = updateCategoryByID( body.categoryId, body);
    console.log("PATCH:Category update data:", regCategory);
    return NextResponse.json(regCategory);


}
catch (err) {
    console.log("PATCH:Category update error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });

}
}

// export async function GET(
// req: Request,
// { params }: { params: { categoryId: string } }){
// try{

//     if (!params.categoryId) {
//         return new NextResponse("Unauthorized:", { status: 401 });
//     }

//     // call the get category data by categoryID function from firebase/db.ts
//     const getCategory = await getCategoryByID(params.categoryId);

//     console.log("GET:Category data:", getCategory);
//     return NextResponse.json(getCategory);
// } catch (err) {
//     console.log("GET:Category error:", err);
//     return new NextResponse("Internal Server Error", { status: 500 });
// }
// }

export async function GET(
    req: Request,
    { params }: { params: { categoryId: string } }
  ) {
    try {
      if (!params.categoryId) {
        return new NextResponse('Unauthorized:', { status: 401 });
      }
  
      // Call the get listings by category function from firebase/db.ts
      const listings = await getListingsByCategory(params.categoryId);
  
      return new NextResponse(JSON.stringify(listings), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.log('GET:Listings by category error:', err);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }
  

export async function DELETE(
req: Request,
{ params }: { params: { categoryId: string } }){
    try{
        // check for userID of Seller
        // check if user is logged in
        // const {user} = useAuthProvider();

        // if (!user) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        if (!params.categoryId) {
            return new NextResponse("Unauthorized:", { status: 401 });
        }

        // call the delete category data by categoryID function from firebase/db.ts
        const deleteCategory = await deleteCategoryByID(params.categoryId);

        console.log("DELETE:Category data:", deleteCategory);
        return NextResponse.json(deleteCategory);
    }
 catch (err) {
    console.log("DELETE:Category error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
}}