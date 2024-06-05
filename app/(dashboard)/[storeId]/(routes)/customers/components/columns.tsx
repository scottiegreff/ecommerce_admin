"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type CustomerColumn = {
  id: string
  custFName: string
  custLName: string
  email: string
  phone: string
}

export const columns: ColumnDef<CustomerColumn>[] = [
  
  {
    accessorKey: "custFName",
    header: "Customer First Name",
  },
  {
    accessorKey: "custLName",
    header: "Customer Last Name",
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
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
