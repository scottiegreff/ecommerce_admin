"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type ShiftColumn = {
  shiftId: string;
  fName: string;
  lName: string;
  startShift: string;
  endShift: string;
};

export const columns: ColumnDef<ShiftColumn>[] = [
  {
    accessorKey: "fName",
    header: "First",
  },
  {
    accessorKey: "lName",
    header: "Last",
  },
  {
    accessorKey: "startShift",
    header: "Start",
  },
  {
    accessorKey: "endShift",
    header: "End",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];