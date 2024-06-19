"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type BookingColumn = {
  bookingId: string;
  startOfBooking: string;
  endOfBooking: string;
  service: string;
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
    accessorKey: "startOfBooking",
    header: "Apt. Start",
  },
  {
    accessorKey: "endOfBooking",
    header: "Apt. End",
  },
  {
    accessorKey: "service",
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
