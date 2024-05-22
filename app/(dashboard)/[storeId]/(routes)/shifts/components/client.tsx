"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
// import { ShiftMeta } from "../page"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, ShiftColumn } from "./columns";

interface ShiftClientProps {
  data: ShiftColumn[];
}

export const ShiftClient: React.FC<ShiftClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  // CHANGE ALL THE DATA HERE FOR THE CELLS
  // console.log("DATA COLUMNS", columns);
  // let employeeHoursTemp = {};
  // function fillInEmployeeShifts() {
  //   //if column accessorKey => "startTime" than change the bg color of the cell and if the column is < the endTime do nothing
  //   data.map((item) => {
  //     const startTime = item.startTime;
  //     const endTime = item.endTime;
  //   });
  // }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Shifts (${data.length})`}
          description="Manage shifts for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/shifts/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <p className="text-slate-500">Search shift of employee by their last name.</p>
      <DataTable searchKey="lName" columns={columns} data={data} />
    </>
  );
};
