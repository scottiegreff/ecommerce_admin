"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type BookingColumn = {
  name: string[];
  date: string;
  duration: number[];
  startTime: number;
  endTime: number;
  employeeId: string;
  custFName: string;
  custLName: string;
  price: number[];

};

export const columns: ColumnDef<BookingColumn>[] = [
  {
    accessorKey: "name",
    header: "Service",
  },
  {
    accessorKey: "date",
    header: "Date",
  }, 
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
  },
  {
    accessorKey: "endTime",
    header: "End Time",
  },
  {
    accessorKey: "employeeId",
    header: "Employee's ID",
  },
 
  {
    accessorKey: "custFName",
    header: "Client's First Name",
  },
  {
    accessorKey: "custLName",
    header: "Client's Last Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
