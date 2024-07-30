"use client"

import { ColumnDef } from "@tanstack/react-table"

export type ServiceOrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  services: string;
  createdAt: string;
}

export const serviceColumns: ColumnDef<ServiceOrderColumn>[] = [
  {
    accessorKey: "services",
    header: "Services",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
];
