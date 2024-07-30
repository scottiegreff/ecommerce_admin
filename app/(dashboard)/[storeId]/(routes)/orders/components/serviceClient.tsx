"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { serviceColumns, ServiceOrderColumn } from "./serviceColumns";

interface OrderClientProps {
  data: ServiceOrderColumn[];
}

export const ServiceOrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Service Orders`}
        description="Service orders for your store"
      />
      <Separator />
      <DataTable searchKey="services" columns={serviceColumns} data={data} />
    </>
  );
};
