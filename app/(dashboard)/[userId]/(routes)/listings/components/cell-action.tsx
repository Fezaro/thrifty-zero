"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ListingColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { useState } from "react";
import axios from "axios";

interface CellActionProps {
    data: ListingColumn
}

export const CellAction: React.FC<CellActionProps> = (
    { data }
) => {
    const router = useRouter();
    const params = useParams();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onCopy = (listingUrl: string) => {

        navigator.clipboard.writeText(listingUrl);
        toast.success('Listing Link copied to clipboard.');
    }

    //   console.log("Cell Act ListingId: ", data.listingId)

    const onConfirm = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/listings/${data.listingId}`);
            toast.success('Listing deleted.');
            router.refresh();
            router.push(`/${params.userId}/listings`);
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onConfirm}
                loading={loading}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />

                    </Button>

                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/${params.userId}/listings/${data.listingId}`)}>
                        <Edit className="h-4 mr-2 w-4" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={
                        () => onCopy(data.listingURL)
                    }>
                        <Copy className="h-4 mr-2 w-4" />
                        Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 mr-2 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>

            </DropdownMenu>
        </>
    )
}

