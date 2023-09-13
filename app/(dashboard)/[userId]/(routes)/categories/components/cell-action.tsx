"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { CategoriesColumn } from "./column";

interface CellActionProps {
    data: CategoriesColumn
}

export const CellAction: React.FC<CellActionProps> = (
    { data }
) => {

    const onCopy = (name:string) => {
        
        navigator.clipboard.writeText(name);
        toast.success('Category name copied to clipboard.');
      }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />

                </Button>

            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                    <Edit className="h-4 mr-2 w-4" />
                    Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={
                    () => onCopy(data.name)
                }>
                    <Copy className="h-4 mr-2 w-4" />
                    Copy
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Trash className="h-4 mr-2 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>

    )
}

