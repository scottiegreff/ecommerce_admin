"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { productColumns, ProductOrderColumn } from "./productColumns";

interface OrderClientProps {
  data: ProductOrderColumn[];
}

export const ProductOrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Product Orders`}
        description="Manage product orders for your store"
      />
      <Separator />
      <DataTable searchKey="products" columns={productColumns} data={data} />
    </>
  );
};
