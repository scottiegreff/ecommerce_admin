"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
// import { BookingMeta } from "../page"

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";
import { Employee, Service, Shift, Customer } from "@prisma/client";

import { columns, BookingColumn } from "./columns";

interface BookingClientProps {
  data: BookingColumn[];
}

export const BookingClient: React.FC<BookingClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  // CHANGE ALL THE DATA HERE FOR THE CELL
  // console.log("DATA COLUMNS", columns);
  // let employeeHoursTemp = {};
  // function fillInEmployeeBookings() {
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
          title={`Bookings (${data.length})`}
          description="Manage bookings for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/bookings/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <p className="text-slate-500">
        Search booking of employee by their last name.
      </p>
      <DataTable searchKey="startOfBooking" columns={columns} data={data} />
    </>
  );
};
