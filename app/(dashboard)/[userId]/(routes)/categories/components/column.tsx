"use client";

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";


export type CategoriesColumn = {
    name: string,
    isActive: boolean,
}

export const columns: ColumnDef<CategoriesColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "isActive",
        header: "Is Active",
    },
    {
        id: "actions",
        cell: ({row}) => <CellAction data={row.original}/>
    },
]