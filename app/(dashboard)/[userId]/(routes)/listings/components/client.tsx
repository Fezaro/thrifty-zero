"use client"
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export const ListingClient =  () =>{

    const router = useRouter();
    const params = useParams();
    return (
        <>
        <div className="flex items-center justify-between">
        <Heading
            title="Listings (0)"
            description="Manage your listings"/>
            <Button onClick={() => router.push(`/${params.userId}/listings/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
        </div>
        </>
    )
}