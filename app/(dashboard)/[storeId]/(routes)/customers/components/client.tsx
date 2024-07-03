"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, CustomerColumn } from "./columns";

interface CustomerClientProps {
  data: CustomerColumn[];
}

export const CustomerClient: React.FC<CustomerClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Customers (${data.length})`} description="Manage customers for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/customers/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <p className="text-slate-500">
        Search customer by last name.
      </p>
      <DataTable searchKey="custLName" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Customers" />
      <Separator />
      <ApiList entityName="customers" entityIdName="customerId" />
    </>
  );
};
