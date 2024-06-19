"use client";

import axios from "axios";
import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import useCart from "@/hooks/use-cart";
import getService from "@/actions/get-service";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";

import { BookingColumn } from "./columns";

interface CellActionProps {
  data: BookingColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    console.log("data", data.bookingId);
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/bookings/${data?.bookingId}`);
      toast.success("Booking deleted.");
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while deleting the booking");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Booking ID copied to clipboard.");
  };

  const onPayNow = (data: BookingColumn) => {
    console.log("PAY NOW", data);
    // cart.addItem(data);
    // router.push(`/${params.storeId}/cart`)
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onPayNow(data)}
          >
            <Edit className="mr-2 h-4 w-4" /> PAY NOW
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data?.bookingId)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
