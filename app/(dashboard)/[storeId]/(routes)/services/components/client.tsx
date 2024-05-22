"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { ServiceColumn, columns } from "./columns";

interface ServicesClientProps {
  data: ServiceColumn[];
};

export const ServicesClient: React.FC<ServicesClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`Services (${data.length})`} description="Manage services for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/services/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Services" />
      <Separator />
      <ApiList entityName="services" entityIdName="serviceId" />
    </>
  );
};
