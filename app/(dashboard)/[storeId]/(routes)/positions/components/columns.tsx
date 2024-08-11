"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import Decimal from "decimal.js"

export type PositionColumn = {
  id: string
  title: string
  wage: Decimal,
  commission: Decimal,
  createdAt: string;
}

export const columns: ColumnDef<PositionColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "wage",
    header: "Salary - $ / hr",
  },
  {
    accessorKey: "commission",
    header: "Commission",
  },
  // {
  //   accessorKey: "value",
  //   header: "Value",
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-x-2">
  //       {row.original.value}
  //       <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.value }} />
  //     </div>
  //   )
  // },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
