import { Category } from "@/firebase/db";
import { CategoriesColumn, columns } from "./column";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

interface CategoriesClientProps {
    data: Category[] | null;
    tableData: CategoriesColumn | null;
}

export const CategoriesClient: React.FC<CategoriesClientProps> = (
    { data }
) => {
    const router = useRouter();
    const params = useParams();

    if (!data) {
        return (
            <div>
                <p>Categories not found... </p>
            </div>
        )
    }
    
    return (
        <>
        <div className="flex items-center justify-between">
        <Heading
            title={`Categories (${data.length})`}
            description="Manage your Categories"/>
            <Button onClick={() => router.push(`/${params.userId}/categories/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
        </div>

        <Separator />

        <DataTable columns={columns} data={data} searchKey="name"/>
        </>
    );
}