"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";


  // date
  // startTime
  // custFName
  // custLName
  // email
  // phone
  // name (service)
  // fName (employee)

export type BookingColumn = {
  date: string;
  startTime: number;
  custFName: string;
  custLName: string;
  email: string;
  phone: string;
  name: string;
  fName: string;
  lName: string;
};

export const columns: ColumnDef<BookingColumn>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
  },
  {
    accessorKey: "name",
    header: "Service",
  },
  {
    accessorKey: "custFName",
    header: "First Name",
  },
  {
    accessorKey: "custLName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },

  {
    accessorKey: "fName",
    header: "Employee First Name",
  },
  {
    accessorKey: "lName",
    header: "Employee Last Name",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
