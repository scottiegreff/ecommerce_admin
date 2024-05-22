"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, HeroColumn } from "./columns";

interface HeroClientProps {
  data: HeroColumn[];
}

export const HeroClient: React.FC<HeroClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Heros (${data.length})`}
          description="Manage heros for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/heros/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Heros" />
      <Separator />
      <ApiList entityName="heros" entityIdName="heroId" />
    </>
  );
};
