"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type BookingColumn = {
  bookingId: string;
  serviceId: string;
  customerId: string;
  shiftId: string;
  date: string;
  startTime: number;
  endTime: number;
};

export const columns: ColumnDef<BookingColumn>[] = [
  {
    accessorKey: "serviceId",
    header: "Service Id",
  },
  {
    accessorKey: "customerId",
    header: "Customer Id",
  },
  {
    accessorKey: "date",
    header: "Date",
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
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
