"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ListingColumn = {
    title: string,
    description: string,
    price: number,
    category: string,
    isActive: boolean,
    contactPhoneNumber: string,
    reasonForSelling: string,
    durationUsed: string,
    pickUpLocation: string,
    listingURL: string,
    createdAt: string,
    listingId:String,
}

export const columns: ColumnDef<ListingColumn>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "isActive",
        header: "Is Active",
    },
    {
        accessorKey: "contactPhoneNumber",
        header: "Contact Phone Number",
    },
    {
        accessorKey: "reasonForSelling",
        header: "Reason For Selling",
    },
    {
        accessorKey: "durationUsed",
        header: "Duration Used",
    },
    {
        accessorKey: "pickUpLocation",
        header: "Pickup Location",
    },
    {
        accessorKey: "listingURL",
        header: "Listing Url",
    },

    {
        id: "actions",
        cell: ({row}) => <CellAction data={row.original}/>
    },

]
